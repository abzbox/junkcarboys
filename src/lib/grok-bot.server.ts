import { createServerFn } from "@tanstack/react-start";
import { LINDERS, LINDERS_CHECKED } from "@/lib/linders";

type BoardLine = {
  part: string;
  fit: string;
  price: number;
  city: string;
  seller: string;
  kind: string;
};

type Turn = { role: "user" | "assistant"; content: string };

type AskInput = { question: string; board: BoardLine[]; history: Turn[] };

function clip(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function askInput(input: unknown): AskInput {
  if (!input || typeof input !== "object") throw new Error("Ask a question.");
  const raw = input as { question?: unknown; board?: unknown; history?: unknown };
  const question = clip(raw.question, 400);
  if (question.length < 2) throw new Error("Ask a question.");
  const board = (Array.isArray(raw.board) ? raw.board : []).slice(0, 40).map((row) => {
    const item = row as Partial<BoardLine>;
    return {
      part: clip(item.part, 40),
      fit: clip(item.fit, 60),
      price: Number(item.price) || 0,
      city: clip(item.city, 40),
      seller: clip(item.seller, 40),
      kind: clip(item.kind, 16),
    };
  });
  const history: Turn[] = (Array.isArray(raw.history) ? raw.history : []).slice(-6).flatMap((row) => {
    const turn = row as Partial<Turn>;
    const content = clip(turn.content, 500);
    if (!content) return [];
    const role: Turn["role"] = turn.role === "assistant" ? "assistant" : "user";
    return [{ role, content }];
  });
  return { question, board, history };
}

export const askYardDesk = createServerFn({ method: "POST" })
  .validator(askInput)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Grok isn't connected in this preview." };

    const parts = data.board
      .map((row) => `${row.part} | ${row.fit} | $${row.price} | ${row.city} | ${row.seller} | ${row.kind}`)
      .join("\n");
    const cars = LINDERS.map(
      (car) => `${car.year} ${car.make} ${car.model} ${car.trim} | $${car.price} | ${car.miles} mi | stock ${car.stock}`,
    ).join("\n");

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 450,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: [
              "You are the Junk Car Boys yard desk in Worcester, Massachusetts.",
              "Answer only from the parts board and the Linder's used-car list below.",
              "If it is not listed, say it is not on the board. Do not invent parts, prices, or stock.",
              "Board prices are not a promise from a shop. Linder's cars are a public list, not confirmed still for sale.",
              "Keep it under 90 words. Plain sentences.",
              "",
              "Parts on this phone's board:",
              parts || "(none)",
              "",
              `Linder's retail cars checked ${LINDERS_CHECKED}:`,
              cars,
            ].join("\n"),
          },
          ...data.history,
          { role: "user", content: data.question },
        ],
      }),
    });

    if (!response.ok) {
      return { ok: false as const, error: "Grok didn't answer. Try once more." };
    }
    const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: false as const, error: "Grok sent an empty answer." };
    return { ok: true as const, text };
  });

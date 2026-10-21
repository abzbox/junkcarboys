import { useState } from "react";
import { askYardDesk } from "@/lib/grok-bot.server";
import { yearsLabel } from "@/lib/format";
import { useBoard } from "@/lib/store";

const STARTERS = ["Civic headlight near Worcester", "Cheapest transmission", "Any Kia on Linder's lot"];

type Chat = { role: "user" | "assistant"; content: string };

export function GrokBot() {
  const listings = useBoard((state) => state.listings);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [chat, setChat] = useState<Chat[]>([]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const history = chat.slice(-6);
    setChat((rows) => [...rows, { role: "user", content: question }]);
    setDraft("");
    setBusy(true);
    setNote("");
    const board = listings
      .filter((listing) => listing.status === "active")
      .slice(0, 40)
      .map((listing) => ({
        part: listing.part,
        fit: `${yearsLabel(listing.yearStart, listing.yearEnd)} ${listing.make} ${listing.model}`,
        price: listing.price,
        city: listing.city,
        seller: listing.sellerName,
        kind: listing.sellerType,
      }));
    try {
      const result = await askYardDesk({ data: { question, board, history } });
      if (!result.ok) {
        setNote(result.error);
        return;
      }
      setChat((rows) => [...rows, { role: "assistant", content: result.text }]);
    } catch {
      setNote("Grok didn't answer. Try once more.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed right-3 bottom-20 z-40 md:right-5 md:bottom-5">
      {open ? (
        <section className="mb-2 flex max-h-[70vh] w-[min(100vw-1.5rem,22rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black text-white shadow-2xl">
          <header className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
            <div>
              <p className="font-logo text-lg leading-none text-[#ffe500]">GROK</p>
              <p className="text-xs text-white/60">Yard desk. One question at a time.</p>
            </div>
            <button type="button" className="min-h-11 px-2 text-sm font-bold" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3">
            {chat.length === 0 ? (
              <p className="text-sm text-white/70">Ask what is on the rack or on Linder's used lot. I only use those lists.</p>
            ) : null}
            {chat.map((turn, index) => (
              <p
                key={`${turn.role}-${index}`}
                className={`max-w-[95%] rounded-xl px-3 py-2 text-sm ${turn.role === "user" ? "ml-auto bg-[#ffe500] text-black" : "bg-white/10"}`}
              >
                {turn.content}
              </p>
            ))}
            {busy ? <p className="text-sm text-white/50">Checking the board…</p> : null}
            {note ? <p className="text-sm text-[#ffe500]">{note}</p> : null}
          </div>
          {chat.length === 0 ? (
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {STARTERS.map((starter) => (
                <button key={starter} type="button" className="min-h-10 rounded-full bg-white/10 px-3 text-left text-xs font-semibold" onClick={() => void send(starter)}>
                  {starter}
                </button>
              ))}
            </div>
          ) : null}
          <form
            className="flex gap-2 border-t border-white/10 p-2"
            onSubmit={(event) => {
              event.preventDefault();
              void send(draft);
            }}
          >
            <label className="sr-only" htmlFor="grok-q">
              Ask Grok
            </label>
            <input
              id="grok-q"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Need a 2018 F-150 alternator"
              className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-[#141414] px-3 text-base text-white"
            />
            <button type="submit" disabled={busy} className="min-h-11 rounded-lg bg-[#ffe500] px-3 text-sm font-extrabold text-black disabled:opacity-50">
              Ask
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        className="ml-auto flex min-h-12 items-center rounded-full bg-[#ffe500] px-4 text-sm font-extrabold text-black shadow-lg"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Hide Grok" : "Ask Grok"}
      </button>
    </div>
  );
}

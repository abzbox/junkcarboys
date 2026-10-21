import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { btn, field, labelCls, Page } from "@/components/ui";
import { MAKES, PARTS, VEHICLES, YEARS, partCategory, type Condition } from "@/lib/catalog";
import { money } from "@/lib/format";
import { parseYardSheet } from "@/lib/parse-list";
import { useBoard, type NewListing } from "@/lib/store";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Post a part — Junkyard Boys" }] }),
  component: SellPage,
});

const CONDITIONS: Condition[] = ["Yard pull", "Tested", "As-is", "Rebuilt", "New takeoff"];

const SHEET_SAMPLE = `2015-2020 Ford F-150 alternator $85
2018 Honda Civic headlight $95
2016 Chevrolet Silverado 1500 tailgate $320`;

async function compress(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.72);
}

function SellPage() {
  const navigate = useNavigate();
  const addListing = useBoard((state) => state.addListing);
  const addParsed = useBoard((state) => state.addParsed);
  const profile = useBoard((state) => state.profile);
  const [mode, setMode] = useState<"one" | "sheet">("one");
  const [part, setPart] = useState("Alternator");
  const [make, setMake] = useState("Ford");
  const [model, setModel] = useState("F-150");
  const [yearStart, setYearStart] = useState(2018);
  const [yearEnd, setYearEnd] = useState(2018);
  const [condition, setCondition] = useState<Condition>("Yard pull");
  const [price, setPrice] = useState("80");
  const [engineNote, setEngineNote] = useState("");
  const [description, setDescription] = useState("");
  const [asYard, setAsYard] = useState(false);
  const [acceptsOffers, setAcceptsOffers] = useState(true);
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [sheet, setSheet] = useState(SHEET_SAMPLE);
  const [sheetYard, setSheetYard] = useState(false);
  const models = useMemo(() => VEHICLES.filter((vehicle) => vehicle.make === make), [make]);
  const rows = useMemo(() => parseYardSheet(sheet), [sheet]);
  const title = `${yearStart === yearEnd ? yearStart : `${yearStart}–${yearEnd}`} ${make} ${model} ${part}`;

  function draftFromForm(): NewListing | null {
    const amount = Number(price);
    if (!part || !make || !model) {
      setError("Pick the part and the vehicle.");
      return null;
    }
    if (!Number.isFinite(amount) || amount < 1) {
      setError("Set a price.");
      return null;
    }
    setError("");
    return {
      title,
      part,
      category: partCategory(part),
      yearStart,
      yearEnd,
      make,
      model,
      engineNote,
      condition,
      price: amount,
      acceptsOffers,
      description,
      photo: photo || undefined,
      asYard,
    };
  }

  return (
    <Page className="py-6">
      <h1 className="font-display text-4xl uppercase text-fg">Put it on the board</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Posting as {profile.name} in {profile.city}. One part, or paste a yard sheet — one line each, price at the end.
      </p>
      <div className="mt-4 flex gap-2">
        <button type="button" className={btn(mode === "one" ? "rust" : "line")} onClick={() => setMode("one")}>
          One part
        </button>
        <button type="button" className={btn(mode === "sheet" ? "rust" : "line")} onClick={() => setMode("sheet")}>
          Paste a yard list
        </button>
      </div>

      {mode === "one" ? (
        <form
          className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]"
          onSubmit={(event) => {
            event.preventDefault();
            const draft = draftFromForm();
            if (!draft) return;
            try {
              const id = addListing(draft);
              void navigate({ to: "/listing/$id", params: { id } });
            } catch {
              setError("Couldn't save that. Try a smaller photo or post without one.");
            }
          }}
        >
          <div className="grid gap-3">
            <label className={labelCls} htmlFor="part">
              Part
            </label>
            <select id="part" className={field} value={part} onChange={(event) => setPart(event.target.value)}>
              {PARTS.map((item) => (
                <option key={item.part}>{item.part}</option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="make">
                  Make
                </label>
                <select
                  id="make"
                  className={field}
                  value={make}
                  onChange={(event) => {
                    const next = event.target.value;
                    setMake(next);
                    const first = VEHICLES.find((vehicle) => vehicle.make === next);
                    if (first) setModel(first.model);
                  }}
                >
                  {MAKES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="model">
                  Model
                </label>
                <select id="model" className={field} value={model} onChange={(event) => setModel(event.target.value)}>
                  {models.map((vehicle) => (
                    <option key={vehicle.model}>{vehicle.model}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="from">
                  Fits from
                </label>
                <select id="from" className={field} value={yearStart} onChange={(event) => setYearStart(Number(event.target.value))}>
                  {YEARS.map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="to">
                  Fits through
                </label>
                <select id="to" className={field} value={yearEnd} onChange={(event) => setYearEnd(Number(event.target.value))}>
                  {YEARS.map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="condition">
                  Condition
                </label>
                <select
                  id="condition"
                  className={field}
                  value={condition}
                  onChange={(event) => setCondition(event.target.value as Condition)}
                >
                  {CONDITIONS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="price">
                  Price
                </label>
                <input id="price" inputMode="numeric" className={field} value={price} onChange={(event) => setPrice(event.target.value)} />
              </div>
            </div>
            <label className={labelCls} htmlFor="note">
              What it fits, exactly
            </label>
            <input
              id="note"
              className={field}
              value={engineNote}
              onChange={(event) => setEngineNote(event.target.value)}
              placeholder="5.0 and 2.7 EcoBoost. Not the hybrid."
            />
            <label className={labelCls} htmlFor="desc">
              Description
            </label>
            <textarea
              id="desc"
              className={`${field} min-h-28 py-2`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Where it came off, what's wrong, how you'll meet."
            />
            <label className={labelCls} htmlFor="photo">
              Photo
            </label>
            <input
              id="photo"
              className={field}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void compress(file).then((url) => {
                  if (url.length > 450000) {
                    setError("That photo is too heavy. Try another, or post without it.");
                    setPhoto("");
                    return;
                  }
                  setPhoto(url);
                  setError("");
                });
              }}
            />
            <label className="flex min-h-11 items-center gap-2 text-fg">
              <input type="checkbox" checked={acceptsOffers} onChange={(event) => setAcceptsOffers(event.target.checked)} />
              Take offers
            </label>
            <label className="flex min-h-11 items-center gap-2 text-fg">
              <input type="checkbox" checked={asYard} onChange={(event) => setAsYard(event.target.checked)} />
              List as yard stock (adds a bin)
            </label>
            {error ? (
              <p className="text-sm text-rust" role="status">
                {error}
              </p>
            ) : null}
            <button className={btn()} type="submit">
              Post {title}
            </button>
          </div>
          <aside className="border border-line bg-surface p-4">
            <p className="text-xs tracking-widest text-faint uppercase">Preview</p>
            <img src={photo || "/photos/engines.jpg"} alt="" className="ratio-photo mt-3" />
            <p className="mt-3 font-display text-3xl text-fg tabular-nums">{money(Number(price) || 0)}</p>
            <h2 className="font-display text-2xl uppercase text-fg">{title}</h2>
            <p className="text-sm text-muted">
              {condition} · {asYard ? "Yard" : "Private"} · {profile.city}
            </p>
          </aside>
        </form>
      ) : (
        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const good = rows.filter((row) => row.ok);
            if (!good.length) {
              setError("No priced lines to post.");
              return;
            }
            const drafts: NewListing[] = good.map((row) => ({
              title: row.title,
              part: row.part,
              category: row.category,
              yearStart: row.yearStart,
              yearEnd: row.yearEnd,
              make: row.make,
              model: row.model,
              engineNote: row.make === "Unknown" ? "Fitment was guessed from a pasted line. Confirm before you drive." : "",
              condition: "Yard pull",
              price: row.price,
              acceptsOffers: true,
              description: `Loaded from a yard sheet: ${row.raw}`,
              asYard: sheetYard,
            }));
            addParsed(drafts);
            setError("");
            void navigate({ to: "/deals" });
          }}
        >
          <label className={labelCls} htmlFor="sheet">
            One part per line
          </label>
          <textarea
            id="sheet"
            className={`${field} min-h-40 py-2 font-mono`}
            value={sheet}
            onChange={(event) => setSheet(event.target.value)}
          />
          <label className="flex min-h-11 items-center gap-2 text-fg">
            <input type="checkbox" checked={sheetYard} onChange={(event) => setSheetYard(event.target.checked)} />
            These are yard pulls (each gets a bin)
          </label>
          <ul className="grid gap-2">
            {rows.map((row) => (
              <li key={row.raw} className="border border-line px-3 py-2 text-sm">
                <span className={row.ok ? "text-fg" : "text-rust"}>{row.ok ? row.title : row.raw}</span>
                <span className="ml-2 text-muted">{row.ok ? money(row.price) : row.reason}</span>
              </li>
            ))}
          </ul>
          {error ? <p className="text-sm text-rust">{error}</p> : null}
          <button className={btn()} type="submit">
            Post {rows.filter((row) => row.ok).length} parts
          </button>
        </form>
      )}
    </Page>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { btn, field, labelCls, Page } from "@/components/ui";
import { MAKES, PARTS, SYMPTOMS, VEHICLES, YARD_TIPS, YEARS } from "@/lib/catalog";
import { guideMatches, yardQuery } from "@/lib/search";
import { useBoard } from "@/lib/store";

export const Route = createFileRoute("/guide")({
  head: () => ({ meta: [{ title: "Part guide — Junkyard Boys" }] }),
  component: GuidePage,
});

function GuidePage() {
  const listings = useBoard((state) => state.listings);
  const addWanted = useBoard((state) => state.addWanted);
  const [year, setYear] = useState(2018);
  const [make, setMake] = useState("Ford");
  const [model, setModel] = useState("F-150");
  const [symptom, setSymptom] = useState(SYMPTOMS[0]?.id ?? "nostart");
  const [part, setPart] = useState("Alternator");
  const [note, setNote] = useState("");
  const [posted, setPosted] = useState(false);
  const models = useMemo(() => VEHICLES.filter((vehicle) => vehicle.make === make), [make]);
  const activeSymptom = SYMPTOMS.find((item) => item.id === symptom) ?? SYMPTOMS[0];
  const matches = guideMatches(listings, { year, make, model }, part);

  return (
    <Page className="py-6">
      <h1 className="font-display text-4xl uppercase text-fg">Part guide</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Tell it the truck and what it's doing. You'll get the usual pull, what's already on the board, and what to ask
        before you hand over cash.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div>
          <label className={labelCls} htmlFor="g-year">
            Year
          </label>
          <select id="g-year" className={field} value={year} onChange={(event) => setYear(Number(event.target.value))}>
            {YEARS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="g-make">
            Make
          </label>
          <select
            id="g-make"
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
          <label className={labelCls} htmlFor="g-model">
            Model
          </label>
          <select id="g-model" className={field} value={model} onChange={(event) => setModel(event.target.value)}>
            {models.map((vehicle) => (
              <option key={vehicle.model}>{vehicle.model}</option>
            ))}
          </select>
        </div>
      </div>

      <h2 className="mt-8 font-display text-2xl uppercase text-fg">What's it doing?</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {SYMPTOMS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={symptom === item.id}
            className={`min-h-11 border px-3 py-2 text-left ${symptom === item.id ? "border-rust bg-raised text-fg" : "border-line text-muted"}`}
            onClick={() => {
              setSymptom(item.id);
              setPart(item.parts[0] ?? part);
              setPosted(false);
            }}
          >
            <span className="block font-display text-lg uppercase text-fg">{item.label}</span>
          </button>
        ))}
      </div>
      {activeSymptom ? <p className="mt-3 text-muted">{activeSymptom.hint}</p> : null}

      <h2 className="mt-6 font-display text-2xl uppercase text-fg">The part to ask for</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {(activeSymptom?.parts ?? []).map((item) => (
          <button
            key={item}
            type="button"
            className={btn(part === item ? "rust" : "line")}
            onClick={() => {
              setPart(item);
              setPosted(false);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <label className={`${labelCls} mt-4`} htmlFor="g-part">
        Or pick the part yourself
      </label>
      <select
        id="g-part"
        className={`${field} max-w-sm`}
        value={part}
        onChange={(event) => {
          setPart(event.target.value);
          setPosted(false);
        }}
      >
        {PARTS.map((item) => (
          <option key={item.part}>{item.part}</option>
        ))}
      </select>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-3xl uppercase text-fg">
            On the board · {year} {make} {model} {part}
          </h2>
          <Link to="/yard" search={yardQuery({ q: `${year} ${make} ${model} ${part}` })} className={btn("line")}>
            Open in search
          </Link>
        </div>
        {matches.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="border border-line bg-surface p-4">
            <p className="text-fg">Nothing pulled for that yet.</p>
            <p className="mt-1 text-sm text-muted">Post a wanted note. It shows on the board so a yard or a neighbor can answer it.</p>
          </div>
        )}
      </section>

      <form
        className="mt-6 border border-line p-4"
        onSubmit={(event) => {
          event.preventDefault();
          addWanted({ year, make, model, part, note });
          setPosted(true);
          setNote("");
        }}
      >
        <h2 className="font-display text-2xl uppercase text-fg">I'm looking for this</h2>
        <label className={`${labelCls} mt-3`} htmlFor="wanted-note">
          Note for sellers
        </label>
        <textarea
          id="wanted-note"
          className={`${field} min-h-24 py-2`}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Driver side, I'll pick up in Worcester this week."
        />
        <button className={`${btn()} mt-3`} type="submit">
          Post wanted
        </button>
        {posted ? (
          <p className="mt-2 text-sm text-bone" role="status">
            Posted. It's on the board under people hunting.
          </p>
        ) : null}
      </form>

      <section className="mt-8">
        <h2 className="font-display text-2xl uppercase text-fg">Before you pay</h2>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {YARD_TIPS.map((tip) => (
            <li key={tip} className="border border-line px-3 py-3 text-sm text-muted">
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}

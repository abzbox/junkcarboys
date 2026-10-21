import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { LOCAL_YARDS, LINDERS_ARRIVALS, LINDERS_PARTS, YARD_CHECKED } from "@/lib/local-yards";
import { yardQuery } from "@/lib/search";
import { useBoard } from "@/lib/store";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Yards near 01605 — Junk Car Boys" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const listings = useBoard((state) => state.listings);
  const yardParts = listings.filter((listing) => listing.status === "active" && listing.sellerType === "yard");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const parts = useMemo(() => {
    if (!needle) return LINDERS_PARTS;
    return LINDERS_PARTS.filter((part) =>
      `${part.part} ${part.year} ${part.makeModel} ${part.stock} ${part.detail}`.toLowerCase().includes(needle),
    );
  }, [needle]);
  const cars = useMemo(() => {
    if (!needle) return LINDERS_ARRIVALS;
    return LINDERS_ARRIVALS.filter((car) => `${car.year} ${car.makeModel} ${car.stock}`.toLowerCase().includes(needle));
  }, [needle]);

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6">
      <p className="text-xs font-bold tracking-widest text-[#ffe500] uppercase">Zip 01605 and the yards around it</p>
      <h1 className="font-display text-4xl font-extrabold text-white italic">Local yards</h1>
      <p className="mt-2 max-w-3xl text-white/70">
        Checked {YARD_CHECKED}. Linder's is the only shop nearby that put a parts list on the open web. The rows below are copied from that public page. They are not a live feed, and a car can leave the yard the same day.
      </p>

      <ul className="mt-5 grid gap-3 lg:grid-cols-2">
        {LOCAL_YARDS.map((yard) => (
          <li key={yard.name} className="rounded-xl border border-white/10 bg-[#12141b] p-4">
            <h2 className="text-lg font-extrabold">{yard.name}</h2>
            <p className="text-sm text-white/60">
              {yard.address} · {yard.miles}
            </p>
            <p className="mt-2 text-sm text-white/80">{yard.hours}</p>
            <p className="mt-2 text-sm text-white/80">{yard.inventory}</p>
            <p className="mt-2 text-sm text-white/80">{yard.charges}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
              {yard.phone ? (
                <a className="inline-flex min-h-11 items-center text-[#ffe500]" href={`tel:${yard.phone.replace(/[^\d+]/g, "")}`}>
                  {yard.phone}
                </a>
              ) : null}
              {yard.site ? (
                <a className="inline-flex min-h-11 items-center text-white" href={yard.site} target="_blank" rel="noreferrer">
                  Their website
                </a>
              ) : null}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold italic">Linder's public parts</h2>
          <p className="text-sm text-white/60">
            {LINDERS_PARTS.length} parts from the first page of the newest donors. Several of those cars have more pages on their site.
          </p>
        </div>
        <label className="block text-sm font-semibold" htmlFor="yard-q">
          Search this snapshot
          <input
            id="yard-q"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Civic, compressor, T32501"
            className="mt-1 min-h-11 w-64 max-w-full rounded-lg border border-white/15 bg-black px-3 text-base"
          />
        </label>
      </div>
      {parts.length ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((part) => (
            <li key={part.url} className="rounded-xl border border-white/10 bg-white p-3 text-neutral-950">
              <p className="text-lg font-extrabold">{part.price}</p>
              <p className="font-bold">{part.part}</p>
              <p className="text-sm text-neutral-600">
                {part.year} {part.makeModel} · stock {part.stock}
                {part.grade ? ` · grade ${part.grade}` : ""}
              </p>
              {part.detail ? <p className="text-sm text-neutral-600">{part.detail}</p> : null}
              <a className="mt-1 inline-flex min-h-11 items-center text-sm font-bold text-[#9a6200]" href={part.url} target="_blank" rel="noreferrer">
                Open on Linder's
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-xl border border-white/10 p-4 text-white/70">Nothing in this snapshot matches that.</p>
      )}

      <h2 className="mt-8 font-display text-2xl font-extrabold italic">Recent donor cars</h2>
      <p className="text-sm text-white/60">{cars.length} vehicles on their recent-arrivals page. Miles are what they printed. 0 means they left it blank.</p>
      <ul className="mt-3 max-h-[28rem] space-y-1 overflow-y-auto rounded-xl border border-white/10 p-2">
        {cars.map((car) => (
          <li key={car.stock} className="flex flex-wrap items-center justify-between gap-2 px-2 py-1 text-sm">
            <span>
              <span className="font-bold">
                {car.year} {car.makeModel}
              </span>
              <span className="text-white/55">
                {" "}
                · {car.stock} · {car.miles && car.miles !== "0" ? `${Number(car.miles).toLocaleString()} mi` : "miles not listed"} · in {car.purchased}
              </span>
            </span>
            <a className="inline-flex min-h-10 items-center font-bold text-[#ffe500]" href={car.partsUrl} target="_blank" rel="noreferrer">
              Their parts
            </a>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 font-display text-2xl font-extrabold italic">Marketplace board</h2>
      <p className="text-sm text-white/60">These are listings on this site, including samples. They are not the shops' inventory.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {yardParts.map((listing) => (
          <ListingCard key={listing.id} listing={listing} layout="stock" />
        ))}
      </div>
      <p className="mt-4 text-sm text-white/50">
        Want a part that is not on Linder's list? <Link to="/yard" search={yardQuery({ q: needle, source: "all" })} className="font-bold text-[#ffe500]">Search the board</Link> or ask the yard desk.
      </p>
    </div>
  );
}

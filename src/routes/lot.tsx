import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VehicleCard } from "@/components/vehicle-card";
import { btn, field, labelCls, Page } from "@/components/ui";
import { LINDERS, LINDERS_CHECKED, LINDERS_MAKES, LINDERS_REPORTED_TOTAL, matchLinders } from "@/lib/linders";

type LotSearch = { q: string; make: string; sort: string };

export const Route = createFileRoute("/lot")({
  validateSearch: (search: Record<string, unknown>): LotSearch => ({
    q: typeof search.q === "string" ? search.q : "",
    make: typeof search.make === "string" ? search.make : "",
    sort: typeof search.sort === "string" ? search.sort : "price",
  }),
  head: () => ({ meta: [{ title: "Linder's used lot — Junkyard Boys" }] }),
  component: LotPage,
});

function LotPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/lot" });
  const [q, setQ] = useState(search.q);

  useEffect(() => {
    setQ(search.q);
  }, [search.q]);

  const rows = useMemo(() => {
    const matched = matchLinders(search.q).filter((vehicle) => !search.make || vehicle.make === search.make);
    const sorted = [...matched];
    sorted.sort((a, b) => {
      if (search.sort === "miles") return a.miles - b.miles;
      if (search.sort === "year") return b.year - a.year;
      if (search.sort === "price-desc") return b.price - a.price;
      return a.price - b.price;
    });
    return sorted;
  }, [search.q, search.make, search.sort]);

  function update(partial: Partial<LotSearch>) {
    void navigate({
      search: { q: search.q, make: search.make, sort: search.sort, ...partial },
      replace: true,
    });
  }

  return (
    <Page className="py-6">
      <p className="font-display text-sm tracking-widest text-rust uppercase">Worcester dealer list</p>
      <h1 className="mt-1 font-display text-4xl uppercase text-fg">Linder's used lot</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {LINDERS.length} retail vehicles copied from Linder's public pages on {LINDERS_CHECKED}. Their site reported{" "}
        {LINDERS_REPORTED_TOTAL} that day. This is not the salvage yard, and nobody confirmed these are still on the
        line.
      </p>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          update({ q });
        }}
      >
        <label className="sr-only" htmlFor="lot-q">
          Search Linder's cars
        </label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-faint" />
          <input
            id="lot-q"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Seltos, Frontier, stock 66715…"
            className={`${field} pl-11`}
          />
        </div>
        <button className={btn()} type="submit">
          Search
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="lot-make">
          Make
        </label>
        <select id="lot-make" className={`${field} w-auto`} value={search.make} onChange={(event) => update({ make: event.target.value })}>
          <option value="">All makes</option>
          {LINDERS_MAKES.map((make) => (
            <option key={make}>{make}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="lot-sort">
          Sort
        </label>
        <select id="lot-sort" className={`${field} w-auto`} value={search.sort} onChange={(event) => update({ sort: event.target.value })}>
          <option value="price">Price, low</option>
          <option value="price-desc">Price, high</option>
          <option value="miles">Lowest miles</option>
          <option value="year">Newest year</option>
        </select>
      </div>
      <p className={`${labelCls} mt-4`}>
        {rows.length} {rows.length === 1 ? "vehicle" : "vehicles"}
      </p>
      {rows.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((vehicle) => (
            <VehicleCard key={vehicle.stock} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <p className="border border-line bg-surface p-4 text-muted">Nothing in this export matches that.</p>
      )}
    </Page>
  );
}

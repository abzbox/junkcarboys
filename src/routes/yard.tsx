import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { VehicleCard } from "@/components/vehicle-card";
import { btn, field, labelCls, Page } from "@/components/ui";
import { CATEGORIES, MAKES } from "@/lib/catalog";
import { matchLinders } from "@/lib/linders";
import { filterListings, yardQuery, type YardSearch } from "@/lib/search";
import { useBoard } from "@/lib/store";

export const Route = createFileRoute("/yard")({
  validateSearch: (search: Record<string, unknown>): YardSearch => ({
    q: typeof search.q === "string" ? search.q : "",
    cat: typeof search.cat === "string" ? search.cat : "",
    source: typeof search.source === "string" ? search.source : "",
    make: typeof search.make === "string" ? search.make : "",
    model: typeof search.model === "string" ? search.model : "",
    year: typeof search.year === "string" ? search.year : "",
    sort: typeof search.sort === "string" ? search.sort : "new",
    max: typeof search.max === "string" ? search.max : "",
    miles: typeof search.miles === "string" ? search.miles : "",
    offers: typeof search.offers === "string" ? search.offers : "",
    saved: typeof search.saved === "string" ? search.saved : "",
    engine: typeof search.engine === "string" ? search.engine : "",
    fit: typeof search.fit === "string" ? search.fit : "",
  }),
  head: () => ({ meta: [{ title: "Find Parts — Junk Car Boys" }] }),
  component: YardPage,
});

function YardPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/yard" });
  const listings = useBoard((state) => state.listings);
  const saved = useBoard((state) => state.saved);
  const wanted = useBoard((state) => state.wanted);
  const [q, setQ] = useState(search.q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setQ(search.q);
  }, [search.q]);

  const results = filterListings(listings, search, saved);
  const cars = search.q.trim() ? matchLinders(search.q).slice(0, 6) : [];

  function update(partial: Partial<YardSearch>, replace = true) {
    void navigate({ search: yardQuery({ ...search, ...partial }), replace });
  }

  const filters = (
    <div className="grid gap-3">
      <label className={labelCls} htmlFor="f-cat">
        Category
      </label>
      <select id="f-cat" className={field} value={search.cat} onChange={(event) => update({ cat: event.target.value })}>
        <option value="">All parts</option>
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>
      <label className={labelCls} htmlFor="f-make">
        Make
      </label>
      <select id="f-make" className={field} value={search.make} onChange={(event) => update({ make: event.target.value })}>
        <option value="">Any make</option>
        {MAKES.map((make) => (
          <option key={make}>{make}</option>
        ))}
      </select>
      <label className={labelCls} htmlFor="f-engine">
        Engine or trim
      </label>
      <input
        id="f-engine"
        className={field}
        value={search.engine}
        placeholder="5.0, EcoBoost, XLT"
        onChange={(event) => update({ engine: event.target.value })}
      />
      <label className={labelCls} htmlFor="f-fit">
        OEM number or VIN
      </label>
      <input
        id="f-fit"
        className={field}
        value={search.fit}
        placeholder="Casting number or VIN"
        onChange={(event) => update({ fit: event.target.value })}
      />
      <label className={labelCls} htmlFor="f-source">
        Who has it
      </label>
      <select
        id="f-source"
        className={field}
        value={search.source}
        onChange={(event) => update({ source: event.target.value })}
      >
        <option value="">Yards and neighbors</option>
        <option value="yard">Yards only</option>
        <option value="private">Private sellers</option>
      </select>
      <label className={labelCls} htmlFor="f-max">
        Max price
      </label>
      <select id="f-max" className={field} value={search.max} onChange={(event) => update({ max: event.target.value })}>
        <option value="">Any price</option>
        {[50, 100, 200, 400, 800].map((price) => (
          <option key={price} value={String(price)}>
            Under ${price}
          </option>
        ))}
      </select>
      <label className={labelCls} htmlFor="f-miles">
        Distance from Worcester
      </label>
      <select
        id="f-miles"
        className={field}
        value={search.miles}
        onChange={(event) => update({ miles: event.target.value })}
      >
        <option value="">Anywhere on the board</option>
        <option value="15">Within 15 miles</option>
        <option value="45">Within 45 miles</option>
        <option value="90">Within 90 miles</option>
      </select>
      <label className="flex min-h-11 items-center gap-2 text-fg">
        <input
          type="checkbox"
          checked={search.offers === "1"}
          onChange={(event) => update({ offers: event.target.checked ? "1" : "" })}
        />
        Taking offers
      </label>
      <label className="flex min-h-11 items-center gap-2 text-fg">
        <input
          type="checkbox"
          checked={search.saved === "1"}
          onChange={(event) => update({ saved: event.target.checked ? "1" : "" })}
        />
        Saved only
      </label>
      <button type="button" className={btn("quiet", "justify-start px-0")} onClick={() => update(yardQuery())}>
        Clear filters
      </button>
    </div>
  );

  return (
    <Page className="py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold text-fg italic">Find parts</h1>
          <p className="text-muted">
            {results.length} {results.length === 1 ? "part matches" : "parts match"}. Sample tags are examples, not a live yard feed.
          </p>
        </div>
        <Link to="/sell" className={btn()}>
          List a part
        </Link>
        <label className="sr-only" htmlFor="sort">
          Sort
        </label>
        <select
          id="sort"
          className={`${field} w-auto`}
          value={search.sort}
          onChange={(event) => update({ sort: event.target.value })}
        >
          <option value="new">Newest</option>
          <option value="price">Price, low</option>
          <option value="price-desc">Price, high</option>
          <option value="miles">Closest</option>
        </select>
      </div>
      <form
        className="mb-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          update({ q });
        }}
      >
        <label className="sr-only" htmlFor="board-q">
          Search parts
        </label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-faint" />
          <input
            id="board-q"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Year, truck, part, or yard"
            className={`${field} pl-11`}
          />
        </div>
        <button className={btn()} type="submit">
          Search
        </button>
      </form>
      <div className="grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <button type="button" className={`${btn("line")} w-full md:hidden`} onClick={() => setFiltersOpen((value) => !value)}>
            {filtersOpen ? "Hide filters" : "Filters"}
          </button>
          <div className={`${filtersOpen ? "mt-3" : "hidden"} md:block`}>{filters}</div>
        </aside>
        <div>
          {cars.length ? (
            <section className="mb-6">
              <h2 className="font-display text-2xl uppercase text-fg">On Linder's used lot</h2>
              <p className="mb-3 text-sm text-muted">Retail cars from the Oct 21 public list, not yard parts.</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cars.map((vehicle) => (
                  <VehicleCard key={vehicle.stock} vehicle={vehicle} />
                ))}
              </div>
            </section>
          ) : null}
          {results.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : cars.length ? null : (
            <div className="border border-line bg-surface p-6">
              <h2 className="font-display text-2xl uppercase text-fg">Nothing with that tag</h2>
              <p className="mt-2 text-muted">
                Try a wider year, or post that you're hunting it. Sellers on the board can see wanted notes.
              </p>
              <button type="button" className={`${btn("line")} mt-4`} onClick={() => update(yardQuery({ q: search.q }))}>
                Clear filters, keep the search
              </button>
            </div>
          )}
          <section className="mt-8 border border-line p-4">
            <h2 className="font-display text-2xl uppercase text-fg">Still hunting</h2>
            <ul className="mt-2 grid gap-3 sm:grid-cols-2">
              {wanted.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <p className="font-display text-lg uppercase text-fg">
                    {item.year} {item.make} {item.model} {item.part}
                  </p>
                  <p className="text-sm text-muted">
                    {item.name} · {item.note}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Page>
  );
}

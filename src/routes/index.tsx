import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MapPin, Search, Tag, Truck, Users, Zap } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { ListingCard } from "@/components/listing-card";
import { PARTS, VEHICLES, type CategoryId, type Listing } from "@/lib/catalog";
import { LINDERS, LINDERS_CHECKED } from "@/lib/linders";
import { LINDERS_PARTS } from "@/lib/local-yards";
import { yardQuery } from "@/lib/search";
import { useBoard } from "@/lib/store";
import { VehicleCard } from "@/components/vehicle-card";

export const Route = createFileRoute("/")({
  component: Home,
});

const YEARS = Array.from({ length: 19 }, (_, index) => 2026 - index);

const TABS: { id: string; label: string }[] = [
  { id: "all", label: "All Parts" },
  { id: "drivetrain", label: "Engines" },
  { id: "trans", label: "Transmissions" },
  { id: "body", label: "Body Parts" },
  { id: "lights", label: "Lights" },
  { id: "wheels", label: "Wheels & Tires" },
  { id: "interior", label: "Interior" },
  { id: "suspension", label: "Suspension" },
  { id: "electrical", label: "Electronics" },
  { id: "cooling", label: "More" },
];

const FEATURES = [
  { icon: Search, title: "Fast search", text: "Find parts in seconds" },
  { icon: MapPin, title: "Local availability", text: "Junkyards and local sellers" },
  { icon: Users, title: "User listings", text: "Buy and sell with your community" },
  { icon: Tag, title: "Great deals", text: "Save on used parts" },
  { icon: Truck, title: "Easy pickup", text: "Local meetups or yard pickup" },
];

const PINS = [
  { name: "Scrap It", city: "Fremont St", x: "30%", y: "46%" },
  { name: "Linder's and Sam's Pull-A-Part", city: "Granite St", x: "40%", y: "64%" },
  { name: "Standard Used Auto Parts", city: "Granite St", x: "52%", y: "74%" },
  { name: "M.L. Norwood", city: "North Grafton", x: "74%", y: "38%" },
];

function inTab(listing: Listing, tab: string) {
  if (tab === "all") return true;
  if (tab === "trans") return listing.part === "Transmission";
  if (tab === "drivetrain") return listing.category === "drivetrain" && listing.part !== "Transmission";
  return listing.category === (tab as CategoryId);
}

function Home() {
  const navigate = useNavigate();
  const listings = useBoard((state) => state.listings);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [part, setPart] = useState("");
  const [where, setWhere] = useState("Worcester");
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("new");

  const active = listings.filter((listing) => listing.status === "active");
  const models = VEHICLES.filter((vehicle) => !make || vehicle.make === make).map((vehicle) => vehicle.model);
  const cities = [...new Set(active.map((listing) => listing.city.split(",")[0] ?? listing.city))];

  const liveParts = LINDERS_PARTS.filter((part) => part.price.startsWith("$")).slice(0, 4);

  const featured = useMemo(() => {
    const rows = active.filter((listing) => inTab(listing, tab));
    rows.sort((a, b) => (sort === "price" ? a.price - b.price : b.postedAt - a.postedAt));
    return rows.slice(0, 6);
  }, [active, tab, sort]);

  const lotPreview = [...LINDERS].sort((a, b) => a.price - b.price).slice(0, 4);

  return (
    <div className="bg-black text-white">
      <img
        src="/brand/hero.jpg"
        alt="Junk Car Boys. Buy, sell, and find used car parts around Worcester, Massachusetts."
        className="h-48 w-full object-cover object-center sm:h-auto sm:object-fill"
      />

      <div className="mx-auto max-w-[1180px] px-3">
        <form
          className="-mt-8 rounded-2xl border border-white/10 bg-[#141414] p-3 shadow-xl sm:-mt-14"
          onSubmit={(event) => {
            event.preventDefault();
            const chosen = PARTS.find((item) => item.part === part);
            const bits = [part, where === "Anywhere" ? "" : where].filter(Boolean);
            void navigate({
              to: "/yard",
              search: yardQuery({
                make,
                model,
                year,
                cat: chosen?.category ?? "",
                q: bits.join(" "),
              }),
            });
          }}
        >
          <div className="grid items-end gap-2 md:grid-cols-6">
            <Field id="s-make" label="Make" value={make} onChange={(value) => { setMake(value); setModel(""); }}>
              <option value="">Any make</option>
              {[...new Set(VEHICLES.map((vehicle) => vehicle.make))].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Field>
            <Field id="s-model" label="Model" value={model} onChange={setModel}>
              <option value="">Any model</option>
              {models.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Field>
            <Field id="s-year" label="Year" value={year} onChange={setYear}>
              <option value="">Any year</option>
              {YEARS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Field>
            <Field id="s-part" label="Part type" value={part} onChange={setPart}>
              <option value="">Any part type</option>
              {PARTS.map((item) => (
                <option key={item.part}>{item.part}</option>
              ))}
            </Field>
            <Field id="s-where" label="Location" value={where} onChange={setWhere}>
              <option>Anywhere</option>
              {cities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Field>
            <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 self-end rounded-xl bg-[#ffe500] px-4 text-base font-extrabold text-black">
              <Search className="size-5" aria-hidden="true" />
              Search parts
            </button>
          </div>
        </form>

        <ul className="grid grid-cols-2 gap-3 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((feature) => (
            <li key={feature.title} className="flex items-start gap-2">
              <feature.icon className="mt-0.5 size-6 shrink-0 text-[#ffe500]" aria-hidden="true" />
              <span>
                <span className="block text-xs font-extrabold tracking-wider text-[#ffe500] uppercase">{feature.title}</span>
                <span className="block text-xs text-white/60">{feature.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <section className="grid gap-4 pb-8 lg:grid-cols-[1.35fr_0.75fr]">
          <div>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-extrabold italic">Local junkyard availability</h2>
                <p className="text-sm text-white/60">Yards around zip 01605. Linder's prices are from their public pages on October 21, 2026.</p>
              </div>
              <Link to="/inventory" className="inline-flex min-h-11 shrink-0 items-center text-sm font-bold text-[#ffe500]">
                View all yards
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {liveParts.map((part) => (
                <a key={part.url} href={part.url} target="_blank" rel="noreferrer" className="rounded-xl bg-white p-3 text-neutral-950">
                  <p className="text-[11px] font-bold tracking-wide text-emerald-700 uppercase">On Linder's site</p>
                  <p className="mt-1 text-xl font-extrabold">{part.price}</p>
                  <p className="font-bold">{part.part}</p>
                  <p className="text-sm text-neutral-600">
                    {part.year} {part.makeModel}
                  </p>
                  <p className="text-xs text-neutral-500">Stock {part.stock} · grade {part.grade}</p>
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <aside className="rounded-2xl bg-[#ffe500] p-5 text-neutral-950">
              <h2 className="font-display text-3xl leading-none font-extrabold italic">Sell your parts</h2>
              <p className="mt-2 text-sm">Got parts to sell? List them for free, set your own price, and connect with local buyers.</p>
              <ul className="mt-3 space-y-1.5 text-sm font-semibold">
                {[
                  "Name the part and the car it came off",
                  "Set your price",
                  "Reach local buyers",
                  "It's free to list",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/sell" className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#ff6a00] px-5 font-extrabold text-white">
                Post your parts
              </Link>
            </aside>
            <aside className="overflow-hidden rounded-2xl border border-white/10 bg-[#d7e6ee] text-neutral-950">
              <div className="flex items-center justify-between px-3 pt-3">
                <p className="font-extrabold">Local inventory near you</p>
                <Zap className="size-4 text-[#ff6a00]" aria-hidden="true" />
              </div>
              <div className="relative mx-3 mt-2 h-52 overflow-hidden rounded-xl bg-[#c5d8e4]">
                <svg viewBox="0 0 320 220" className="h-full w-full" role="img" aria-label="Map of Worcester, Shrewsbury, Auburn, and Millbury">
                  <rect width="320" height="220" fill="#d5e4ee" />
                  <path d="M40 20 C80 60 70 120 90 200" stroke="#f2f6f8" strokeWidth="18" fill="none" />
                  <path d="M20 90 H300" stroke="#eef3f6" strokeWidth="10" fill="none" />
                  <path d="M150 10 V210" stroke="#9bb4c4" strokeWidth="4" fill="none" />
                  <text x="156" y="28" fill="#3d5a6c" fontSize="11" fontWeight="700">I-190</text>
                  <text x="214" y="42" fill="#1f2933" fontSize="12" fontWeight="700">Shrewsbury</text>
                  <text x="168" y="118" fill="#1f2933" fontSize="14" fontWeight="800">Worcester</text>
                  <text x="200" y="168" fill="#1f2933" fontSize="12" fontWeight="700">Auburn</text>
                  <text x="230" y="198" fill="#1f2933" fontSize="12" fontWeight="700">Millbury</text>
                </svg>
                {PINS.map((pin) => (
                  <Link
                    key={pin.name}
                    to="/inventory"
                    className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                    style={{ left: pin.x, top: pin.y }}
                    aria-label={`${pin.name}, ${pin.city}`}
                  >
                    <span className="size-4 rounded-full border-2 border-white bg-[#ffe500] shadow" />
                  </Link>
                ))}
              </div>
              <Link to="/inventory" className="m-3 flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
                View inventory on map
              </Link>
            </aside>
          </div>
        </section>

        <section className="pb-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-extrabold italic">Featured marketplace listings</h2>
            <label className="text-sm font-semibold">
              Sort by
              <select className="ml-2 min-h-11 rounded-lg border border-white/15 bg-black px-2" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="new">Newest first</option>
                <option value="price">Price, low</option>
              </select>
            </label>
          </div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-bold ${tab === item.id ? "bg-[#ffe500] text-black" : "bg-white/10 text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {featured.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-white/10 p-4 text-white/70">Nothing in that category on the rack right now.</p>
          )}
        </section>

        <section className="pb-12">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-extrabold italic">Linder's used lot</h2>
              <p className="text-sm text-white/60">
                {LINDERS.length} retail cars from their public pages, checked {LINDERS_CHECKED}. Whole cars, not yard pulls.
              </p>
            </div>
            <Link to="/lot" search={{ q: "", make: "", sort: "price" }} className="inline-flex min-h-11 items-center text-sm font-bold text-[#ffe500]">
              All {LINDERS.length}
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lotPreview.map((vehicle) => (
              <VehicleCard key={vehicle.stock} vehicle={vehicle} />
            ))}
          </div>
          <p className="mt-4 text-xs text-white/45">Surrounding yards, their phones, and the Linder's snapshot are on the inventory page. Those prices are theirs, not a quote from us.</p>
        </section>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 block text-[11px] font-bold tracking-wide text-white/50 uppercase">{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full rounded-lg border border-white/10 bg-[#1c1c1c] px-2 text-sm text-white">
        {children}
      </select>
    </label>
  );
}

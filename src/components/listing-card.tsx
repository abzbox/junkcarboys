import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import type { Condition, Listing } from "@/lib/catalog";
import { listingFacts } from "@/lib/catalog";
import { money, yearsLabel } from "@/lib/format";
import { useBoard } from "@/lib/store";

const FOCI = ["center", "left center", "right center", "center top"];

function focus(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash + char.charCodeAt(0)) % FOCI.length;
  return FOCI[hash] ?? "center";
}

function tone(condition: Condition) {
  if (condition === "Tested" || condition === "Rebuilt") return "bg-emerald-600 text-white";
  if (condition === "New takeoff") return "bg-sky-600 text-white";
  return "bg-amber-400 text-neutral-950";
}

export function ListingCard({ listing, layout = "market" }: { listing: Listing; layout?: "market" | "stock" }) {
  const saved = useBoard((state) => state.saved.includes(listing.id));
  const toggleSave = useBoard((state) => state.toggleSave);
  const fit = `${yearsLabel(listing.yearStart, listing.yearEnd)} ${listing.make} ${listing.model}`;
  const facts = listingFacts(listing);

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl bg-white text-neutral-950 shadow-md">
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? "Unsave part" : "Save part"}
        onClick={() => toggleSave(listing.id)}
        className="absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full bg-white/90 text-neutral-800"
      >
        <Heart className="size-5" fill={saved ? "currentColor" : "none"} />
      </button>
      <Link to="/listing/$id" params={{ id: listing.id }} className="flex flex-1 flex-col">
        <div className="relative h-36 bg-neutral-200">
          <img
            src={listing.photo}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: focus(listing.id) }}
          />
          {listing.status === "sold" ? (
            <span className="absolute inset-x-0 bottom-0 bg-black/80 py-1 text-center text-sm font-bold tracking-wide text-white uppercase">
              Sold
            </span>
          ) : (
            <span
              className={`absolute bottom-2 left-2 rounded px-2 py-1 text-xs font-bold ${facts.sample ? "bg-amber-400 text-neutral-950" : "bg-emerald-700 text-white"}`}
            >
              {facts.label}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          {layout === "market" ? (
            <p className="text-2xl leading-none font-extrabold tabular-nums">{money(listing.price)}</p>
          ) : null}
          <h3 className="text-base leading-tight font-extrabold">{listing.part}</h3>
          <p className="text-sm text-neutral-500">{fit}</p>
          {layout === "stock" ? <p className="text-xl leading-none font-extrabold tabular-nums">{money(listing.price)}</p> : null}
          {layout === "market" ? (
            <span className={`mt-1 w-fit rounded px-2 py-0.5 text-xs font-bold ${tone(listing.condition)}`}>{listing.condition}</span>
          ) : null}
          <p className="mt-auto flex items-center gap-1 pt-2 text-xs text-neutral-500">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{listing.city}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{listing.sellerType === "private" ? "Private seller" : listing.sellerName}</span>
          </p>
        </div>
      </Link>
    </article>
  );
}

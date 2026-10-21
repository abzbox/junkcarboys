import {
  categoryLabel,
  type CategoryId,
  type Listing,
} from "@/lib/catalog";

export type YardSearch = {
  q: string;
  cat: string;
  source: string;
  make: string;
  model: string;
  year: string;
  sort: string;
  max: string;
  miles: string;
  offers: string;
  saved: string;
  engine: string;
  fit: string;
};

export function yardQuery(partial: Partial<YardSearch> = {}): YardSearch {
  return {
    q: "",
    cat: "",
    source: "",
    make: "",
    model: "",
    year: "",
    sort: "new",
    max: "",
    miles: "",
    offers: "",
    saved: "",
    engine: "",
    fit: "",
    ...partial,
  };
}

export function norm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const STOP = new Set(["the", "and", "for", "with", "from", "that", "this", "near", "me"]);

export function haystack(listing: Listing) {
  return norm(
    [
      listing.title,
      listing.part,
      listing.make,
      listing.model,
      listing.city,
      listing.yardName ?? "",
      listing.sellerName,
      listing.description,
      listing.engineNote,
      listing.engine ?? "",
      listing.trim ?? "",
      listing.oem ?? "",
      listing.condition,
      categoryLabel(listing.category),
      listing.aliases.join(" "),
      listing.bin ?? "",
    ].join(" "),
  );
}

export function textMatch(listing: Listing, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const yearMatch = query.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : null;
  if (year && (year < listing.yearStart || year > listing.yearEnd)) return false;
  const tokens = query
    .replace(/\b(19|20)\d{2}\b/g, " ")
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP.has(token));
  if (!tokens.length) return true;
  const hay = haystack(listing);
  return tokens.every((token) => hay.includes(norm(token)));
}

export function filterListings(
  listings: Listing[],
  search: YardSearch,
  saved: string[],
) {
  const max = Number(search.max);
  const miles = Number(search.miles);
  const filtered = listings.filter((listing) => {
    if (search.saved === "1" && !saved.includes(listing.id)) return false;
    if (search.cat && listing.category !== (search.cat as CategoryId)) return false;
    if (search.source === "yard" && listing.sellerType !== "yard") return false;
    if (search.source === "private" && listing.sellerType !== "private") return false;
    if (search.make && listing.make !== search.make) return false;
    if (search.model && listing.model !== search.model) return false;
    if (search.year) {
      const year = Number(search.year);
      if (!Number.isFinite(year) || year < listing.yearStart || year > listing.yearEnd) return false;
    }
    if (search.engine) {
      const engineHay = norm(`${listing.engine ?? ""} ${listing.engineNote} ${listing.trim ?? ""}`);
      if (!engineHay.includes(norm(search.engine))) return false;
    }
    if (search.fit) {
      const fitHay = norm(
        `${listing.oem ?? ""} ${listing.engineNote} ${listing.description} ${listing.aliases.join(" ")} ${listing.trim ?? ""}`,
      );
      if (!fitHay.includes(norm(search.fit))) return false;
    }
    if (search.offers === "1" && !listing.acceptsOffers) return false;
    if (Number.isFinite(max) && search.max && listing.price > max) return false;
    if (Number.isFinite(miles) && search.miles && listing.miles > miles) return false;
    return textMatch(listing, search.q);
  });

  const sorted = [...filtered];
  sorted.sort((a, b) => {
    if (a.status !== b.status) return a.status === "active" ? -1 : 1;
    if (search.sort === "price") return a.price - b.price;
    if (search.sort === "price-desc") return b.price - a.price;
    if (search.sort === "miles") return a.miles - b.miles;
    return b.postedAt - a.postedAt;
  });
  return sorted;
}

export function guideMatches(
  listings: Listing[],
  vehicle: { year: number; make: string; model: string },
  part: string,
) {
  const want = norm(part);
  return listings.filter((listing) => {
    if (listing.status !== "active") return false;
    if (norm(listing.make) !== norm(vehicle.make)) return false;
    if (norm(listing.model) !== norm(vehicle.model)) return false;
    if (vehicle.year < listing.yearStart || vehicle.year > listing.yearEnd) return false;
    const partHay = norm(`${listing.part} ${listing.title}`);
    return partHay.includes(want) || want.includes(norm(listing.part));
  });
}

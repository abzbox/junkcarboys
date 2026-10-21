import { PARTS, VEHICLES, partCategory, type CategoryId } from "@/lib/catalog";
import { norm } from "@/lib/search";

export type ParsedRow = {
  ok: boolean;
  reason?: string;
  title: string;
  part: string;
  category: CategoryId;
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  price: number;
  raw: string;
};

const partsByLength = [...PARTS].sort((a, b) => b.part.length - a.part.length);
const vehiclesByLength = [...VEHICLES].sort(
  (a, b) => b.make.length + b.model.length - (a.make.length + a.model.length),
);

function pickVehicle(nline: string) {
  const exact = vehiclesByLength.find(
    (vehicle) => nline.includes(norm(vehicle.make)) && nline.includes(norm(vehicle.model)),
  );
  if (exact) return exact;

  let best: { make: string; model: string; score: number } | null = null;
  for (const vehicle of VEHICLES) {
    const words = vehicle.model
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2);
    const matched = words.filter((word) => nline.includes(word));
    if (!matched.length && !nline.includes(norm(vehicle.model))) continue;
    const coverage = words.length ? matched.length / words.length : 0;
    const score =
      coverage * 100 +
      matched.join("").length +
      (nline.includes(norm(vehicle.model)) ? 40 : 0) +
      (nline.includes(norm(vehicle.make)) ? 25 : 0);
    if (!best || score > best.score) best = { make: vehicle.make, model: vehicle.model, score };
  }
  return best;
}

const TOKEN_PART: Record<string, string> = {
  alt: "Alternator",
  alternator: "Alternator",
  starter: "Starter",
  ecm: "ECM",
  ecu: "ECM",
  pcm: "ECM",
  headlight: "Headlight",
  headlamp: "Headlight",
  taillight: "Tail light",
  tail: "Tail light",
  mirror: "Mirror",
  door: "Front door",
  fender: "Fender",
  hood: "Hood",
  bumper: "Bumper cover",
  tailgate: "Tailgate",
  regulator: "Window regulator",
  window: "Window regulator",
  wheel: "Wheel",
  wheels: "Wheel",
  rim: "Wheel",
  rims: "Wheel",
  seat: "Front seat",
  strut: "Strut",
  rotor: "Brake rotor",
  rotors: "Brake rotor",
  caliper: "Brake caliper",
  radiator: "Radiator",
  compressor: "AC compressor",
  blower: "Blower motor",
  fan: "Cooling fan",
  transmission: "Transmission",
  trans: "Transmission",
  camera: "Backup camera",
};

function pickPart(rest: string, nline: string) {
  for (const entry of partsByLength) {
    if (nline.includes(norm(entry.part))) return entry.part;
  }
  const tokens = rest.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for (const token of tokens) {
    const hit = TOKEN_PART[token];
    if (hit) return hit;
  }
  if (tokens.includes("control") || tokens.includes("arm")) return "Control arm";
  return "";
}

function parseLine(raw: string): ParsedRow {
  const priceMatch = raw.match(/\$?\s*(\d{1,5})(?:\.\d{1,2})?\s*$/);
  const price = priceMatch ? Number(priceMatch[1]) : 0;
  let rest = priceMatch ? raw.slice(0, priceMatch.index).trim() : raw.trim();
  const range = rest.match(/\b((?:19|20)\d{2})\s*(?:-|–|to)\s*((?:19|20)\d{2})\b/i);
  let yearStart = 0;
  let yearEnd = 0;
  if (range) {
    yearStart = Number(range[1]);
    yearEnd = Number(range[2]);
    rest = rest.replace(range[0], " ").trim();
  } else {
    const single = rest.match(/\b((?:19|20)\d{2})\b/);
    if (single) {
      yearStart = Number(single[1]);
      yearEnd = yearStart;
      rest = rest.replace(single[0], " ").trim();
    }
  }
  if (yearStart && yearEnd && yearEnd < yearStart) {
    const swap = yearStart;
    yearStart = yearEnd;
    yearEnd = swap;
  }

  const vehicle = pickVehicle(norm(rest));
  const partName = pickPart(rest, norm(rest));
  const part = partName || "Misc part";
  const category: CategoryId = partName ? partCategory(partName) : "body";
  const make = vehicle?.make ?? "";
  const model = vehicle?.model ?? "";
  const yearBit = yearStart ? (yearStart === yearEnd ? `${yearStart} ` : `${yearStart}–${yearEnd} `) : "";
  const titleCore = rest.replace(/\s+/g, " ").trim();
  const title = `${yearBit}${make ? `${make} ` : ""}${model ? `${model} ` : ""}${
    part !== "Misc part" ? part : titleCore || "Part"
  }`
    .replace(/\s+/g, " ")
    .trim();

  const base = {
    title: title || raw,
    part,
    category,
    make: make || "Unknown",
    model: model || "Unknown",
    yearStart: yearStart || 2015,
    yearEnd: yearEnd || 2024,
    price,
    raw,
  };

  if (!price || price < 1) {
    return { ...base, ok: false, reason: "Put a price at the end of the line." };
  }
  return { ...base, ok: true };
}

export function parseYardSheet(text: string): ParsedRow[] {
  return text
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .slice(0, 30)
    .map(parseLine);
}

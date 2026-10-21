import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { btn, Page, Stamp } from "@/components/ui";
import { miles, money } from "@/lib/format";
import { LINDERS, LINDERS_CHECKED, vehicleTitle } from "@/lib/linders";
import { useBoard } from "@/lib/store";

export const Route = createFileRoute("/lot/$stock")({
  head: () => ({ meta: [{ title: "Linder's vehicle — Junkyard Boys" }] }),
  component: VehiclePage,
});

function noteKey(stock: string) {
  return `jyb-linders-note-${stock}`;
}

function VehiclePage() {
  const { stock } = Route.useParams();
  const vehicle = LINDERS.find((item) => item.stock === stock);
  const watchId = `linders-${stock}`;
  const saved = useBoard((state) => state.saved.includes(watchId));
  const toggleSave = useBoard((state) => state.toggleSave);
  const [note, setNote] = useState("");
  const [stored, setStored] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStored(window.localStorage.getItem(noteKey(stock)) ?? "");
    setStatus("");
  }, [stock]);

  if (!vehicle) {
    return (
      <Page className="py-16">
        <h1 className="font-display text-4xl uppercase text-fg">Not in this export</h1>
        <Link to="/lot" search={{ q: "", make: "", sort: "price" }} className={`${btn()} mt-4`}>
          Back to Linder's lot
        </Link>
      </Page>
    );
  }

  const specs = [
    ["Trim", vehicle.trim],
    ["Price", money(vehicle.price)],
    ["Miles", miles(vehicle.miles)],
    ["Engine", vehicle.engine],
    ["Transmission", vehicle.transmission],
    ["Drivetrain", vehicle.drivetrain],
    ["Exterior", vehicle.exterior],
    ["Interior", vehicle.interior],
    ["MPG", vehicle.cityMpg && vehicle.hwyMpg ? `${vehicle.cityMpg} city / ${vehicle.hwyMpg} hwy` : ""],
    ["Style", vehicle.style],
    ["Stock", vehicle.stock],
    ["VIN", vehicle.vin],
  ].filter((pair): pair is [string, string] => Boolean(pair[1]));

  return (
    <Page className="py-6">
      <p className="text-sm text-faint">
        <Link to="/lot" search={{ q: "", make: "", sort: "price" }} className="text-rust">
          Linder's used lot
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Stamp>Retail used</Stamp>
        <Stamp>Not a yard pull</Stamp>
      </div>
      <h1 className="mt-3 font-display text-4xl leading-none uppercase text-fg">{vehicleTitle(vehicle)}</h1>
      <p className="mt-2 text-muted">{vehicle.trim}</p>
      <p className="mt-4 font-display text-5xl leading-none text-fg tabular-nums">{money(vehicle.price)}</p>
      <p className="mt-2 text-sm text-muted">
        Checked {LINDERS_CHECKED} on Linder's public pages. Price and mileage can move. This app does not hold the car.
      </p>
      {vehicle.notes ? <p className="mt-2 text-sm text-bone">{vehicle.notes}</p> : null}
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {specs.map(([label, value]) => (
          <div key={label} className="border border-line p-3">
            <dt className="text-xs tracking-widest text-faint uppercase">{label}</dt>
            <dd className={label === "VIN" ? "break-all text-fg" : "text-fg"}>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <a className={btn()} href={vehicle.url} target="_blank" rel="noreferrer">
          Open on Linder's
        </a>
        <button type="button" className={btn("line")} aria-pressed={saved} onClick={() => toggleSave(watchId)}>
          {saved ? "Watching" : "Watch this car"}
        </button>
      </div>
      <form
        className="mt-6 max-w-lg border border-line bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const text = note.trim();
          if (!text) return;
          window.localStorage.setItem(noteKey(vehicle.stock), text);
          setStored(text);
          setNote("");
          setStatus("Saved on this phone. Take it with you — it is not sent to the dealer.");
        }}
      >
        <p className="font-display text-xl uppercase text-fg">Note for yourself</p>
        <p className="mt-1 text-sm text-muted">Payments, a trade, or what you want to ask. Stays on this device.</p>
        {stored ? <p className="mt-3 text-sm text-fg">Your note: {stored}</p> : null}
        <textarea
          className="mt-3 min-h-24 w-full rounded-md border border-line bg-bg px-3 py-2 text-base text-fg"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ask about the history report and a same-day look."
        />
        <button className={`${btn("line")} mt-3`} type="submit">
          Keep note
        </button>
        {status ? (
          <p className="mt-2 text-sm text-bone" role="status">
            {status}
          </p>
        ) : null}
      </form>
    </Page>
  );
}
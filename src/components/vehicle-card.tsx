import { Link } from "@tanstack/react-router";
import type { RetailVehicle } from "@/lib/linders";
import { vehicleTitle } from "@/lib/linders";
import { miles, money } from "@/lib/format";

export function VehicleCard({ vehicle }: { vehicle: RetailVehicle }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white text-neutral-950 shadow-md">
      <Link
        to="/lot/$stock"
        params={{ stock: vehicle.stock }}
        search={{ q: "", make: "", sort: "price" }}
        className="flex flex-1 flex-col gap-1 p-4"
      >
        <span className="text-xs font-extrabold tracking-widest text-[#c2410c] uppercase">Linder's · retail used</span>
        <h3 className="text-xl leading-tight font-extrabold">{vehicleTitle(vehicle)}</h3>
        <p className="text-sm text-neutral-500">{vehicle.trim}</p>
        <p className="mt-2 text-2xl leading-none font-extrabold tabular-nums">{money(vehicle.price)}</p>
        <p className="mt-auto pt-2 text-sm text-neutral-500">
          {miles(vehicle.miles)}
          {vehicle.exterior ? ` · ${vehicle.exterior}` : ""}
        </p>
        <p className="text-sm text-neutral-400">Stock {vehicle.stock}</p>
      </Link>
    </article>
  );
}

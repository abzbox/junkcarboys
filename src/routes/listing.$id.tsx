import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { btn, field, labelCls, Page, Stamp } from "@/components/ui";
import { MAKES, VEHICLES, YARD_TIPS, categoryLabel } from "@/lib/catalog";
import { ago, money, yearsLabel } from "@/lib/format";
import { yardQuery } from "@/lib/search";
import { useBoard } from "@/lib/store";

export const Route = createFileRoute("/listing/$id")({
  head: () => ({ meta: [{ title: "Part — Junkyard Boys" }] }),
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const listings = useBoard((state) => state.listings);
  const offers = useBoard((state) => state.offers);
  const receipts = useBoard((state) => state.receipts);
  const saved = useBoard((state) => state.saved);
  const toggleSave = useBoard((state) => state.toggleSave);
  const buyNow = useBoard((state) => state.buyNow);
  const makeOffer = useBoard((state) => state.makeOffer);
  const takeCounter = useBoard((state) => state.takeCounter);
  const markSold = useBoard((state) => state.markSold);
  const removeListing = useBoard((state) => state.removeListing);
  const dropSampleOffer = useBoard((state) => state.dropSampleOffer);
  const listing = listings.find((item) => item.id === id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void Promise.resolve(useBoard.persist.rehydrate()).finally(() => setReady(true));
  }, []);

  if (!listing && !ready) {
    return (
      <Page className="py-16">
        <p className="text-muted">Pulling the tag…</p>
      </Page>
    );
  }

  if (!listing) {
    return (
      <Page className="py-16">
        <h1 className="font-display text-4xl uppercase text-fg">That tag is gone</h1>
        <p className="mt-2 text-muted">It isn't on the board anymore.</p>
        <Link to="/yard" search={yardQuery()} className={`${btn()} mt-4`}>
          Back to the board
        </Link>
      </Page>
    );
  }

  const mineOffers = offers.filter((offer) => offer.listingId === listing.id);
  const receipt = receipts.find((item) => item.listingId === listing.id);
  const similar = listings
    .filter(
      (item) =>
        item.id !== listing.id &&
        item.status === "active" &&
        (item.part === listing.part || (item.make === listing.make && item.model === listing.model)),
    )
    .slice(0, 3);

  return (
    <Page className="py-6">
      <p className="text-sm text-faint">
        <Link to="/yard" search={yardQuery({ cat: listing.category })} className="text-rust">
          {categoryLabel(listing.category)}
        </Link>
      </p>
      <div className="mt-3 grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="relative overflow-hidden border border-line bg-raised">
            <img src={listing.photo} alt={listing.title} className="ratio-photo" />
            {listing.status === "sold" ? (
              <span className="absolute bottom-3 left-3 bg-bg px-3 py-1 font-display text-xl uppercase tracking-widest text-bone">
                Sold
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none uppercase text-fg">{listing.title}</h1>
          <p className="mt-2 text-muted">{listing.description}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Info label="Fits" value={`${yearsLabel(listing.yearStart, listing.yearEnd)} ${listing.make} ${listing.model}`} />
            <Info label="Interchange" value={listing.engineNote} />
            <Info label="Condition" value={listing.condition} />
            <Info label="Donor miles" value={listing.donorMiles ?? "Not listed"} />
            <Info label="Warranty" value={listing.warranty} />
            <Info label="Posted" value={ago(listing.postedAt)} hydrate />
          </dl>
          <FitCheck yearStart={listing.yearStart} yearEnd={listing.yearEnd} make={listing.make} model={listing.model} />
          <ul className="mt-4 grid gap-2">
            {YARD_TIPS.slice(0, 3).map((tip) => (
              <li key={tip} className="border border-line px-3 py-2 text-sm text-muted">
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <aside className="md:col-span-2">
          <div className="border border-line bg-surface p-4 md:sticky md:top-24">
            <p className="font-display text-5xl leading-none text-fg tabular-nums">{money(listing.price)}</p>
            {listing.acceptsOffers && listing.status === "active" ? (
              <p className="mt-1 text-sm text-muted">Floor {money(listing.floor)} — offers at or above it get held.</p>
            ) : null}
            <p className="mt-3 flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0 text-rust" aria-hidden="true" />
              <span>
                {listing.yardName ?? listing.sellerName} · {listing.city} · {listing.miles} mi from Worcester
              </span>
            </p>
            {listing.bin ? (
              <div className="mt-4 border border-line bg-raised p-3">
                <p className="font-display text-sm tracking-widest text-rust uppercase">Quote this bin</p>
                <p className="font-display text-4xl text-fg">{listing.bin}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Private seller. Meet in a public lot in {listing.city}.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Stamp>{listing.sellerType === "yard" ? "Yard" : "Private"}</Stamp>
              <Stamp>{listing.condition}</Stamp>
            </div>
            <button
              type="button"
              className={`${btn("line")} mt-4 w-full`}
              onClick={() => toggleSave(listing.id)}
              aria-pressed={saved.includes(listing.id)}
            >
              <Bookmark className="size-4" fill={saved.includes(listing.id) ? "currentColor" : "none"} />
              {saved.includes(listing.id) ? "Saved" : "Save"}
            </button>
            {listing.status === "sold" ? (
              <p className="mt-4 text-sm text-bone" role="status">
                {receipt ? `${receipt.how} at ${money(receipt.amount)}. Pickup notes are in Deals.` : "This one already sold."}
              </p>
            ) : listing.mine ? (
              <OwnerBox
                onSold={() => markSold(listing.id)}
                onRemove={() => removeListing(listing.id)}
                onSample={() => dropSampleOffer(listing.id)}
              />
            ) : (
              <BuyerBox
                price={listing.price}
                floor={listing.floor}
                accepts={listing.acceptsOffers}
                onBuy={() => buyNow(listing.id)}
                onOffer={(amount, note) => makeOffer(listing.id, amount, note)}
              />
            )}
            {mineOffers.length ? (
              <ul className="mt-4 grid gap-2">
                {mineOffers.map((offer) => (
                  <li key={offer.id} className="border border-line p-3 text-sm">
                    <p className="font-display text-lg text-fg uppercase">
                      {offer.buyerName} · {money(offer.amount)} · {offer.status}
                    </p>
                    {offer.note ? <p className="text-muted">{offer.note}</p> : null}
                    {offer.reply ? (
                      <p className="mt-1 text-bone" role="status">
                        {offer.reply}
                      </p>
                    ) : null}
                    {offer.status === "counter" && offer.counterAmount && offer.fromMe ? (
                      <button type="button" className={`${btn()} mt-2`} onClick={() => takeCounter(offer.id)}>
                        Take {money(offer.counterAmount)}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </aside>
      </div>
      {similar.length ? (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-2xl uppercase text-fg">Also on the lot</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {similar.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      ) : null}
    </Page>
  );
}

function Info({ label, value, hydrate = false }: { label: string; value: string; hydrate?: boolean }) {
  return (
    <div className="border border-line p-3">
      <dt className="text-xs tracking-widest text-faint uppercase">{label}</dt>
      <dd className="text-fg" suppressHydrationWarning={hydrate}>
        {value}
      </dd>
    </div>
  );
}

function BuyerBox({
  price,
  floor,
  accepts,
  onBuy,
  onOffer,
}: {
  price: number;
  floor: number;
  accepts: boolean;
  onBuy: () => void;
  onOffer: (amount: number, note: string) => { ok: boolean; reason?: string };
}) {
  const [amount, setAmount] = useState(String(floor));
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="mt-4 grid gap-2">
      <button type="button" className={btn()} onClick={onBuy}>
        Buy now · {money(price)}
      </button>
      {accepts ? (
        <form
          className="grid gap-2 border border-line p-3"
          onSubmit={(event) => {
            event.preventDefault();
            const result = onOffer(Number(amount), note);
            setMessage(result.ok ? "Offer's in. The reply is under this box." : result.reason ?? "Offer didn't send.");
          }}
        >
          <p className="font-display text-lg uppercase text-fg">Make an offer</p>
          <label className={labelCls} htmlFor="offer-amount">
            Your price
          </label>
          <input
            id="offer-amount"
            inputMode="numeric"
            className={field}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <label className={labelCls} htmlFor="offer-note">
            Note
          </label>
          <textarea
            id="offer-note"
            className={`${field} min-h-24 py-2`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="I can pick up today."
          />
          <button className={btn("line")} type="submit">
            Send offer
          </button>
          {message ? (
            <p className="text-sm text-bone" role="status">
              {message}
            </p>
          ) : null}
        </form>
      ) : (
        <p className="text-sm text-muted">Firm price. No offers on this tag.</p>
      )}
    </div>
  );
}

function OwnerBox({
  onSold,
  onRemove,
  onSample,
}: {
  onSold: () => void;
  onRemove: () => void;
  onSample: () => void;
}) {
  return (
    <div className="mt-4 grid gap-2">
      <p className="text-sm text-muted">This is your listing. Buyers send offers here.</p>
      <button type="button" className={btn("line")} onClick={onSample}>
        Preview a buyer offer
      </button>
      <button type="button" className={btn("line")} onClick={onSold}>
        Mark sold
      </button>
      <button type="button" className={btn("quiet")} onClick={onRemove}>
        Remove from the board
      </button>
    </div>
  );
}

function FitCheck({
  yearStart,
  yearEnd,
  make,
  model,
}: {
  yearStart: number;
  yearEnd: number;
  make: string;
  model: string;
}) {
  const [year, setYear] = useState(2018);
  const [vehMake, setVehMake] = useState(make);
  const [vehModel, setVehModel] = useState(model);
  const [result, setResult] = useState("");
  const models = useMemo(() => VEHICLES.filter((vehicle) => vehicle.make === vehMake), [vehMake]);

  return (
    <form
      className="mt-4 border border-line bg-surface p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const same = vehMake === make && vehModel === model;
        const inYears = year >= yearStart && year <= yearEnd;
        if (same && inYears) setResult(`Yes. A ${year} ${vehMake} ${vehModel} is inside this donor range.`);
        else if (same) setResult(`Same truck, wrong years. This pull is only ${yearsLabel(yearStart, yearEnd)}.`);
        else setResult(`No. This tag is a ${make} ${model}, not a ${vehMake} ${vehModel}.`);
      }}
    >
      <p className="font-display text-xl uppercase text-fg">Will it fit my truck?</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <select className={field} value={year} onChange={(event) => setYear(Number(event.target.value))} aria-label="Your year">
          {Array.from({ length: 29 }, (_, index) => 2026 - index).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          className={field}
          value={vehMake}
          aria-label="Your make"
          onChange={(event) => {
            const next = event.target.value;
            setVehMake(next);
            const first = VEHICLES.find((vehicle) => vehicle.make === next);
            if (first) setVehModel(first.model);
          }}
        >
          {MAKES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className={field} value={vehModel} aria-label="Your model" onChange={(event) => setVehModel(event.target.value)}>
          {models.map((vehicle) => (
            <option key={vehicle.model}>{vehicle.model}</option>
          ))}
        </select>
      </div>
      <button className={`${btn("line")} mt-3`} type="submit">
        Check fit
      </button>
      {result ? (
        <p className="mt-2 text-sm text-bone" role="status">
          {result}
        </p>
      ) : null}
    </form>
  );
}

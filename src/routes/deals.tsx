import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { btn, field, Page } from "@/components/ui";
import { ago, money } from "@/lib/format";
import { useBoard, type Offer } from "@/lib/store";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Deals — Junkyard Boys" }] }),
  component: DealsPage,
});

const TABS = [
  { id: "offers", label: "My offers" },
  { id: "inbox", label: "On my parts" },
  { id: "pickups", label: "Pickups" },
  { id: "mine", label: "My listings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function DealsPage() {
  const offers = useBoard((state) => state.offers);
  const listings = useBoard((state) => state.listings);
  const receipts = useBoard((state) => state.receipts);
  const respond = useBoard((state) => state.respond);
  const takeCounter = useBoard((state) => state.takeCounter);
  const removeListing = useBoard((state) => state.removeListing);
  const markSold = useBoard((state) => state.markSold);
  const dropSampleOffer = useBoard((state) => state.dropSampleOffer);
  const removeWanted = useBoard((state) => state.removeWanted);
  const wanted = useBoard((state) => state.wanted);
  const [tab, setTab] = useState<TabId>("offers");
  const mineIds = new Set(listings.filter((listing) => listing.mine).map((listing) => listing.id));
  const mineOffers = offers.filter((offer) => offer.fromMe);
  const inbox = offers.filter((offer) => mineIds.has(offer.listingId) && !offer.fromMe);
  const mineListings = listings.filter((listing) => listing.mine);

  return (
    <Page className="py-6">
      <h1 className="font-display text-4xl uppercase text-fg">Deals</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Offers you send stay on this phone. Yard desks answer with their floor. Offers on your own parts wait here
        until you accept, counter, or pass.
      </p>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={btn(tab === item.id ? "rust" : "line", "shrink-0")}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "offers" ? (
        <OfferList
          offers={mineOffers}
          empty="You haven't offered yet. Open a part and name a price."
          onTake={takeCounter}
        />
      ) : null}

      {tab === "inbox" ? (
        inbox.length ? (
          <ul className="mt-4 grid gap-3">
            {inbox.map((offer) => (
              <InboxRow key={offer.id} offer={offer} onRespond={respond} />
            ))}
          </ul>
        ) : (
          <Empty text="Nothing incoming. Post a part, then preview a buyer offer to see how accept and counter work." />
        )
      ) : null}

      {tab === "pickups" ? (
        receipts.length ? (
          <ul className="mt-4 grid gap-3">
            {receipts.map((receipt) => (
              <li key={receipt.id} className="border border-line bg-surface p-4">
                <p className="font-display text-2xl uppercase text-fg">{receipt.title}</p>
                <p className="text-muted">
                  {receipt.how} · {money(receipt.amount)} · {receipt.seller}
                </p>
                <p className="text-sm text-faint">
                  {receipt.city}
                  {receipt.bin ? ` · Quote bin ${receipt.bin}` : " · Set a public meetup"} ·{" "}
                  <span suppressHydrationWarning>{ago(receipt.at)}</span>
                </p>
                <Link to="/listing/$id" params={{ id: receipt.listingId }} className={`${btn("line")} mt-3`}>
                  View tag
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty text="No pickups yet. Buy now, or get an offer accepted, and the hold note lands here." />
        )
      ) : null}

      {tab === "mine" ? (
        <div className="mt-4 grid gap-6">
          {mineListings.length ? (
            <ul className="grid gap-3">
              {mineListings.map((listing) => (
                <li key={listing.id} className="border border-line bg-surface p-4">
                  <p className="font-display text-2xl uppercase text-fg">{listing.title}</p>
                  <p className="text-muted">
                    {money(listing.price)} · {listing.status === "sold" ? "Sold" : "On the board"}
                    {listing.bin ? ` · Bin ${listing.bin}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link to="/listing/$id" params={{ id: listing.id }} className={btn("line")}>
                      Open
                    </Link>
                    {listing.status === "active" ? (
                      <>
                        <button type="button" className={btn("line")} onClick={() => dropSampleOffer(listing.id)}>
                          Preview a buyer offer
                        </button>
                        <button type="button" className={btn("line")} onClick={() => markSold(listing.id)}>
                          Mark sold
                        </button>
                      </>
                    ) : null}
                    <button type="button" className={btn("quiet")} onClick={() => removeListing(listing.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty text="You haven't posted. Sell a single part or paste a yard sheet." />
          )}
          <section>
            <h2 className="font-display text-2xl uppercase text-fg">Wanted notes you posted</h2>
            <ul className="mt-3 grid gap-2">
              {wanted.filter((item) => item.mine).length ? (
                wanted
                  .filter((item) => item.mine)
                  .map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 border border-line px-3 py-2">
                      <span className="text-fg">
                        {item.year} {item.make} {item.model} {item.part}
                      </span>
                      <button type="button" className={btn("quiet")} onClick={() => removeWanted(item.id)}>
                        Remove
                      </button>
                    </li>
                  ))
              ) : (
                <li className="text-sm text-muted">None yet. The part guide can post one.</li>
              )}
            </ul>
          </section>
        </div>
      ) : null}
    </Page>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="mt-6 border border-line bg-surface p-4 text-muted">{text}</p>;
}

function OfferList({
  offers,
  empty,
  onTake,
}: {
  offers: Offer[];
  empty: string;
  onTake: (id: string) => void;
}) {
  if (!offers.length) return <Empty text={empty} />;
  return (
    <ul className="mt-4 grid gap-3">
      {offers.map((offer) => (
        <li key={offer.id} className="border border-line bg-surface p-4">
          <p className="font-display text-2xl uppercase text-fg">{offer.listingTitle}</p>
          <p className="text-muted">
            You offered {money(offer.amount)} · {labelStatus(offer.status)}
            {offer.counterAmount ? ` · counter ${money(offer.counterAmount)}` : ""}
          </p>
          {offer.note ? <p className="text-sm text-faint">{offer.note}</p> : null}
          {offer.reply ? (
            <p className="mt-2 text-sm text-bone" role="status">
              {offer.reply}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/listing/$id" params={{ id: offer.listingId }} className={btn("line")}>
              View part
            </Link>
            {offer.status === "counter" && offer.counterAmount ? (
              <button type="button" className={btn()} onClick={() => onTake(offer.id)}>
                Take {money(offer.counterAmount)}
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function InboxRow({
  offer,
  onRespond,
}: {
  offer: Offer;
  onRespond: (id: string, action: "accept" | "decline" | "counter", amount?: number) => void;
}) {
  const [counter, setCounter] = useState(String(Math.round(offer.amount * 1.08)));
  return (
    <li className="border border-line bg-surface p-4">
      <p className="font-display text-2xl uppercase text-fg">{offer.listingTitle}</p>
      <p className="text-muted">
        {offer.buyerName} offered {money(offer.amount)} · {labelStatus(offer.status)}
      </p>
      {offer.note ? <p className="text-sm text-fg">{offer.note}</p> : null}
      {offer.reply ? <p className="mt-1 text-sm text-bone">{offer.reply}</p> : null}
      {offer.status === "open" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className={btn()} onClick={() => onRespond(offer.id, "accept")}>
            Accept {money(offer.amount)}
          </button>
          <button type="button" className={btn("line")} onClick={() => onRespond(offer.id, "decline")}>
            Pass
          </button>
          <input
            aria-label="Counter price"
            inputMode="numeric"
            className={`${field} w-28`}
            value={counter}
            onChange={(event) => setCounter(event.target.value)}
          />
          <button type="button" className={btn("line")} onClick={() => onRespond(offer.id, "counter", Number(counter))}>
            Counter
          </button>
        </div>
      ) : null}
    </li>
  );
}

function labelStatus(status: Offer["status"]) {
  if (status === "open") return "Waiting";
  if (status === "accepted") return "Accepted";
  if (status === "counter") return "Counter";
  return "Passed";
}

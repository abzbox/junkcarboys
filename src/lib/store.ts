import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  RESERVE,
  SEED,
  WANTED_SEED,
  photoFor,
  DESK_EMAIL,
  type Condition,
  type Listing,
  type Wanted,
} from "@/lib/catalog";
import { money } from "@/lib/format";

export type Profile = { name: string; city: string };

export type OfferStatus = "open" | "accepted" | "declined" | "counter";

export type Offer = {
  id: string;
  listingId: string;
  listingTitle: string;
  amount: number;
  note: string;
  buyerName: string;
  status: OfferStatus;
  counterAmount?: number;
  reply: string;
  createdAt: number;
  fromMe: boolean;
};

export type Receipt = {
  id: string;
  listingId: string;
  title: string;
  amount: number;
  seller: string;
  city: string;
  bin?: string;
  how: string;
  at: number;
};

export type NewListing = {
  title: string;
  part: string;
  category: Listing["category"];
  yearStart: number;
  yearEnd: number;
  make: string;
  model: string;
  engineNote: string;
  condition: Condition;
  price: number;
  acceptsOffers: boolean;
  description: string;
  photo?: string;
  asYard: boolean;
  bin?: string;
  oem?: string;
  trim?: string;
  core?: number;
  phone?: string;
  pickup?: string;
};

type Persisted = {
  profile: Profile;
  offers: Offer[];
  saved: string[];
  receipts: Receipt[];
  wanted: Wanted[];
  soldIds: string[];
  mine: Listing[];
  pulled: Listing[];
};

type BoardState = {
  profile: Profile;
  listings: Listing[];
  offers: Offer[];
  saved: string[];
  receipts: Receipt[];
  wanted: Wanted[];
  setProfile: (profile: Profile) => void;
  toggleSave: (id: string) => void;
  addListing: (draft: NewListing) => string;
  addParsed: (rows: NewListing[]) => number;
  removeListing: (id: string) => void;
  markSold: (id: string) => void;
  buyNow: (id: string) => boolean;
  makeOffer: (id: string, amount: number, note: string) => { ok: boolean; reason?: string };
  takeCounter: (offerId: string) => void;
  respond: (offerId: string, action: "accept" | "decline" | "counter", counterAmount?: number) => void;
  dropSampleOffer: (id: string) => void;
  pullMore: () => number;
  addWanted: (wanted: Omit<Wanted, "id" | "createdAt" | "mine" | "name" | "city"> & { note: string }) => void;
  removeWanted: (id: string) => void;
};

const BUYERS = ["Chris P.", "Dana L.", "Omar S.", "Nikki V.", "Earl T."];
const SAMPLE_NOTES = [
  "Can you do this if I pick up today?",
  "Still available? I'll come after work.",
  "I'll take it if the connector is intact.",
  "Cash in hand. Worcester meetup.",
];

function declineOpen(offers: Offer[], listingId: string, reply: string) {
  return offers.map((offer) =>
    offer.listingId === listingId && (offer.status === "open" || offer.status === "counter")
      ? { ...offer, status: "declined" as const, reply }
      : offer,
  );
}

function receiptFor(listing: Listing, amount: number, how: string): Receipt {
  return {
    id: crypto.randomUUID(),
    listingId: listing.id,
    title: listing.title,
    amount,
    seller: listing.yardName || listing.sellerName,
    city: listing.city,
    bin: listing.bin,
    how,
    at: Date.now(),
  };
}

function compose(soldIds: string[], pulled: Listing[], mine: Listing[]) {
  const sold = new Set(soldIds);
  const seed = SEED.map((listing) =>
    sold.has(listing.id) ? { ...listing, status: "sold" as const } : { ...listing },
  );
  const seen = new Set(seed.map((listing) => listing.id));
  const extras = [...pulled, ...mine].filter((listing) => {
    if (seen.has(listing.id)) return false;
    seen.add(listing.id);
    return true;
  });
  return [...extras, ...seed].map((listing) =>
    sold.has(listing.id) ? { ...listing, status: "sold" as const } : listing,
  );
}

const initialProfile: Profile = { name: "Yard shopper", city: "Worcester, MA" };

export const useBoard = create<BoardState>()(
  persist(
    (set, get) => ({
      profile: initialProfile,
      listings: compose([], [], []),
      offers: [],
      saved: [],
      receipts: [],
      wanted: WANTED_SEED,
      setProfile: (profile) => set({ profile }),
      toggleSave: (id) =>
        set((state) => ({
          saved: state.saved.includes(id) ? state.saved.filter((item) => item !== id) : [id, ...state.saved],
        })),
      addListing: (draft) => {
        const id = crypto.randomUUID();
        const profile = get().profile;
        const listing: Listing = {
          id,
          title: draft.title.trim() || `${draft.yearStart} ${draft.make} ${draft.model} ${draft.part}`,
          part: draft.part,
          category: draft.category,
          yearStart: draft.yearStart,
          yearEnd: Math.max(draft.yearStart, draft.yearEnd),
          make: draft.make,
          model: draft.model,
          engineNote: draft.engineNote.trim() || "Seller didn't note interchange. Ask before you drive over.",
          aliases: [],
          condition: draft.condition,
          price: Math.round(draft.price),
          floor: draft.acceptsOffers ? Math.round(draft.price * 0.85) : Math.round(draft.price),
          acceptsOffers: draft.acceptsOffers,
          city: profile.city || "Worcester, MA",
          miles: 1,
          yardName: draft.asYard ? profile.name : undefined,
          bin: draft.asYard ? draft.bin || `B-${100 + Math.floor(Math.random() * 800)}` : undefined,
          description: draft.description.trim() || "Posted from the Junkyard Boys board.",
          photo: draft.photo || photoFor(draft.category),
          sellerName: profile.name,
          sellerType: draft.asYard ? "yard" : "private",
          postedAt: Date.now(),
          warranty: draft.asYard
            ? "Your yard's terms. Say them in the description so buyers aren't guessing."
            : "Private sale. Meet in a public lot. No warranty unless you wrote one.",
          status: "active",
          mine: true,
          availability: "seller",
          checkedLabel: "Posted by the seller. Not checked by a yard.",
          core: Math.max(0, Math.round(draft.core ?? 0)),
          pickup: draft.pickup?.trim() || `Meet in a public lot in ${profile.city || "Worcester, MA"}.`,
          shipping: "Pickup only, unless the seller wrote a shipping plan in the description.",
          contact: DESK_EMAIL,
          oem: draft.oem?.trim() ?? "",
          engine: draft.engineNote.trim(),
          trim: draft.trim?.trim() ?? "",
          phone: draft.phone?.trim() ?? "",
        };
        set((state) => ({ listings: [listing, ...state.listings] }));
        return id;
      },
      addParsed: (rows) => {
        rows.forEach((row) => get().addListing(row));
        return rows.length;
      },
      removeListing: (id) =>
        set((state) => ({
          listings: state.listings.filter((listing) => !(listing.id === id && listing.mine)),
          offers: state.offers.filter((offer) => offer.listingId !== id),
          saved: state.saved.filter((item) => item !== id),
        })),
      markSold: (id) =>
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === id && listing.mine ? { ...listing, status: "sold" } : listing,
          ),
          offers: declineOpen(state.offers, id, "Seller marked it sold."),
        })),
      buyNow: (id) => {
        const listing = get().listings.find((item) => item.id === id);
        if (!listing || listing.status !== "active" || listing.mine) return false;
        set((state) => ({
          listings: state.listings.map((item) => (item.id === id ? { ...item, status: "sold" } : item)),
          offers: declineOpen(state.offers, id, "Someone bought it outright."),
          receipts: [receiptFor(listing, listing.price, "Bought now"), ...state.receipts],
        }));
        return true;
      },
      makeOffer: (id, amount, note) => {
        const listing = get().listings.find((item) => item.id === id);
        if (!listing || listing.status !== "active") return { ok: false, reason: "That part is already gone." };
        if (listing.mine) return { ok: false, reason: "That's your part. Buyers offer on it." };
        if (!listing.acceptsOffers) return { ok: false, reason: "This seller isn't taking offers. Buy it now." };
        if (!Number.isFinite(amount) || amount < 1) return { ok: false, reason: "Offer a real dollar amount." };
        const profile = get().profile;
        let status: OfferStatus = "counter";
        let counterAmount: number | undefined = listing.floor;
        let reply = "";
        if (amount >= listing.floor) {
          status = "accepted";
          counterAmount = undefined;
          reply =
            listing.sellerType === "yard"
              ? `${listing.yardName} will hold it at ${money(amount)}. Pay at the counter and quote bin ${listing.bin ?? "the tag"}.`
              : `${listing.sellerName} accepts ${money(amount)}. Set a meetup in ${listing.city}. Public lot, daytime.`;
        } else {
          reply =
            listing.sellerType === "yard"
              ? `Desk counter: they won't go under ${money(listing.floor)}. The tag is already on the rack.`
              : `${listing.sellerName} counters at ${money(listing.floor)}.`;
        }
        const offer: Offer = {
          id: crypto.randomUUID(),
          listingId: listing.id,
          listingTitle: listing.title,
          amount: Math.round(amount),
          note: note.trim(),
          buyerName: profile.name,
          status,
          counterAmount,
          reply,
          createdAt: Date.now(),
          fromMe: true,
        };
        set((state) => ({
          offers: [offer, ...state.offers],
          listings:
            status === "accepted"
              ? state.listings.map((item) => (item.id === id ? { ...item, status: "sold" } : item))
              : state.listings,
          receipts:
            status === "accepted"
              ? [receiptFor(listing, Math.round(amount), "Offer accepted"), ...state.receipts]
              : state.receipts,
        }));
        return { ok: true };
      },
      takeCounter: (offerId) => {
        const offer = get().offers.find((item) => item.id === offerId);
        const listing = offer ? get().listings.find((item) => item.id === offer.listingId) : undefined;
        if (!offer || !listing || offer.status !== "counter" || !offer.counterAmount) return;
        if (listing.status !== "active") return;
        const amount = offer.counterAmount;
        set((state) => ({
          offers: state.offers.map((item) =>
            item.id === offerId
              ? { ...item, status: "accepted", reply: `You took the counter at ${money(amount)}. ${item.reply}` }
              : item.listingId === listing.id && item.id !== offerId && (item.status === "open" || item.status === "counter")
                ? { ...item, status: "declined", reply: "Another offer closed the deal." }
                : item,
          ),
          listings: state.listings.map((item) => (item.id === listing.id ? { ...item, status: "sold" } : item)),
          receipts: [receiptFor(listing, amount, "Counter accepted"), ...state.receipts],
        }));
      },
      respond: (offerId, action, counterAmount) => {
        const offer = get().offers.find((item) => item.id === offerId);
        const listing = offer ? get().listings.find((item) => item.id === offer.listingId) : undefined;
        if (!offer || !listing || !listing.mine || offer.status !== "open") return;
        if (action === "decline") {
          set((state) => ({
            offers: state.offers.map((item) =>
              item.id === offerId ? { ...item, status: "declined", reply: "You passed on this offer." } : item,
            ),
          }));
          return;
        }
        if (action === "counter") {
          if (!counterAmount || counterAmount < 1) return;
          set((state) => ({
            offers: state.offers.map((item) =>
              item.id === offerId
                ? {
                    ...item,
                    status: "counter",
                    counterAmount: Math.round(counterAmount),
                    reply: `You countered at ${money(counterAmount)}.`,
                  }
                : item,
            ),
          }));
          return;
        }
        set((state) => ({
          offers: declineOpen(state.offers, listing.id, "Seller accepted another offer.").map((item) =>
            item.id === offerId
              ? { ...item, status: "accepted", reply: `You accepted ${money(offer.amount)}. Arrange pickup in ${listing.city}.` }
              : item,
          ),
          listings: state.listings.map((item) => (item.id === listing.id ? { ...item, status: "sold" } : item)),
          receipts: [receiptFor(listing, offer.amount, "You accepted an offer"), ...state.receipts],
        }));
      },
      dropSampleOffer: (id) => {
        const listing = get().listings.find((item) => item.id === id);
        if (!listing || !listing.mine || listing.status !== "active") return;
        const amount = Math.max(10, Math.round(listing.price * (0.78 + Math.random() * 0.12)));
        const buyer = BUYERS[Math.floor(Math.random() * BUYERS.length)] ?? "Chris P.";
        const note = SAMPLE_NOTES[Math.floor(Math.random() * SAMPLE_NOTES.length)] ?? "Still available?";
        const offer: Offer = {
          id: crypto.randomUUID(),
          listingId: listing.id,
          listingTitle: listing.title,
          amount,
          note,
          buyerName: buyer,
          status: "open",
          reply: "",
          createdAt: Date.now(),
          fromMe: false,
        };
        set((state) => ({ offers: [offer, ...state.offers] }));
      },
      pullMore: () => {
        const have = new Set(get().listings.map((listing) => listing.id));
        const next = RESERVE.filter((listing) => !have.has(listing.id)).slice(0, 3);
        if (!next.length) return 0;
        const stamped = next.map((listing) => ({ ...listing, postedAt: Date.now(), pulled: true }));
        set((state) => ({ listings: [...stamped, ...state.listings] }));
        return stamped.length;
      },
      addWanted: (draft) => {
        const profile = get().profile;
        const wanted: Wanted = {
          id: crypto.randomUUID(),
          year: draft.year,
          make: draft.make,
          model: draft.model,
          part: draft.part,
          note: draft.note.trim() || "Looking local. Cash pickup.",
          name: profile.name,
          city: profile.city || "Worcester, MA",
          mine: true,
          createdAt: Date.now(),
        };
        set((state) => ({ wanted: [wanted, ...state.wanted] }));
      },
      removeWanted: (id) =>
        set((state) => ({
          wanted: state.wanted.filter((item) => !(item.id === id && item.mine)),
        })),
    }),
    {
      name: "jyb-board-v1",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): Persisted => ({
        profile: state.profile,
        offers: state.offers,
        saved: state.saved,
        receipts: state.receipts,
        wanted: state.wanted,
        soldIds: state.listings.filter((listing) => listing.status === "sold").map((listing) => listing.id),
        mine: state.listings.filter((listing) => listing.mine),
        pulled: state.listings.filter((listing) => listing.pulled && !listing.mine),
      }),
      merge: (persisted, current) => {
        const saved = persisted as Persisted | undefined;
        if (!saved || !saved.profile) return current;
        return {
          ...current,
          profile: saved.profile,
          offers: saved.offers ?? [],
          saved: saved.saved ?? [],
          receipts: saved.receipts ?? [],
          wanted: saved.wanted?.length ? saved.wanted : current.wanted,
          listings: compose(saved.soldIds ?? [], saved.pulled ?? [], saved.mine ?? []),
        };
      },
    },
  ),
);

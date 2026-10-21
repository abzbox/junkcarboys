import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Handshake, Home, LayoutGrid, MapPin, Menu, Search, Tag, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { btn, field, labelCls } from "@/components/ui";
import { GrokBot } from "@/components/grok-bot";
import { yardQuery } from "@/lib/search";
import { useBoard } from "@/lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/yard", label: "Find Parts" },
  { to: "/sell", label: "Sell Parts" },
  { to: "/inventory", label: "Junkyard Inventory" },
  { to: "/guide", label: "How It Works" },
  { to: "/contact", label: "Contact" },
] as const;

const DOCK = [
  { to: "/", label: "Home", icon: Home },
  { to: "/yard", label: "Find", icon: Search },
  { to: "/sell", label: "Sell", icon: Tag },
  { to: "/inventory", label: "Yards", icon: LayoutGrid },
  { to: "/deals", label: "Deals", icon: Handshake },
] as const;

const CITIES = ["Worcester", "Millbury", "Lowell", "Quincy", "Springfield", "Pawtucket", "Hyannis"];

function activePath(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const profile = useBoard((state) => state.profile);
  const setProfile = useBoard((state) => state.setProfile);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);

  useEffect(() => {
    void useBoard.persist.rehydrate();
  }, []);

  useEffect(() => {
    setName(profile.name);
    setCity(profile.city);
  }, [profile.name, profile.city]);

  const home = pathname === "/";

  return (
    <div className="min-h-screen bg-black text-white">
      <header className={home ? "sticky top-0 z-40 border-b border-white/10 bg-black md:absolute md:border-transparent md:bg-transparent" : "sticky top-0 z-40 border-b border-white/10 bg-black"}>
        <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-3 py-2.5">
          <Link to="/" className={`font-logo text-lg leading-none text-[#ffe500] sm:text-2xl ${home ? "md:hidden" : ""}`}>
            JUNK CAR BOYS
          </Link>
          <nav className={`ml-4 hidden items-center gap-1 lg:flex ${home ? "lg:ml-0" : ""}`} aria-label="Primary">
            {NAV.map((link) => {
              const on = activePath(pathname, link.to);
              const className = `inline-flex min-h-11 items-center border-b-2 px-2 text-sm font-semibold ${on ? "border-[#ffe500] text-white" : "border-transparent text-white/80"}`;
              return link.to === "/yard" ? (
                <Link key={link.to} to="/yard" search={yardQuery()} className={className} aria-current={on ? "page" : undefined}>
                  {link.label}
                </Link>
              ) : (
                <Link key={link.to} to={link.to} className={className} aria-current={on ? "page" : undefined}>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <label className="hidden items-center gap-1 text-sm font-semibold sm:flex">
              <MapPin className="size-4 text-[#ffe500]" aria-hidden="true" />
              <span className="sr-only">Location</span>
              <select
                className="bg-transparent text-sm font-semibold text-white"
                defaultValue="Worcester"
                onChange={(event) => {
                  const value = event.target.value;
                  void navigate({
                    to: "/yard",
                    search: yardQuery(value === "All" ? {} : { q: value }),
                  });
                }}
              >
                <option value="All">All areas</option>
                {CITIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <Link to="/yard" search={yardQuery()} className="flex size-11 items-center justify-center" aria-label="Search parts">
              <Search className="size-5" />
            </Link>
            <button type="button" className="hidden min-h-11 rounded-full border border-white/25 px-3 text-sm font-bold sm:inline-flex sm:items-center" onClick={() => setOpen(true)}>
              Log In
            </button>
            <button type="button" className="inline-flex min-h-11 items-center rounded-full bg-[#ffe500] px-3 text-sm font-extrabold text-black" onClick={() => setOpen(true)}>
              Sign Up
            </button>
            <button type="button" className="flex size-11 items-center justify-center lg:hidden" aria-expanded={menu} aria-label={menu ? "Close menu" : "Open menu"} onClick={() => setMenu((value) => !value)}>
              {menu ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
        {menu ? (
          <nav className="border-t border-white/10 bg-black px-3 py-2 lg:hidden" aria-label="Mobile">
            {NAV.map((link) =>
              link.to === "/yard" ? (
                <Link key={link.to} to="/yard" search={yardQuery()} className="flex min-h-12 items-center text-base font-semibold" onClick={() => setMenu(false)}>
                  {link.label}
                </Link>
              ) : (
                <Link key={link.to} to={link.to} className="flex min-h-12 items-center text-base font-semibold" onClick={() => setMenu(false)}>
                  {link.label}
                </Link>
              ),
            )}
            <Link to="/lot" search={{ q: "", make: "", sort: "price" }} className="flex min-h-12 items-center text-base font-semibold" onClick={() => setMenu(false)}>
              Linder's used lot
            </Link>
            <Link to="/deals" className="flex min-h-12 items-center text-base font-semibold" onClick={() => setMenu(false)}>
              Deals
            </Link>
            <button type="button" className="flex min-h-12 items-center text-base font-semibold" onClick={() => { setMenu(false); setOpen(true); }}>
              Log In
            </button>
          </nav>
        ) : null}
        {open ? (
          <form
            className="border-t border-white/10 bg-black px-4 py-4"
            onSubmit={(event) => {
              event.preventDefault();
              setProfile({
                name: name.trim() || "Yard shopper",
                city: city.trim() || "Worcester, MA",
              });
              setOpen(false);
            }}
          >
            <p className="font-display text-lg font-extrabold italic">Your name on offers</p>
            <p className="mb-3 text-sm text-white/70">No account. This only labels offers on this phone.</p>
            <label className={labelCls} htmlFor="seller-name">
              Name
            </label>
            <input id="seller-name" className={`${field} mb-3`} value={name} onChange={(event) => setName(event.target.value)} />
            <label className={labelCls} htmlFor="seller-city">
              City
            </label>
            <input id="seller-city" className={`${field} mb-3`} value={city} onChange={(event) => setCity(event.target.value)} />
            <div className="flex gap-2">
              <button className={btn()} type="submit">
                Save
              </button>
              <button className={btn("line")} type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </form>
        ) : null}
      </header>
      <main>{children}</main>
      <GrokBot />
      <footer className="border-t border-white/10 bg-black pb-24 text-white md:pb-8">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-8 md:grid-cols-[1.1fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-logo text-3xl leading-none text-[#ffe500]">JUNK CAR BOYS</p>
            <p className="mt-3 max-w-xs text-sm text-white/70">Buy, sell, and find used car parts around Worcester and central Massachusetts.</p>
          </div>
          <div>
            <p className="font-bold">Quick links</p>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li><Link to="/" className="inline-flex min-h-10 items-center">Home</Link></li>
              <li><Link to="/yard" search={yardQuery()} className="inline-flex min-h-10 items-center">Find Parts</Link></li>
              <li><Link to="/sell" className="inline-flex min-h-10 items-center">Sell Parts</Link></li>
              <li><Link to="/inventory" className="inline-flex min-h-10 items-center">Junkyard Inventory</Link></li>
              <li><Link to="/guide" className="inline-flex min-h-10 items-center">How It Works</Link></li>
              <li><Link to="/contact" className="inline-flex min-h-10 items-center">Contact</Link></li>
              <li><Link to="/lot" search={{ q: "", make: "", sort: "price" }} className="inline-flex min-h-10 items-center">Linder's used lot</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold">Contact us</p>
            <ul className="mt-2 space-y-2 text-sm text-white/80">
              <li><a className="inline-flex min-h-10 items-center" href="tel:9788779945">(978) 877-9945</a></li>
              <li><a className="inline-flex min-h-10 items-center" href="mailto:junkcarboyscom@gmail.com">junkcarboyscom@gmail.com</a></li>
              <li>Worcester, Massachusetts</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-xl">
            <img src="/brand/footer-car.jpg" alt="Your junk. Our cash. No hassle." className="h-36 w-full object-cover" />
          </div>
        </div>
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 border-t border-white/10 px-4 py-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Junk Car Boys. Yard rows are a sample board, not a live shop feed. Linder's cars are a public list from Oct 21, 2026.</p>
          <p className="flex gap-3">
            <Link to="/guide">How it works</Link>
            <Link to="/contact">Contact</Link>
          </p>
        </div>
      </footer>
      <nav className="dock fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black md:hidden" aria-label="Shortcuts">
        <div className="flex">
          {DOCK.map((link) => {
            const on = activePath(pathname, link.to);
            const Icon = link.icon;
            const className = `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${on ? "text-[#ffe500]" : "text-white/70"}`;
            return link.to === "/yard" ? (
              <Link key={link.label} to="/yard" search={yardQuery()} aria-current={on ? "page" : undefined} className={className}>
                <Icon className="size-5" aria-hidden="true" />
                {link.label}
              </Link>
            ) : (
              <Link key={link.label} to={link.to} aria-current={on ? "page" : undefined} className={className}>
                <Icon className="size-5" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import { useCartContext } from "../context/CartContext";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, openCart } = useCartContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => setMenu(false), [pathname]);

  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop");
  };

  const searchForm = (cls) => (
    <form onSubmit={submit} role="search" className={`relative ${cls}`}>
      <label className="sr-only" htmlFor="site-search">Search parts</label>
      <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
      <input id="site-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search CPUs, GPUs, RAM…" className="input h-10 bg-page pl-9" />
    </form>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/90 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-4">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-tile text-brand" : "text-mute hover:text-ink"}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        {searchForm("ml-auto hidden max-w-sm flex-1 sm:block")}
        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <button onClick={openCart} className="btn-primary h-10 px-3 text-sm sm:px-4" aria-label={`Open cart, ${count} items`}>
            <Icon name="cart" />
            <span className="hidden sm:inline">Cart</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-onbrand px-1 text-xs font-bold text-brand">{count}</span>
          </button>
          <button onClick={() => setMenu(!menu)} className="btn-outline h-10 w-10 px-0 lg:hidden" aria-label="Menu" aria-expanded={menu}>
            <Icon name={menu ? "x" : "menu"} />
          </button>
        </div>
      </div>
      {menu && (
        <div className="border-t border-line bg-card px-4 pb-4 pt-3 lg:hidden">
          {searchForm("mb-3 sm:hidden")}
          <nav className="grid gap-1" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-tile text-brand" : "text-ink"}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

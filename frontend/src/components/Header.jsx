import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useCartContext } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, openCart } = useCartContext();
  const { isDark, toggleTheme } = useTheme();
  const { stats } = useStore();
  const { user, isAuthenticated, isAdmin, isStaff, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menu, setMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setMenu(false);
    setUserDropdown(false);
  }, [pathname]);

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
          {/* Admin / Staff Portal Button */}
          {isStaff && (
            <Link
              to={isAdmin ? "/admin" : "/admin/products"}
              className="btn-outline hidden h-10 px-3 text-xs font-semibold gap-1.5 md:inline-flex"
              title="Store Management Portal"
            >
              <Icon name="chart" className="h-4 w-4 text-brand" />
              <span>{isAdmin ? "Admin" : "Moderator"}</span>
              {isAdmin && stats.pendingCount > 0 && (
                <span className="grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {stats.pendingCount}
                </span>
              )}
            </Link>
          )}

          {/* User Auth Profile / Login Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="btn-outline h-10 px-2.5 text-xs font-semibold gap-1.5"
                title="Account Profile"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-brand text-[11px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden xl:inline max-w-[80px] truncate">{user.name}</span>
                <span className="rounded bg-brand/10 px-1 py-0.2 text-[9px] font-bold uppercase text-brand">
                  {user.role}
                </span>
              </button>

              {userDropdown && (
                <div className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-line bg-card p-2 shadow-lift animate-in fade-in duration-150">
                  <div className="border-b border-line px-3 py-2">
                    <div className="font-semibold text-xs text-ink truncate">{user.name}</div>
                    <div className="text-[11px] text-mute truncate">{user.email}</div>
                    <div className="mt-1 inline-block rounded-md bg-tile px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand">
                      Role: {user.role}
                    </div>
                  </div>
                  <div className="py-1 text-xs">
                    {isStaff && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-brand hover:bg-tile"
                      >
                        <Icon name="chart" className="h-4 w-4" />
                        <span>Management Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Icon name="x" className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="btn-outline h-10 px-3 text-xs font-semibold gap-1.5"
            >
              <Icon name="user" className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <ThemeToggle />
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

          {/* User Section in Mobile Menu */}
          <div className="mt-3 border-t border-line pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-tile/70 p-2.5">
                  <div>
                    <div className="text-xs font-semibold text-ink">{user.name}</div>
                    <div className="text-[11px] text-mute">{user.email}</div>
                  </div>
                  <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-bold uppercase text-brand">
                    {user.role}
                  </span>
                </div>
                {isStaff && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-xs font-semibold text-brand"
                  >
                    <Icon name="chart" className="h-4 w-4" />
                    <span>Management Portal</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left text-xs font-semibold text-red-500 py-1 px-3"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="btn-outline h-10 w-full text-xs font-semibold gap-2"
              >
                <Icon name="user" className="h-4 w-4" /> Sign In / Create Account
              </button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="text-sm font-medium text-mute">Appearance</span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-tile px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-brand"
            >
              <Icon name={isDark ? "sun" : "moon"} className={`h-4 w-4 ${isDark ? "text-amber-400" : "text-slate-600"}`} />
              <span>{isDark ? "Light mode" : "Dark mode"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

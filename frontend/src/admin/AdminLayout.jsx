import { NavLink, Outlet, Link } from "react-router-dom";
import Logo from "../components/Logo";
import Icon from "../components/Icon";
import ThemeToggle from "../components/ThemeToggle";
import { useStore } from "../context/StoreContext";

export default function AdminLayout() {
  const { stats } = useStore();

  const links = [
    { to: "/admin", label: "Dashboard", icon: "chart", end: true },
    { to: "/admin/orders", label: "Orders", icon: "bag", badge: stats.pendingCount },
    { to: "/admin/products", label: "Products & Stock", icon: "box", badge: stats.outOfStockCount > 0 ? stats.outOfStockCount : null, alert: true },
  ];

  return (
    <div className="min-h-screen bg-page text-ink antialiased">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              className="btn-outline h-10 px-3.5 text-sm font-medium gap-1.5"
              title="Return to Customer Storefront"
            >
              <Icon name="store" className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Store</span>
            </Link>
          </div>
        </div>

        {/* Admin Navigation Bar */}
        <div className="border-t border-line/60 bg-tile/40 px-4 sm:px-6">
          <div className="container-x flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand text-onbrand shadow-soft"
                      : "text-mute hover:bg-card hover:text-ink"
                  }`
                }
              >
                <Icon name={link.icon} className="h-4 w-4" />
                <span>{link.label}</span>
                {link.badge ? (
                  <span
                    className={`ml-1 grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-bold ${
                      link.alert
                        ? "bg-red-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {link.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="container-x py-8">
        <Outlet />
      </main>

      {/* Admin Quick Footer */}
      <footer className="mt-12 border-t border-line py-6 text-center text-xs text-mute">
        CSZ Store Admin Management Panel • Live Synchronization Active
      </footer>
    </div>
  );
}

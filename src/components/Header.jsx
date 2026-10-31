import Icon from "./Icon";
import Logo from "./Logo";

const LINKS = [
  { href: "#categories", label: "Categories" },
  { href: "#shop", label: "Shop" },
  { href: "#why-csz", label: "Why CSZ" },
];

export default function Header({ count, onCart, query, setQuery }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-mute lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-ink">{l.label}</a>
          ))}
        </nav>
        <label className="relative ml-auto flex-1 lg:max-w-md">
          <span className="sr-only">Search parts</span>
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search CPUs, GPUs, RAM…"
            className="h-10 w-full rounded-lg border border-line bg-page pl-9 pr-3 text-sm placeholder:text-mute focus:border-brand focus:outline-none"
          />
        </label>
        <button onClick={onCart} className="btn-primary relative h-10 px-3 text-sm sm:px-4" aria-label={`Open cart, ${count} items`}>
          <Icon name="cart" />
          <span className="hidden sm:inline">Cart</span>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-onbrand px-1 text-xs font-bold text-brand">{count}</span>
        </button>
      </div>
    </header>
  );
}

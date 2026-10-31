import Logo from "./Logo";
import { CATEGORIES } from "../data/categories";
import { STORE } from "../data/config";

export default function Footer({ onSelect }) {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-sm sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-mute">Quality computer parts for builders, gamers and businesses.</p>
        </div>
        <div>
          <div className="font-semibold">Shop</div>
          <ul className="mt-3 space-y-2 text-mute">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c}><a href="#shop" onClick={() => onSelect(c)} className="hover:text-ink">{c}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold">Support</div>
          <ul className="mt-3 space-y-2 text-mute">
            <li>Shipping and delivery</li>
            <li>Returns and warranty</li>
            <li>{STORE.email}</li>
            <li>{STORE.phone}</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Get deal alerts</div>
          <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
            <label className="sr-only" htmlFor="email">Email address</label>
            <input id="email" type="email" required placeholder="you@example.com" className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-page px-3 focus:border-brand focus:outline-none" />
            <button className="btn-primary h-10 px-4 text-sm">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-mute">
        © {new Date().getFullYear()} {STORE.name} – {STORE.fullName}. All rights reserved.
      </div>
    </footer>
  );
}

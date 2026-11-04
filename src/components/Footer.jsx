import { Link } from "react-router-dom";
import Logo from "./Logo";
import SocialIcon from "./SocialIcon";
import { CATEGORIES } from "../data/categories";
import { STORE } from "../data/config";

const SOCIAL = [["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"]];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-card">
      <div className="container-x grid gap-10 py-12 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-mute">Quality computer parts for builders, gamers and businesses.</p>
          <div className="mt-5 flex gap-2">
            {SOCIAL.map(([key, label]) => (
              <a key={key} href={STORE.social[key]} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-lg border border-line text-mute transition hover:border-brand hover:text-brand">
                <SocialIcon name={key} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold">Shop</div>
          <ul className="mt-3 space-y-2 text-mute">
            {CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.slug}><Link to={`/category/${c.slug}`} className="hover:text-ink">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-mute">
            <li><Link to="/about" className="hover:text-ink">About us</Link></li>
            <li><Link to="/contact" className="hover:text-ink">Contact</Link></li>
            <li><Link to="/categories" className="hover:text-ink">All categories</Link></li>
            <li><Link to="/checkout" className="hover:text-ink">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <ul className="mt-3 space-y-2 text-mute">
            <li>{STORE.email}</li>
            <li>{STORE.phone}</li>
            <li>{STORE.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-mute">
        © {new Date().getFullYear()} {STORE.name} – {STORE.fullName}. All rights reserved.
      </div>
    </footer>
  );
}

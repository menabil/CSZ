import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import products from "../data/products";
import { categorySlug } from "../data/categories";
import { categoryImages } from "../assets/images";
import { describe, features } from "../utils/product";
import { money } from "../utils/format";
import { useCartContext } from "../context/CartContext";
import Icon from "../components/Icon";
import ProductGrid from "../components/ProductGrid";
import SectionHeading from "../components/SectionHeading";
import NotFound from "./NotFound";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  if (!product) return <NotFound />;
  return <Detail key={product.id} p={product} />;
}

function Detail({ p }) {
  const { add } = useCartContext();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const out = p.stock === 0;
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const rows = [["Brand", p.brand], ["Category", p.category], ["Warranty", "12 months"], ["Availability", out ? "Out of stock" : `${p.stock} in stock`]];

  return (
    <div className="container-x py-8">
      <nav className="text-sm text-mute" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link> / <Link to={`/category/${categorySlug(p.category)}`} className="hover:text-ink">{p.category}</Link> / <span className="text-ink">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative grid aspect-square place-items-center rounded-3xl bg-tile">
          <img src={categoryImages[p.category]} alt={p.name} className={`w-4/5 ${out ? "opacity-50 grayscale" : ""}`} />
          {p.oldPrice && <span className="absolute left-4 top-4 rounded-md bg-accent px-2.5 py-1 text-sm font-semibold text-white">Save {money(p.oldPrice - p.price)}</span>}
        </div>

        <div>
          <div className="text-sm font-medium text-brand">{p.brand}</div>
          <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight">{p.name}</h1>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <Icon name="star" className="h-4 w-4 text-amber-500" fill="currentColor" />
            <span className="font-semibold">{p.rating}</span><span className="text-mute">({p.reviews} reviews)</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{money(p.price)}</span>
            {p.oldPrice && <span className="text-lg text-mute line-through">{money(p.oldPrice)}</span>}
          </div>
          <p className="mt-4 text-mute">{describe(p)}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {features(p).map((s) => <li key={s} className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-brand" />{s}</li>)}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-line bg-card">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-11 place-items-center" aria-label="Decrease quantity"><Icon name="minus" className="h-4 w-4" /></button>
              <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="grid h-12 w-11 place-items-center" aria-label="Increase quantity"><Icon name="plus" className="h-4 w-4" /></button>
            </div>
            <button disabled={out} onClick={() => add(p, qty)} className="btn-primary h-12 flex-1 px-6 sm:flex-none">Add to cart</button>
            <button disabled={out} onClick={() => { add(p, qty); navigate("/checkout"); }} className="btn-outline h-12 flex-1 px-6 sm:flex-none">Buy now</button>
          </div>
          {out && <p className="mt-3 text-sm text-accent">This item is currently out of stock.</p>}

          <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-card text-sm">
            {rows.map(([k, v]) => <div key={k} className="flex justify-between px-4 py-3"><dt className="text-mute">{k}</dt><dd className="font-medium">{v}</dd></div>)}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="Related products" to={`/category/${categorySlug(p.category)}`} />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

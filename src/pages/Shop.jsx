import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import products from "../data/products";
import { CATEGORIES, SORT_OPTIONS } from "../data/categories";
import useProductFilter from "../hooks/useProductFilter";
import FilterPanel from "../components/FilterPanel";
import ProductGrid from "../components/ProductGrid";
import Icon from "../components/Icon";
import NotFound from "./NotFound";

// Used for both /shop and /category/:slug
export default function Shop() {
  const { slug } = useParams();
  return <ShopView key={slug || "all"} slug={slug} />;
}

function ShopView({ slug }) {
  const category = CATEGORIES.find((c) => c.slug === slug);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [showFilters, setShowFilters] = useState(false);

  const base = useMemo(() => (category ? products.filter((p) => p.category === category.name) : products), [category]);
  const f = useProductFilter(base, q);

  if (slug && !category) return <NotFound />;

  const setQ = (value) => setParams(value ? { q: value } : {}, { replace: true });
  const reset = () => { f.reset(); setParams({}, { replace: true }); };
  const activeCount = f.activeCount + (q ? 1 : 0);

  return (
    <div className="container-x py-8">
      <nav className="text-sm text-mute" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link> / <Link to="/shop" className="hover:text-ink">Shop</Link>
        {category && <> / <span className="text-ink">{category.name}</span></>}
      </nav>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category ? category.name : q ? `Results for “${q}”` : "All products"}</h1>
          <p className="mt-1 text-sm text-mute" aria-live="polite">{f.list.length} {f.list.length === 1 ? "product" : "products"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline h-10 px-4 text-sm lg:hidden" aria-expanded={showFilters}>
            <Icon name="filter" className="h-4 w-4" /> Filters{activeCount > 0 && ` (${activeCount})`}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only sm:not-sr-only text-mute">Sort by</span>
            <select value={f.sort} onChange={(e) => f.setSort(e.target.value)} className="input h-10 w-auto">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-24"><FilterPanel q={q} setQ={setQ} f={f} onReset={reset} /></div>
        </aside>
        <ProductGrid products={f.list} onReset={reset} cols="xl:grid-cols-3" />
      </div>
    </div>
  );
}

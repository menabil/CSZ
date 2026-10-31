import CategoryBar from "./CategoryBar";
import ProductGrid from "./ProductGrid";
import { SORT_OPTIONS } from "../data/categories";

export default function ShopSection({ filter, onAdd }) {
  const { list, category, setCategory, sort, setSort, reset } = filter;
  return (
    <section id="shop" className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Shop computer parts</h2>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-mute">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-lg border border-line bg-card px-3">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-5"><CategoryBar active={category} onChange={setCategory} /></div>
      <p className="mb-4 mt-5 text-sm text-mute" aria-live="polite">
        {list.length} {list.length === 1 ? "product" : "products"}
      </p>
      <ProductGrid products={list} onAdd={onAdd} onReset={reset} />
    </section>
  );
}

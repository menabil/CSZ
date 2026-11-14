import Icon from "./Icon";

export default function FilterPanel({ q, setQ, f, onReset }) {
  return (
    <div className="space-y-6 rounded-2xl border border-line bg-card p-5">
      <div>
        <label className="label" htmlFor="filter-q">Search</label>
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input id="filter-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search in this list" className="input pl-9" />
        </div>
      </div>
      <div>
        <div className="label">Price range ($)</div>
        <div className="flex items-center gap-2">
          <input type="number" min="0" inputMode="numeric" placeholder="Min" aria-label="Minimum price" value={f.min} onChange={(e) => f.setMin(e.target.value)} className="input" />
          <span className="text-mute">–</span>
          <input type="number" min="0" inputMode="numeric" placeholder="Max" aria-label="Maximum price" value={f.max} onChange={(e) => f.setMax(e.target.value)} className="input" />
        </div>
      </div>
      <div>
        <div className="label">Brand</div>
        <div className="max-h-52 space-y-2 overflow-y-auto pr-1" data-lenis-prevent>
          {f.allBrands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={f.brands.includes(b)} onChange={() => f.toggleBrand(b)} className="h-4 w-4 accent-brand" /> {b}
            </label>
          ))}
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={f.inStock} onChange={(e) => f.setInStock(e.target.checked)} className="h-4 w-4 accent-brand" /> In stock only
      </label>
      <button onClick={onReset} className="btn-outline h-10 w-full text-sm">Clear all filters</button>
    </div>
  );
}

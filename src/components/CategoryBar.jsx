import { CATEGORIES } from "../data/categories";

export default function CategoryBar({ active, onChange }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Product categories">
      {["All", ...CATEGORIES].map((c) => (
        <button
          key={c}
          role="tab"
          aria-selected={active === c}
          onClick={() => onChange(c)}
          className={`h-10 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition ${
            active === c ? "border-brand bg-brand text-onbrand" : "border-line bg-card hover:border-brand"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

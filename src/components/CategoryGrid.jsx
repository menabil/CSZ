import { CATEGORIES } from "../data/categories";
import { categoryImages } from "../assets/images";

export default function CategoryGrid({ onSelect }) {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 pb-6 pt-2 sm:px-6">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Browse by category</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="group flex flex-col items-center rounded-2xl border border-line bg-card p-3 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lift"
          >
            <span className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl bg-tile">
              <img src={categoryImages[c]} alt="" className="h-full w-full object-contain p-2 transition group-hover:scale-105" />
            </span>
            <span className="mt-3 text-sm font-semibold">{c}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

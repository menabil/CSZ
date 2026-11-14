import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { categoryImages } from "../assets/images";
import { useStore } from "../context/StoreContext";

export default function CategoryGrid() {
  const { products } = useStore();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {CATEGORIES.map((c) => (
        <Link key={c.slug} to={`/category/${c.slug}`} className="group rounded-2xl border border-line bg-card p-3 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lift">
          <span className="grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-tile">
            <img src={categoryImages[c.name]} alt="" className="h-full w-full object-contain p-2 transition group-hover:scale-105" />
          </span>
          <span className="mt-3 block text-sm font-semibold">{c.name}</span>
          <span className="text-xs text-mute">{products.filter((p) => p.category === c.name).length} products</span>
        </Link>
      ))}
    </div>
  );
}

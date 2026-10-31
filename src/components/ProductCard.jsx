import { useState } from "react";
import Icon from "./Icon";
import { categoryImages } from "../assets/images";
import { money } from "../utils/format";

export default function ProductCard({ product: p, onAdd }) {
  const [liked, setLiked] = useState(false);
  const out = p.stock === 0;
  const low = !out && p.stock < 10;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="pcb-grid-soft relative aspect-[4/3] bg-tile">
        <img src={categoryImages[p.category]} alt={p.name} loading="lazy" className={`h-full w-full object-contain p-5 transition duration-300 group-hover:scale-105 ${out ? "opacity-50 grayscale" : ""}`} />
        {(p.badge || p.oldPrice) && (
          <span className="absolute left-3 top-3 rounded-md bg-copper px-2 py-1 text-xs font-semibold text-white">
            {p.oldPrice ? `Save ${money(p.oldPrice - p.price)}` : p.badge}
          </span>
        )}
        <button
          onClick={() => setLiked(!liked)}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card shadow-soft transition ${liked ? "text-red-500" : "text-mute hover:text-ink"}`}
        >
          <Icon name="heart" className="h-[18px] w-[18px]" fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="text-xs text-mute">{p.category}</div>
        <h3 className="mt-1 font-display text-base font-bold leading-snug">{p.name}</h3>
        <p className="mt-1 text-sm text-mute">{p.spec}</p>
        <div className="mt-2 flex items-center gap-1 text-sm">
          <Icon name="star" className="h-4 w-4 text-copper" fill="currentColor" />
          <span className="font-semibold">{p.rating}</span>
          <span className="text-mute">({p.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold">{money(p.price)}</span>
              {p.oldPrice && <span className="text-sm text-mute line-through">{money(p.oldPrice)}</span>}
            </div>
            <div className={`mt-0.5 text-xs ${out || low ? "text-copper" : "text-mute"}`}>
              {out ? "Out of stock" : low ? `Only ${p.stock} left` : "In stock"}
            </div>
          </div>
          <button onClick={() => onAdd(p)} disabled={out} className="btn-primary h-10 px-4 text-sm">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

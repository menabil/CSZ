import { Link } from "react-router-dom";
import Icon from "./Icon";
import { categoryImages } from "../assets/images";
import { money } from "../utils/format";

export default function CartItem({ item, setQty, remove }) {
  return (
    <div className="flex gap-3 border-b border-line py-4">
      <img src={categoryImages[item.category]} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-tile object-contain p-1" />
      <div className="min-w-0 flex-1">
        <Link to={`/product/${item.id}`} className="text-sm font-semibold leading-snug hover:text-brand">{item.name}</Link>
        <div className="text-sm text-mute">{money(item.price)}</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-line">
            <button onClick={() => setQty(item.id, item.qty - 1)} className="grid h-8 w-8 place-items-center" aria-label="Decrease quantity"><Icon name="minus" className="h-4 w-4" /></button>
            <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
            <button onClick={() => setQty(item.id, item.qty + 1)} disabled={item.qty >= item.stock} className="grid h-8 w-8 place-items-center disabled:opacity-30" aria-label="Increase quantity"><Icon name="plus" className="h-4 w-4" /></button>
          </div>
          <button onClick={() => remove(item.id)} className="text-sm text-mute underline hover:text-ink">Remove</button>
        </div>
      </div>
    </div>
  );
}

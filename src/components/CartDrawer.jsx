import Icon from "./Icon";
import CartItem from "./CartItem";
import { money } from "../utils/format";
import { STORE } from "../data/config";

export default function CartDrawer({ open, onClose, cart }) {
  const { items, subtotal, shipping, total, setQty, remove } = cart;
  const left = Math.max(0, STORE.freeShippingAt - subtotal);
  const progress = Math.min(100, (subtotal / STORE.freeShippingAt) * 100);

  return (
    <div className={`fixed inset-0 z-30 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col border-l border-line bg-card transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <h2 className="font-display text-lg font-bold">Your cart</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-tile" aria-label="Close cart">
            <Icon name="x" />
          </button>
        </div>

        {items.length > 0 && (
          <div className="border-b border-line px-5 py-3 text-sm">
            <p>{left > 0 ? <>Add <b>{money(left)}</b> more for free shipping</> : "You’ve unlocked free shipping"}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-tile">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="grid h-full place-items-center py-16 text-center">
              <div>
                <p className="font-semibold">Your cart is empty</p>
                <p className="mt-1 text-sm text-mute">Add a part to get started.</p>
                <button onClick={onClose} className="mt-4 h-10 rounded-lg border border-line px-4 text-sm font-semibold hover:border-brand">Keep shopping</button>
              </div>
            </div>
          ) : (
            items.map((i) => <CartItem key={i.id} item={i} setQty={setQty} remove={remove} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-2 border-t border-line p-5 text-sm">
            <div className="flex justify-between"><span className="text-mute">Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-mute">Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
            <div className="flex justify-between pt-1 font-display text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
            <button className="btn-primary mt-2 h-12 w-full">Checkout</button>
          </div>
        )}
      </aside>
    </div>
  );
}

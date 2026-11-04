import { useCallback, useEffect, useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import { STORE } from "../data/config";

export default function useCart() {
  const [items, setItems] = useLocalStorage("csz-cart", []);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(t);
  }, [notice]);

  const add = useCallback(
    (product, qty = 1) => {
      setItems((cart) => {
        const found = cart.find((i) => i.id === product.id);
        if (found) {
          return cart.map((i) => (i.id === product.id ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i));
        }
        return [...cart, { ...product, qty: Math.min(product.stock, qty) }];
      });
      setNotice(`${product.name} added to cart`);
    },
    [setItems]
  );

  const setQty = useCallback(
    (id, qty) =>
      setItems((cart) =>
        qty < 1 ? cart.filter((i) => i.id !== id) : cart.map((i) => (i.id === id ? { ...i, qty: Math.min(i.stock, qty) } : i))
      ),
    [setItems]
  );

  const remove = useCallback((id) => setItems((cart) => cart.filter((i) => i.id !== id)), [setItems]);
  const clear = useCallback(() => setItems([]), [setItems]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const shipping = subtotal === 0 || subtotal >= STORE.freeShippingAt ? 0 : STORE.shippingFee;
    return { subtotal, count, shipping, total: subtotal + shipping };
  }, [items]);

  return { items, add, setQty, remove, clear, notice, ...totals };
}

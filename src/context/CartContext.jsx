import { createContext, useContext, useState } from "react";
import useCart from "../hooks/useCart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const value = { ...cart, open, openCart: () => setOpen(true), closeCart: () => setOpen(false) };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCartContext = () => useContext(CartContext);

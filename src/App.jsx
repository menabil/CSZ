import { useState } from "react";
import products from "./data/products";
import useCart from "./hooks/useCart";
import useProductFilter from "./hooks/useProductFilter";
import useLockBodyScroll from "./hooks/useLockBodyScroll";
import Announcement from "./components/Announcement";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CategoryGrid from "./components/CategoryGrid";
import ShopSection from "./components/ShopSection";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

export default function App() {
  const cart = useCart();
  const filter = useProductFilter(products);
  const [cartOpen, setCartOpen] = useState(false);
  useLockBodyScroll(cartOpen);

  const pickCategory = (name) => {
    filter.setCategory(name);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="top">
      <Announcement />
      <Header count={cart.count} onCart={() => setCartOpen(true)} query={filter.query} setQuery={filter.setQuery} />
      <main>
        <Hero />
        <Features />
        <CategoryGrid onSelect={pickCategory} />
        <ShopSection filter={filter} onAdd={cart.add} />
      </main>
      <Footer onSelect={filter.setCategory} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
      <Toast message={cart.notice} />
    </div>
  );
}

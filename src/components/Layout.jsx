import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Announcement from "./Announcement";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import Toast from "./Toast";
import { useLenis } from "../context/LenisContext";

export default function Layout() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  // Always start a new page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return (
    <>
      <Announcement />
      <Header />
      <main><Outlet /></main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}

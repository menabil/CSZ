import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { StoreProvider } from "./context/StoreContext";
import { LenisProvider } from "./context/LenisContext";
import { CartProvider } from "./context/CartContext";
import Preloader from "./components/Preloader";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <StoreProvider>
          <LenisProvider>
            <CartProvider>
              <Preloader />
              <Routes>
                {/* Customer Storefront Routes */}
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="category/:slug" element={<Shop />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin Management Routes */}
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="products" element={<AdminProducts />} />
                </Route>
              </Routes>
            </CartProvider>
          </LenisProvider>
        </StoreProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

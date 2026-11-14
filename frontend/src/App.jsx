import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { LenisProvider } from "./context/LenisContext";
import { CartProvider } from "./context/CartContext";
import Preloader from "./components/Preloader";
import Layout from "./components/Layout";
import AuthModal from "./components/AuthModal";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import AdminUsers from "./admin/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <LenisProvider>
              <CartProvider>
                <Preloader />
                <AuthModal />
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

                  {/* Protected Staff Management Routes */}
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="orders"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <AdminOrders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="products"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                          <AdminProducts />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="users"
                      element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                          <AdminUsers />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
              </CartProvider>
            </LenisProvider>
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

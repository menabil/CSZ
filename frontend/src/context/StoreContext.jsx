import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import initialProducts from "../data/products";
import { api } from "../services/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend API
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.products.getAll();
      if (res && res.products && res.products.length > 0) {
        // Map _id to id if needed for compatibility
        const mapped = res.products.map((p) => ({
          ...p,
          id: p._id || p.id,
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn("Backend products fetch failed, using local catalog:", err.message);
    }
  }, []);

  // Fetch orders from backend API
  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.orders.getAll();
      if (res && res.orders) {
        const mapped = res.orders.map((o) => ({
          ...o,
          id: o.orderId || o._id || o.id,
        }));
        setOrders(mapped);
      }
    } catch (err) {
      // If user is guest or not admin, try fetching their own orders
      try {
        const myRes = await api.orders.getMyOrders();
        if (myRes && myRes.orders) {
          const mapped = myRes.orders.map((o) => ({
            ...o,
            id: o.orderId || o._id || o.id,
          }));
          setOrders(mapped);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders()]).finally(() => setLoading(false));
  }, [fetchProducts, fetchOrders]);

  // Create Order (Checkout) -> saves in MongoDB & sends Nodemailer email to Admin
  const createOrder = async (orderData) => {
    try {
      const res = await api.orders.create(orderData);
      if (res && res.order) {
        const created = {
          ...res.order,
          id: res.order.orderId || res.order._id,
        };
        setOrders((prev) => [created, ...prev]);

        // Refresh live products from DB (stock updated)
        fetchProducts();
        return created;
      }
      throw new Error(res.message || "Failed to create order");
    } catch (err) {
      console.error("Order creation fallback:", err.message);
      // Local fallback in case backend is offline
      const localId = `CSZ-${Math.floor(100000 + Math.random() * 900000)}`;
      const localOrder = {
        id: localId,
        orderId: localId,
        createdAt: new Date().toISOString(),
        status: "Pending",
        ...orderData,
      };
      setOrders((prev) => [localOrder, ...prev]);
      setProducts((prev) =>
        prev.map((prod) => {
          const item = orderData.items?.find((i) => i.id === prod.id || i.name === prod.name);
          return item ? { ...prod, stock: Math.max(0, prod.stock - (item.qty || 1)) } : prod;
        })
      );
      return localOrder;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
    } catch (err) {
      console.warn("API update order status error:", err.message);
    }
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId || ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
      await api.orders.delete(orderId);
    } catch (err) {
      console.warn("API delete order error:", err.message);
    }
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId && ord.orderId !== orderId));
  };

  // Update stock level for a product
  const updateProductStock = async (productId, newStock) => {
    const parsedStock = Math.max(0, parseInt(newStock, 10) || 0);
    try {
      await api.products.updateStock(productId, parsedStock);
    } catch (err) {
      console.warn("API update stock error:", err.message);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId || p._id === productId ? { ...p, stock: parsedStock } : p))
    );
  };

  // Update product details
  const updateProduct = async (productId, updates) => {
    try {
      const res = await api.products.update(productId, updates);
      if (res && res.product) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId || p._id === productId ? { ...p, ...res.product, id: res.product._id || p.id } : p
          )
        );
        return res.product;
      }
    } catch (err) {
      console.warn("API update product error:", err.message);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId || p._id === productId ? { ...p, ...updates } : p))
    );
  };

  // Add a new product (Moderator or Admin)
  const addProduct = async (productData) => {
    try {
      const res = await api.products.create(productData);
      if (res && res.product) {
        const added = { ...res.product, id: res.product._id || res.product.id };
        setProducts((prev) => [added, ...prev]);
        return added;
      }
    } catch (err) {
      console.warn("API create product error:", err.message);
    }
    const localId = `p-${Date.now()}`;
    const localProduct = {
      id: localId,
      rating: 5.0,
      reviews: 0,
      badge: "New",
      ...productData,
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
    };
    setProducts((prev) => [localProduct, ...prev]);
    return localProduct;
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await api.products.delete(productId);
    } catch (err) {
      console.warn("API delete product error:", err.message);
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
  };

  // Reset demo store data back to initial catalog
  const resetStore = () => {
    setProducts(initialProducts);
    fetchProducts();
  };

  // Computed statistics for admin dashboard
  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "Cancelled");
    const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalUnitsSold = activeOrders.reduce(
      (sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.qty || 1), 0) : 0),
      0
    );

    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const processingCount = orders.filter((o) => o.status === "Processing").length;
    const shippedCount = orders.filter((o) => o.status === "Shipped").length;
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
    const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalUnitsSold,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
    };
  }, [orders, products]);

  const value = {
    products,
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    updateProductStock,
    updateProduct,
    addProduct,
    deleteProduct,
    resetStore,
    fetchProducts,
    fetchOrders,
    stats,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

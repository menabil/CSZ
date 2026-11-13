import { createContext, useContext, useEffect, useMemo, useState } from "react";
import initialProducts from "../data/products";

const StoreContext = createContext(null);

const STORAGE_PRODUCTS_KEY = "csz-products";
const STORAGE_ORDERS_KEY = "csz-orders";

const INITIAL_ORDERS = [
  {
    id: "CSZ-584219",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    customer: {
      name: "Tanvir Ahmed",
      phone: "01712345678",
      email: "tanvir@example.com",
      address: "House 24, Road 7, Dhanmondi",
      city: "Dhaka",
      postcode: "1205",
      note: "Please call before delivery",
    },
    items: [
      { id: 1, name: "Ryzen 7 7800X3D", category: "Processors", brand: "AMD", price: 389, qty: 1, spec: "8 cores · 16 threads · AM5" },
      { id: 10, name: "Vengeance DDR5 32GB Kit", category: "Memory", brand: "Corsair", price: 109, qty: 2, spec: "2×16 GB · 6000 MHz · CL30" },
    ],
    payment: "bkash",
    subtotal: 607,
    shipping: 0,
    total: 607,
    status: "Processing",
  },
  {
    id: "CSZ-492103",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(), // Yesterday
    customer: {
      name: "Nusrat Jahan",
      phone: "01898765432",
      email: "nusrat@example.com",
      address: "Flat 4B, Sector 11, Uttara",
      city: "Dhaka",
      postcode: "1230",
      note: "Deliver after 4 PM",
    },
    items: [
      { id: 6, name: "Dual GeForce RTX 4070 Super 12GB", category: "Graphics Cards", brand: "ASUS", price: 599, qty: 1, spec: "12 GB GDDR6X · Dual fan · HDMI/DP" },
    ],
    payment: "card",
    subtotal: 599,
    shipping: 0,
    total: 599,
    status: "Delivered",
  },
];

export function StoreProvider({ children }) {
  // Products state backed by localStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialProducts;
  });

  // Orders state backed by localStorage
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ORDERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Create a new order when customer completes checkout
  const createOrder = (orderData) => {
    const newOrder = {
      id: `CSZ-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      ...orderData,
    };

    // 1. Decrement stock for purchased items
    setProducts((prev) =>
      prev.map((prod) => {
        const purchased = orderData.items?.find((i) => i.id === prod.id);
        if (purchased) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - (purchased.qty || 1)),
          };
        }
        return prod;
      })
    );

    // 2. Prepend order to orders list
    setOrders((prev) => [newOrder, ...prev]);

    return newOrder;
  };

  // Update order status (Pending, Processing, Shipped, Delivered, Cancelled)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return { ...ord, status: newStatus };
      })
    );
  };

  // Delete an order
  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  // Update stock level for a product
  const updateProductStock = (productId, newStock) => {
    const parsedStock = Math.max(0, parseInt(newStock, 10) || 0);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: parsedStock } : p))
    );
  };

  // Update product details (price, stock, spec, badge, etc.)
  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  // Add a new product to store catalog
  const addProduct = (productData) => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      rating: 5.0,
      reviews: 0,
      badge: "New",
      ...productData,
      price: Number(productData.price) || 0,
      oldPrice: productData.oldPrice ? Number(productData.oldPrice) : null,
      stock: Number(productData.stock) || 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  // Delete a product
  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Reset demo store data back to initial catalog and demo orders
  const resetStore = () => {
    setProducts(initialProducts);
    setOrders(INITIAL_ORDERS);
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(initialProducts));
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
    } catch {
      // ignore
    }
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
    createOrder,
    updateOrderStatus,
    deleteOrder,
    updateProductStock,
    updateProduct,
    addProduct,
    deleteProduct,
    resetStore,
    stats,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

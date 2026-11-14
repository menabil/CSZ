const API_BASE = "/api";

const getToken = () => {
  try {
    return localStorage.getItem("csz-token");
  } catch {
    return null;
  }
};

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  // Only set Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401 && token) {
        // Token expired or invalid
        localStorage.removeItem("csz-token");
        localStorage.removeItem("csz-user");
      }
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  auth: {
    login: (credentials) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    getMe: () => request("/auth/me"),
    updateProfile: (profileData) =>
      request("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      }),
    changePassword: (passwordData) =>
      request("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(passwordData),
      }),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/products/${id}`),
    create: (productData) =>
      request("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      }),
    update: (id, productData) =>
      request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      }),
    updateStock: (id, stock) =>
      request(`/products/${id}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ stock }),
      }),
    delete: (id) =>
      request(`/products/${id}`, {
        method: "DELETE",
      }),
  },

  // Cloudinary Image Upload
  upload: {
    uploadImage: (file) => {
      const formData = new FormData();
      formData.append("image", file);
      return request("/upload", {
        method: "POST",
        body: formData,
      });
    },
  },

  // Orders
  orders: {
    create: (orderData) =>
      request("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      }),
    getMyOrders: () => request("/orders/my-orders"),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/orders/${id}`),
    updateStatus: (id, status) =>
      request(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    delete: (id) =>
      request(`/orders/${id}`, {
        method: "DELETE",
      }),
  },

  // Users (Admin only)
  users: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/users${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/users/${id}`),
    updateRole: (id, role) =>
      request(`/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      }),
    toggleStatus: (id) =>
      request(`/users/${id}/status`, {
        method: "PUT",
      }),
    delete: (id) =>
      request(`/users/${id}`, {
        method: "DELETE",
      }),
    getStats: () => request("/users/stats/summary"),
  },

  // Admin Overview
  admin: {
    getDashboardStats: () => request("/admin/dashboard"),
  },
};

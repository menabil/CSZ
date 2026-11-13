import { useState } from "react";
import Icon from "../components/Icon";
import { useStore } from "../context/StoreContext";
import { CATEGORIES } from "../data/categories";
import { categoryImages } from "../assets/images";
import { money } from "../utils/format";

export default function AdminProducts() {
  const { products, updateProductStock, updateProduct, addProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [stockFilter, setStockFilter] = useState("All"); // All, Low, Out
  const [editingProduct, setEditingProduct] = useState(null); // Product object or null
  const [isAdding, setIsAdding] = useState(false);

  // New product form initial state
  const [form, setForm] = useState({
    name: "",
    category: "Processors",
    brand: "",
    spec: "",
    price: "",
    oldPrice: "",
    stock: "10",
    badge: "",
  });

  const filtered = products.filter((p) => {
    const term = search.toLowerCase();
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.spec.toLowerCase().includes(term);
    const matchCat = selectedCat === "All" || p.category === selectedCat;
    const matchStock =
      stockFilter === "All" ||
      (stockFilter === "Low" && p.stock > 0 && p.stock <= 5) ||
      (stockFilter === "Out" && p.stock === 0) ||
      (stockFilter === "In" && p.stock > 5);
    return matchSearch && matchCat && matchStock;
  });

  const handleOpenAdd = () => {
    setForm({
      name: "",
      category: "Processors",
      brand: "",
      spec: "",
      price: "",
      oldPrice: "",
      stock: "15",
      badge: "New",
    });
    setIsAdding(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      brand: p.brand,
      spec: p.spec,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      stock: String(p.stock),
      badge: p.badge || "",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: form.name,
        category: form.category,
        brand: form.brand,
        spec: form.spec,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        badge: form.badge || null,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: form.name,
        category: form.category,
        brand: form.brand || "Generic",
        spec: form.spec || "High-performance hardware component",
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        badge: form.badge || null,
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Inventory</h1>
          <p className="mt-1 text-sm text-mute">
            Live stock control, product catalog management, and price adjustments.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary h-10 px-4 text-sm gap-2">
          <Icon name="plus" className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="input h-10 w-auto text-xs"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Level Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="input h-10 w-auto text-xs"
          >
            <option value="All">All Stock Levels</option>
            <option value="In">In Stock (&gt; 5)</option>
            <option value="Low">Low Stock (1 – 5)</option>
            <option value="Out">Out of Stock (0)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, brands, specs…"
            className="input h-10 pl-9 text-xs"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-tile/40 text-xs font-semibold uppercase text-mute">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock Level</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((prod) => {
                const isOut = prod.stock === 0;
                const isLow = !isOut && prod.stock <= 5;

                return (
                  <tr key={prod.id} className="transition hover:bg-tile/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={categoryImages[prod.category] || categoryImages["Processors"]}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg bg-tile object-contain p-1"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-ink leading-tight">{prod.name}</div>
                          <div className="text-xs text-mute">{prod.brand} • {prod.spec}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-mute whitespace-nowrap">
                      {prod.category}
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap">
                      <div>{money(prod.price)}</div>
                      {prod.oldPrice && (
                        <div className="text-xs text-mute line-through">{money(prod.oldPrice)}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateProductStock(prod.id, prod.stock - 1)}
                          disabled={prod.stock <= 0}
                          className="grid h-7 w-7 place-items-center rounded border border-line hover:bg-tile disabled:opacity-30"
                          title="Decrease stock"
                        >
                          <Icon name="minus" className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={prod.stock}
                          onChange={(e) => updateProductStock(prod.id, e.target.value)}
                          className="input h-7 w-14 px-1 text-center text-xs font-semibold"
                        />
                        <button
                          onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                          className="grid h-7 w-7 place-items-center rounded border border-line hover:bg-tile"
                          title="Increase stock"
                        >
                          <Icon name="plus" className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isOut
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : isLow
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-green-500/10 text-green-600 dark:text-green-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isOut ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-green-500"
                          }`}
                        />
                        {isOut ? "Out of stock" : isLow ? `Low (${prod.stock})` : "In stock"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="btn-outline h-8 w-8 px-0 text-mute hover:text-brand"
                          title="Edit product"
                        >
                          <Icon name="edit" className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${prod.name}?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="btn-outline h-8 w-8 px-0 text-mute hover:text-red-500"
                          title="Delete product"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAdding || editingProduct) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-line bg-card p-6 shadow-lift my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingProduct(null);
              }}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-lg hover:bg-tile text-mute hover:text-ink"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-mute mt-0.5">
              Updates to stock or price will instantly reflect in the store.
            </p>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="label">Product Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Core i9-14900K"
                  className="input"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Brand</label>
                  <input
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="e.g. Intel / ASUS"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Specifications / Subtitle</label>
                <input
                  required
                  value={form.spec}
                  onChange={(e) => setForm({ ...form, spec: e.target.value })}
                  placeholder="e.g. 24 cores · 32 threads · LGA1700"
                  className="input"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">Price ($)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="299"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Old Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="349 (opt)"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Initial Stock</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="10"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Badge (optional)</label>
                <input
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g. Best seller / Hot deal / New"
                  className="input"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingProduct(null);
                  }}
                  className="btn-outline h-10 px-4 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary h-10 px-5 text-sm">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

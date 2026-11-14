import { useState } from "react";
import Icon from "../components/Icon";
import { useStore } from "../context/StoreContext";
import { CATEGORIES } from "../data/categories";
import { categoryImages } from "../assets/images";
import { money } from "../utils/format";
import { api } from "../services/api";

export default function AdminProducts() {
  const { products, updateProductStock, updateProduct, addProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [stockFilter, setStockFilter] = useState("All"); // All, Low, Out
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Processors",
    brand: "",
    spec: "",
    price: "",
    oldPrice: "",
    stock: "10",
    badge: "",
    image: "",
  });

  const filtered = products.filter((p) => {
    const term = search.toLowerCase();
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(term) ||
      p.brand?.toLowerCase().includes(term) ||
      p.spec?.toLowerCase().includes(term);
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
      image: "",
    });
    setUploadError("");
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
      image: p.image || "",
    });
    setUploadError("");
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const res = await api.upload.uploadImage(file);
      if (res && res.url) {
        setForm((prev) => ({ ...prev, image: res.url }));
      } else {
        throw new Error(res.message || "Upload failed");
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload image to Cloudinary");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    if (editingProduct) {
      await updateProduct(editingProduct._id || editingProduct.id, {
        name: form.name,
        category: form.category,
        brand: form.brand,
        spec: form.spec,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        badge: form.badge || null,
        image: form.image || "",
      });
      setEditingProduct(null);
    } else {
      await addProduct({
        name: form.name,
        category: form.category,
        brand: form.brand || "Generic",
        spec: form.spec || "Hardware component",
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        badge: form.badge || null,
        image: form.image || "",
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
            Add hardware products, upload product images to Cloudinary, and manage stock levels.
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn-primary h-10 px-4 text-sm gap-2">
          <Icon name="plus" className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
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
                const prodId = prod._id || prod.id;

                return (
                  <tr key={prodId} className="transition hover:bg-tile/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image || categoryImages[prod.category] || categoryImages["Processors"]}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg bg-tile object-contain p-1 border border-line/40"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-ink leading-tight flex items-center gap-1.5">
                            <span>{prod.name}</span>
                            {prod.image && (
                              <span className="rounded bg-brand/10 px-1 py-0.2 text-[9px] font-bold text-brand uppercase">
                                Cloudinary
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-mute">
                            {prod.brand} • {prod.spec}
                          </div>
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
                          onClick={() => updateProductStock(prodId, prod.stock - 1)}
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
                          onChange={(e) => updateProductStock(prodId, e.target.value)}
                          className="input h-7 w-14 px-1 text-center text-xs font-semibold"
                        />
                        <button
                          onClick={() => updateProductStock(prodId, prod.stock + 1)}
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
                              deleteProduct(prodId);
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
              Product updates and Cloudinary uploads are saved directly to MongoDB.
            </p>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              {/* Product Image & Cloudinary Uploader */}
              <div className="rounded-2xl border border-line bg-tile/40 p-4">
                <label className="label mb-2">Product Image (Cloudinary Upload)</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-card grid place-items-center">
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="h-full w-full object-contain p-1" />
                    ) : (
                      <span className="text-[10px] text-mute text-center px-1">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploading}
                      className="block w-full text-xs text-mute file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-onbrand hover:file:brightness-110 cursor-pointer"
                    />
                    <div className="mt-1 text-[11px] text-mute">
                      {uploading ? (
                        <span className="text-brand font-medium animate-pulse">
                          Uploading to Cloudinary...
                        </span>
                      ) : (
                        "Uploads directly to Cloudinary CDN storage"
                      )}
                    </div>
                    {uploadError && (
                      <div className="text-[11px] text-red-500 mt-1">{uploadError}</div>
                    )}
                  </div>
                </div>
              </div>

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
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary h-10 px-5 text-sm"
                >
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

import { useState } from "react";
import Icon from "../components/Icon";
import { useStore } from "../context/StoreContext";
import { money } from "../utils/format";
import { categoryImages } from "../assets/images";

const STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === "All" || o.status === filterStatus;
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(term) ||
      o.customer?.name?.toLowerCase().includes(term) ||
      o.customer?.phone?.toLowerCase().includes(term) ||
      o.customer?.city?.toLowerCase().includes(term) ||
      o.customer?.email?.toLowerCase().includes(term) ||
      o.items?.some((i) => i.name.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800";
      default:
        return "bg-tile text-mute border-line";
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Orders</h1>
          <p className="mt-1 text-sm text-mute">
            Review incoming orders, process shipments, and view customer purchase details.
          </p>
        </div>
        <div className="text-sm font-medium text-mute">
          Total: <b className="text-ink">{orders.length}</b> orders
        </div>
      </div>

      {/* Controls: Search & Status Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-line bg-card p-1">
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === st
                  ? "bg-brand text-onbrand shadow-soft"
                  : "text-mute hover:text-ink hover:bg-tile"
              }`}
            >
              {st}
              {st !== "All" && (
                <span className="ml-1.5 opacity-70">
                  ({orders.filter((o) => o.status === st).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, phone, item…"
            className="input h-10 pl-9 text-xs"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <Icon name="bag" className="mx-auto h-10 w-10 text-mute/50" />
            <p className="mt-3 font-semibold">No orders found</p>
            <p className="mt-1 text-xs text-mute">
              {search || filterStatus !== "All"
                ? "Try adjusting your search query or filter"
                : "When customers place orders from the cart, they will appear here live."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-tile/40 text-xs font-semibold uppercase text-mute">
                <tr>
                  <th className="px-5 py-3.5">Order</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="transition hover:bg-tile/30">
                    <td className="px-5 py-4 font-semibold text-brand">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="hover:underline font-mono"
                      >
                        {ord.id}
                      </button>
                      <div className="text-[11px] font-normal uppercase text-mute">
                        {ord.payment}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-mute whitespace-nowrap">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold">{ord.customer?.name || "Customer"}</div>
                      <div className="text-xs text-mute">{ord.customer?.phone}</div>
                      <div className="text-xs text-mute truncate max-w-[160px]">
                        {ord.customer?.city}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-medium text-ink">
                        {ord.items?.length || 0} item(s)
                      </div>
                      <div className="text-mute truncate max-w-[180px]">
                        {ord.items?.map((i) => `${i.name} (${i.qty})`).join(", ")}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-ink whitespace-nowrap">
                      {money(ord.total)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none ${statusColor(
                          ord.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="btn-outline h-8 px-2.5 text-xs font-medium"
                          title="View order details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order ${ord.id}?`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                          className="btn-outline h-8 w-8 px-0 text-mute hover:text-red-500"
                          title="Delete order"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl border border-line bg-card p-6 shadow-lift my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-lg hover:bg-tile text-mute hover:text-ink"
            >
              <Icon name="x" className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon name="bag" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold">Order Details</h2>
                <p className="text-xs text-mute font-mono">
                  {selectedOrder.id} • Placed {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            {/* Status Change Bar */}
            <div className="mt-5 flex items-center justify-between rounded-xl bg-tile p-3">
              <span className="text-xs font-semibold text-mute">Order Status:</span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  className={`rounded-lg border px-3 py-1 text-xs font-semibold ${statusColor(
                    selectedOrder.status
                  )}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="mt-5 grid gap-4 rounded-xl border border-line p-4 text-xs sm:grid-cols-2">
              <div>
                <div className="font-semibold text-mute uppercase tracking-wider text-[10px]">
                  Customer Contact
                </div>
                <div className="mt-1 font-semibold text-sm text-ink">
                  {selectedOrder.customer?.name}
                </div>
                <div className="mt-0.5 text-mute">{selectedOrder.customer?.phone}</div>
                <div className="text-mute">{selectedOrder.customer?.email}</div>
              </div>
              <div>
                <div className="font-semibold text-mute uppercase tracking-wider text-[10px]">
                  Delivery Address
                </div>
                <div className="mt-1 text-ink">{selectedOrder.customer?.address}</div>
                <div className="text-mute">
                  {selectedOrder.customer?.city}{" "}
                  {selectedOrder.customer?.postcode && `(${selectedOrder.customer?.postcode})`}
                </div>
                <div className="text-mute uppercase text-[10px] mt-1 font-semibold">
                  Payment: {selectedOrder.payment}
                </div>
              </div>
              {selectedOrder.customer?.note && (
                <div className="sm:col-span-2 rounded-lg bg-tile/70 p-2 text-mute">
                  <b>Customer Note:</b> {selectedOrder.customer.note}
                </div>
              )}
            </div>

            {/* Purchased Items List */}
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-mute mb-2">
                Purchased Products ({selectedOrder.items?.length || 0})
              </div>
              <ul className="divide-y divide-line rounded-xl border border-line">
                {selectedOrder.items?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-3">
                    <img
                      src={categoryImages[item.category]}
                      alt=""
                      className="h-12 w-12 rounded-lg bg-tile object-contain p-1"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-semibold text-ink leading-tight">{item.name}</div>
                      <div className="text-mute">{item.spec || item.category}</div>
                      <div className="mt-0.5 text-mute">
                        {money(item.price)} × {item.qty}
                      </div>
                    </div>
                    <div className="font-bold text-sm text-ink">
                      {money(item.price * item.qty)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Summary */}
            <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs">
              <div className="flex justify-between text-mute">
                <span>Subtotal</span>
                <span>{money(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-mute">
                <span>Shipping Fee</span>
                <span>{selectedOrder.shipping === 0 ? "Free" : money(selectedOrder.shipping)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold text-ink">
                <span>Total Amount</span>
                <span className="text-brand">{money(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-primary h-10 px-5 text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { useStore } from "../context/StoreContext";
import { money } from "../utils/format";

export default function AdminDashboard() {
  const { stats, orders, products, updateProductStock, resetStore } = useStore();

  const handleQuickRestock = (productId, currentStock) => {
    updateProductStock(productId, currentStock + 5);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all store data to initial demo products and orders?")) {
      resetStore();
    }
  };

  const recentOrders = orders.slice(0, 5);
  const lowOrOutStock = products.filter((p) => p.stock <= 5).slice(0, 5);

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

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales & Store Dashboard</h1>
          <p className="mt-1 text-sm text-mute">
            Live overview of sales, customer orders, and warehouse inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="btn-primary h-10 px-4 text-sm">
            <Icon name="bag" className="h-4 w-4" /> View Orders
          </Link>
          <button
            onClick={handleReset}
            className="btn-outline h-10 px-3 text-sm text-mute hover:text-rose-500"
            title="Reset store to default demo state"
          >
            <Icon name="refresh" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mute">Total Sales Revenue</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <Icon name="dollar" className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-bold">{money(stats.totalRevenue)}</div>
          <p className="mt-1 text-xs text-mute">Excluding cancelled orders</p>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mute">Total Orders</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-brand">
              <Icon name="bag" className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{stats.totalOrders}</span>
            {stats.pendingCount > 0 && (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                {stats.pendingCount} pending
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-mute">{stats.deliveredCount} completed delivery</p>
        </div>

        {/* Units Sold */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mute">Products Sold</span>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Icon name="chart" className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 text-3xl font-bold">{stats.totalUnitsSold} <span className="text-sm font-normal text-mute">items</span></div>
          <p className="mt-1 text-xs text-mute">Across all placed orders</p>
        </div>

        {/* Stock Alerts */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-mute">Inventory Alerts</span>
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${
              stats.outOfStockCount > 0 ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
            }`}>
              <Icon name="alert" className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-500">{stats.outOfStockCount}</span>
            <span className="text-xs font-medium text-mute">out of stock</span>
            <span className="text-xl font-bold text-amber-500">{stats.lowStockCount}</span>
            <span className="text-xs font-medium text-mute">low stock</span>
          </div>
          <p className="mt-1 text-xs text-mute">Total catalog: {products.length} products</p>
        </div>
      </div>

      {/* Order Status Distribution Bar */}
      <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
        <h2 className="text-base font-semibold">Order Fulfillment Status</h2>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-tile">
          {stats.totalOrders > 0 ? (
            <>
              <div
                style={{ width: `${(stats.deliveredCount / stats.totalOrders) * 100}%` }}
                className="bg-emerald-500"
                title={`Delivered: ${stats.deliveredCount}`}
              />
              <div
                style={{ width: `${(stats.shippedCount / stats.totalOrders) * 100}%` }}
                className="bg-purple-500"
                title={`Shipped: ${stats.shippedCount}`}
              />
              <div
                style={{ width: `${(stats.processingCount / stats.totalOrders) * 100}%` }}
                className="bg-blue-500"
                title={`Processing: ${stats.processingCount}`}
              />
              <div
                style={{ width: `${(stats.pendingCount / stats.totalOrders) * 100}%` }}
                className="bg-amber-500"
                title={`Pending: ${stats.pendingCount}`}
              />
              <div
                style={{ width: `${(stats.cancelledCount / stats.totalOrders) * 100}%` }}
                className="bg-rose-500"
                title={`Cancelled: ${stats.cancelledCount}`}
              />
            </>
          ) : (
            <div className="w-full bg-tile" />
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-mute">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Delivered ({stats.deliveredCount})</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Shipped ({stats.shippedCount})</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Processing ({stats.processingCount})</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Pending ({stats.pendingCount})</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Cancelled ({stats.cancelledCount})</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders Section (2 cols) */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Recent Customer Orders</h2>
              <p className="text-xs text-mute">Latest orders received from customer cart checkout</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-semibold text-brand hover:underline">
              View all ({orders.length}) →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-sm text-mute">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold uppercase text-mute">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-tile/40 transition">
                      <td className="py-3 font-semibold text-brand">
                        <Link to="/admin/orders" className="hover:underline">{ord.id}</Link>
                      </td>
                      <td className="py-3 font-medium">
                        <div>{ord.customer?.name || "Customer"}</div>
                        <div className="text-xs text-mute">{ord.customer?.city || "Online"}</div>
                      </td>
                      <td className="py-3 text-xs text-mute">
                        {ord.items?.length || 0} part(s)
                      </td>
                      <td className="py-3 font-semibold">{money(ord.total)}</td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts & Quick Restock (1 col) */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Stock Watch</h2>
              <p className="text-xs text-mute">Needs restock soon</p>
            </div>
            <Link to="/admin/products" className="text-xs font-semibold text-brand hover:underline">
              Manage inventory →
            </Link>
          </div>

          {lowOrOutStock.length === 0 ? (
            <div className="py-8 text-center text-xs text-green-600 dark:text-green-400">
              All items currently have healthy stock levels!
            </div>
          ) : (
            <div className="space-y-3">
              {lowOrOutStock.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between rounded-xl border border-line/60 bg-tile/30 p-2.5">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="truncate text-xs font-semibold text-ink">{prod.name}</div>
                    <div className="text-[11px] text-mute">{prod.category} • {money(prod.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${
                      prod.stock === 0 ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {prod.stock === 0 ? "Out" : `${prod.stock} left`}
                    </span>
                    <button
                      onClick={() => handleQuickRestock(prod.id, prod.stock)}
                      className="btn-outline h-7 px-2 text-xs font-semibold"
                      title="Add 5 units to stock"
                    >
                      +5
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

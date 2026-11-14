import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { api } from "../services/api";

const ROLES = ["All", "admin", "moderator", "user"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.users.getAll(),
        api.users.getStats(),
      ]);
      if (usersRes && usersRes.users) {
        setUsers(usersRes.users);
      }
      if (statsRes && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.users.updateRole(userId, newRole);
      setActionMsg(`User role updated to ${newRole}`);
      setTimeout(() => setActionMsg(""), 3000);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message || "Failed to update user role");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.users.toggleStatus(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: res.isActive } : u))
      );
    } catch (err) {
      alert(err.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user '${name}'?`)) return;
    try {
      await api.users.delete(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setActionMsg(`User '${name}' deleted successfully`);
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const term = search.toLowerCase();
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term)) ||
      (u.city && u.city.toLowerCase().includes(term));
    return matchRole && matchSearch;
  });

  const roleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-brand/10 text-brand border-brand/30";
      case "moderator":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User & Role Management</h1>
          <p className="mt-1 text-sm text-mute">
            Admin oversight: view all database users, assign roles (Admin, Moderator, Customer), and manage permissions.
          </p>
        </div>
        {actionMsg && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-950/60 dark:text-green-300">
            ✓ {actionMsg}
          </div>
        )}
      </div>

      {/* Role Summary Stats Cards */}
      {stats && (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-line bg-card p-4 shadow-soft">
            <div className="text-xs font-semibold text-mute uppercase">Total Registered</div>
            <div className="mt-2 text-2xl font-bold">{stats.totalUsers}</div>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4 shadow-soft">
            <div className="text-xs font-semibold text-brand uppercase">👑 Admins</div>
            <div className="mt-2 text-2xl font-bold text-brand">{stats.admins}</div>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4 shadow-soft">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
              🛠️ Moderators
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.moderators}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-card p-4 shadow-soft">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
              👤 Regular Users
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.regularUsers}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-line bg-card p-1">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                roleFilter === r
                  ? "bg-brand text-onbrand shadow-soft"
                  : "text-mute hover:text-ink hover:bg-tile"
              }`}
            >
              {r === "All" ? "All Users" : r}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone…"
            className="input h-10 pl-9 text-xs"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-soft">
        {loading ? (
          <div className="py-16 text-center text-sm text-mute">Loading users from MongoDB...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-sm text-mute">No users found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-tile/40 text-xs font-semibold uppercase text-mute">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Location / Phone</th>
                  <th className="px-5 py-3.5">Role (Assign)</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="transition hover:bg-tile/30">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-ink">{u.name}</div>
                      <div className="text-[11px] text-mute">
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-mute font-mono">{u.email}</td>
                    <td className="px-5 py-3.5 text-xs text-mute">
                      <div>{u.city || "Dhaka"}</div>
                      <div>{u.phone || "-"}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase focus:outline-none ${roleBadgeColor(
                          u.role
                        )}`}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.isActive
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                        title="Click to toggle active status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {u.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="btn-outline h-8 w-8 px-0 text-mute hover:text-red-500"
                        title="Delete user"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

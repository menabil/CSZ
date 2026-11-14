import { useState } from "react";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const { authModal, closeAuthModal, login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(authModal.mode === "register");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "Dhaka",
  });

  if (!authModal.open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!form.name || !form.email || !form.password) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        const res = await register(form);
        if (!res.success) {
          setError(res.message || "Registration failed");
        }
      } else {
        if (!form.email || !form.password) {
          setError("Please enter your email and password");
          setLoading(false);
          return;
        }

        const res = await login(form.email, form.password);
        if (!res.success) {
          setError(res.message || "Invalid email or password");
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setIsRegister(false);
    setForm((prev) => ({ ...prev, email, password }));
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-line bg-card p-6 sm:p-8 shadow-lift">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-lg hover:bg-tile text-mute hover:text-ink transition"
          aria-label="Close"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
            <Icon name="user" className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight">
            {isRegister ? "Create Account" : "Sign In to CSZ Store"}
          </h2>
          <p className="mt-1 text-xs text-mute">
            {isRegister
              ? "Join us to manage orders, wishlist and hardware parts"
              : "Access your account, track orders, or enter management panel"}
          </p>
        </div>

        {/* Quick Demo Login Credentials Pill Strip */}
        {!isRegister && (
          <div className="mt-4 rounded-xl border border-line/60 bg-tile/40 p-2.5 text-xs">
            <div className="text-[11px] font-semibold text-mute uppercase mb-1.5 text-center">
              Quick Role Test Fill:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@csz.com", "admin123")}
                className="rounded-lg border border-line bg-card py-1 px-1.5 text-center font-semibold text-[11px] text-brand hover:border-brand transition"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("moderator@csz.com", "mod123")}
                className="rounded-lg border border-line bg-card py-1 px-1.5 text-center font-semibold text-[11px] text-purple-600 dark:text-purple-400 hover:border-purple-500 transition"
              >
                🛠️ Moderator
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("user@csz.com", "user123")}
                className="rounded-lg border border-line bg-card py-1 px-1.5 text-center font-semibold text-[11px] text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 transition"
              >
                👤 Customer
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
            <Icon name="alert" className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {isRegister && (
            <div>
              <label className="label">Full Name</label>
              <input
                required
                type="text"
                placeholder="Tanvir Ahmed"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input h-10"
              />
            </div>
          )}

          <div>
            <label className="label">Email Address</label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input h-10"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              required
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input h-10"
            />
          </div>

          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input h-10"
                  />
                </div>
                <div>
                  <label className="label">City</label>
                  <input
                    type="text"
                    placeholder="Dhaka"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="input h-10"
                  />
                </div>
              </div>

              <div>
                <label className="label">Address (optional)</label>
                <input
                  type="text"
                  placeholder="Street address / Area"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="input h-10"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 h-11 w-full text-sm font-semibold"
          >
            {loading ? "Processing..." : isRegister ? "Create My Account" : "Sign In"}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-5 text-center text-xs text-mute">
          {isRegister ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError("");
                }}
                className="font-semibold text-brand hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError("");
                }}
                className="font-semibold text-brand hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

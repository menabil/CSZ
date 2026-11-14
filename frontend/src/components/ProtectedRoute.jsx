import { Link } from "react-router-dom";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="container-x flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  // 1. Check Authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="container-x py-16 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-line bg-card p-8 shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Icon name="shield" className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Authentication Required</h1>
          <p className="mt-2 text-sm text-mute">
            You must be logged in to access this protected area. Please sign in with your account credentials.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              onClick={() => openAuthModal("login")}
              className="btn-primary h-11 px-6 text-sm"
            >
              Sign In
            </button>
            <Link to="/" className="btn-outline h-11 px-6 text-sm">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Check Role Authorization ("shob dhoron er security check frontend and backend 2 ta thake ey hobe")
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="container-x py-16 text-center">
        <div className="mx-auto max-w-lg rounded-3xl border border-line bg-card p-8 shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
            <Icon name="alert" className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">403 – Access Denied</h1>
          <p className="mt-2 text-sm text-mute">
            Your current account role is <b className="text-ink uppercase">{user.role}</b>. This section requires{" "}
            <b>{allowedRoles.join(" or ")}</b> privileges.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-primary h-11 px-6 text-sm">
              Return to Storefront
            </Link>
            <button
              onClick={() => openAuthModal("login")}
              className="btn-outline h-11 px-6 text-sm"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

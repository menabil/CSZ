import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-mute">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6 h-11 px-6">Back to home</Link>
    </div>
  );
}

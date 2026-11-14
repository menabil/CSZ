import { Link } from "react-router-dom";
import Features from "../components/Features";
import { STORE } from "../data/config";

export default function About() {
  return (
    <>
      <section className="container-x py-14">
        <p className="text-sm font-semibold text-brand">About us</p>
        <h1 className="mt-2 max-w-2xl text-4xl font-bold leading-tight tracking-tight">{STORE.fullName} makes building a PC simple.</h1>
        <p className="mt-4 max-w-2xl text-lg text-mute">We sell processors, graphics cards, memory, storage and more. Every part is genuine, every spec is clear, and our team helps you pick parts that work together.</p>
        <Link to="/shop" className="btn-primary mt-6 h-12 px-6">Start shopping</Link>
      </section>
      <Features />
      <section className="container-x grid gap-4 py-10 sm:grid-cols-3">
        {[["30+", "Parts in stock"], ["12 months", "Warranty on every part"], ["24 hours", "Dispatch time"]].map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-line bg-card p-6"><div className="text-3xl font-bold text-brand">{n}</div><div className="mt-1 text-mute">{l}</div></div>
        ))}
      </section>
    </>
  );
}

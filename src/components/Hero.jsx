import Icon from "./Icon";
import { hero } from "../assets/images";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-deep text-white">
      <div className="pcb-grid absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-brand" /> RTX 40 Super cards are in stock
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Build your next PC with parts you can trust.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/70">
            Processors, graphics cards, memory and more. Genuine parts, clear specs and fast delivery from CSZ.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shop" className="btn-primary h-12 px-6">Shop all parts <Icon name="arrow" className="h-4 w-4" /></a>
            <a href="#categories" className="inline-flex h-12 items-center rounded-lg border border-white/20 px-6 font-semibold transition hover:bg-white/10">Browse categories</a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            {["100% genuine", "Warranty on every part", "Easy returns"].map((t) => (
              <li key={t} className="flex items-center gap-1.5"><Icon name="check" className="h-4 w-4 text-brand" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <img src={hero} alt="Illustration of a gaming PC with fans, motherboard and graphics card" className="w-full drop-shadow-2xl" />
          <div className="absolute -bottom-3 left-2 flex items-center gap-3 rounded-xl bg-card px-4 py-3 text-ink shadow-soft sm:left-6">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-tile text-brand"><Icon name="truck" /></span>
            <span className="text-sm font-semibold leading-tight">Fast delivery<span className="block font-normal text-mute">Ships in 24 hours</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

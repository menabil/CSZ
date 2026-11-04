import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { BANNERS } from "../data/banners";

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = BANNERS.length;
  const go = (i) => setIndex((i + total) % total);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((v) => (v + 1) % total), 5500);
    return () => clearInterval(t);
  }, [paused, total]);

  return (
    <section className="container-x pt-6" aria-roledescription="carousel" aria-label="Featured offers" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative grid overflow-hidden rounded-3xl bg-brand/[0.06]">
        {BANNERS.map((b, i) => {
          const active = i === index;
          return (
            <div key={b.id} aria-hidden={!active} className={`col-start-1 row-start-1 grid items-center gap-6 px-6 pb-20 pt-10 transition-opacity duration-700 sm:px-12 md:grid-cols-2 lg:py-16 lg:pb-20 ${active ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <div className={`transition duration-700 ${active ? "translate-y-0" : "translate-y-3"}`}>
                <span className="inline-block rounded-full bg-card px-3 py-1 text-sm font-medium text-brand shadow-soft">{b.eyebrow}</span>
                <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{b.title}</h1>
                <p className="mt-3 max-w-md text-mute sm:text-lg">{b.text}</p>
                <Link to={b.to} tabIndex={active ? 0 : -1} className="btn-primary mt-6 h-12 px-6">
                  {b.cta} <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative mx-auto w-full max-w-sm md:max-w-md">
                <div className="absolute inset-4 rounded-full bg-card" aria-hidden="true" />
                <img src={b.image} alt="" className={`relative w-full transition duration-700 ${active ? "scale-100" : "scale-95"}`} />
              </div>
            </div>
          );
        })}
        <div className="absolute inset-x-6 bottom-5 flex items-center justify-between sm:inset-x-12">
          <div className="flex gap-2">
            {BANNERS.map((b, i) => (
              <button key={b.id} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-brand" : "w-2 bg-ink/20"}`} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => go(index - 1)} className="btn-outline h-10 w-10 px-0" aria-label="Previous slide"><Icon name="left" /></button>
            <button onClick={() => go(index + 1)} className="btn-outline h-10 w-10 px-0" aria-label="Next slide"><Icon name="right" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

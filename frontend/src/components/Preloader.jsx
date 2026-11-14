import { useEffect, useState } from "react";
import { logo } from "../assets/images";
import useLockBodyScroll from "../hooks/useLockBodyScroll";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setProgress((v) => Math.min(100, v + (v < 70 ? 6 : 3))), 50);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const a = setTimeout(() => setHide(true), 250);
    const b = setTimeout(() => setGone(true), 900);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [progress]);

  useLockBodyScroll(!gone);
  if (gone) return null;

  return (
    <div className={`fixed inset-0 z-50 grid place-items-center bg-page transition-all duration-700 ${hide ? "pointer-events-none -translate-y-4 opacity-0" : ""}`} role="status" aria-label="Loading">
      <div className="w-56 text-center">
        <img src={logo} alt="" className="mx-auto h-16 w-16 animate-pulse rounded-2xl" />
        <div className="mt-4 text-lg font-bold text-ink">Computer Sell Zone</div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-tile">
          <div className="h-full rounded-full bg-brand transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-xs text-mute">{progress}%</div>
      </div>
    </div>
  );
}

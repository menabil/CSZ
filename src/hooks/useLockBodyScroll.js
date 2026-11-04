import { useEffect } from "react";
import { useLenis } from "../context/LenisContext";

export default function useLockBodyScroll(locked) {
  const lenis = useLenis();
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "";
    if (lenis) (locked ? lenis.stop() : lenis.start());
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [locked, lenis]);
}

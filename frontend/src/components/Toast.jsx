import Icon from "./Icon";
import { useCartContext } from "../context/CartContext";

export default function Toast() {
  const { notice } = useCartContext();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4" role="status" aria-live="polite">
      <div className={`flex max-w-sm items-center gap-2 rounded-xl border border-line/30 bg-slate-900 px-4 py-3 text-sm text-white shadow-soft transition duration-300 dark:border-line dark:bg-slate-800 dark:text-slate-100 ${notice ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        <Icon name="check" className="h-4 w-4 shrink-0 text-green-400" />
        <span>{notice || "\u00A0"}</span>
      </div>
    </div>
  );
}

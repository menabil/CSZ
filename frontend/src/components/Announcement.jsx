import { STORE } from "../data/config";

export default function Announcement() {
  return (
    <div className="border-b border-line/40 bg-slate-900 px-4 py-2 text-center text-sm font-medium text-slate-100 dark:border-line/60 dark:bg-slate-950 dark:text-slate-300">
      Free shipping on orders of ${STORE.freeShippingAt} or more
    </div>
  );
}

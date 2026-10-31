import { STORE } from "../data/config";

export default function Announcement() {
  return (
    <div className="bg-deep px-4 py-2 text-center text-sm text-white/90">
      Free shipping on orders of ${STORE.freeShippingAt} or more
    </div>
  );
}

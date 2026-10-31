import { logo } from "../assets/images";
import { STORE } from "../data/config";

export default function Logo({ className = "" }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 shrink-0 ${className}`} aria-label={`${STORE.name} home`}>
      <img src={logo} alt="" className="h-10 w-10 rounded-xl" />
      <span className="hidden sm:block font-display font-bold leading-tight">
        {STORE.fullName.split(" ")[0]}
        <span className="block text-sm font-medium text-mute">Sell Zone</span>
      </span>
    </a>
  );
}

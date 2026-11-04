import { Link } from "react-router-dom";
import { logo } from "../assets/images";
import { STORE } from "../data/config";

export default function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${STORE.name} home`}>
      <img src={logo} alt="" className="h-10 w-10 rounded-xl" />
      <span className="hidden font-bold leading-tight sm:block">
        Computer
        <span className="block text-sm font-medium text-mute">Sell Zone</span>
      </span>
    </Link>
  );
}

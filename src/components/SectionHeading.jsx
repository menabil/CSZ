import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function SectionHeading({ title, to, linkText = "View all" }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {to && (
        <Link to={to} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">
          {linkText} <Icon name="arrow" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

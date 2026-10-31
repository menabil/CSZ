import Icon from "./Icon";

export default function Toast({ message }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4" role="status" aria-live="polite">
      <div className={`flex max-w-sm items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-page shadow-soft transition duration-300 ${message ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        <Icon name="check" className="h-4 w-4 shrink-0 text-brand" />
        <span>{message || "\u00A0"}</span>
      </div>
    </div>
  );
}

export default function EmptyState({ onReset }) {
  return (
    <div className="rounded-2xl border border-dashed border-line py-16 text-center">
      <p className="font-semibold">No parts match your search</p>
      <p className="mt-1 text-sm text-mute">Try a different word or choose another category.</p>
      <button onClick={onReset} className="mt-4 h-10 rounded-lg border border-line px-4 text-sm font-semibold transition hover:border-brand">
        Clear filters
      </button>
    </div>
  );
}

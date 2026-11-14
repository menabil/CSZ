export default function EmptyState({ onReset }) {
  return (
    <div className="rounded-2xl border border-dashed border-line py-16 text-center">
      <p className="font-semibold">No parts match your search</p>
      <p className="mt-1 text-sm text-mute">Try a different word or clear the filters.</p>
      <button onClick={onReset} className="btn-outline mt-4 h-10 px-4 text-sm">Clear filters</button>
    </div>
  );
}

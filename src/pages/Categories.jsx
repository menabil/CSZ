import CategoryGrid from "../components/CategoryGrid";

export default function Categories() {
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold tracking-tight">All categories</h1>
      <p className="mb-6 mt-1 text-mute">Pick a category to see matching parts.</p>
      <CategoryGrid />
    </div>
  );
}

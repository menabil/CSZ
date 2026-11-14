import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default function ProductGrid({ products, onReset, cols = "xl:grid-cols-4" }) {
  if (products.length === 0) return <EmptyState onReset={onReset} />;
  return (
    <div className={`grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 ${cols}`}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

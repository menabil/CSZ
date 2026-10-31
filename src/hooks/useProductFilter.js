import { useMemo, useState } from "react";

export default function useProductFilter(products) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || `${p.name} ${p.spec} ${p.category}`.toLowerCase().includes(q))
    );
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, category, query, sort]);

  const reset = () => {
    setQuery("");
    setCategory("All");
  };

  return { list, category, setCategory, query, setQuery, sort, setSort, reset };
}

import { useMemo, useState } from "react";

// Filters a product list by search text, brand, price range, stock and sort order.
export default function useProductFilter(products, query = "") {
  const [sort, setSort] = useState("featured");
  const [brands, setBrands] = useState([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [inStock, setInStock] = useState(false);

  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);

  const list = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const lo = min === "" ? 0 : Number(min);
    const hi = max === "" ? Infinity : Number(max);
    let result = products.filter((p) => {
      const hay = `${p.name} ${p.brand} ${p.spec} ${p.category}`.toLowerCase();
      return (
        words.every((w) => hay.includes(w)) &&
        (brands.length === 0 || brands.includes(p.brand)) &&
        p.price >= lo &&
        p.price <= hi &&
        (!inStock || p.stock > 0)
      );
    });
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, query, brands, min, max, inStock, sort]);

  const toggleBrand = (b) => setBrands((c) => (c.includes(b) ? c.filter((x) => x !== b) : [...c, b]));
  const reset = () => { setBrands([]); setMin(""); setMax(""); setInStock(false); setSort("featured"); };
  const activeCount = brands.length + (min !== "" || max !== "" ? 1 : 0) + (inStock ? 1 : 0);

  return { list, allBrands, sort, setSort, brands, toggleBrand, min, setMin, max, setMax, inStock, setInStock, reset, activeCount };
}

export const CATEGORIES = [
  { name: "Processors", slug: "processors" },
  { name: "Graphics Cards", slug: "graphics-cards" },
  { name: "Memory", slug: "memory" },
  { name: "Storage", slug: "storage" },
  { name: "Motherboards", slug: "motherboards" },
  { name: "Power Supplies", slug: "power-supplies" },
  { name: "Cooling", slug: "cooling" },
  { name: "Cases", slug: "cases" },
];

export const categorySlug = (name) => CATEGORIES.find((c) => c.name === name)?.slug ?? "";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

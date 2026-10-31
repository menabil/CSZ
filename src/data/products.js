// Sample catalog. Replace with your real products (or load from an API later).
const products = [
  { id: 1, name: "Ryzen 7 7800X3D", category: "Processors", spec: "8 cores · 16 threads · AM5", price: 389, oldPrice: 449, stock: 12, rating: 4.9, reviews: 312, badge: "Best seller" },
  { id: 2, name: "Core i5-14600K", category: "Processors", spec: "14 cores · 20 threads · LGA1700", price: 279, stock: 20, rating: 4.7, reviews: 188 },
  { id: 3, name: "GeForce RTX 4070 Super 12GB", category: "Graphics Cards", spec: "12 GB GDDR6X · Triple fan", price: 599, oldPrice: 649, stock: 6, rating: 4.8, reviews: 247, badge: "Hot deal" },
  { id: 4, name: "Radeon RX 7800 XT 16GB", category: "Graphics Cards", spec: "16 GB GDDR6 · Dual fan", price: 489, stock: 9, rating: 4.6, reviews: 142 },
  { id: 5, name: "Vengeance DDR5 32GB Kit", category: "Memory", spec: "2×16 GB · 6000 MHz · CL30", price: 109, oldPrice: 134, stock: 40, rating: 4.8, reviews: 403 },
  { id: 6, name: "Fury Beast DDR4 16GB Kit", category: "Memory", spec: "2×8 GB · 3200 MHz · CL16", price: 42, stock: 55, rating: 4.6, reviews: 521 },
  { id: 7, name: "990 Pro NVMe SSD 1TB", category: "Storage", spec: "PCIe 4.0 · 7,450 MB/s read", price: 119, oldPrice: 149, stock: 31, rating: 4.9, reviews: 276 },
  { id: 8, name: "Barracuda 4TB HDD", category: "Storage", spec: "SATA III · 5400 RPM", price: 84, stock: 18, rating: 4.4, reviews: 97 },
  { id: 9, name: "B650 Tomahawk WiFi", category: "Motherboards", spec: "AM5 · ATX · DDR5 · Wi-Fi 6E", price: 219, stock: 14, rating: 4.7, reviews: 133 },
  { id: 10, name: "Z790 Aorus Elite AX", category: "Motherboards", spec: "LGA1700 · ATX · DDR5", price: 239, stock: 0, rating: 4.6, reviews: 88 },
  { id: 11, name: "RM850x 850W Gold", category: "Power Supplies", spec: "Fully modular · 80+ Gold", price: 139, stock: 22, rating: 4.9, reviews: 359 },
  { id: 12, name: "Hyper 212 Black Air Cooler", category: "Cooling", spec: "Tower · 120 mm fan", price: 44, stock: 35, rating: 4.5, reviews: 214 },
  { id: 13, name: "Kraken 360 Liquid Cooler", category: "Cooling", spec: "360 mm AIO · LCD display", price: 259, stock: 7, rating: 4.7, reviews: 76, badge: "New" },
  { id: 14, name: "North Mesh Mid Tower", category: "Cases", spec: "ATX · 2 fans included", price: 139, stock: 11, rating: 4.8, reviews: 121 },
];

export default products;

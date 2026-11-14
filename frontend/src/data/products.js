// Dummy catalog. Replace with your real products (or load from an API later).
const make = (id, name, category, brand, spec, price, oldPrice, stock, rating, reviews, badge) => ({
  id, name, category, brand, spec, price, stock, rating, reviews,
  ...(oldPrice ? { oldPrice } : {}),
  ...(badge ? { badge } : {}),
});

const products = [
  make(1, "Ryzen 7 7800X3D", "Processors", "AMD", "8 cores · 16 threads · AM5", 389, 449, 12, 4.9, 312, "Best seller"),
  make(2, "Core i5-14600K", "Processors", "Intel", "14 cores · 20 threads · LGA1700", 279, null, 20, 4.7, 188, ""),
  make(3, "Ryzen 5 7600", "Processors", "AMD", "6 cores · 12 threads · AM5", 199, 229, 26, 4.7, 205, ""),
  make(4, "Core i7-14700K", "Processors", "Intel", "20 cores · 28 threads · LGA1700", 389, 419, 10, 4.8, 164, ""),
  make(5, "Ryzen 9 7950X", "Processors", "AMD", "16 cores · 32 threads · AM5", 549, 599, 5, 4.8, 97, "New"),
  make(6, "Dual GeForce RTX 4070 Super 12GB", "Graphics Cards", "ASUS", "12 GB GDDR6X · Dual fan · HDMI/DP", 599, 649, 6, 4.8, 247, "Hot deal"),
  make(7, "Radeon RX 7800 XT 16GB", "Graphics Cards", "MSI", "16 GB GDDR6 · Dual fan", 489, null, 9, 4.6, 142, ""),
  make(8, "GeForce RTX 4060 Ti 8GB Gaming OC", "Graphics Cards", "Gigabyte", "8 GB GDDR6 · Triple fan", 399, null, 14, 4.5, 118, ""),
  make(9, "TUF GeForce RTX 4080 Super 16GB", "Graphics Cards", "ASUS", "16 GB GDDR6X · Triple fan", 1049, 1099, 3, 4.9, 64, ""),
  make(10, "Vengeance DDR5 32GB Kit", "Memory", "Corsair", "2×16 GB · 6000 MHz · CL30", 109, 134, 40, 4.8, 403, "Best seller"),
  make(11, "Fury Beast DDR4 16GB Kit", "Memory", "Kingston", "2×8 GB · 3200 MHz · CL16", 42, null, 55, 4.6, 521, ""),
  make(12, "Trident Z5 RGB DDR5 32GB", "Memory", "G.Skill", "2×16 GB · 6400 MHz · CL32 · RGB", 149, null, 18, 4.8, 156, ""),
  make(13, "Pro DDR5 16GB 5600", "Memory", "Crucial", "1×16 GB · 5600 MHz · CL46", 64, 79, 33, 4.5, 210, ""),
  make(14, "990 Pro NVMe SSD 1TB", "Storage", "Samsung", "PCIe 4.0 · 7,450 MB/s read", 119, 149, 31, 4.9, 276, "Best seller"),
  make(15, "Barracuda 4TB HDD", "Storage", "Seagate", "SATA III · 5400 RPM", 84, null, 18, 4.4, 97, ""),
  make(16, "WD Black SN850X 2TB", "Storage", "WD", "PCIe 4.0 · 7,300 MB/s read", 169, 199, 15, 4.8, 188, ""),
  make(17, "MX500 SATA SSD 1TB", "Storage", "Crucial", "2.5-inch · 560 MB/s read", 69, null, 44, 4.6, 301, ""),
  make(18, "B650 Tomahawk WiFi", "Motherboards", "MSI", "AM5 · ATX · DDR5 · Wi-Fi 6E", 219, null, 14, 4.7, 133, ""),
  make(19, "Z790 Aorus Elite AX", "Motherboards", "Gigabyte", "LGA1700 · ATX · DDR5", 239, null, 0, 4.6, 88, ""),
  make(20, "ROG Strix B760-F Gaming WiFi", "Motherboards", "ASUS", "LGA1700 · ATX · DDR5", 189, null, 12, 4.6, 102, ""),
  make(21, "B550M Pro4", "Motherboards", "ASRock", "AM4 · Micro ATX · DDR4", 99, 119, 21, 4.4, 75, ""),
  make(22, "RM850x 850W Gold", "Power Supplies", "Corsair", "Fully modular · 80+ Gold", 139, null, 22, 4.9, 359, ""),
  make(23, "MAG A750GL 750W Gold", "Power Supplies", "MSI", "Fully modular · 80+ Gold", 99, 119, 27, 4.6, 144, ""),
  make(24, "Focus GX-1000 1000W", "Power Supplies", "Seasonic", "Fully modular · 80+ Gold", 189, null, 8, 4.9, 90, ""),
  make(25, "Hyper 212 Black Air Cooler", "Cooling", "Cooler Master", "Tower · 120 mm fan", 44, null, 35, 4.5, 214, ""),
  make(26, "Kraken 360 Liquid Cooler", "Cooling", "NZXT", "360 mm AIO · LCD display", 259, null, 7, 4.7, 76, "New"),
  make(27, "Dark Rock 4 Air Cooler", "Cooling", "be quiet!", "Dual tower · 135 mm fan", 89, null, 16, 4.8, 112, ""),
  make(28, "Toughliquid 240 AIO", "Cooling", "Thermaltake", "240 mm AIO · ARGB", 139, 159, 13, 4.5, 58, ""),
  make(29, "H5 Flow Mid Tower", "Cases", "NZXT", "ATX · 2 fans included", 94, null, 19, 4.7, 226, ""),
  make(30, "Lancool 216 Airflow", "Cases", "Lian Li", "ATX · 2 × 160 mm fans", 109, 129, 11, 4.8, 137, ""),
  make(31, "4000D Airflow", "Cases", "Corsair", "ATX · Tempered glass", 104, null, 24, 4.8, 301, ""),
  make(32, "NR200P Mini-ITX Case", "Cases", "Cooler Master", "Mini-ITX · Tempered glass", 99, null, 9, 4.6, 83, ""),
];

export default products;

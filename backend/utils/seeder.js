const User = require("../models/userModel");
const Product = require("../models/productModel");

const seedInitialData = async () => {
  try {
    // 1. Seed demo roles if not present
    const adminExists = await User.findOne({ email: "admin@csz.com" });
    if (!adminExists) {
      await User.create({
        name: "Store Administrator",
        email: "admin@csz.com",
        password: "admin123",
        role: "admin",
        phone: "01700000001",
        city: "Dhaka",
      });
      console.log("Seeded initial Admin user: admin@csz.com / admin123");
    }

    const moderatorExists = await User.findOne({ email: "moderator@csz.com" });
    if (!moderatorExists) {
      await User.create({
        name: "Hardware Moderator",
        email: "moderator@csz.com",
        password: "mod123",
        role: "moderator",
        phone: "01700000002",
        city: "Chittagong",
      });
      console.log("Seeded initial Moderator user: moderator@csz.com / mod123");
    }

    const customerExists = await User.findOne({ email: "user@csz.com" });
    if (!customerExists) {
      await User.create({
        name: "Standard Customer",
        email: "user@csz.com",
        password: "user123",
        role: "user",
        phone: "01700000003",
        city: "Sylhet",
      });
      console.log("Seeded initial Customer user: user@csz.com / user123");
    }

    // 2. Seed initial products if product collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const initialSeed = [
        { name: "Ryzen 7 7800X3D", category: "Processors", brand: "AMD", spec: "8 cores · 16 threads · AM5", price: 389, oldPrice: 449, stock: 12, rating: 4.9, reviews: 312, badge: "Best seller" },
        { name: "Core i5-14600K", category: "Processors", brand: "Intel", spec: "14 cores · 20 threads · LGA1700", price: 279, oldPrice: null, stock: 20, rating: 4.7, reviews: 188, badge: "" },
        { name: "Ryzen 5 7600", category: "Processors", brand: "AMD", spec: "6 cores · 12 threads · AM5", price: 199, oldPrice: 229, stock: 26, rating: 4.7, reviews: 205, badge: "" },
        { name: "Core i7-14700K", category: "Processors", brand: "Intel", spec: "20 cores · 28 threads · LGA1700", price: 389, oldPrice: 419, stock: 10, rating: 4.8, reviews: 164, badge: "" },
        { name: "Dual GeForce RTX 4070 Super 12GB", category: "Graphics Cards", brand: "ASUS", spec: "12 GB GDDR6X · Dual fan · HDMI/DP", price: 599, oldPrice: 649, stock: 6, rating: 4.8, reviews: 247, badge: "Hot deal" },
        { name: "Radeon RX 7800 XT 16GB", category: "Graphics Cards", brand: "MSI", spec: "16 GB GDDR6 · Dual fan", price: 489, oldPrice: null, stock: 9, rating: 4.6, reviews: 142, badge: "" },
        { name: "Vengeance DDR5 32GB Kit", category: "Memory", brand: "Corsair", spec: "2×16 GB · 6000 MHz · CL30", price: 109, oldPrice: 134, stock: 40, rating: 4.8, reviews: 403, badge: "Best seller" },
        { name: "990 Pro NVMe SSD 1TB", category: "Storage", brand: "Samsung", spec: "PCIe 4.0 · 7,450 MB/s read", price: 119, oldPrice: 149, stock: 31, rating: 4.9, reviews: 276, badge: "Best seller" },
      ];
      await Product.insertMany(initialSeed);
      console.log(`Seeded ${initialSeed.length} catalog products`);
    }
  } catch (error) {
    console.error("Seeder error:", error.message);
  }
};

module.exports = seedInitialData;

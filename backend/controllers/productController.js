const Product = require("../models/productModel");

// Default initial catalog if database is empty
const INITIAL_PRODUCTS_SEED = [
  { name: "Ryzen 7 7800X3D", category: "Processors", brand: "AMD", spec: "8 cores · 16 threads · AM5", price: 389, oldPrice: 449, stock: 12, rating: 4.9, reviews: 312, badge: "Best seller" },
  { name: "Core i5-14600K", category: "Processors", brand: "Intel", spec: "14 cores · 20 threads · LGA1700", price: 279, oldPrice: null, stock: 20, rating: 4.7, reviews: 188, badge: "" },
  { name: "Ryzen 5 7600", category: "Processors", brand: "AMD", spec: "6 cores · 12 threads · AM5", price: 199, oldPrice: 229, stock: 26, rating: 4.7, reviews: 205, badge: "" },
  { name: "Core i7-14700K", category: "Processors", brand: "Intel", spec: "20 cores · 28 threads · LGA1700", price: 389, oldPrice: 419, stock: 10, rating: 4.8, reviews: 164, badge: "" },
  { name: "Ryzen 9 7950X", category: "Processors", brand: "AMD", spec: "16 cores · 32 threads · AM5", price: 549, oldPrice: 599, stock: 5, rating: 4.8, reviews: 97, badge: "New" },
  { name: "Dual GeForce RTX 4070 Super 12GB", category: "Graphics Cards", brand: "ASUS", spec: "12 GB GDDR6X · Dual fan · HDMI/DP", price: 599, oldPrice: 649, stock: 6, rating: 4.8, reviews: 247, badge: "Hot deal" },
  { name: "Radeon RX 7800 XT 16GB", category: "Graphics Cards", brand: "MSI", spec: "16 GB GDDR6 · Dual fan", price: 489, oldPrice: null, stock: 9, rating: 4.6, reviews: 142, badge: "" },
  { name: "GeForce RTX 4060 Ti 8GB Gaming OC", category: "Graphics Cards", brand: "Gigabyte", spec: "8 GB GDDR6 · Triple fan", price: 399, oldPrice: null, stock: 14, rating: 4.5, reviews: 118, badge: "" },
  { name: "TUF GeForce RTX 4080 Super 16GB", category: "Graphics Cards", brand: "ASUS", spec: "16 GB GDDR6X · Triple fan", price: 1049, oldPrice: 1099, stock: 3, rating: 4.9, reviews: 64, badge: "" },
  { name: "Vengeance DDR5 32GB Kit", category: "Memory", brand: "Corsair", spec: "2×16 GB · 6000 MHz · CL30", price: 109, oldPrice: 134, stock: 40, rating: 4.8, reviews: 403, badge: "Best seller" },
  { name: "Fury Beast DDR4 16GB Kit", category: "Memory", brand: "Kingston", spec: "2×8 GB · 3200 MHz · CL16", price: 42, oldPrice: null, stock: 55, rating: 4.6, reviews: 521, badge: "" },
  { name: "Trident Z5 RGB DDR5 32GB", category: "Memory", brand: "G.Skill", spec: "2×16 GB · 6400 MHz · CL32 · RGB", price: 149, oldPrice: null, stock: 18, rating: 4.8, reviews: 156, badge: "" },
  { name: "990 Pro NVMe SSD 1TB", category: "Storage", brand: "Samsung", spec: "PCIe 4.0 · 7,450 MB/s read", price: 119, oldPrice: 149, stock: 31, rating: 4.9, reviews: 276, badge: "Best seller" },
  { name: "WD Black SN850X 2TB", category: "Storage", brand: "WD", spec: "PCIe 4.0 · 7,300 MB/s read", price: 169, oldPrice: 199, stock: 15, rating: 4.8, reviews: 188, badge: "" },
  { name: "B650 Tomahawk WiFi", category: "Motherboards", brand: "MSI", spec: "AM5 · ATX · DDR5 · Wi-Fi 6E", price: 219, oldPrice: null, stock: 14, rating: 4.7, reviews: 133, badge: "" },
  { name: "RM850x 850W Gold", category: "Power Supplies", brand: "Corsair", spec: "Fully modular · 80+ Gold", price: 139, oldPrice: null, stock: 22, rating: 4.9, reviews: 359, badge: "" },
  { name: "Kraken 360 Liquid Cooler", category: "Cooling", brand: "NZXT", spec: "360 mm AIO · LCD display", price: 259, oldPrice: null, stock: 7, rating: 4.7, reviews: 76, badge: "New" },
  { name: "H5 Flow Mid Tower", category: "Cases", brand: "NZXT", spec: "ATX · 2 fans included", price: 94, oldPrice: null, stock: 19, rating: 4.7, reviews: 226, badge: "" },
];

// @desc    Get all products (public)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, brand, search, sort, stockStatus } = req.query;

    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (brand) {
      query.brand = brand;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { spec: { $regex: search, $options: "i" } },
      ];
    }

    if (stockStatus === "in") {
      query.stock = { $gt: 5 };
    } else if (stockStatus === "low") {
      query.stock = { $gt: 0, $lte: 5 };
    } else if (stockStatus === "out") {
      query.stock = 0;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "name") sortOption = { name: 1 };

    let products = await Product.find(query).sort(sortOption);

    // Auto-seed if database has 0 products
    if (products.length === 0 && !category && !brand && !search) {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(INITIAL_PRODUCTS_SEED);
        products = await Product.find(query).sort(sortOption);
      }
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private / Moderator or Admin ("modarator product add korte parbe")
const createProduct = async (req, res, next) => {
  try {
    const { name, category, brand, spec, price, oldPrice, stock, badge, image } = req.body;

    if (!name || !category || !brand || !spec || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide product name, category, brand, spec, and price",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      brand: brand.trim(),
      spec: spec.trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      stock: stock !== undefined ? Math.max(0, parseInt(stock, 10)) : 0,
      badge: badge ? badge.trim() : "",
      image: image || "",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: `Product '${product.name}' created successfully by ${req.user.role}`,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private / Moderator or Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, category, brand, spec, price, oldPrice, stock, badge, image } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (name) product.name = name.trim();
    if (category) product.category = category.trim();
    if (brand) product.brand = brand.trim();
    if (spec) product.spec = spec.trim();
    if (price !== undefined) product.price = Number(price);
    if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null;
    if (stock !== undefined) product.stock = Math.max(0, parseInt(stock, 10));
    if (badge !== undefined) product.badge = badge ? badge.trim() : "";
    if (image !== undefined) product.image = image;

    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product '${product.name}' updated successfully`,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private / Moderator or Admin
const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid stock number",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.stock = Math.max(0, parseInt(stock, 10));
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Stock for '${product.name}' updated to ${product.stock}`,
      stock: product.stock,
      productId: product._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private / Moderator or Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Product '${product.name}' has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct,
};

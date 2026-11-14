const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// @desc    Create a new order (Checkout)
// @route   POST /api/orders
// @access  Public / Authenticated
const createOrder = async (req, res, next) => {
  try {
    const { customer, items, payment, subtotal, shipping, total } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address || !customer.city) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete customer contact and address details",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided in cart",
      });
    }

    // Generate unique order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `CSZ-${randomSuffix}`;

    // Calculate/validate totals if not provided
    const calculatedSubtotal = subtotal !== undefined
      ? Number(subtotal)
      : items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
    const shippingFee = shipping !== undefined ? Number(shipping) : (calculatedSubtotal >= 50 ? 0 : 15);
    const calculatedTotal = total !== undefined ? Number(total) : calculatedSubtotal + shippingFee;

    // Create the order in database
    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      customer: {
        name: customer.name.trim(),
        email: customer.email ? customer.email.trim() : (req.user ? req.user.email : "guest@csz.com"),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city.trim(),
        postcode: customer.postcode ? customer.postcode.trim() : "",
        note: customer.note ? customer.note.trim() : "",
      },
      items: items.map((i) => ({
        product: i.product || i._id || null,
        name: i.name,
        category: i.category || "",
        brand: i.brand || "",
        spec: i.spec || "",
        price: Number(i.price),
        qty: Number(i.qty) || 1,
      })),
      payment: payment || "cod",
      subtotal: calculatedSubtotal,
      shipping: shippingFee,
      total: calculatedTotal,
      status: "Pending",
    });

    // Automatically decrement product stock in database
    for (const item of items) {
      if (item.product || item._id) {
        try {
          const prodId = item.product || item._id;
          const prod = await Product.findById(prodId);
          if (prod) {
            prod.stock = Math.max(0, prod.stock - (Number(item.qty) || 1));
            await prod.save();
          }
        } catch {
          // If product ID format is not mongo ID (e.g. initial demo numbers 1, 2, 3), try by name
          try {
            const prodByName = await Product.findOne({ name: item.name });
            if (prodByName) {
              prodByName.stock = Math.max(0, prodByName.stock - (Number(item.qty) || 1));
              await prodByName.save();
            }
          } catch {
            // ignore
          }
        }
      } else if (item.name) {
        try {
          const prodByName = await Product.findOne({ name: item.name });
          if (prodByName) {
            prodByName.stock = Math.max(0, prodByName.stock - (Number(item.qty) || 1));
            await prodByName.save();
          }
        } catch {
          // ignore
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: `Order ${order.orderId} placed successfully`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private / User
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { "customer.email": req.user.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only: "admin shob kisu dekte parbe")
// @route   GET /api/orders
// @access  Private / Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
        { "customer.city": { $regex: search, $options: "i" } },
        { "items.name": { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (Owner or Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { orderId: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only allow owner or admin
    if (
      req.user.role !== "admin" &&
      (!order.user || order.user.toString() !== req.user._id.toString()) &&
      order.customer.email.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to view this order.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private / Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid status: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { orderId: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private / Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { orderId: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order ${order.orderId} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};

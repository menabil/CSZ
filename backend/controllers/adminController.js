const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// @desc    Get comprehensive admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private / Admin ("admin shob kisu dekte parbe")
const getDashboardOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      orders,
      recentOrders,
      recentUsers,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.find().select("total status items createdAt"),
      Order.find().sort({ createdAt: -1 }).limit(6),
      User.find().select("-password").sort({ createdAt: -1 }).limit(5),
      Product.find({ stock: { $gt: 0, $lte: 5 } }).sort({ stock: 1 }).limit(10),
      Product.find({ stock: 0 }).sort({ updatedAt: -1 }).limit(10),
    ]);

    // Active revenue (excluding Cancelled orders)
    const activeOrders = orders.filter((o) => o.status !== "Cancelled");
    const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    // Total units of hardware parts sold
    const totalUnitsSold = activeOrders.reduce(
      (sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.qty || 1), 0) : 0),
      0
    );

    // Status breakdown
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const processingOrders = orders.filter((o) => o.status === "Processing").length;
    const shippedOrders = orders.filter((o) => o.status === "Shipped").length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
    const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

    // Role breakdown
    const [userCount, modCount, adminCount] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "moderator" }),
      User.countDocuments({ role: "admin" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalRevenue,
          totalOrders,
          totalUnitsSold,
          totalUsers,
          totalProducts,
          outOfStockCount: outOfStockProducts.length,
          lowStockCount: lowStockProducts.length,
        },
        orderStatusBreakdown: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
        userRoleBreakdown: {
          users: userCount,
          moderators: modCount,
          admins: adminCount,
        },
        recentOrders,
        recentUsers,
        alerts: {
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
};

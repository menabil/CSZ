const User = require("../models/userModel");

// @desc    Get all users (with search, role filter, pagination)
// @route   GET /api/users
// @access  Private / Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;

    const query = {};
    if (role && ["user", "moderator", "admin"].includes(role)) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private / Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (promote/demote between user, moderator, admin)
// @route   PUT /api/users/:id/role
// @access  Private / Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid role ('user', 'moderator', or 'admin')",
      });
    }

    // Protect the current admin from accidentally removing their own admin role
    if (req.params.id === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You cannot demote yourself from the admin role",
      });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User '${user.name}' role updated to '${role}'`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle active / deactivated status of user
// @route   PUT /api/users/:id/status
// @access  Private / Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? "activated" : "deactivated"}`,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private / Admin
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User '${user.name}' (${user.email}) has been permanently deleted`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user counts by role
// @route   GET /api/users/stats/summary
// @access  Private / Admin
const getUserStats = async (req, res, next) => {
  try {
    const [totalUsers, admins, moderators, regularUsers, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "moderator" }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ isActive: true }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        admins,
        moderators,
        regularUsers,
        activeUsers,
        deactivatedUsers: totalUsers - activeUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats,
};

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalOrders, totalRevenue, totalUsers, totalProducts,
      monthOrders, monthRevenue, pendingOrders, lowStockProducts,
      recentOrders, topProducts, ordersByStatus, monthlyRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([{ $match: { createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      Order.countDocuments({ status: 'Pending' }),
      Product.find({ stock: { $lt: 10 }, isActive: true }).select('name stock').limit(5),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
      Product.find().sort({ soldCount: -1 }).limit(5).select('name soldCount price images'),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalUsers,
        totalProducts,
        monthOrders,
        monthRevenue: monthRevenue[0]?.total || 0,
        pendingOrders,
      },
      lowStockProducts,
      recentOrders,
      topProducts,
      ordersByStatus,
      monthlyRevenue
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

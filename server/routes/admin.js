const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Banner = require('../models/Banner');
const Appointment = require('../models/Appointment');
const Coupon = require('../models/Coupon');
const adminAuth = require('../middleware/adminAuth');

// ─── Dashboard Analytics ─────────────────────────────────────────────────────
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders, totalRevenue, pendingPrescriptions, totalProducts,
      totalUsers, todayOrders, weekOrders, monthOrders,
      recentOrders, lowStockProducts, pendingAppointments,
      topProducts
    ] = await Promise.all([
      Order.countDocuments({ paymentStatus: 'Paid' }),
      Order.aggregate([{ $match: { paymentStatus: 'Paid' } }, { $group: { _id: null, total: { $sum: '$grandTotal' } } }]),
      Order.countDocuments({ prescriptionVerified: false, status: 'Payment Received' }),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments({ createdAt: { $gte: todayStart }, paymentStatus: 'Paid' }),
      Order.countDocuments({ createdAt: { $gte: weekStart }, paymentStatus: 'Paid' }),
      Order.countDocuments({ createdAt: { $gte: monthStart }, paymentStatus: 'Paid' }),
      Order.find({ paymentStatus: 'Paid' }).sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find({ 'variants.stock': { $lte: 5 } }).select('name variants brand').limit(10),
      Appointment.countDocuments({ status: 'Pending' }),
      Product.find().sort({ soldCount: -1 }).limit(5).select('name soldCount price brand ratings')
    ]);

    // Revenue chart - last 7 days
    const revenueChart = await Order.aggregate([
      { $match: { paymentStatus: 'Paid', createdAt: { $gte: weekStart } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$grandTotal' }, orders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Category revenue
    const categoryRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', revenue: { $sum: '$items.price' }, count: { $sum: 1 } } },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalOrders, pendingPrescriptions, totalProducts, totalUsers,
        todayOrders, weekOrders, monthOrders, pendingAppointments
      },
      revenueChart, categoryRevenue,
      recentOrders, lowStockProducts, topProducts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Banner Management ───────────────────────────────────────────────────────
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/banners');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `banner_${Date.now()}${path.extname(file.originalname)}`)
});
const bannerUpload = multer({ storage: bannerStorage });

router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/banners/all', adminAuth, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/banners', adminAuth, bannerUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/banners/${req.file.filename}`;
    const banner = await Banner.create(data);
    res.status(201).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/banners/:id', adminAuth, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/banners/:id', adminAuth, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

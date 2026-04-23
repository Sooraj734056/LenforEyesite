const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// POST /api/orders — Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, razorpayOrderId } = req.body;

    let itemsTotal = 0, lensTotal = 0;
    const enrichedItems = await Promise.all(items.map(async item => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      const price = product.price * item.quantity;
      itemsTotal += price;
      const lensPrice = item.lens?.price || 0;
      lensTotal += lensPrice * item.quantity;
      return {
        ...item,
        productName: product.name,
        price: product.price,
        image: product.variants?.[0]?.images?.[0] || ''
      };
    }));

    let discount = 0;
    let couponApplied = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        const validation = coupon.isValid(req.user._id, itemsTotal + lensTotal);
        if (validation.valid) {
          discount = coupon.calculateDiscount(itemsTotal + lensTotal);
          coupon.usedCount += 1;
          coupon.usedBy.push(req.user._id);
          await coupon.save();
          couponApplied = couponCode;
        }
      }
    }

    const shippingCost = (itemsTotal + lensTotal) >= 1000 ? 0 : 99;
    const subtotal = itemsTotal + lensTotal - discount + shippingCost;
    const tax = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + tax;

    const pointsEarned = Math.round(grandTotal * 0.05); // 5% points

    const order = await Order.create({
      user: req.user._id,
      items: enrichedItems,
      shippingAddress,
      itemsTotal,
      lensTotal,
      shippingCost,
      discount,
      tax,
      grandTotal,
      pointsEarned,
      couponCode: couponApplied,
      paymentMethod: paymentMethod || 'Razorpay',
      razorpayOrderId,
      statusHistory: [{ status: 'Payment Received', note: 'Order placed successfully' }]
    });

    // Award loyalty points to user
    await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: pointsEarned } });

    // Update sold count
    await Promise.all(items.map(item =>
      Product.findByIdAndUpdate(item.product, { $inc: { soldCount: item.quantity } })
    ));

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/my — My orders
router.get('/my', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('items.product', 'name variants'),
      Order.countDocuments({ user: req.user._id })
    ]);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id — Order detail
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name variants brand');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders — Admin: all orders
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
    ];
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit)).populate('user', 'name email phone'),
      Order.countDocuments(query)
    ]);
    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/status — Admin: update status
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, note, trackingNumber, courierName } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    order.status = status;
    order.statusHistory.push({ status, note: note || '', updatedBy: req.user._id });
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;
    if (status === 'Prescription Verified') order.prescriptionVerified = true;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/job-sheet — Mark job sheet printed
router.put('/:id/job-sheet', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { jobSheetPrinted: true }, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id/job-sheet — Get job sheet data
router.get('/:id/job-sheet', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name brand').populate('user', 'name email phone');
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

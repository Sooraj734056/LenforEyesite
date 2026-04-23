const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// POST /api/coupons/validate — Validate a coupon
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    const result = coupon.isValid(req.user._id, orderAmount);
    if (!result.valid) return res.status(400).json({ success: false, message: result.message });
    const discount = coupon.calculateDiscount(orderAmount);
    res.json({ success: true, discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, description: coupon.description } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/coupons — Admin: list all
router.get('/', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/coupons — Admin: create
router.post('/', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/coupons/:id — Admin: update
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/coupons/:id — Admin: delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const adminAuth = require('../middleware/adminAuth');

// GET /api/banners — Public
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/banners/admin — Admin list
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ position: 1, order: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/banners — Create
router.post('/', adminAuth, async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/banners/:id
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/banners/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

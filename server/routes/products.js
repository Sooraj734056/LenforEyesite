const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product');
const { protect, optionalAuth } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const slugify = require('slugify');

// ─── Multer for images ───────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── GET /api/products — List with filters ───────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, brand, gender, frameShape, frameMaterial, frameWidth, minPrice, maxPrice,
            sort, search, page = 1, limit = 12, featured, newArrival, bestseller } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = { $in: brand.split(',') };
    if (gender) query.gender = gender;
    if (frameShape) query.frameShape = { $in: frameShape.split(',') };
    if (frameMaterial) query.frameMaterial = { $in: frameMaterial.split(',') };
    if (frameWidth) query.frameWidth = frameWidth;
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestseller === 'true') query.isBestseller = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const sortMap = {
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
      'newest': { createdAt: -1 },
      'popular': { soldCount: -1, 'ratings.average': -1 },
      'rating': { 'ratings.average': -1 }
    };
    const sortObj = sortMap[sort] || { isFeatured: -1, soldCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      pagination: { total, pages: Math.ceil(total / Number(limit)), current: Number(page), limit: Number(limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/search/suggestions
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ success: true, suggestions: [] });
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    }).select('name brand category variants price').limit(8);
    res.json({ success: true, suggestions: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    await Product.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products — Admin create
router.post('/', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    data.slug = slugify(data.name || '', { lower: true, strict: true });
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(f => `/uploads/products/${f.filename}`);
      if (data.variants && data.variants.length > 0) {
        data.variants[0].images = imageUrls;
      }
    }
    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id — Admin update
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id — Admin delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products/bulk-upload — CSV import
const csvUpload = multer({ storage: multer.memoryStorage() });
router.post('/bulk-upload', adminAuth, csvUpload.single('csv'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const results = [];
    const { Readable } = require('stream');
    const stream = Readable.from(req.file.buffer.toString());

    await new Promise((resolve, reject) => {
      stream.pipe(csv())
        .on('data', (row) => {
          if (row.name && row.price) {
            results.push({
              name: row.name,
              brand: row.brand || 'Other',
              category: row.category || 'Eyeglasses',
              gender: row.gender || 'Unisex',
              price: Number(row.price),
              comparePrice: Number(row.comparePrice) || undefined,
              frameShape: row.frameShape || 'Round',
              frameMaterial: row.frameMaterial || 'TR90',
              slug: slugify(`${row.name}-${Date.now()}`, { lower: true, strict: true }),
              variants: [{ 
                color: row.color || 'Black', 
                colorHex: row.colorHex || '#000000', 
                stock: Number(row.stock) || 0 
              }],
              description: row.description || '',
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid products found in CSV.' });
    }

    const inserted = await Product.insertMany(results, { ordered: false });
    res.json({ 
      success: true, 
      count: inserted.length, 
      message: `${inserted.length} products successfully imported.` 
    });

  } catch (err) {
    console.error('Bulk Upload Error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.code === 11000 ? 'Some products already exist (duplicate slug/name).' : err.message 
    });
  }
});

// POST /api/products/:id/review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    const existing = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed.' });
    product.reviews.push({ user: req.user._id, name: req.user.name, ...req.body });
    product.calculateRating();
    await product.save();
    res.status(201).json({ success: true, reviews: product.reviews, ratings: product.ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ─── Rate Limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, ''),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Database ────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/banners', require('./routes/banners'));
app.get('/api/seed-db', async (req, res) => {
  try {
    const seed = require('./seed-script-logic');
    await seed();
    res.json({ success: true, message: 'Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🔵 Lens For Eyesight API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Lens For Eyesight Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products\n`);
});

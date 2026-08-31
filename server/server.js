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
const allowedOrigins = [
  (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, ''),
  'https://lenfor-eyesite-5p5e5t70s-surajs-projects-ecfa77d1.vercel.app',
  'https://lenfor-eyesite-fmr2xm0bo-surajs-projects-ecfa77d1.vercel.app',
  'https://lenfor-eyesite.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Database ────────────────────────────────────────────────────────────────
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lens-ecommerce';
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed:', err.message);
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔄 Starting In-Memory MongoDB server for development...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create({
          binary: { version: '4.4.18' }
        });
        const memUri = mongoServer.getUri();
        await mongoose.connect(memUri);
        console.log('✅ In-Memory MongoDB connected successfully!');

        console.log('🌱 Auto-seeding initial database (products, banners, users)...');
        const seed = require('./seed-script-logic');
        await seed();
        console.log('🚀 Database seeded successfully!');
      } catch (memErr) {
        console.error('❌ In-Memory MongoDB Error:', memErr);
      }
    } else {
      console.error('❌ Database connection error in production. Please check MONGO_URI in environment variables.');
    }
  }
};
connectDB();

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
    timestamp: new Date().toISOString(),
    debug: 'V2_PRESCRIPTIONS_LOADED'
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

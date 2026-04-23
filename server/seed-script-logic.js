const Product = require('./models/Product');
const User = require('./models/User');
const Banner = require('./models/Banner');

const sampleProducts = [
  // Ray-Ban
  {
    name: 'Ray-Ban Wayfarer Classic RB2140',
    brand: 'Ray-Ban', category: 'Sunglasses',
    gender: 'Unisex', frameShape: 'Wayfarer', frameMaterial: 'Acetate', frameWidth: 'Medium',
    price: 8500, comparePrice: 11000, discount: 23,
    slug: 'ray-ban-wayfarer-classic-rb2140',
    variants: [
      { color: 'Black', colorHex: '#000000', images: ['/img/products/rayban_wayfarer_1776925095455.png'], stock: 20, sku: 'RB-2140-BLK' },
    ],
    features: ['100% UV Protection', 'Polarized Crystal Lenses'],
    description: 'The original Wayfarer — universal and timeless.',
    isFeatured: true, isBestseller: true,
  },
  {
    name: 'Ray-Ban Aviator Classic RB3025',
    brand: 'Ray-Ban', category: 'Sunglasses',
    gender: 'Unisex', frameShape: 'Aviator', frameMaterial: 'Metal', frameWidth: 'Medium',
    price: 9200, comparePrice: 12500, discount: 26,
    slug: 'ray-ban-aviator-classic-rb3025',
    variants: [
      { color: 'Gold Green', colorHex: '#FFD700', images: ['/img/products/rayban_aviator_1776925112753.png'], stock: 18, sku: 'RB-3025-GLD' },
    ],
    features: ['Polarized Lenses', 'Gold Plated Metal Frame'],
    description: 'Born from the military, worn by legends.',
    isFeatured: true, isBestseller: true,
  }
];

const sampleBanners = [
  {
    title: 'See the World in Clarity',
    subtitle: 'Up to 60% off on Premium Eyewear',
    imageUrl: '/img/img1.jpg',
    link: '/products',
    buttonText: 'Shop Now',
    position: 'hero', order: 1, isActive: true, bgColor: '#00AEEF'
  },
];

async function seed() {
  // Clear existing data
  await Product.deleteMany({});
  await Banner.deleteMany({});
  await User.deleteMany({ email: { $in: ['admin@lensforeyesight.com', 'demo@example.com'] } });

  // Insert data
  await Product.insertMany(sampleProducts);
  await Banner.insertMany(sampleBanners);

  // Create users
  await User.create({
    name: 'Lens Admin',
    email: 'admin@lensforeyesight.com',
    phone: '9999999999',
    password: 'Admin@123',
    role: 'admin'
  });

  await User.create({
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '8888888888',
    password: 'Demo@123',
    role: 'user'
  });
}

module.exports = seed;

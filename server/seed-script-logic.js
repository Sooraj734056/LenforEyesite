const Product = require('./models/Product');
const User = require('./models/User');
const Banner = require('./models/Banner');

const sampleProducts = [
  // ─── RAY-BAN ───────────────────────────────────────────────
  {
    name: 'Ray-Ban Wayfarer Classic RB2140',
    brand: 'Ray-Ban', category: 'Sunglasses',
    gender: 'Unisex', frameShape: 'Wayfarer', frameMaterial: 'Acetate', frameWidth: 'Medium',
    price: 8500, comparePrice: 11000, discount: 23,
    slug: 'ray-ban-wayfarer-classic-rb2140',
    variants: [
      { color: 'Black', colorHex: '#000000', images: ['/img/products/rayban_wayfarer.png'], stock: 20, sku: 'RB-2140-BLK' },
      { color: 'Tortoise', colorHex: '#8B4513', images: ['/img/products/rayban_wayfarer.png'], stock: 15, sku: 'RB-2140-TRT' }
    ],
    features: ['100% UV Protection', 'Polarized Crystal Lenses', 'Classic Acetate Frame', 'Iconic Wayfarer Shape'],
    description: 'The original Wayfarer — worn by icons from Audrey Hepburn to Bob Dylan. Bold, universal and timeless.',
    isFeatured: true, isBestseller: true,
    tags: ['wayfarer', 'sunglasses', 'polarized', 'iconic', 'uv protection', 'classic'],
  },
  {
    name: 'Ray-Ban Aviator Classic RB3025',
    brand: 'Ray-Ban', category: 'Sunglasses',
    gender: 'Unisex', frameShape: 'Aviator', frameMaterial: 'Metal', frameWidth: 'Medium',
    price: 9200, comparePrice: 12500, discount: 26,
    slug: 'ray-ban-aviator-classic-rb3025',
    variants: [
      { color: 'Gold Green', colorHex: '#FFD700', images: ['/img/products/rayban_aviator.png'], stock: 18, sku: 'RB-3025-GLD' },
      { color: 'Silver Blue', colorHex: '#C0C0C0', images: ['/img/products/rayban_aviator.png'], stock: 12, sku: 'RB-3025-SLV' }
    ],
    features: ['Polarized Green/Blue Lenses', 'Gold Plated Metal Frame', 'Military Origin Design', '100% UV Protection'],
    description: 'Born from the military, worn by legends. The Aviator is the original Ray-Ban — bold, commanding and beautifully crafted.',
    isFeatured: true, isBestseller: true,
    tags: ['aviator', 'sunglasses', 'polarized', 'gold', 'metal', 'military'],
  },
  {
    name: 'Ray-Ban Round Metal RB3447',
    brand: 'Ray-Ban', category: 'Sunglasses',
    gender: 'Unisex', frameShape: 'Round', frameMaterial: 'Metal', frameWidth: 'Narrow',
    price: 7800, comparePrice: 10500, discount: 26,
    slug: 'ray-ban-round-metal-rb3447',
    variants: [
      { color: 'Bronze Gold', colorHex: '#CD7F32', images: ['/img/products/rayban_aviator.png'], stock: 14, sku: 'RB-3447-BRZ' },
    ],
    features: ['Retro Round Shape', 'Metal Frame', '100% UV Protection', 'Crystal Clear Lenses'],
    description: 'A tribute to the free-thinking artists of the 1960s, the Round Metal is a philosophical frame that makes a timeless statement.',
    isFeatured: true, isNewArrival: true,
    tags: ['round', 'sunglasses', 'retro', 'metal', 'vintage'],
  },

  // ─── VOGUE ──────────────────────────────────────────────────
  {
    name: 'Vogue Cat Eye Signature VO5576',
    brand: 'Vogue', category: 'Eyeglasses',
    gender: 'Women', frameShape: 'Cat-Eye', frameMaterial: 'Acetate', frameWidth: 'Medium',
    price: 4200, comparePrice: 6500, discount: 35,
    slug: 'vogue-cat-eye-signature-vo5576',
    variants: [
      { color: 'Tortoise Gold', colorHex: '#C68E18', images: ['/img/products/vogue_cateye.png'], stock: 22, sku: 'VG-CAT-GLD' },
      { color: 'Black', colorHex: '#000000', images: ['/img/products/vogue_cateye.png'], stock: 18, sku: 'VG-CAT-BLK' }
    ],
    features: ['Premium Acetate', 'Feminine Cat-Eye Silhouette', 'Spring Hinges', 'Made in Italy'],
    description: 'Chic and feminine cat-eye frames that command attention. A fashion statement for the modern woman.',
    isFeatured: true, isNewArrival: true,
    tags: ['cat-eye', 'women', 'gold', 'fashionable', 'acetate', 'italian'],
  },
  {
    name: 'Vogue Butterfly VO5454',
    brand: 'Vogue', category: 'Sunglasses',
    gender: 'Women', frameShape: 'Cat-Eye', frameMaterial: 'Acetate', frameWidth: 'Wide',
    price: 4800, comparePrice: 7000, discount: 31,
    slug: 'vogue-butterfly-vo5454',
    variants: [
      { color: 'Pink Glitter', colorHex: '#FF69B4', images: ['/img/products/vogue_cateye.png'], stock: 16, sku: 'VG-BUT-PNK' },
    ],
    features: ['Oversized Butterfly Shape', 'UV400 Protection', 'Gradient Lens', 'Light Acetate Frame'],
    description: 'Bold, glamorous oversized butterfly shades for the woman who loves making an entrance.',
    isNewArrival: true,
    tags: ['butterfly', 'sunglasses', 'women', 'oversized', 'glamour'],
  },

  // ─── FASTRACK ────────────────────────────────────────────────
  {
    name: 'Fastrack Sport Blue Cut Computer Glasses',
    brand: 'Fastrack', category: 'Computer Glasses',
    gender: 'Men', frameShape: 'Rectangle', frameMaterial: 'TR90', frameWidth: 'Wide',
    price: 999, comparePrice: 1599, discount: 38,
    slug: 'fastrack-sport-blue-cut-computer',
    variants: [
      { color: 'Blue', colorHex: '#00AEEF', images: ['/img/products/fastrack_sport.png'], stock: 60, sku: 'FT-CG-001-BLU' },
      { color: 'Black', colorHex: '#111111', images: ['/img/products/fastrack_sport.png'], stock: 45, sku: 'FT-CG-001-BLK' }
    ],
    features: ['Blue Light Blocking', 'Anti-Glare Coating', 'Flexible TR90 Frame', 'Lightweight Design'],
    description: 'Protect your eyes from harmful screen light with Fastrack\'s sporty and flexible computer glasses.',
    isNewArrival: true,
    tags: ['computer', 'blue cut', 'screen', 'office', 'sport', 'tr90'],
  },
  {
    name: 'Fastrack Neon Rectangular Sunglasses',
    brand: 'Fastrack', category: 'Sunglasses',
    gender: 'Men', frameShape: 'Rectangle', frameMaterial: 'TR90', frameWidth: 'Wide',
    price: 1299, comparePrice: 1999, discount: 35,
    slug: 'fastrack-neon-rectangular-sunglasses',
    variants: [
      { color: 'Neon Green', colorHex: '#39FF14', images: ['/img/products/fastrack_sport.png'], stock: 35, sku: 'FT-SUN-NEO-GRN' },
      { color: 'Red', colorHex: '#FF0000', images: ['/img/products/fastrack_sport.png'], stock: 28, sku: 'FT-SUN-RED' }
    ],
    features: ['UV400 Protection', 'Polarized Option', 'Bold Sporty Design', 'Rubber Grip Temples'],
    description: 'Bold and bright — Fastrack\'s neon frames for those who refuse to blend in.',
    isBestseller: true,
    tags: ['sunglasses', 'neon', 'sport', 'bold', 'men', 'youth'],
  },

  // ─── ZEISS ────────────────────────────────────────────────
  {
    name: 'Zeiss Blue Protect Premium Computer Glasses',
    brand: 'Zeiss', category: 'Computer Glasses',
    gender: 'Unisex', frameShape: 'Rectangle', frameMaterial: 'TR90', frameWidth: 'Medium',
    price: 5999, comparePrice: 8999, discount: 33,
    slug: 'zeiss-blue-protect-premium-computer',
    variants: [
      { color: 'Black Matte', colorHex: '#1a1a1a', images: ['/img/products/zeiss_computer.png'], stock: 15, sku: 'ZS-BP-BLK' },
      { color: 'Gunmetal', colorHex: '#636363', images: ['/img/products/zeiss_computer.png'], stock: 10, sku: 'ZS-BP-GMT' }
    ],
    features: ['Zeiss BlueGuard Technology', 'UV Protection Up to 400nm', 'DuraVision Platinum Coating', 'Anti-Reflection & Anti-Static'],
    description: 'Clinically proven Zeiss BlueGuard technology blocks up to 40% of blue light without color distortion.',
    isFeatured: true, isBestseller: true,
    tags: ['zeiss', 'premium', 'blue light', 'computer', 'optical', 'german'],
  },
  {
    name: 'Zeiss Titanium Classic Eyeglasses',
    brand: 'Zeiss', category: 'Eyeglasses',
    gender: 'Men', frameShape: 'Rectangle', frameMaterial: 'Titanium', frameWidth: 'Medium',
    price: 7500, comparePrice: 11000, discount: 32,
    slug: 'zeiss-titanium-classic-eyeglasses',
    variants: [
      { color: 'Dark Gunmetal', colorHex: '#414A4C', images: ['/img/products/zeiss_computer.png'], stock: 8, sku: 'ZS-TI-GMT' }
    ],
    features: ['Pure Titanium Frame', 'Featherweight Comfort', 'Zeiss Precision Optics', '2 Year Warranty'],
    description: 'German engineering meets Italian design. Zeiss Titanium frames for the discerning professional.',
    isFeatured: true,
    tags: ['zeiss', 'titanium', 'premium', 'men', 'rectangle', 'professional'],
  },

  // ─── VINCENT CHASE ──────────────────────────────────────────
  {
    name: 'Vincent Chase Matte Black Classic',
    brand: 'Vincent Chase', category: 'Eyeglasses',
    gender: 'Men', frameShape: 'Rectangle', frameMaterial: 'TR90', frameWidth: 'Medium',
    price: 1299, comparePrice: 2499, discount: 48,
    slug: 'vincent-chase-matte-black-classic',
    variants: [
      { color: 'Matte Black', colorHex: '#1a1a1a', images: ['/img/products/vincent_chase_titanium.png'], stock: 45, sku: 'VC-001-MB' },
      { color: 'Navy Blue', colorHex: '#000080', images: ['/img/products/vincent_chase_titanium.png'], stock: 30, sku: 'VC-001-NVY' }
    ],
    features: ['Lightweight TR90', 'Blue Cut Lens Compatible', '6 Months Warranty', 'Anti-Scratch Coating'],
    description: 'Premium rectangle frames with a sleek matte black finish. Perfect for everyday professional use.',
    isFeatured: true, isBestseller: true,
    tags: ['rectangle', 'men', 'professional', 'matte', 'tr90', 'affordable'],
  },
  {
    name: 'Vincent Chase Rimless Elegance',
    brand: 'Vincent Chase', category: 'Eyeglasses',
    gender: 'Unisex', frameShape: 'Oval', frameMaterial: 'Titanium', frameWidth: 'Narrow',
    price: 2499, comparePrice: 4499, discount: 44,
    slug: 'vincent-chase-rimless-elegance',
    variants: [
      { color: 'Silver', colorHex: '#C0C0C0', images: ['/img/products/vincent_chase_titanium.png'], stock: 25, sku: 'VC-RIM-SLV' },
      { color: 'Gold', colorHex: '#FFD700', images: ['/img/products/vincent_chase_titanium.png'], stock: 18, sku: 'VC-RIM-GLD' }
    ],
    features: ['Ultra-Light Titanium', 'Rimless Design', 'Spring Hinges', 'Adjustable Nose Pads'],
    description: 'Sleek, invisible-looking rimless frames for those who want vision correction without compromising their look.',
    isFeatured: true, isNewArrival: true,
    tags: ['rimless', 'titanium', 'lightweight', 'unisex', 'elegant'],
  },

  // ─── JOHN JACOBS ────────────────────────────────────────────
  {
    name: 'John Jacobs Rose Gold Rimless',
    brand: 'John Jacobs', category: 'Eyeglasses',
    gender: 'Women', frameShape: 'Oval', frameMaterial: 'Metal', frameWidth: 'Narrow',
    price: 2199, comparePrice: 3999, discount: 45,
    slug: 'john-jacobs-rose-gold-rimless',
    variants: [
      { color: 'Rose Gold', colorHex: '#B76E79', images: ['/img/products/johnjacobs_rosegold.png'], stock: 30, sku: 'JJ-001-RG' }
    ],
    features: ['Stainless Steel', 'Spring Hinge', 'Rimless Design', 'Adjustable Nose Pads'],
    description: 'Elegant rimless oval frames in a stunning rose gold finish. Ultra-lightweight for all-day comfort.',
    isFeatured: true, isNewArrival: true,
    tags: ['rimless', 'women', 'oval', 'rose gold', 'lightweight', 'elegant'],
  },
  {
    name: 'John Jacobs Bold Acetate Round',
    brand: 'John Jacobs', category: 'Eyeglasses',
    gender: 'Unisex', frameShape: 'Round', frameMaterial: 'Acetate', frameWidth: 'Medium',
    price: 3200, comparePrice: 5200, discount: 38,
    slug: 'john-jacobs-bold-acetate-round',
    variants: [
      { color: 'Havana Brown', colorHex: '#804000', images: ['/img/products/johnjacobs_rosegold.png'], stock: 20, sku: 'JJ-RND-HVN' },
      { color: 'Forest Green', colorHex: '#228B22', images: ['/img/products/johnjacobs_rosegold.png'], stock: 14, sku: 'JJ-RND-GRN' }
    ],
    features: ['Handcrafted Acetate', 'Bold Round Frame', 'Premium Hinges', 'Signature JJ Logo'],
    description: 'Statement round frames crafted from premium Italian acetate. A must-have for the fashion-forward individual.',
    isNewArrival: true,
    tags: ['round', 'acetate', 'bold', 'unisex', 'statement', 'premium'],
  },

  // ─── LENSKART ───────────────────────────────────────────────
  {
    name: 'Lenskart Air Signature Titanium',
    brand: 'Lenskart', category: 'Eyeglasses',
    gender: 'Unisex', frameShape: 'Round', frameMaterial: 'Titanium', frameWidth: 'Narrow',
    price: 3499, comparePrice: 5999, discount: 42,
    slug: 'lenskart-air-signature-titanium',
    variants: [
      { color: 'Silver', colorHex: '#C0C0C0', images: ['/img/products/lenskart_air_round.png'], stock: 25, sku: 'LK-AIR-SLV' },
      { color: 'Gold', colorHex: '#FFD700', images: ['/img/products/lenskart_air_round.png'], stock: 18, sku: 'LK-AIR-GLD' }
    ],
    features: ['Pure Titanium', 'Hypoallergenic', 'Anti-Rust', '1 Year Warranty', 'Spring Hinge'],
    description: 'Ultra-light titanium frames — wear them all day without the pressure. The signature Lenskart Air experience.',
    isFeatured: true, isBestseller: true,
    tags: ['titanium', 'round', 'lightweight', 'premium', 'unisex', 'air'],
  },

  // ─── KIDS ───────────────────────────────────────────────────
  {
    name: 'Kids Fun Collection - Purple Stars',
    brand: 'Vincent Chase', category: 'Kids',
    gender: 'Kids', frameShape: 'Round', frameMaterial: 'TR90', frameWidth: 'Narrow',
    price: 799, comparePrice: 1299, discount: 38,
    slug: 'kids-fun-purple-stars',
    variants: [
      { color: 'Purple', colorHex: '#9B59B6', images: ['/img/products/kids_purple_round.png'], stock: 40, sku: 'VC-KIDS-PRP' },
      { color: 'Red', colorHex: '#FF0000', images: ['/img/products/kids_purple_round.png'], stock: 35, sku: 'VC-KIDS-RED' },
      { color: 'Blue', colorHex: '#0000FF', images: ['/img/products/kids_purple_round.png'], stock: 38, sku: 'VC-KIDS-BLU' }
    ],
    features: ['Flexible TR90 Frame', 'Child-Safe Design', 'Anti-Scratch Lens', 'Spring Hinge'],
    description: 'Colorful, fun and flexible frames designed for active kids. Durable enough for school and play.',
    isFeatured: true,
    tags: ['kids', 'children', 'flexible', 'fun', 'purple', 'school', 'safe'],
  },
];

const sampleBanners = [
  {
    title: 'Premium Eyewear Collection',
    subtitle: 'Discover the perfect blend of style and clarity',
    imageUrl: '/img/banners/hero1.png',
    link: '/products',
    buttonText: 'Shop Now',
    position: 'hero', order: 1, isActive: true, bgColor: '#00AEEF'
  },
  {
    title: 'Free Home Eye Test in Jaipur',
    subtitle: 'Book your appointment today — it\'s free!',
    imageUrl: '/img/banners/hero2.png',
    link: '/contact',
    buttonText: 'Book Appointment',
    position: 'hero', order: 2, isActive: true, bgColor: '#0057A8'
  },
  {
    title: 'Zeiss & Crizal Lenses Available',
    subtitle: 'Premium lens brands at affordable prices',
    imageUrl: '/img/banners/hero3.png',
    link: '/products?brand=Zeiss',
    buttonText: 'Explore',
    position: 'hero', order: 3, isActive: true, bgColor: '#003580'
  },
];

async function seed() {
  await Product.deleteMany({});
  await Banner.deleteMany({});
  await User.deleteMany({ email: { $in: ['admin@lensforeyesight.com', 'demo@example.com'] } });

  await Product.insertMany(sampleProducts);
  await Banner.insertMany(sampleBanners);

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

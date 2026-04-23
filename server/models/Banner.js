const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  subtitle:    String,
  imageUrl:    { type: String, required: true },
  mobileImageUrl: String,
  link:        { type: String, default: '/products' },
  buttonText:  { type: String, default: 'Shop Now' },
  position:    { type: String, enum: ['hero', 'category', 'banner_bottom', 'popup'], default: 'hero' },
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
  validFrom:   Date,
  validTill:   Date,
  bgColor:     { type: String, default: '#00AEEF' },
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);

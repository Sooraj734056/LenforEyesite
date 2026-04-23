const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  color:      { type: String, required: true },
  colorHex:   { type: String, default: '#000000' },
  images:     [String],
  stock:      { type: Number, default: 0 },
  sku:        { type: String, unique: true, sparse: true }
});

const ReviewSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       String,
  rating:     { type: Number, min: 1, max: 5, required: true },
  comment:    String,
  images:     [String]
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  slug:           { type: String, unique: true },
  brand:          { type: String, required: true, enum: ['Ray-Ban', 'Zeiss', 'Crizal', 'Lenskart', 'Vogue', 'Fastrack', 'Vincent Chase', 'John Jacobs', 'Other'] },
  category:       { type: String, required: true, enum: ['Eyeglasses', 'Sunglasses', 'Contact Lenses', 'Computer Glasses', 'Reading Glasses', 'Kids'] },
  gender:         { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex'], default: 'Unisex' },
  frameShape:     { type: String, enum: ['Round', 'Square', 'Rectangle', 'Cat-Eye', 'Aviator', 'Wayfarer', 'Oval', 'Geometric', 'N/A'], default: 'Round' },
  frameWidth:     { type: String, enum: ['Narrow', 'Medium', 'Wide', 'N/A'], default: 'Medium' },
  frameMaterial:  { type: String, enum: ['Acetate', 'TR90', 'Metal', 'Titanium', 'Mixed', 'N/A'], default: 'TR90' },
  frameSize:      { type: String, enum: ['Small', 'Medium', 'Large', 'N/A'], default: 'Medium' },

  price:          { type: Number, required: true },
  comparePrice:   { type: Number },
  discount:       { type: Number, default: 0 }, // percentage

  variants:       [VariantSchema],
  features:       [String],
  description:    { type: String, default: '' },
  specifications: { type: Map, of: String },

  lensCompatible: { type: Boolean, default: true },
  isFeatured:     { type: Boolean, default: false },
  isNewArrival:   { type: Boolean, default: false },
  isBestseller:   { type: Boolean, default: false },

  reviews:        [ReviewSchema],
  ratings: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 }
  },

  tags:           [String],
  viewCount:      { type: Number, default: 0 },
  soldCount:      { type: Number, default: 0 },
}, { timestamps: true });

// Auto-calculate average rating
ProductSchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) { this.ratings = { average: 0, count: 0 }; return; }
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.ratings = { average: (sum / this.reviews.length).toFixed(1), count: this.reviews.length };
};

// Text search index
ProductSchema.index({ name: 'text', brand: 'text', tags: 'text', category: 'text' });
ProductSchema.index({ category: 1, brand: 1, price: 1 });

module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  description:   { type: String, default: '' },
  type:          { type: String, enum: ['percentage', 'flat'], required: true },
  value:         { type: Number, required: true }, // % or ₹
  minOrderAmount:{ type: Number, default: 0 },
  maxDiscount:   { type: Number, default: null }, // cap for percentage coupons
  usageLimit:    { type: Number, default: null }, // null = unlimited
  usedCount:     { type: Number, default: 0 },
  userLimit:     { type: Number, default: 1 }, // per user usage limit
  usedBy:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  validFrom:     { type: Date, default: Date.now },
  validTill:     { type: Date, required: true },
  applicableCategories: [String], // empty = all categories
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

CouponSchema.methods.isValid = function(userId, orderAmount) {
  const now = new Date();
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (now < this.validFrom) return { valid: false, message: 'Coupon not yet active' };
  if (now > this.validTill) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (orderAmount < this.minOrderAmount) return { valid: false, message: `Minimum order amount ₹${this.minOrderAmount} required` };
  const userUsage = this.usedBy.filter(id => id.toString() === userId.toString()).length;
  if (userUsage >= this.userLimit) return { valid: false, message: 'You have already used this coupon' };
  return { valid: true };
};

CouponSchema.methods.calculateDiscount = function(amount) {
  if (this.type === 'flat') return Math.min(this.value, amount);
  const disc = (amount * this.value) / 100;
  return this.maxDiscount ? Math.min(disc, this.maxDiscount) : disc;
};

module.exports = mongoose.model('Coupon', CouponSchema);

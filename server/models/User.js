const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, enum: ['Self', 'Spouse', 'Child', 'Parent', 'Other'], default: 'Other' },
  prescriptions: [{
    rightEye: { sph: String, cyl: String, axis: String, add: String },
    leftEye:  { sph: String, cyl: String, axis: String, add: String },
    pupillaryDistance: String,
    uploadedPhoto: String,
    addedAt: { type: Date, default: Date.now }
  }]
});

const AddressSchema = new mongoose.Schema({
  label:    { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  line1:    { type: String, required: true },
  line2:    String,
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
  isDefault:{ type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Name is required'], trim: true },
  email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  phone:    { type: String, unique: true, sparse: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:   { type: String, default: '' },
  addresses:       [AddressSchema],
  familyMembers:   [FamilyMemberSchema],
  wishlist:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  loyaltyPoints:   { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordToken:   String,
  resetPasswordExpire:  Date,
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
UserSchema.methods.getSignedJwt = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = mongoose.model('User', UserSchema);

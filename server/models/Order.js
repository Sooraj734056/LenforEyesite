const mongoose = require('mongoose');

const LensSchema = new mongoose.Schema({
  powerType:    { type: String, enum: ['Single Vision', 'Bifocal', 'Progressive', 'Zero Power'], required: true },
  package:      { type: String, enum: ['Basic', 'Basic Anti-Glare', 'Blue Cut', 'Photochromic', 'None'], required: true },
  price:        { type: Number, default: 0 },
  prescription: {
    rightEye:   { sph: String, cyl: String, axis: String, add: String },
    leftEye:    { sph: String, cyl: String, axis: String, add: String },
    pd:         String,
    uploadedPhoto: String,
    callForPower: { type: Boolean, default: false },
  }
});

const OrderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  variant:   { color: String, sku: String },
  quantity:  { type: Number, required: true, default: 1 },
  price:     { type: Number, required: true },
  lens:      LensSchema,
  image:     String,
});

const ShippingAddressSchema = new mongoose.Schema({
  fullName: String, phone: String,
  line1: String, line2: String,
  city: String, state: String, pincode: String
});

const StatusHistorySchema = new mongoose.Schema({
  status:    String,
  note:      String,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       [OrderItemSchema],
  
  shippingAddress: ShippingAddressSchema,
  
  itemsTotal:      { type: Number, required: true },
  lensTotal:       { type: Number, default: 0 },
  shippingCost:    { type: Number, default: 0 },
  discount:        { type: Number, default: 0 },
  tax:             { type: Number, default: 0 },
  grandTotal:      { type: Number, required: true },
  pointsEarned:    { type: Number, default: 0 },

  couponCode:      String,

  paymentMethod:   { type: String, enum: ['Razorpay', 'COD'], default: 'Razorpay' },
  paymentStatus:   { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,

  status: {
    type: String,
    enum: ['Order Placed', 'Payment Received', 'Prescription Verified', 'Lab Processing', 'Quality Check', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested'],
    default: 'Order Placed'
  },
  statusHistory: [StatusHistorySchema],

  trackingNumber:  String,
  courierName:     String,
  estimatedDelivery: Date,

  prescriptionVerified:  { type: Boolean, default: false },
  prescriptionNotes:     String,
  labNotes:              String,
  assignedTechnician:    String,

  invoiceUrl:      String,
  jobSheetPrinted: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-generate order number
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `LFE${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);

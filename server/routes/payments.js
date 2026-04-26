const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// POST /api/payments/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    // DEMO MODE: If keys are placeholders, return a dummy order
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('placeholder')) {
      return res.json({
        success: true,
        orderId: `order_DEMO_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        keyId: 'rzp_test_demo'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: { userId: req.user._id.toString() }
    };
    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Payment order creation failed.' });
  }
});

// POST /api/payments/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // DEMO MODE: Bypass signature check for demo orders
    if (razorpay_order_id.includes('DEMO')) {
      // Skip signature validation for demo
    } else {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder')
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
      }
    }

    // Update order payment status
    const order = await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'Paid',
      razorpayPaymentId: razorpay_payment_id,
      $push: { statusHistory: { status: 'Payment Received', note: `Payment confirmed: ${razorpay_payment_id}` } }
    }, { new: true });

    res.json({ success: true, message: 'Payment verified successfully.', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments/webhook (Razorpay webhook handler)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(JSON.stringify(body))
      .digest('hex');
    if (signature !== expectedSig) return res.status(400).send('Invalid signature');
    console.log('Razorpay webhook event:', body.event);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;

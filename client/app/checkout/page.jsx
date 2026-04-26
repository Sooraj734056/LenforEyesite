'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FaMapMarkerAlt, FaTruck, FaCreditCard, FaCheckCircle, FaLock, 
  FaBox, FaPhone, FaArrowRight, FaArrowLeft 
} from 'react-icons/fa';
import Link from 'next/link';
import styles from './page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

const STEPS = ['Address', 'Shipping', 'Payment'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'

  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: user?.phone || '',
    line1: '', line2: '', city: 'Jaipur', state: 'Rajasthan', pincode: ''
  });

  const subtotal = getTotal();
  const shipping = subtotal >= 1000 ? 0 : 99;
  const discount = couponDiscount;
  const tax = Math.round((subtotal + shipping - discount) * 0.18);
  const total = subtotal + shipping - discount + tax;
  const totalLens = items.reduce((acc, i) => acc + (i.lens?.price || 0) * i.quantity, 0);

  if (!user) return (
    <div className="flex-center" style={{ minHeight: 500, flexDirection: 'column', gap: 16 }}>
      <h2>Please login to checkout</h2>
      <Link href="/login" className="btn btn-primary">Login</Link>
    </div>
  );
  if (items.length === 0) return (
    <div className="flex-center" style={{ minHeight: 500, flexDirection: 'column', gap: 16 }}>
      <h2>Your cart is empty</h2>
      <Link href="/products" className="btn btn-primary">Shop Now</Link>
    </div>
  );

  const applyCoupon = async () => {
    try {
      const { data } = await axios.post(`${API}/coupons/validate`, { code: couponCode, orderAmount: subtotal },
        { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        setCouponDiscount(data.discount);
        setCouponApplied(couponCode);
        toast.success(`Coupon applied! You save ₹${data.discount}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async () => {
    setLoading(true);
    try {
      // HANDLE COD (Cash on Delivery)
      if (paymentMethod === 'COD') {
        const orderItems = items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          lens: item.lens,
          variant: { color: item.variantColor },
          image: item.image
        }));

        const { data: orderData } = await axios.post(`${API}/orders`, {
          items: orderItems,
          shippingAddress: address,
          couponCode: couponApplied,
          paymentMethod: 'COD'
        }, { headers: { Authorization: `Bearer ${token}` } });

        clearCart();
        toast.success('🎉 Order placed successfully (COD)!');
        router.push(`/account/orders?success=true&order=${orderData.order.orderNumber}`);
        return;
      }

      // Create Razorpay order on server
      const { data: rzpData } = await axios.post(`${API}/payments/create-order`, { amount: total },
        { headers: { Authorization: `Bearer ${token}` } });

      // CHECK IF DEMO MODE
      if (rzpData.orderId.includes('DEMO')) {
        toast.success('🚀 Demo Mode: Bypassing Razorpay...');
        
        // Directly create order
        const orderItems = items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          lens: item.lens,
          variant: { color: item.variantColor },
          image: item.image
        }));

        const { data: orderData } = await axios.post(`${API}/orders`, {
          items: orderItems,
          shippingAddress: address,
          couponCode: couponApplied,
          razorpayOrderId: rzpData.orderId,
          paymentMethod: 'Razorpay'
        }, { headers: { Authorization: `Bearer ${token}` } });

        // Auto-verify for demo
        await axios.post(`${API}/payments/verify`, {
          razorpay_order_id: rzpData.orderId,
          razorpay_payment_id: 'pay_DEMO_' + Date.now(),
          razorpay_signature: 'demo_sig',
          orderId: orderData.order._id
        }, { headers: { Authorization: `Bearer ${token}` } });

        clearCart();
        toast.success('🎉 Order placed successfully (Demo)!');
        router.push(`/account/orders?success=true&order=${orderData.order.orderNumber}`);
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) { 
        toast.error('Payment service unavailable. Please try again.'); 
        setLoading(false); 
        return; 
      }

      const options = {
        key: RAZORPAY_KEY,
        amount: rzpData.amount,
        currency: 'INR',
        name: 'Lens For Eyesight',
        description: `Order of ${items.length} item(s)`,
        order_id: rzpData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || address.phone
        },
        theme: { color: '#00AEEF' },
        handler: async (response) => {
          try {
            const orderItems = items.map(item => ({
              product: item.productId,
              quantity: item.quantity,
              price: item.price,
              lens: item.lens,
              variant: { color: item.variantColor },
              image: item.image
            }));

            const { data: orderData } = await axios.post(`${API}/orders`, {
              items: orderItems,
              shippingAddress: address,
              couponCode: couponApplied,
              razorpayOrderId: rzpData.orderId,
              paymentMethod: 'Razorpay'
            }, { headers: { Authorization: `Bearer ${token}` } });

            await axios.post(`${API}/payments/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order._id
            }, { headers: { Authorization: `Bearer ${token}` } });

            clearCart();
            toast.success('🎉 Order placed successfully!');
            router.push(`/account/orders?success=true&order=${orderData.order.orderNumber}`);
          } catch (err) {
            console.error('Order Error:', err);
            toast.error(err.response?.data?.message || 'Order confirmation failed. Please contact support.');
            setLoading(false);
          }
        },
        modal: { 
          ondismiss: () => { 
            setLoading(false); 
            toast.error('Payment cancelled'); 
          } 
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Order/Payment Error:', err);
      const msg = err.response?.data?.message || 'Order confirmation failed. Please try again.';
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.checkoutPage}>
        <h1 className={styles.checkoutTitle}>Secure Checkout</h1>

        {/* Steps */}
        <div className={styles.stepBar}>
          {STEPS.map((s, i) => (
            <div key={s} className={styles.stepItem}>
              <div className={`${styles.stepCircle} ${i < step ? styles.done : i === step ? styles.active : ''}`}>
                {i < step ? <FaCheckCircle /> : i + 1}
              </div>
              <span className={`${styles.stepName} ${i === step ? styles.stepNameActive : ''}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.lineFilled : ''}`} />}
            </div>
          ))}
        </div>

        <div className={styles.checkoutGrid}>
          {/* Left: Form */}
          <div className={styles.formSection}>
            {/* Step 0: Address */}
            {step === 0 && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}><FaMapMarkerAlt /> Delivery Address</h2>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} placeholder="As per ID" required id="addr-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input className="form-input" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" required id="addr-phone" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address Line 1 *</label>
                    <input className="form-input" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} placeholder="House/Flat No, Street, Area" required id="addr-line1" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address Line 2</label>
                    <input className="form-input" value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} placeholder="Landmark (optional)" id="addr-line2" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input className="form-input" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required id="addr-city" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} id="addr-state" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input className="form-input" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} placeholder="302004" maxLength="6" required id="addr-pincode" />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => setStep(1)}
                  disabled={!address.fullName || !address.phone || !address.line1 || !address.pincode}
                  id="addr-continue" style={{ width: '100%', marginTop: 16 }}>
                  Continue to Shipping →
                </button>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}><FaTruck /> Shipping Method</h2>
                <div className={styles.shippingOptions}>
                  <div className={`${styles.shippingOpt} ${styles.shippingOptActive}`}>
                    <div className={styles.shippingInfo}>
                      <div className={styles.shippingName}>Standard Delivery</div>
                      <div className={styles.shippingDays}>5–7 business days</div>
                    </div>
                    <div className={styles.shippingPrice}>{shipping === 0 ? <span className={styles.free}>FREE</span> : `₹${shipping}`}</div>
                  </div>
                  <div className={styles.shippingOpt}>
                    <div className={styles.shippingInfo}>
                      <div className={styles.shippingName}>Express Delivery</div>
                      <div className={styles.shippingDays}>2–3 business days</div>
                    </div>
                    <div className={styles.shippingPrice}>₹199</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(2)} style={{ flex: 1 }} id="ship-continue">Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}><FaCreditCard /> Payment</h2>

                {/* Coupon */}
                <div className={styles.couponWrap}>
                  <input className="form-input" placeholder="Enter coupon code" value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())} style={{ flex: 1 }} id="coupon-input" />
                  <button className="btn btn-outline" onClick={applyCoupon} id="apply-coupon">Apply</button>
                </div>
                {couponApplied && <div className={styles.couponSuccess}><FaCheckCircle /> Coupon "{couponApplied}" applied. You save ₹{couponDiscount}!</div>}

                {/* Payment Methods */}
                <div className={styles.paymentMethods}>
                  <div 
                    className={`${styles.payMethod} ${paymentMethod === 'Razorpay' ? styles.payMethodActive : ''}`}
                    onClick={() => setPaymentMethod('Razorpay')}
                    id="pay-online"
                  >
                    <div className={styles.payMethodCheck}>
                      <div className={styles.checkCircle}>{paymentMethod === 'Razorpay' && <div className={styles.checkDot} />}</div>
                    </div>
                    <div className={styles.payMethodInfo}>
                      <div className={styles.payMethodTitle}>Pay Online (Safe & Secure)</div>
                      <div className={styles.payMethodDesc}>UPI, Cards, Net Banking, Wallets</div>
                    </div>
                    <div className={styles.payMethodIcons} style={{ pointerEvents: 'none' }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" height="12" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" height="10" />
                    </div>
                  </div>

                  <div 
                    className={`${styles.payMethod} ${paymentMethod === 'COD' ? styles.payMethodActive : ''}`}
                    onClick={() => setPaymentMethod('COD')}
                    id="pay-cod"
                  >
                    <div className={styles.payMethodCheck}>
                      <div className={styles.checkCircle}>{paymentMethod === 'COD' && <div className={styles.checkDot} />}</div>
                    </div>
                    <div className={styles.payMethodInfo}>
                      <div className={styles.payMethodTitle}>Cash on Delivery (COD)</div>
                      <div className={styles.payMethodDesc}>Pay when your order arrives at your door</div>
                    </div>
                    <div className={styles.payMethodPrice}>+ ₹49 fee</div>
                  </div>
                </div>

                <div className={styles.razorpayNote}>
                  {paymentMethod === 'Razorpay' ? (
                    <><FaLock /> Secured by Razorpay. Your payment info is encrypted and never stored.</>
                  ) : (
                    <><FaBox /> ₹49 COD handling fee will be added to your total.</>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handlePayment} disabled={loading}
                    style={{ flex: 1 }} id="pay-btn">
                    {loading ? 'Processing...' : paymentMethod === 'COD' ? `Confirm COD Order (₹${(total + 49).toLocaleString('en-IN')}) →` : `Pay ₹${total.toLocaleString('en-IN')} →`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              <div className={styles.summaryItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <img src={resolveMediaUrl(item.image) || 'https://placehold.co/56x42/0A0A0A/00AEEF?text=F'} alt={item.productName} className={styles.summaryImg} />
                    <div className={styles.summaryItemInfo}>
                      <div className={styles.summaryItemName}>{item.productName}</div>
                      <div className={styles.summaryItemMeta}>
                        {item.variantColor} · Qty: {item.quantity}
                        {item.lens && <div className={styles.summaryLens}>+ {item.lens.powerType} ({item.lens.package})</div>}
                      </div>
                    </div>
                    <div className={styles.summaryItemPrice}>₹{((item.price + (item.lens?.price || 0)) * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              <hr className="divider" />
              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}><span>Frame Total</span><span>₹{(subtotal - totalLens).toLocaleString('en-IN')}</span></div>
                {totalLens > 0 && <div className={styles.summaryLine}><span>Lens Total</span><span>₹{totalLens.toLocaleString('en-IN')}</span></div>}
                <div className={styles.summaryLine}><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `₹${shipping}`}</span></div>
                {discount > 0 && <div className={`${styles.summaryLine} ${styles.discountLine}`}><span>Coupon Discount</span><span>-₹{discount}</span></div>}
                <div className={styles.summaryLine}><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
              </div>
              <hr className="divider" />
              <div className={styles.totalLine}>
                <span>Total</span>
                <span className={styles.totalAmount}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Address Summary */}
            {step > 0 && (
              <div className={`${styles.summaryCard} ${styles.addrSummary}`}>
                <h4><FaMapMarkerAlt /> Delivery To</h4>
                <p>{address.fullName}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
                <p><FaPhone /> {address.phone}</p>
                <button className={styles.editAddr} onClick={() => setStep(0)}>Edit</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

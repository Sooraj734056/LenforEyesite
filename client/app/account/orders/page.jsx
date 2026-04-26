'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCreditCard, FaClipboardCheck, FaMicroscope, FaSearch, FaTruck, 
  FaCheckCircle, FaBoxOpen, FaShoppingBag 
} from 'react-icons/fa';
import styles from './page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const STATUS_STEPS = [
  { id: 'Payment Received', icon: <FaCreditCard /> },
  { id: 'Prescription Verified', icon: <FaClipboardCheck /> },
  { id: 'Lab Processing', icon: <FaMicroscope /> },
  { id: 'Quality Check', icon: <FaSearch /> },
  { id: 'Shipped', icon: <FaTruck /> },
  { id: 'Delivered', icon: <FaCheckCircle /> }
];

export default function OrdersPage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { setOrders(data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await axios.put(`${API}/orders/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Order cancelled successfully');
      setOrders(orders.map(o => o._id === id ? { ...o, status: 'Cancelled' } : o));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (!user) return <div className="flex-center" style={{ minHeight: 400 }}><Link href="/login" className="btn btn-primary">Login to view orders</Link></div>;

  const STATUS_COLORS = {
    'Payment Received': '#F59E0B', 'Prescription Verified': '#3B82F6',
    'Lab Processing': '#8B5CF6', 'Quality Check': '#06B6D4',
    'Shipped': '#00AEEF', 'Delivered': '#10B981', 'Cancelled': '#EF4444'
  };

  const PAY_COLORS = {
    'Paid': '#10B981', 'Pending': '#F59E0B', 'Failed': '#EF4444'
  };

  const StatusTimeline = ({ order }) => {
    const currentIdx = STATUS_STEPS.findIndex(s => s.id === order.status);
    return (
      <div className={styles.timeline}>
        {STATUS_STEPS.map((step, i) => (
          <motion.div 
            key={step.id} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${styles.timelineStep} ${i <= currentIdx ? styles.timelineActive : ''}`}
          >
            <div className={styles.timelineDot} style={{ color: i <= currentIdx ? STATUS_COLORS[step.id] : undefined }}>
              {step.icon}
            </div>
            <div className={styles.timelineInfo}>
              <div className={styles.timelineStatus}>{step.id}</div>
              {i <= currentIdx && <div className={styles.timelineDate}>Completed</div>}
            </div>
            {i < STATUS_STEPS.length - 1 && <div className={`${styles.timelineLine} ${i <= currentIdx ? styles.lineActive : ''}`} />}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '32px 24px 64px' }}>
      <div className={styles.pageHeader}>
        <div>
          <h1>My Orders</h1>
          <p>{orders.length} orders placed</p>
        </div>
        <Link href="/products" className="btn btn-primary btn-sm">+ Shop More</Link>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: 300 }}><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><FaBoxOpen /></div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link href="/products" className="btn btn-primary">Browse Eyewear</Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderNum}>Order #{order.orderNumber}</div>
                <div className={styles.badges}>
                  <span className="badge" style={{ background: `${STATUS_COLORS[order.status]}18`, color: STATUS_COLORS[order.status] }}>{order.status}</span>
                  <span className="badge" style={{ background: `${PAY_COLORS[order.paymentStatus]}18`, color: PAY_COLORS[order.paymentStatus], fontSize: '0.7rem' }}>
                    {order.paymentStatus === 'Paid' ? <><FaCreditCard /> Paid</> : <><FaShoppingBag /> Payment Pending</>}
                  </span>
                </div>
                <div className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div className={styles.orderItems}>
                {order.items?.map((item, i) => (
                  <div key={i} className={styles.orderItem}>
                    <img src={resolveMediaUrl(item.image) || `https://placehold.co/64x48/0A0A0A/00AEEF?text=F`} alt={item.productName} className={styles.itemImg} />
                    <div className={styles.itemDetails}>
                      <div className={styles.itemName}>{item.productName}</div>
                      <div className={styles.itemMeta}>{item.variant?.color} · Qty: {item.quantity}</div>
                      {item.lens && <div className={styles.lensTag}><FaSearch /> {item.lens.powerType} — {item.lens.package}</div>}
                    </div>
                    <div className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  <span>Total: </span>
                  <strong>₹{order.grandTotal?.toLocaleString('en-IN')}</strong>
                </div>
                {order.trackingNumber && (
                  <div className={styles.tracking}>🚚 Tracking: <strong>{order.trackingNumber}</strong> via {order.courierName}</div>
                )}
                <div className={styles.orderActions}>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelected(selected?._id === order._id ? null : order)}>
                    {selected?._id === order._id ? 'Hide Details' : 'Track Order'}
                  </button>
                  {['Order Placed', 'Payment Received'].includes(order.status) && (
                    <button 
                      className="btn btn-outline btn-sm" 
                      style={{ borderColor: '#EF4444', color: '#EF4444' }}
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
              {selected?._id === order._id && (
                <div className={styles.trackSection}>
                  <h4>Order Timeline</h4>
                  <StatusTimeline order={order} />
                  <div className={styles.addressBox}>
                    <h5>Delivery Address</h5>
                    <p>{order.shippingAddress?.fullName}</p>
                    <p>{order.shippingAddress?.line1}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

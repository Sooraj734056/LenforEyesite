'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import { resolveMediaUrl } from '@/lib/media';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './page.module.css';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const STATUS_STEPS = [
  { id: 'Payment Received', icon: '💰' },
  { id: 'Prescription Verified', icon: '📋' },
  { id: 'Lab Processing', icon: '🔬' },
  { id: 'Quality Check', icon: '🔍' },
  { id: 'Shipped', icon: '🚚' },
  { id: 'Delivered', icon: '✅' }
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
          <div key={step.id} className={`${styles.timelineStep} ${i <= currentIdx ? styles.timelineActive : ''}`}>
            <div className={styles.timelineDot} style={{ color: i <= currentIdx ? STATUS_COLORS[step.id] : undefined }}>
              {step.icon}
            </div>
            <div className={styles.timelineInfo}>
              <div className={styles.timelineStatus}>{step.id}</div>
              {i <= currentIdx && <div className={styles.timelineDate}>Updated</div>}
            </div>
            {i < STATUS_STEPS.length - 1 && <div className={`${styles.timelineLine} ${i < currentIdx ? styles.lineActive : ''}`} />}
          </div>
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
          <div className={styles.emptyIcon}>📦</div>
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
                    {order.paymentStatus === 'Paid' ? '💳 Paid' : '⏳ Payment Pending'}
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
                      {item.lens && <div className={styles.lensTag}>🔭 {item.lens.powerType} — {item.lens.package}</div>}
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
                <button className="btn btn-outline btn-sm" onClick={() => setSelected(selected?._id === order._id ? null : order)}>
                  {selected?._id === order._id ? 'Hide Details' : 'Track Order'}
                </button>
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

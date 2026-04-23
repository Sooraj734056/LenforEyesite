'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import styles from './page.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Products', href: '/admin/products', icon: '👓' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Marketing', href: '/admin/marketing', icon: '🎯' },
  { label: 'Back to Store', href: '/', icon: '🏪' },
];

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setStats(data.stats);
        setRevenueChart(data.revenueChart);
        setCategoryRevenue(data.categoryRevenue);
        setRecentOrders(data.recentOrders);
        setTopProducts(data.topProducts);
        setLowStock(data.lowStockProducts);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [token]);

  if (!user || user.role !== 'admin') return (
    <div className="flex-center" style={{ minHeight: 500, flexDirection: 'column', gap: 16 }}>
      <h2>Admin Access Required</h2>
      <Link href="/" className="btn btn-primary">Go Home</Link>
    </div>
  );

  const chartColors = { primary: '#00AEEF', success: '#10B981', warning: '#F59E0B', error: '#EF4444' };

  const revenueData = {
    labels: revenueChart.map(d => new Date(d._id).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Revenue (₹)',
      data: revenueChart.map(d => d.revenue),
      borderColor: chartColors.primary,
      backgroundColor: 'rgba(0,174,239,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: chartColors.primary,
    }]
  };

  const categoryData = {
    labels: categoryRevenue.slice(0, 6).map(c => c._id),
    datasets: [{
      data: categoryRevenue.slice(0, 6).map(c => c.revenue),
      backgroundColor: ['#00AEEF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
    }]
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
  };

  const STATUS_COLORS = {
    'Payment Received': 'badge-warning', 'Prescription Verified': 'badge-primary',
    'Lab Processing': 'badge-primary', 'Quality Check': 'badge-primary',
    'Shipped': 'badge-success', 'Delivered': 'badge-success', 'Cancelled': 'badge-error'
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandIcon}>👓</div>
          <div>
            <div className={styles.brandName}>Lens Admin</div>
            <div className={styles.brandSub}>Control Panel</div>
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${item.href === '/admin' ? styles.navActive : ''}`} id={`admin-nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarUser}>
          <div className={styles.userAvatar}>{user.name[0]}</div>
          <div>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userRole}>Administrator</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <p className={styles.pageDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className={styles.topActions}>
            <Link href="/admin/products" className="btn btn-primary btn-sm" id="add-product-btn">+ Add Product</Link>
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: 400 }}><div className="spinner" /></div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              {[
                { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#00AEEF', sub: 'All time' },
                { label: 'Total Orders', value: (stats?.totalOrders || 0).toLocaleString(), icon: '📦', color: '#10B981', sub: `${stats?.todayOrders || 0} today` },
                { label: 'Total Customers', value: (stats?.totalUsers || 0).toLocaleString(), icon: '👥', color: '#8B5CF6', sub: 'Registered users' },
                { label: 'Total Products', value: (stats?.totalProducts || 0).toLocaleString(), icon: '👓', color: '#F59E0B', sub: 'Active listings' },
                { label: "Pending Prescriptions", value: (stats?.pendingPrescriptions || 0).toLocaleString(), icon: '📋', color: '#EF4444', sub: 'Need verification' },
                { label: "Pending Appointments", value: (stats?.pendingAppointments || 0).toLocaleString(), icon: '📅', color: '#EC4899', sub: 'Eye test requests' },
              ].map(s => (
                <div key={s.label} className={styles.statCard} id={`stat-${s.label.toLowerCase().replace(/\s/g, '-')}`}>
                  <div className={styles.statIcon} style={{ background: `${s.color}18` }}>
                    <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{s.value}</div>
                    <div className={styles.statLabel}>{s.label}</div>
                    <div className={styles.statSub}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className={styles.chartsRow}>
              {/* Revenue Chart */}
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <h3>Revenue (Last 7 Days)</h3>
                  <span className={styles.chartSub}>₹{(stats?.weekOrders || 0)} orders this week</span>
                </div>
                <div className={styles.chartWrap}>
                  <Line data={revenueData} options={chartOptions} />
                </div>
              </div>

              {/* Category Split */}
              <div className={styles.chartCard} style={{ flex: '0 0 280px' }}>
                <div className={styles.chartHeader}>
                  <h3>By Category</h3>
                </div>
                <div className={styles.chartWrap} style={{ height: 220 }}>
                  <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }} />
                </div>
              </div>
            </div>

            {/* Tables Row */}
            <div className={styles.tablesRow}>
              {/* Recent Orders */}
              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h3>Recent Orders</h3>
                  <Link href="/admin/orders" className={styles.viewAll}>View All →</Link>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td><Link href={`/admin/orders?id=${order._id}`} className={styles.orderLink}>{order.orderNumber}</Link></td>
                          <td>{order.user?.name || '—'}</td>
                          <td className={styles.amount}>₹{order.grandTotal?.toLocaleString('en-IN')}</td>
                          <td><span className={`badge ${STATUS_COLORS[order.status] || 'badge-dark'}`}>{order.status}</span></td>
                          <td className={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock */}
              <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                  <h3>⚠️ Low Stock Alert</h3>
                  <Link href="/admin/products" className={styles.viewAll}>Manage →</Link>
                </div>
                {lowStock.length === 0 ? (
                  <div className={styles.noData}>✅ All products well stocked</div>
                ) : (
                  <div className={styles.alertList}>
                    {lowStock.map(p => (
                      <div key={p._id} className={styles.alertItem}>
                        <div className={styles.alertName}>{p.name}</div>
                        <div className={styles.alertBrand}>{p.brand}</div>
                        {p.variants?.map(v => (
                          <span key={v.color} className={styles.alertStock}>
                            {v.color}: {v.stock} left
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className={styles.tableCard}>
              <div className={styles.tableHeader}>
                <h3>🏆 Top Selling Products</h3>
              </div>
              <div className={styles.topList}>
                {topProducts.map((p, i) => (
                  <div key={p._id} className={styles.topItem}>
                    <span className={styles.topRank}>#{i + 1}</span>
                    <div className={styles.topInfo}>
                      <div className={styles.topName}>{p.name}</div>
                      <div className={styles.topBrand}>{p.brand} · ₹{p.price?.toLocaleString('en-IN')}</div>
                    </div>
                    <div className={styles.topSold}>{p.soldCount} sold</div>
                    <div className={styles.topRating}>⭐ {p.ratings?.average || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

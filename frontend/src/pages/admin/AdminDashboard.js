import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardStats } from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STATUS_COLORS_MAP = { Pending: '#f59e0b', Confirmed: '#3b82f6', Processing: '#8b5cf6', Shipped: '#06b6d4', Delivered: '#10b981', Cancelled: '#ef4444', Returned: '#f97316' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex-center" style={{ height: 400 }}><div className="spinner" /></div>;
  if (!data) return null;

  const { stats, recentOrders = [], topProducts = [], ordersByStatus = [], monthlyRevenue = [], lowStockProducts = [] } = data;

  const revenueChartData = monthlyRevenue.map(m => ({
    name: MONTHS[(m._id.month - 1)],
    revenue: m.revenue,
    orders: m.orders
  }));

  const pieData = ordersByStatus.map(s => ({ name: s._id, value: s.count, color: STATUS_COLORS_MAP[s._id] || '#9ca3af' }));

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 6 }}>Dashboard</h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#2d6a4f', bg: '#f0fdf4', change: `₹${(stats.monthRevenue || 0).toLocaleString('en-IN')} this month` },
          { label: 'Total Orders', value: stats.totalOrders || 0, icon: '📦', color: '#3b82f6', bg: '#eff6ff', change: `${stats.monthOrders || 0} this month` },
          { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: '#8b5cf6', bg: '#f5f3ff', change: 'Registered users' },
          { label: 'Active Products', value: stats.totalProducts || 0, icon: '🌱', color: '#f59e0b', bg: '#fffbeb', change: `${stats.pendingOrders || 0} pending orders` },
        ].map((card) => (
          <div key={card.label} style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{card.label}</span>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>{card.value}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{card.change}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
        {/* Revenue Chart */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 24 }}>Revenue Overview</h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueChartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#2d6a4f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-center" style={{ height: 240, color: '#9ca3af', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 40 }}>📊</span>
              <span>No revenue data yet</span>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 24 }}>Orders by Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                {pieData.map(item => (
                  <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 99, background: item.color }} />
                      <span style={{ color: '#4b5563' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-center" style={{ height: 240, color: '#9ca3af', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 40 }}>📦</span><span>No orders yet</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}>Recent Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: 13, color: '#2d6a4f', fontWeight: 600 }}>View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af' }}>No orders yet</div>
          ) : recentOrders.slice(0, 6).map(order => (
            <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>#{order.orderNumber}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{order.user?.name || 'User'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#2d6a4f', fontSize: 14 }}>₹{order.totalPrice?.toFixed(0)}</div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                  background: `${STATUS_COLORS_MAP[order.status]}20`,
                  color: STATUS_COLORS_MAP[order.status] || '#6b7280'
                }}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right column: Top Products + Low Stock */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Products */}
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}>Top Products</h3>
              <Link to="/admin/products" style={{ fontSize: 13, color: '#2d6a4f', fontWeight: 600 }}>View All →</Link>
            </div>
            {topProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af' }}>No sales yet</div>
            ) : topProducts.map((p, i) => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ width: 28, height: 28, borderRadius: 99, background: '#f0fdf4', color: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{p.soldCount} sold</div>
                <div style={{ fontWeight: 700, color: '#2d6a4f', fontSize: 14 }}>₹{p.price}</div>
              </div>
            ))}
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div style={{ background: '#fff7ed', borderRadius: 20, padding: 24, border: '1px solid #fed7aa' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: '#c2410c', marginBottom: 12 }}>⚠️ Low Stock Alert</h3>
              {lowStockProducts.map(p => (
                <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #fed7aa', fontSize: 13 }}>
                  <span style={{ fontWeight: 500 }}>{p.name}</span>
                  <span style={{ color: '#dc2626', fontWeight: 700 }}>{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

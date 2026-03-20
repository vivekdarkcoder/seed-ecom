import React, { useEffect, useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getMyOrders } from '../../utils/api';

const STATUS_COLORS = { Pending: 'yellow', Confirmed: 'blue', Processing: 'purple', Shipped: 'blue', Delivered: 'green', Cancelled: 'red', Returned: 'red' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMyOrders().then(r => setOrders(r.data.orders)).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="page-header"><div className="container"><h1>📦 My Orders</h1><p>{orders.length} orders placed</p></div></div>
        <div className="container" style={{ marginBottom: 64 }}>
          {loading ? <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
          : orders.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders yet</h3><p>Start shopping to see your orders here.</p></div>
          ) : orders.map(order => (
            <div key={order._id} style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>Order #{order.orderNumber}</span>
                  <span style={{ marginLeft: 16, color: '#6b7280', fontSize: 13 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`badge badge-${STATUS_COLORS[order.status] || 'gray'}`}>{order.status}</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: '#2d6a4f' }}>₹{order.totalPrice.toFixed(0)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {order.items.map(item => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9fafb', borderRadius: 10, padding: '8px 14px', fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: '#6b7280' }}>× {item.quantity}</span>
                    <span style={{ color: '#2d6a4f', fontWeight: 700 }}>₹{item.price}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
                📍 {order.shippingAddress.city}, {order.shippingAddress.state} · 💳 {order.paymentMethod}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

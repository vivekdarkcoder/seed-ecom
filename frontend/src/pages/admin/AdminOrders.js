import React, { useState, useEffect, useCallback } from 'react';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
const STATUS_COLORS = { Pending: 'yellow', Confirmed: 'blue', Processing: 'purple', Shipped: 'blue', Delivered: 'green', Cancelled: 'red', Returned: 'red' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (statusFilter) params.status = statusFilter;
    getAllOrders(params).then(r => { setOrders(r.data.orders); setTotal(r.data.total); }).finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selectedOrder._id, { status: newStatus, note: statusNote });
      toast.success('Order status updated!');
      setSelectedOrder(null);
      fetchOrders();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  const pages = Math.ceil(total / 20);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4 }}>Orders</h1>
        <p style={{ color: '#6b7280' }}>{total} total orders</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => { setStatusFilter(''); setPage(1); }}
          className={`badge ${!statusFilter ? 'badge-green' : 'badge-gray'}`}
          style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 13, border: 'none' }}>
          All ({total})
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`badge badge-${statusFilter === s ? STATUS_COLORS[s] : 'gray'}`}
            style={{ cursor: 'pointer', padding: '8px 16px', fontSize: 13, border: 'none' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {loading ? (
          <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders found</h3></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Order', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>#{order.orderNumber}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{order.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#4b5563' }}>
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#2d6a4f', fontSize: 15 }}>₹{order.totalPrice?.toFixed(0)}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge badge-${order.paymentStatus === 'Paid' ? 'green' : 'yellow'}`} style={{ fontSize: 11 }}>
                        {order.paymentMethod} · {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge badge-${STATUS_COLORS[order.status] || 'gray'}`}>{order.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setStatusNote(''); }}
                        style={{ padding: '6px 14px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Update →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order #{selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {/* Order Info */}
            <div style={{ background: '#f9fafb', borderRadius: 14, padding: 18, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
                <div><span style={{ color: '#6b7280' }}>Customer:</span><br /><strong>{selectedOrder.user?.name}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Total:</span><br /><strong style={{ color: '#2d6a4f', fontSize: 18 }}>₹{selectedOrder.totalPrice?.toFixed(0)}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Payment:</span><br /><strong>{selectedOrder.paymentMethod}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Ship to:</span><br /><strong>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</strong></div>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Order Items</h4>
              {selectedOrder.items?.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>₹{(item.price * item.quantity).toFixed(0)}</strong>
                </div>
              ))}
            </div>

            {/* Status History */}
            {selectedOrder.statusHistory?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 10, fontSize: 14, color: '#6b7280', textTransform: 'uppercase' }}>Status History</h4>
                {selectedOrder.statusHistory.slice(-4).map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 13 }}>
                    <span className={`badge badge-${STATUS_COLORS[h.status] || 'gray'}`} style={{ flexShrink: 0 }}>{h.status}</span>
                    <span style={{ color: '#6b7280' }}>{h.note}</span>
                    <span style={{ color: '#9ca3af', marginLeft: 'auto' }}>{new Date(h.updatedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Update Status */}
            <div style={{ background: '#f0fdf4', borderRadius: 14, padding: 18 }}>
              <h4 style={{ fontWeight: 700, marginBottom: 12, color: '#2d6a4f' }}>Update Status</h4>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <input className="form-control" value={statusNote} onChange={e => setStatusNote(e.target.value)} placeholder="Optional note (e.g. tracking number)" />
              </div>
              <button onClick={handleStatusUpdate} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={updating}>
                {updating ? '⏳ Updating...' : '✅ Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

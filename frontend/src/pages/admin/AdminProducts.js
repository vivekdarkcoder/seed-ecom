import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, updateProduct } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (search) params.search = search;
    // Admin needs all products including inactive
    getProducts(params)
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (product) => {
    try {
      await updateProduct(product._id, { isActive: !product.isActive });
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}`);
      fetchProducts();
    } catch { toast.error('Update failed'); }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await updateProduct(product._id, { isFeatured: !product.isFeatured });
      toast.success(`${product.isFeatured ? 'Removed from' : 'Added to'} featured`);
      fetchProducts();
    } catch { toast.error('Update failed'); }
  };

  const pages = Math.ceil(total / 15);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4 }}>Products</h1>
          <p style={{ color: '#6b7280' }}>{total} total products</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">+ Add New Product</Link>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
        <input className="form-control" placeholder="🔍 Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 320 }} />
        <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setPage(1); }}>Clear</button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {loading ? (
          <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🌱</div><h3>No products found</h3><Link to="/admin/products/new" className="btn btn-primary">Add First Product</Link></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60'} alt={p.name}
                          style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                          onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60'; }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', maxWidth: 200 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                            {p.isOrganic && '🌿 Organic '}{p.isFeatured && '⭐ Featured'}{p.isHeirloom && ' 👑 Heirloom'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#4b5563' }}>
                      {p.category?.icon} {p.category?.name || '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#2d6a4f', fontSize: 15 }}>₹{p.discountPrice || p.price}</div>
                      {p.discountPrice && <div style={{ fontSize: 11, color: '#9ca3af', textDecoration: 'line-through' }}>₹{p.price}</div>}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontWeight: 700, fontSize: 14,
                        color: p.stock === 0 ? '#dc2626' : p.stock < 10 ? '#d97706' : '#059669'
                      }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button onClick={() => handleToggle(p)}
                          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, border: 'none', cursor: 'pointer', fontWeight: 600,
                            background: p.isActive ? '#dcfce7' : '#fee2e2', color: p.isActive ? '#166534' : '#991b1b' }}>
                          {p.isActive ? '✅ Active' : '❌ Inactive'}
                        </button>
                        <button onClick={() => handleToggleFeatured(p)}
                          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, border: 'none', cursor: 'pointer', fontWeight: 600,
                            background: p.isFeatured ? '#fef3c7' : '#f3f4f6', color: p.isFeatured ? '#92400e' : '#6b7280' }}>
                          {p.isFeatured ? '⭐ Featured' : '☆ Not Featured'}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/admin/products/edit/${p._id}`}
                          style={{ padding: '6px 14px', background: '#eff6ff', color: '#1d4ed8', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                          ✏️ Edit
                        </Link>
                        <button onClick={() => setDeleteId(p._id)}
                          style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                          🗑️
                        </button>
                      </div>
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

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 12 }}>Delete Product?</h2>
            <p style={{ color: '#6b7280', marginBottom: 28 }}>This action cannot be undone. The product will be permanently removed.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

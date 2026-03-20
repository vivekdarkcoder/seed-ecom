import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, toggleUserStatus, deleteUser } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (search) params.search = search;
    getUsers(params).then(r => { setUsers(r.data.users); setTotal(r.data.total); }).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggle = async (id) => {
    try { await toggleUserStatus(id); toast.success('User status updated'); fetchUsers(); }
    catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    try { await deleteUser(id); toast.success('User deleted'); setDeleteId(null); fetchUsers(); }
    catch { toast.error('Delete failed'); }
  };

  const pages = Math.ceil(total / 20);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4 }}>Users</h1>
        <p style={{ color: '#6b7280' }}>{total} registered users</p>
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
        <input className="form-control" placeholder="🔍 Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 360 }} />
        {search && <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setPage(1); }}>Clear</button>}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {loading ? (
          <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
        ) : users.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">👥</div><h3>No users found</h3></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 99, background: user.role === 'admin' ? '#2d6a4f' : '#dbeafe', color: user.role === 'admin' ? 'white' : '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#4b5563' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#4b5563' }}>{user.phone || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge badge-${user.role === 'admin' ? 'green' : 'blue'}`}>
                        {user.role === 'admin' ? '⚙️ Admin' : '👤 User'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge badge-${user.isActive ? 'green' : 'red'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {user.role !== 'admin' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleToggle(user._id)}
                            style={{ padding: '6px 12px', background: user.isActive ? '#fef3c7' : '#dcfce7', color: user.isActive ? '#92400e' : '#166534', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            {user.isActive ? '🚫 Disable' : '✅ Enable'}
                          </button>
                          <button onClick={() => setDeleteId(user._id)}
                            style={{ padding: '6px 10px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                            🗑️
                          </button>
                        </div>
                      )}
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

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>Delete User?</h2>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>This action cannot be undone. All user data will be permanently removed.</p>
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

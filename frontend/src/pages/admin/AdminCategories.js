import React, { useState, useEffect, useCallback } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../utils/api';
import toast from 'react-hot-toast';

const EMOJIS = ['🍅','🥬','🥕','🥒','🫘','🌿','🫑','🥦','🧅','🧄','🌽','🥔','🍆','🌶️','🫛','🥗'];
const COLORS = ['#E53E3E','#38A169','#DD6B20','#48BB78','#805AD5','#2C7A7B','#9B2C2C','#276749','#D69E2E','#3182CE','#E53E3E','#744210'];
const INITIAL = { name: '', description: '', icon: '🌱', color: '#2d6a4f', sortOrder: 0, isActive: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    getAllCategories().then(r => setCategories(r.data.categories)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => { setForm(INITIAL); setEditCat(null); setShowModal(true); };
  const openEdit = (cat) => { setForm({ ...cat }); setEditCat(cat); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCat) { await updateCategory(editCat._id, form); toast.success('Category updated!'); }
      else { await createCategory(form); toast.success('Category created!'); }
      setShowModal(false);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteCategory(id); toast.success('Category deleted'); setDeleteId(null); fetchCategories(); }
    catch { toast.error('Delete failed'); }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4 }}>Categories</h1>
          <p style={{ color: '#6b7280' }}>{categories.length} categories</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Category</button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {categories.map(cat => (
            <div key={cat._id} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px ${cat.color}25`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}>
              <div style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}30)`, padding: '28px 24px', borderBottom: `3px solid ${cat.color}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 48 }}>{cat.icon}</span>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, color: '#1a1a2e' }}>{cat.name}</h3>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <span className={`badge badge-${cat.isActive ? 'green' : 'red'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                    <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{cat.productCount || 0} products</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6, marginBottom: 14, minHeight: 40 }}>
                  {cat.description || 'No description provided'}
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => openEdit(cat)} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>✏️ Edit</button>
                  <button onClick={() => setDeleteId(cat._id)} className="btn btn-sm" style={{ background: '#fee2e2', color: '#991b1b', flex: 1, justifyContent: 'center' }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editCat ? 'Edit Category' : 'New Category'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Root Vegetables" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of this category..." />
              </div>

              <div className="form-group">
                <label className="form-label">Icon (Emoji)</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {EMOJIS.map(emoji => (
                    <button key={emoji} type="button" onClick={() => set('icon', emoji)}
                      style={{ width: 44, height: 44, borderRadius: 10, fontSize: 24, background: form.icon === emoji ? '#f0fdf4' : '#f9fafb', border: form.icon === emoji ? '2px solid #2d6a4f' : '2px solid transparent', cursor: 'pointer' }}>
                      {emoji}
                    </button>
                  ))}
                  <input value={form.icon} onChange={e => set('icon', e.target.value)} placeholder="Custom emoji" style={{ width: 80, padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 20, textAlign: 'center' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={() => set('color', color)}
                      style={{ width: 36, height: 36, borderRadius: 99, background: color, border: form.color === color ? '3px solid #1a1a2e' : '3px solid transparent', cursor: 'pointer', outline: form.color === color ? '2px solid white' : 'none', outlineOffset: -4 }} />
                  ))}
                  <input type="color" value={form.color} onChange={e => set('color', e.target.value)} style={{ width: 36, height: 36, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0 }} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input className="form-control" type="number" value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28 }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} style={{ width: 18, height: 18, accentColor: '#2d6a4f' }} />
                  <label className="form-label" style={{ margin: 0 }}>Active (visible on store)</label>
                </div>
              </div>

              {/* Preview */}
              <div style={{ background: `linear-gradient(135deg, ${form.color}15, ${form.color}30)`, borderRadius: 16, padding: '20px 24px', marginBottom: 20, borderLeft: `4px solid ${form.color}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 40 }}>{form.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18 }}>{form.name || 'Category Name'}</div>
                  <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>Preview</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={saving}>
                  {saving ? '⏳ Saving...' : editCat ? '✅ Update' : '✅ Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 10 }}>Delete Category?</h2>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Products in this category won't be deleted but will lose their category reference.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

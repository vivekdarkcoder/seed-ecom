import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct, getAllCategories } from '../../utils/api';
import toast from 'react-hot-toast';

const INITIAL = {
  name: '', description: '', shortDescription: '', category: '',
  price: '', discountPrice: '', stock: '', sku: '',
  weight: '', packSize: '', germinationRate: '', daysToHarvest: '',
  season: '', difficulty: 'Easy',
  isOrganic: false, isHeirloom: false, isFeatured: false, isActive: true,
  images: [''], tags: '',
  plantingInstructions: '', careInstructions: '',
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(INITIAL);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => { getAllCategories().then(r => setCategories(r.data.categories)); }, []);

  useEffect(() => {
    if (isEdit) {
      getProduct(id).then(r => {
        const p = r.data.product;
        setForm({ ...p, category: p.category?._id || p.category, tags: (p.tags || []).join(', '), images: p.images?.length ? p.images : [''] });
      }).finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setImg = (i, val) => setForm(f => { const imgs = [...f.images]; imgs[i] = val; return { ...f, images: imgs }; });
  const addImg = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImg = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price), discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        images: form.images.filter(Boolean),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (isEdit) { await updateProduct(id, payload); toast.success('Product updated!'); }
      else { await createProduct(payload); toast.success('Product created!'); }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  if (fetchLoading) return <div className="flex-center" style={{ height: 400 }}><div className="spinner" /></div>;

  const Section = ({ title, children }) => (
    <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: 24 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate('/admin/products')} style={{ background: '#f3f4f6', border: 'none', borderRadius: 10, width: 40, height: 40, cursor: 'pointer', fontSize: 18 }}>←</button>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p style={{ color: '#6b7280' }}>{isEdit ? 'Update product details' : 'Fill in the product information below'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          <div>
            {/* Basic Info */}
            <Section title="📋 Basic Information">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Cherry Tomato F1 Hybrid" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input className="form-control" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. TOM-CHR-001" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input className="form-control" value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="One-line summary for cards" />
              </div>
              <div className="form-group">
                <label className="form-label">Full Description *</label>
                <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} required rows={5} placeholder="Detailed product description..." />
              </div>
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="tomato, hybrid, summer, high-yield" />
              </div>
            </Section>

            {/* Pricing & Stock */}
            <Section title="💰 Pricing & Inventory">
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-control" type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sale Price (₹)</label>
                  <input className="form-control" type="number" min="0" value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)} placeholder="0 = no discount" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-control" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} required />
                </div>
              </div>
            </Section>

            {/* Seed Details */}
            <Section title="🌱 Seed Details">
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Weight</label><input className="form-control" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 10g, 50g" /></div>
                <div className="form-group"><label className="form-label">Pack Size</label><input className="form-control" value={form.packSize} onChange={e => set('packSize', e.target.value)} placeholder="e.g. 100 seeds" /></div>
                <div className="form-group"><label className="form-label">Germination Rate</label><input className="form-control" value={form.germinationRate} onChange={e => set('germinationRate', e.target.value)} placeholder="e.g. 85%" /></div>
                <div className="form-group"><label className="form-label">Days to Harvest</label><input className="form-control" value={form.daysToHarvest} onChange={e => set('daysToHarvest', e.target.value)} placeholder="e.g. 65-75 days" /></div>
                <div className="form-group">
                  <label className="form-label">Season</label>
                  <select className="form-control" value={form.season} onChange={e => set('season', e.target.value)}>
                    <option value="">Select Season</option>
                    {['Summer', 'Winter', 'All Season', 'Kharif', 'Rabi'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-control" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                    {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </Section>

            {/* Instructions */}
            <Section title="📖 Growing Instructions">
              <div className="form-group">
                <label className="form-label">Planting Instructions</label>
                <textarea className="form-control" rows={3} value={form.plantingInstructions} onChange={e => set('plantingInstructions', e.target.value)} placeholder="How to plant these seeds..." />
              </div>
              <div className="form-group">
                <label className="form-label">Care Instructions</label>
                <textarea className="form-control" rows={3} value={form.careInstructions} onChange={e => set('careInstructions', e.target.value)} placeholder="How to care for the plants..." />
              </div>
            </Section>
          </div>

          {/* Right Sidebar */}
          <div style={{ position: 'sticky', top: 84 }}>
            {/* Images */}
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, marginBottom: 16 }}>🖼️ Images</h3>
              {form.images.map((img, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  {img && <img src={img} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} onError={e => e.currentTarget.style.display='none'} />}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input className="form-control" value={img} onChange={e => setImg(i, e.target.value)} placeholder="Image URL" style={{ fontSize: 13 }} />
                    {form.images.length > 1 && <button type="button" onClick={() => removeImg(i)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, padding: '0 10px', cursor: 'pointer' }}>✕</button>}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addImg} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>+ Add Image URL</button>
            </div>

            {/* Flags */}
            <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, marginBottom: 16 }}>⚙️ Settings</h3>
              {[
                ['isActive', '✅ Active (visible on store)'],
                ['isFeatured', '⭐ Featured on homepage'],
                ['isOrganic', '🌿 Organic certified'],
                ['isHeirloom', '👑 Heirloom variety'],
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#2d6a4f' }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? '⏳ Saving...' : isEdit ? '✅ Update Product' : '✅ Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

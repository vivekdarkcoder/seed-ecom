import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getCategories } from '../../utils/api';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.categories)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="page-header">
          <div className="container">
            <h1>🌿 Seed Categories</h1>
            <p>Explore {categories.length} categories of premium vegetable seeds</p>
          </div>
        </div>
        <div className="container" style={{ marginBottom: 64 }}>
          {loading ? (
            <div className="flex-center" style={{ height: 400 }}><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {categories.map(cat => (
                <Link key={cat._id} to={`/categories/${cat.slug}`}
                  style={{ display: 'block', background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', transition: 'all 0.25s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${cat.color}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
                  <div style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}30)`, padding: '32px', textAlign: 'center', borderBottom: `3px solid ${cat.color}` }}>
                    <span style={{ fontSize: 64 }}>{cat.icon}</span>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8, color: '#1a1a2e' }}>{cat.name}</h3>
                    <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{cat.description || `Premium ${cat.name} seeds for your garden`}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: cat.color, fontWeight: 600 }}>{cat.productCount || 0} Products</span>
                      <span style={{ background: cat.color, color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Browse →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

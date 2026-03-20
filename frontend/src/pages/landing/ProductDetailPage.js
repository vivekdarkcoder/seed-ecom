import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { getProduct } from '../../utils/api';
import { useCart } from '../../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { getProduct(id).then(r => setProduct(r.data.product)).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!product) return <div className="loading-screen"><h2>Product not found</h2></div>;

  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  const imgs = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'];

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="container section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Images */}
            <div>
              <div style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 16, background: '#f9fafb', height: 400 }}>
                <img src={imgs[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600'} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: `2px solid ${activeImg === i ? '#2d6a4f' : '#e5e7eb'}`, cursor: 'pointer', padding: 0 }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.style.display='none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              {product.category && <Link to={`/categories/${product.category.slug}`} style={{ fontSize: 13, color: '#2d6a4f', fontWeight: 600 }}>{product.category.icon} {product.category.name}</Link>}
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', margin: '12px 0', lineHeight: 1.2 }}>{product.name}</h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {product.isOrganic && <span className="badge badge-green">🌿 Organic</span>}
                {product.isHeirloom && <span className="badge badge-purple">👑 Heirloom</span>}
                {product.season && <span className="badge badge-blue">📅 {product.season}</span>}
                {product.difficulty && <span className="badge badge-gray">🌱 {product.difficulty}</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: '#2d6a4f' }}>₹{product.discountPrice || product.price}</span>
                {discount > 0 && <>
                  <span style={{ fontSize: 20, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.price}</span>
                  <span className="badge badge-red">-{discount}% OFF</span>
                </>}
              </div>

              <p style={{ color: '#4b5563', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                {[
                  ['📦', 'Pack Size', product.packSize],
                  ['⚖️', 'Weight', product.weight],
                  ['🌱', 'Germination', product.germinationRate],
                  ['📅', 'Days to Harvest', product.daysToHarvest],
                ].filter(([,, v]) => v).map(([icon, label, val]) => (
                  <div key={label} style={{ background: '#f9fafb', borderRadius: 12, padding: '12px 16px' }}>
                    <span style={{ color: '#6b7280', fontSize: 12 }}>{icon} {label}</span>
                    <p style={{ fontWeight: 700, marginTop: 2 }}>{val}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 44, height: 44, background: '#f9fafb', border: 'none', fontSize: 20, cursor: 'pointer' }}>−</button>
                  <span style={{ width: 52, textAlign: 'center', fontWeight: 700, fontSize: 17 }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: 44, height: 44, background: '#f9fafb', border: 'none', fontSize: 20, cursor: 'pointer' }}>+</button>
                </div>
                <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }} disabled={product.stock === 0} onClick={() => addToCart(product, qty)}>
                  {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                </button>
              </div>

              {product.stock < 20 && product.stock > 0 && <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>⚠️ Only {product.stock} packets left!</p>}

              {product.plantingInstructions && (
                <div style={{ marginTop: 24, background: '#f0fdf4', borderRadius: 16, padding: 20, border: '1px solid #bbf7d0' }}>
                  <h4 style={{ color: '#2d6a4f', marginBottom: 8, fontSize: 15 }}>🌱 Planting Instructions</h4>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{product.plantingInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

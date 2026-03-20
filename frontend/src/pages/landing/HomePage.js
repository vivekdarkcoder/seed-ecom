import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import ProductCard from '../../components/landing/ProductCard';
import { getProducts, getCategories } from '../../utils/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getProducts({ featured: true, limit: 8 }),
      getCategories()
    ]).then(([pRes, cRes]) => {
      setFeaturedProducts(pRes.data.products);
      setCategories(cRes.data.categories);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        {[{ size: 400, top: -100, right: -100, opacity: 0.05 }, { size: 300, bottom: -50, left: -80, opacity: 0.07 }, { size: 200, top: '30%', left: '40%', opacity: 0.04 }].map((c, i) => (
          <div key={i} style={{ position: 'absolute', width: c.size, height: c.size, borderRadius: '50%', background: 'white', opacity: c.opacity, top: c.top, bottom: c.bottom, left: c.left, right: c.right, pointerEvents: 'none' }} />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 99, padding: '8px 16px', marginBottom: 24 }}>
                <span style={{ fontSize: 16 }}>🌱</span>
                <span style={{ color: '#a8d5b5', fontSize: 14, fontWeight: 500 }}>India's #1 Vegetable Seeds Store</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
                Grow Your Own<br /><span style={{ color: '#f4a261' }}>Fresh Vegetables</span><br />at Home
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
                Premium quality vegetable seeds for every Indian garden. From heirloom varieties to F1 hybrids — start growing today.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-accent btn-lg">Shop Seeds →</Link>
                <Link to="/categories" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>Browse Categories</Link>
              </div>
              <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
                {[['500+', 'Varieties'], ['50K+', 'Happy Gardeners'], ['98%', 'Germination Rate']].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#f4a261', fontFamily: "'Playfair Display', serif" }}>{num}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { emoji: '🍅', name: 'Tomatoes', img: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400' },
                { emoji: '🥬', name: 'Leafy Greens', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300' },
                { emoji: '🥕', name: 'Carrots', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300' },
                { emoji: '🫑', name: 'Peppers', img: 'https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=300' },
              ].map((item, i) => (
                <div key={i} style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.3)', transform: i % 2 === 1 ? 'translateY(20px)' : 'none', position: 'relative' }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} onError={e => e.currentTarget.style.display = 'none'} />
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '4px 10px', color: 'white', fontSize: 13, fontWeight: 600 }}>
                    {item.emoji} {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: 12 }}>Browse by Category</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Explore our wide range of vegetable seed categories</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {categories.slice(0, 8).map((cat) => (
              <Link key={cat._id} to={`/categories/${cat.slug}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: `2px solid transparent`, cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${cat.color}`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.border = '2px solid transparent'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}>
                <span style={{ fontSize: 36, marginBottom: 10 }}>{cat.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>{cat.name}</span>
                {cat.productCount > 0 && <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{cat.productCount} products</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: '#f0fdf4' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: '2.2rem' }}>Featured Seeds</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Hand-picked top sellers for your garden</p>
            </div>
            <Link to="/products?featured=true" className="btn btn-outline">View All →</Link>
          </div>
          {loading ? (
            <div className="flex-center" style={{ height: 300 }}><div className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: 48 }}>Why Choose SeedsCraft?</h2>
          <div className="grid-4">
            {[
              { icon: '✅', title: 'Certified Quality', desc: 'All seeds are tested and certified for high germination rates.' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Pan-India delivery within 3-5 business days, carefully packed.' },
              { icon: '🌿', title: 'Organic Options', desc: 'Wide range of certified organic and heirloom seed varieties.' },
              { icon: '💬', title: 'Expert Support', desc: 'Gardening guidance from our team of agricultural experts.' },
            ].map((item) => (
              <div key={item.title} style={{ textAlign: 'center', padding: '32px 20px', background: 'white', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{item.icon}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, #f4a261, #e76f51)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'white', marginBottom: 16 }}>Ready to Start Growing? 🌱</h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Join thousands of gardeners across India growing their own food.
          </p>
          <Link to="/products" className="btn btn-lg" style={{ background: 'white', color: '#e76f51', fontWeight: 700 }}>Shop Now →</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

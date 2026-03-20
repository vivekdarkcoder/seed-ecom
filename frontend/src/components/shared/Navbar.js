import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #e5e7eb' : 'none',
      transition: 'all 0.3s ease', padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>🌱</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: scrolled ? '#2d6a4f' : 'white' }}>
            SeedsCraft
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['/', '/products', '/categories'].map((path, i) => {
            const labels = ['Home', 'Products', 'Categories'];
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{
                fontSize: 14, fontWeight: 500, color: scrolled ? (active ? '#2d6a4f' : '#374151') : 'rgba(255,255,255,0.9)',
                borderBottom: active ? '2px solid #2d6a4f' : '2px solid transparent',
                paddingBottom: 2, transition: 'all 0.2s'
              }}>{labels[i]}</Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, background: scrolled ? '#f0fdf4' : 'rgba(255,255,255,0.15)', color: scrolled ? '#2d6a4f' : 'white', fontSize: 20, transition: 'all 0.2s' }}>
            🛒
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: '#e76f51', color: 'white', borderRadius: 99, width: 20, height: 20, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: scrolled ? '#2d6a4f' : 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                👤 {user.name.split(' ')[0]}
              </button>
              {dropOpen && (
                <div style={{ position: 'absolute', top: 52, right: 0, background: 'white', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', minWidth: 180, padding: 8, border: '1px solid #e5e7eb', zIndex: 100 }}
                  onBlur={() => setDropOpen(false)}>
                  {user.role === 'admin' && <DropItem to="/admin" icon="⚙️" label="Admin Panel" setOpen={setDropOpen} />}
                  <DropItem to="/profile" icon="👤" label="My Profile" setOpen={setDropOpen} />
                  <DropItem to="/orders" icon="📦" label="My Orders" setOpen={setDropOpen} />
                  <div style={{ height: 1, background: '#e5e7eb', margin: '6px 0' }} />
                  <button onClick={() => { logout(); setDropOpen(false); navigate('/'); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, fontWeight: 500 }}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ padding: '9px 20px', borderRadius: 12, background: scrolled ? '#2d6a4f' : 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: 14 }}>
              Login
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="hide-desktop" onClick={() => setMenuOpen(!menuOpen)}
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: 'rgba(255,255,255,0.2)', border: 'none', fontSize: 22, color: scrolled ? '#374151' : 'white' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          {[['/', 'Home'], ['/products', 'Products'], ['/categories', 'Categories']].map(([path, label]) => (
            <Link key={path} to={path} style={{ display: 'block', padding: '12px 0', fontWeight: 500, borderBottom: '1px solid #f3f4f6', color: '#374151' }}>{label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function DropItem({ to, icon, label, setOpen }) {
  return (
    <Link to={to} onClick={() => setOpen(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, fontSize: 14, fontWeight: 500, color: '#374151', transition: 'all 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      {icon} {label}
    </Link>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1b4332', color: 'white', padding: '64px 0 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 32 }}>🌱</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700 }}>SeedsCraft</span>
            </div>
            <p style={{ opacity: 0.7, lineHeight: 1.8, fontSize: 14, maxWidth: 280 }}>
              India's trusted source for premium vegetable seeds. Grow your own food, nurture your garden, harvest your happiness.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <span key={i} style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer' }}>{icon}</span>
              ))}
            </div>
          </div>

          <FooterCol title="Shop" links={[['All Seeds', '/products'], ['Categories', '/categories'], ['Organic Seeds', '/products?organic=true'], ['Featured', '/products?featured=true']]} />
          <FooterCol title="Account" links={[['My Account', '/profile'], ['My Orders', '/orders'], ['Shopping Cart', '/cart'], ['Login', '/login']]} />
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 20 }}>Contact Us</h4>
            {[['📧', 'support@seedscraft.com'], ['📞', '+91 98765 43210'], ['📍', 'New Delhi, India']].map(([icon, text], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, opacity: 0.75, fontSize: 14 }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6, fontSize: 13 }}>
          <span>© 2025 SeedsCraft. All rights reserved.</span>
          <span>Made with ❤️ for Indian Farmers</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, marginBottom: 20 }}>{title}</h4>
      {links.map(([label, to]) => (
        <Link key={label} to={to} style={{ display: 'block', opacity: 0.7, fontSize: 14, marginBottom: 10, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
          {label}
        </Link>
      ))}
    </div>
  );
}

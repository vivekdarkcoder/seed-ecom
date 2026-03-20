import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '🌱' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fdf9' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240, flexShrink: 0, background: '#1b4332',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease', overflow: 'hidden', position: 'sticky', top: 0, height: '100vh'
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 16px' : '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🌱</span>
          {!collapsed && <div>
            <div style={{ color: 'white', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18 }}>SeedsCraft</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Admin Panel</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '12px' : '12px 14px', borderRadius: 12, marginBottom: 4,
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontWeight: isActive ? 600 : 400, fontSize: 14,
                transition: 'all 0.2s', textDecoration: 'none',
                justifyContent: collapsed ? 'center' : 'flex-start'
              })}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 99, background: '#40916c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Administrator</div>
              </div>
            </div>
          )}
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: 14 }}>
            🚪 {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Top bar */}
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', border: 'none', cursor: 'pointer', fontSize: 18 }}>
            {collapsed ? '☰' : '✕'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <NavLink to="/" style={{ fontSize: 13, color: '#6b7280' }}>← View Store</NavLink>
            <div style={{ width: 36, height: 36, borderRadius: 99, background: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

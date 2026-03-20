import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return <AuthLayout title="Welcome Back 🌱" subtitle="Sign in to your SeedsCraft account">
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
      </div>
      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
        {loading ? '⏳ Signing in...' : 'Sign In →'}
      </button>
      <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
        Don't have an account? <Link to="/register" style={{ color: '#2d6a4f', fontWeight: 600 }}>Register</Link>
      </p>
      <div style={{ marginTop: 16, padding: 12, background: '#f0fdf4', borderRadius: 10, fontSize: 13, color: '#2d6a4f' }}>
        <strong>Demo Admin:</strong> admin@seedscraft.com / admin123<br />
        <strong>Demo User:</strong> user@seedscraft.com / user1234
      </div>
    </form>
  </AuthLayout>;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return <AuthLayout title="Join SeedsCraft 🌿" subtitle="Create your account and start growing">
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input className="form-control" type="text" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      </div>
      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input className="form-control" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-control" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
      </div>
      <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
        {loading ? '⏳ Creating account...' : 'Create Account →'}
      </button>
      <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
        Already have an account? <Link to="/login" style={{ color: '#2d6a4f', fontWeight: 600 }}>Sign in</Link>
      </p>
    </form>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1b4332, #2d6a4f)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 440, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <span style={{ fontSize: 28 }}>🌱</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#2d6a4f' }}>SeedsCraft</span>
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 8 }}>{title}</h1>
          <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 14 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

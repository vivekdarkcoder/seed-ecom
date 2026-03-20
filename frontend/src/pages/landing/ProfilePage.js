import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.address?.city || '', state: user?.address?.state || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await updateProfile(form); toast.success('Profile updated!'); } catch { toast.error('Update failed'); } finally { setLoading(false); }
  };
  const handlePassword = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await changePassword(passForm); toast.success('Password changed!'); setPassForm({ currentPassword: '', newPassword: '' }); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="page-header"><div className="container"><h1>👤 My Profile</h1><p>Manage your account details</p></div></div>
        <div className="container" style={{ marginBottom: 64, maxWidth: 680 }}>
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 24 }}>Personal Information</h2>
            <form onSubmit={handleProfile}>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={user?.email || ''} disabled style={{ opacity: 0.6 }} /></div>
                <div className="form-group"><label className="form-label">City</label><input className="form-control" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </div>
          <div className="card">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 24 }}>Change Password</h2>
            <form onSubmit={handlePassword}>
              <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-control" value={passForm.currentPassword} onChange={e => setPassForm(f => ({ ...f, currentPassword: e.target.value }))} required /></div>
              <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-control" value={passForm.newPassword} onChange={e => setPassForm(f => ({ ...f, newPassword: e.target.value }))} required minLength={6} /></div>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

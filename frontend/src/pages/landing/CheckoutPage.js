import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../utils/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: '', city: '', state: '', pincode: '',
    paymentMethod: 'COD'
  });

  const shipping = cartTotal >= 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setLoading(true);
    try {
      const { name, phone, street, city, state, pincode, paymentMethod } = form;
      const res = await createOrder({
        items: cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0], price: i.discountPrice || i.price, quantity: i.quantity })),
        shippingAddress: { name, phone, street, city, state, pincode },
        paymentMethod, itemsPrice: cartTotal, shippingPrice: shipping, taxPrice: tax, totalPrice: grandTotal
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="page-header"><div className="container"><h1>📦 Checkout</h1><p>Complete your order</p></div></div>
        <div className="container" style={{ marginBottom: 64 }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
            <div>
              {/* Shipping */}
              <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 24 }}>🏠 Shipping Address</h2>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Street Address *</label><input className="form-control" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} required /></div>
                <div className="grid-3">
                  <div className="form-group"><label className="form-label">City *</label><input className="form-control" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">State *</label><input className="form-control" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required /></div>
                  <div className="form-group"><label className="form-label">Pincode *</label><input className="form-control" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} required /></div>
                </div>
              </div>

              {/* Payment */}
              <div className="card">
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 20 }}>💳 Payment Method</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[['COD', '💵', 'Cash on Delivery', 'Pay when your order arrives'], ['UPI', '📱', 'UPI Payment', 'PhonePe, GPay, Paytm'], ['Card', '💳', 'Debit/Credit Card', 'Visa, Mastercard, RuPay']].map(([val, icon, label, sub]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: `2px solid ${form.paymentMethod === val ? '#2d6a4f' : '#e5e7eb'}`, borderRadius: 12, cursor: 'pointer', background: form.paymentMethod === val ? '#f0fdf4' : 'white', transition: 'all 0.2s' }}>
                      <input type="radio" name="payment" value={val} checked={form.paymentMethod === val} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} style={{ accentColor: '#2d6a4f' }} />
                      <span style={{ fontSize: 22 }}>{icon}</span>
                      <div><div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div><div style={{ fontSize: 12, color: '#6b7280' }}>{sub}</div></div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', position: 'sticky', top: 84 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 20 }}>Order Summary</h2>
              {cart.map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: '#374151' }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>₹{((item.discountPrice || item.price) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
              {[['Subtotal', `₹${cartTotal.toFixed(0)}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['Tax (5%)', `₹${tax}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: '#6b7280' }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20 }}>
                <span>Total</span><span style={{ color: '#2d6a4f' }}>₹{grandTotal.toFixed(0)}</span>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }} disabled={loading}>
                {loading ? '⏳ Placing Order...' : '✅ Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 499 ? 0 : 49;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + shipping + tax;

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="page-header">
          <div className="container">
            <h1>🛒 Shopping Cart</h1>
            <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>
        <div className="container" style={{ marginBottom: 64 }}>
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some seeds to your cart and start growing!</p>
              <Link to="/products" className="btn btn-primary btn-lg">Browse Seeds</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
              {/* Cart Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {cart.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: 20, background: 'white', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', alignItems: 'center' }}>
                    <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200'} alt={item.name}
                      style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 12 }} onError={e => e.currentTarget.style.display='none'} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, marginBottom: 4 }}>{item.name}</h3>
                      {item.packSize && <p style={{ color: '#6b7280', fontSize: 13 }}>Pack: {item.packSize}</p>}
                      <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: 17, marginTop: 6 }}>₹{item.discountPrice || item.price}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{ width: 36, height: 36, background: '#f9fafb', border: 'none', fontSize: 18, cursor: 'pointer', color: '#374151' }}>−</button>
                        <span style={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{ width: 36, height: 36, background: '#f9fafb', border: 'none', fontSize: 18, cursor: 'pointer', color: '#374151' }}>+</button>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', minWidth: 64, textAlign: 'right' }}>
                        ₹{((item.discountPrice || item.price) * item.quantity).toFixed(0)}
                      </span>
                      <button onClick={() => removeFromCart(item._id)}
                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb', position: 'sticky', top: 84 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 24 }}>Order Summary</h2>
                <SummaryRow label="Subtotal" value={`₹${cartTotal.toFixed(0)}`} />
                <SummaryRow label="Shipping" value={shipping === 0 ? 'FREE' : `₹${shipping}`} valueColor={shipping === 0 ? '#10b981' : undefined} />
                <SummaryRow label="Tax (5%)" value={`₹${tax}`} />
                {shipping > 0 && <p style={{ fontSize: 12, color: '#10b981', marginBottom: 12, background: '#dcfce7', padding: '8px 12px', borderRadius: 8 }}>
                  Add ₹{(499 - cartTotal).toFixed(0)} more for FREE shipping!
                </p>}
                <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
                <SummaryRow label="Total" value={`₹${grandTotal.toFixed(0)}`} bold />
                <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
                  onClick={() => user ? navigate('/checkout') : navigate('/login')}>
                  {user ? 'Proceed to Checkout →' : 'Login to Checkout →'}
                </button>
                <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: '#6b7280', fontSize: 13 }}>← Continue Shopping</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function SummaryRow({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <span style={{ color: bold ? '#1a1a2e' : '#6b7280', fontWeight: bold ? 700 : 400, fontSize: bold ? 18 : 14 }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 600, fontSize: bold ? 22 : 14, color: valueColor || (bold ? '#2d6a4f' : '#1a1a2e') }}>{value}</span>
    </div>
  );
}

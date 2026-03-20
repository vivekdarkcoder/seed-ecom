import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const discount = product.discountPrice && product.price
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product._id}`)}>
      <div style={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
          alt={product.name} className="product-card-img"
          style={{ transition: 'transform 0.4s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={e => e.currentTarget.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {product.isOrganic && <span className="badge badge-green">🌿 Organic</span>}
          {product.isFeatured && <span className="badge badge-yellow">⭐ Featured</span>}
          {discount > 0 && <span className="badge badge-red">-{discount}% OFF</span>}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(239,68,68,0.9)', color: 'white', fontSize: 12, fontWeight: 600, textAlign: 'center', padding: '5px 0' }}>
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ background: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: 8, fontWeight: 700 }}>Out of Stock</span>
          </div>
        )}
      </div>

      <div className="product-card-body">
        {product.category && (
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            {product.category.icon} {product.category.name}
          </span>
        )}
        <h3 className="product-card-name" style={{ marginTop: 4 }}>{product.name}</h3>

        <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)', margin: '8px 0' }}>
          {product.packSize && <span>📦 {product.packSize}</span>}
          {product.daysToHarvest && <span>📅 {product.daysToHarvest}</span>}
        </div>

        {product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div className="stars">
              {[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(product.rating) ? 'star' : 'star-empty'}>★</span>)}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>({product.numReviews})</span>
          </div>
        )}

        <div className="product-card-price">
          <span className="price-current">₹{product.discountPrice || product.price}</span>
          {discount > 0 && <span className="price-old">₹{product.price}</span>}
        </div>

        <button
          className="btn btn-primary btn-sm"
          style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
          disabled={product.stock === 0}
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
          {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
}

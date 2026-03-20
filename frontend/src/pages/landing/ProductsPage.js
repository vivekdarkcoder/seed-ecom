import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';
import ProductCard from '../../components/landing/ProductCard';
import { getProducts, getCategories } from '../../utils/api';

export default function ProductsPage() {
  const location = useLocation();
  const { slug } = useParams();
  const searchParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: '',
    sort: 'newest',
    organic: searchParams.get('organic') || '',
    featured: searchParams.get('featured') || '',
    season: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => { getCategories().then(r => setCategories(r.data.categories)); }, []);

  useEffect(() => {
    if (slug) {
      getCategories().then(r => {
        const cat = r.data.categories.find(c => c.slug === slug);
        if (cat) setFilters(f => ({ ...f, category: cat._id }));
      });
    }
  }, [slug]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12, ...filters };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    getProducts(params).then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total);
    }).finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const pages = Math.ceil(total / 12);

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="page-header">
          <div className="container">
            <h1>{slug ? categories.find(c => c.slug === slug)?.name || 'Products' : 'All Seeds'}</h1>
            <p>{total} products found</p>
          </div>
        </div>

        <div className="container" style={{ marginBottom: 64 }}>
          {/* Search & Filters */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <input className="form-control" placeholder="🔍 Search seeds..." value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              style={{ flex: '1 1 240px', minWidth: 200 }} />
            <select className="form-control" value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} style={{ width: 180 }}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
            <select className="form-control" value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))} style={{ width: 160 }}>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <select className="form-control" value={filters.season} onChange={e => setFilters(f => ({ ...f, season: e.target.value }))} style={{ width: 160 }}>
              <option value="">All Seasons</option>
              {['Summer', 'Winter', 'All Season', 'Kharif', 'Rabi'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={filters.organic === 'true'} onChange={e => setFilters(f => ({ ...f, organic: e.target.checked ? 'true' : '' }))} style={{ width: 16, height: 16, accentColor: '#2d6a4f' }} />
              🌿 Organic Only
            </label>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex-center" style={{ height: 400 }}><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🌱</div>
              <h3>No seeds found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button className="btn btn-primary" onClick={() => setFilters(f => ({ ...f, search: '', category: '', organic: '', season: '' }))}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}>→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const CATEGORIES = ['All', 'Fashion', 'Electronics', 'Kitchen', 'Organic', 'Books', 'Sports', 'Other'];

export default function Products() {
  const [products,       setProducts]       = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Fetch all products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        setProducts(res.data.products);
        setFiltered(res.data.products);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Read category from URL on load (e.g. /products?category=Fashion)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Filter whenever search or category changes
  useEffect(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim() !== '') {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, activeCategory, products]);

  // Get category icon
  const getIcon = (category) => {
    const icons = {
      Fashion: '👗', Electronics: '💻', Kitchen: '🍳',
      Organic: '🌿', Books: '📚', Sports: '🏋️',
    };
    return icons[category] || '📦';
  };

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Browse Products</h1>
            <p className="text-sm text-white/40">Discover products from all stores on ShopHub</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 border border-white/15 text-white/70 text-sm rounded-xl hover:bg-white/10 transition no-underline"
            >
              ← Home
            </Link>
            <Link
              to="/cart"
              className="px-4 py-2 border border-white/15 text-white/70 text-sm rounded-xl hover:bg-white/10 transition no-underline"
            >
              🛒 Cart
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-md px-5 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/[0.06] text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-20">
            <p className="text-white/30 text-sm">Loading products...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-white/30 text-sm">No products found</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Product count */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-white/30 mb-5 text-center">
            Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/products/${p._id}`)}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.06] transition group"
              >

                {/* Product image — real or emoji fallback */}
                <div className="w-full h-36 bg-white/[0.06] rounded-xl mb-4 overflow-hidden border border-white/[0.05]">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">{getIcon(p.category)}</span>
                    </div>
                  )}
                </div>

                {/* Category badge */}
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full">
                  {p.category}
                </span>

                {/* Product name */}
                <h3 className="text-sm font-semibold text-white mt-2 mb-1 group-hover:text-indigo-300 transition line-clamp-1">
                  {p.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-white/35 mb-4 line-clamp-2 leading-relaxed">
                  {p.description || 'No description available'}
                </p>

                {/* Price and stock row */}
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">₹{p.price}</span>
                  <span className={`text-xs ${p.stock > 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Store name */}
                {p.storeId?.storeName && (
                  <p className="text-xs text-white/20 mt-2 border-t border-white/[0.06] pt-2">
                    {p.storeId.storeName}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
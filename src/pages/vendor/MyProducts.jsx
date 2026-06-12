import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products/my-products');
      setProducts(res.data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Products</h1>
            <p className="text-sm text-white/40 mt-1">{products.length} products in your store</p>
          </div>
          <Link
            to="/vendor/add-product"
            className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            + Add product
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white/40 text-sm text-center py-20">Loading products...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm text-center py-20">{error}</p>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm mb-4">No products yet</p>
            <Link
              to="/vendor/add-product"
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              Add your first product
            </Link>
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-indigo-500/40 transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">
                    {p.category}
                  </span>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-xs text-red-400/60 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{p.name}</h3>
                <p className="text-xs text-white/40 mb-4 line-clamp-2">{p.description || 'No description'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">₹{p.price}</span>
                  <span className="text-xs text-white/40">{p.stock} in stock</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
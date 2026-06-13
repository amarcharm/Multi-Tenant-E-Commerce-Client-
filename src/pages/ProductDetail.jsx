import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function ProductDetail() {
  const { id }                    = useParams();
  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState('');
  const [added,   setAdded]       = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Check if product already in cart
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center">
      <p className="text-white/30 text-sm">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition"
        >
          ← Back to products
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate('/products')}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition mb-6 inline-block"
        >
          ← Back to products
        </button>

        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

            {/* Image placeholder */}
            <div className="w-full h-56 bg-white/[0.06] rounded-xl flex items-center justify-center border border-white/[0.05]">
              <span className="text-6xl">
                {product.category === 'Fashion'     ? '👗' :
                 product.category === 'Electronics' ? '💻' :
                 product.category === 'Kitchen'     ? '🍳' :
                 product.category === 'Organic'     ? '🌿' :
                 product.category === 'Books'       ? '📚' :
                 product.category === 'Sports'      ? '🏋️' : '📦'}
              </span>
            </div>

            {/* Product info */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="text-xl font-bold text-white mt-3 mb-2">{product.name}</h1>
                <p className="text-sm text-white/40 leading-relaxed mb-4">
                  {product.description || 'No description available'}
                </p>
                {product.storeId?.storeName && (
                  <p className="text-xs text-white/25 mb-4">
                    Sold by <span className="text-indigo-400">{product.storeId.storeName}</span>
                  </p>
                )}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-bold text-white">₹{product.price}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    product.stock > 0
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
                  added
                    ? 'bg-green-600 text-white'
                    : product.stock === 0
                    ? 'bg-white/10 text-white/30 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                }`}
              >
                {added ? '✓ Added to cart' : product.stock === 0 ? 'Out of stock' : 'Add to cart'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
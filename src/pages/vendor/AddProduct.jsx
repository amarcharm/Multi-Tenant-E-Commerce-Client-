import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const CATEGORIES = ['Fashion', 'Electronics', 'Kitchen', 'Organic', 'Books', 'Sports', 'Other'];

export default function AddProduct() {
  const [form, setForm] = useState({
    name:        '',
    price:       '',
    stock:       '',
    category:    'Other',
    description: '',
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Single handler for all inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axiosInstance.post('/products/add', {
        name:        form.name,
        price:       Number(form.price),
        stock:       Number(form.stock),
        category:    form.category,
        description: form.description,
      });

      setSuccess('Product added successfully!');
      setTimeout(() => navigate('/vendor/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e1a] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-6">
          <Link
            to="/vendor/dashboard"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition mb-3 inline-block"
          >
            ← Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Add a product</h1>
          <p className="text-sm text-white/40 mt-1">Fill in the details to list a new product in your store</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7">

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl mb-5">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Product name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium">Product name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Wireless Headphones"
                className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Price and Stock side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-medium">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0.00"
                  className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white/40 font-medium">Stock quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                  className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#1a1830]">{c}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={4}
                className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Adding product...' : 'Add product'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
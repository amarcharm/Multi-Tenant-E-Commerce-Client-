import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';

export default function Checkout() {
  const [cart,    setCart]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone:    '',
    street:   '',
    city:     '',
    state:    '',
    pincode:  '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    if (stored.length === 0) {
      navigate('/cart');
      return;
    }
    setCart(stored);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const items = cart.map((item) => ({
        productId: item._id,
        quantity:  item.quantity,
      }));

      await axiosInstance.post('/orders', {
        items,
        deliveryAddress: form,
      });

      // Clear cart after successful order
      localStorage.removeItem('cart');
      navigate('/orders/success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition mb-3 inline-block"
          >
            ← Back to cart
          </button>
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          <p className="text-sm text-white/40 mt-1">Fill in your delivery details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Delivery form — takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
              <p className="text-sm font-semibold text-white mb-5">Delivery address</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">

                {/* Full name and phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Full name</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Phone number</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="9876543210"
                      className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Street */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Street address</label>
                  <input
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    required
                    placeholder="123 Main Street, Apt 4B"
                    className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                {/* City, state, pincode */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="Chennai"
                      className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      placeholder="Tamil Nadu"
                      className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Pincode</label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      placeholder="600001"
                      className="px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Place order button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing order...' : `Place order — ₹${subtotal}`}
                </button>

              </form>
            </div>
          </div>

          {/* Order summary — takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
              <p className="text-sm font-semibold text-white mb-4">Order summary</p>

              <div className="flex flex-col gap-3 mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{item.name}</p>
                      <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs text-white font-medium flex-shrink-0">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>Delivery</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white mt-2">
                  <span>Total</span>
                  <span>₹{subtotal}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
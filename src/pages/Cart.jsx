import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Load cart from localStorage
  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(stored);
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Save cart back to localStorage and update state
  const saveCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  // Increase quantity (but not above available stock)
  const increaseQty = (id) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQty = Math.min(item.quantity + 1, item.stock);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  // Decrease quantity (minimum 1)
  const decreaseQty = (id) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQty = Math.max(item.quantity - 1, 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  // Remove item completely
  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    saveCart(updated);
  };

  // Clear entire cart
  const clearCart = () => {
    if (!window.confirm('Clear all items from cart?')) return;
    saveCart([]);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get category icon
  const getIcon = (category) => {
    const icons = {
      Fashion: '👗', Electronics: '💻', Kitchen: '🍳',
      Organic: '🌿', Books: '📚', Sports: '🏋️',
    };
    return icons[category] || '📦';
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#0f0e1a] px-6 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your cart</h1>
            <p className="text-sm text-white/40 mt-1">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-400/60 hover:text-red-400 transition"
            >
              Clear cart
            </button>
          )}
        </div>

        {/* Empty cart */}
        {cart.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-white/30 text-sm mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition no-underline inline-block"
            >
              Browse products
            </Link>
          </div>
        )}

        {/* Cart items */}
        {cart.length > 0 && (
          <>
            <div className="flex flex-col gap-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex items-center gap-4"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-white/[0.06] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {getIcon(item.category)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-xs text-white/40 mt-0.5">{item.category}</p>
                    <p className="text-sm font-bold text-white mt-1">₹{item.price}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      className="w-8 h-8 flex items-center justify-center bg-white/[0.06] border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
                    >
                      −
                    </button>
                    <span className="text-sm text-white font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQty(item._id)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 flex items-center justify-center bg-white/[0.06] border border-white/10 rounded-lg text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {/* Item total */}
                  <div className="text-right flex-shrink-0 w-20">
                    <p className="text-sm font-bold text-white">₹{item.price * item.quantity}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-white/30 hover:text-red-400 transition flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Summary box */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60 mb-4">
                <span>Delivery</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-5">
                <span className="text-base font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-white">₹{subtotal}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Proceed to checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-xs text-indigo-400 hover:text-indigo-300 transition mt-4 no-underline"
              >
                ← Continue shopping
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
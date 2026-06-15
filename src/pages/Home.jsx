import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'superadmin') navigate('/admin/dashboard');
      else if (user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="bg-[#0f0e1a] min-h-screen text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-5 border-b border-white/[0.07]">
        <span className="text-xl font-bold tracking-tight">ShopHub</span>

        <div className="hidden md:flex gap-7">
          <Link to="/" className="text-sm text-white/50 hover:text-white transition no-underline">Home</Link>
          <Link to="/products" className="text-sm text-white/50 hover:text-white transition no-underline">Products</Link>
          <span className="text-sm text-white/50 cursor-pointer hover:text-white transition">Stores</span>
          <span className="text-sm text-white/50 cursor-pointer hover:text-white transition">About</span>
        </div>

        <div className="flex gap-3 items-center">
          {/* Cart icon */}
          <Link
            to="/cart"
            className="relative px-3 py-2 border border-white/15 text-white/70 text-sm rounded-xl hover:bg-white/10 transition no-underline"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={handleGetStarted}
              className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2 border border-white/15 text-white/70 text-sm rounded-xl hover:bg-white/10 transition no-underline">
                Log in
              </Link>
              <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition no-underline">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 border-b border-white/[0.07]">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs px-4 py-1.5 rounded-full mb-6">
          ✦ Multi-vendor marketplace platform
        </div>
        <h1 className="text-4xl font-bold leading-tight max-w-xl mx-auto mb-5 tracking-tight text-center">
          Your marketplace,{' '}
          <span className="text-indigo-400">simplified.</span>
        </h1>
        <p className="text-sm text-white/45 max-w-sm text-center mb-9 leading-relaxed">
          Launch your store in minutes. Reach thousands of customers without the technical overhead.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={handleGetStarted} className="px-8 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition">
            Start selling today
          </button>
          <Link to="/products" className="px-8 py-3 bg-white/[0.06] text-white/70 border border-white/10 text-sm rounded-xl hover:bg-white/10 transition no-underline">
            Browse stores →
          </Link>
        </div>
        <div className="flex justify-center gap-14 mt-14 flex-wrap">
          {[
            { num: '500+', label: 'Active stores' },
            { num: '12k+', label: 'Products listed' },
            { num: '8k+',  label: 'Happy customers' },
            { num: '99%',  label: 'Uptime' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold">{s.num}</div>
              <div className="text-xs text-white/35 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="flex flex-col items-center px-6 py-16 border-b border-white/[0.07]">
        <div className="text-center mb-9">
          <p className="text-2xl font-bold mb-2">Everything you need to sell</p>
          <p className="text-sm text-white/40">Built for vendors who want results, not complexity.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-3xl">
          {[
            { icon: '🏪', title: 'Your storefront', desc: 'Branded store page with logo and products.' },
            { icon: '🔒', title: 'Secure payments', desc: 'Stripe-powered encrypted checkout.' },
            { icon: '📊', title: 'Sales analytics', desc: 'Track revenue and top products live.' },
            { icon: '📦', title: 'Inventory',        desc: 'Manage stock with low-stock alerts.' },
          ].map((f) => (
            <div key={f.title} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-indigo-500/50 transition">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-base mb-3">{f.icon}</div>
              <p className="text-sm font-semibold mb-1.5">{f.title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="flex flex-col items-center px-6 py-16 border-b border-white/[0.07]">
        <div className="text-center mb-9">
          <p className="text-2xl font-bold mb-2">Browse by category</p>
          <p className="text-sm text-white/40">Find exactly what you are looking for.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full max-w-lg">
          {[
            { icon: '👗', name: 'Fashion' },
            { icon: '💻', name: 'Electronics' },
            { icon: '🍳', name: 'Kitchen' },
            { icon: '🌿', name: 'Organic' },
            { icon: '📚', name: 'Books' },
            { icon: '🏋️', name: 'Sports' },
          ].map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${c.name}`}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/[0.08] transition no-underline"
            >
              <div className="text-xl mb-2">{c.icon}</div>
              <p className="text-[11px] font-medium text-white/60">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="flex flex-col items-center px-6 py-16 border-b border-white/[0.07]">
        <div className="text-center mb-9">
          <p className="text-2xl font-bold mb-2">How it works</p>
          <p className="text-sm text-white/40">Up and running in three steps.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-xl">
          {[
            { step: '1', title: 'Create account', desc: 'Register as a vendor with your email in under a minute.' },
            { step: '2', title: 'Set up store',   desc: 'Add your store name, logo and list your products.' },
            { step: '3', title: 'Start selling',  desc: 'Go live instantly and start reaching customers.' },
          ].map((h) => (
            <div key={h.step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mx-auto mb-4">{h.step}</div>
              <p className="text-sm font-semibold mb-1.5">{h.title}</p>
              <p className="text-xs text-white/40 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center px-6 py-20">
        <p className="text-3xl font-bold mb-3">Ready to launch your store?</p>
        <p className="text-sm text-white/40 mb-8">Join hundreds of vendors already selling on ShopHub.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/register" className="px-8 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition no-underline">
            Create your store
          </Link>
          <Link to="/login" className="px-8 py-3 bg-white/[0.06] text-white/70 border border-white/10 text-sm rounded-xl hover:bg-white/10 transition no-underline">
            Log in to your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-10 py-5 border-t border-white/[0.07] flex-wrap gap-3">
        <span className="text-base font-bold text-indigo-400">ShopHub</span>
        <span className="text-xs text-white/25">© 2025 ShopHub. All rights reserved.</span>
        <div className="flex gap-5">
          {['Privacy','Terms','Contact'].map((l) => (
            <span key={l} className="text-xs text-white/30 cursor-pointer hover:text-white/60 transition">{l}</span>
          ))}
        </div>
      </footer>

    </div>
  );
}
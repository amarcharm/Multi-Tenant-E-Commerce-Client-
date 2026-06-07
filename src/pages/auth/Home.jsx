import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'vendor') navigate('/vendor/dashboard');
      else if (user.role === 'superadmin') navigate('/admin/dashboard');
      else navigate('/');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white text-white">

      {/* Navbar */}
      <div className="border-b border-gray-100 w-full">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 max-w-7xl mx-auto w-full">
        <span className="text-xl font-semibold text-blue-600">ShopHub</span>
        <div className="hidden md:flex items-center gap-8">
          <span className="text-sm text-gray-200 cursor-pointer hover:text-gray-800">Home</span>
          <span className="text-sm text-gray-200 cursor-pointer hover:text-gray-800">Stores</span>
          <span className="text-sm text-gray-200 cursor-pointer hover:text-gray-800">Products</span>
          <span className="text-sm text-gray-200 cursor-pointer hover:text-gray-800">About</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={handleGetStarted}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Go to dashboard
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-200 text-sm rounded-lg text-gray-300 hover:bg-gray-50 transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
      </div>


      {/* Hero */}
      <section className="text-center px-6 py-16 border-b border-gray-100 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full mb-6">
          <span>✦</span>
          <span>Multi-vendor e-commerce platform</span>
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 leading-tight max-w-2xl mx-auto mb-5 text-center">
          Your store.{' '}
          <span className="text-blue-600">Your brand.</span>{' '}
          One platform.
        </h1>
        <p className="text-gray-500 text-base max-w-md mx-auto mb-10 leading-relaxed text-center">
          ShopHub lets vendors launch their online store in minutes. Customers
          discover and shop from hundreds of stores — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={handleGetStarted}
            className="px-7 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Start selling today
          </button>
          <button className="px-7 py-3 border border-gray-200 text-gray-00 text-sm rounded-lg hover:bg-gray-50 transition">
            Browse stores
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-12 flex-wrap w-full">
          {[
            { num: '500+', label: 'Active stores' },
            { num: '12k+', label: 'Products listed' },
            { num: '8k+',  label: 'Happy customers' },
            { num: '99%',  label: 'Uptime' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-semibold text-gray-300">{s.num}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 border-b border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Everything you need to sell online
          </h2>
          <p className="text-sm text-gray-400">
            Built for vendors who want to focus on their products, not the tech.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {[
            { icon: '🏪', title: 'Your own storefront',    desc: 'Set up your branded store with logo, description and products.' },
            { icon: '🔒', title: 'Secure payments',        desc: 'Stripe-powered checkout with encrypted transactions every time.' },
            { icon: '📊', title: 'Sales analytics',        desc: 'Track revenue, orders and top products from your dashboard.' },
            { icon: '📦', title: 'Inventory management',   desc: 'Manage stock levels and get notified when items run low.' },
          ].map((f) => (
            <div key={f.title} className="border border-gray-100 rounded-xl p-5 hover:border-blue-100 hover:bg-blue-50 transition">
              <div className="text-2xl mb-3">{f.icon}</div>
              <p className="text-sm font-medium text-gray-800 mb-2">{f.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-16 border-b border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Browse by category</h2>
          <p className="text-sm text-gray-400">Find exactly what you are looking for.</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 max-w-3xl mx-auto">
          {[
            { icon: '👗', name: 'Fashion' },
            { icon: '💻', name: 'Electronics' },
            { icon: '🍳', name: 'Kitchen' },
            { icon: '🌿', name: 'Organic' },
            { icon: '📚', name: 'Books' },
            { icon: '🏋️', name: 'Sports' },
          ].map((c) => (
            <div
              key={c.name}
              className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-100 border border-transparent transition"
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="text-xs font-medium text-gray-700">{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-16 border-b border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">How it works</h2>
          <p className="text-sm text-gray-400">Get your store running in three simple steps.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {[
            { step: '1', title: 'Create your account',  desc: 'Register as a vendor in under a minute with your email and basic info.' },
            { step: '2', title: 'Set up your store',    desc: 'Add your store name, logo and start listing products with photos.' },
            { step: '3', title: 'Start selling',        desc: 'Go live instantly. Customers can find and buy from your store right away.' },
          ].map((h) => (
            <div key={h.step} className="text-center">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-medium mx-auto mb-4">
                {h.step}
              </div>
              <p className="text-sm font-medium text-gray-800 mb-2">{h.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Ready to launch your store?
        </h2>
        <p className="text-sm text-gray-400 mb-8">
          Join hundreds of vendors already selling on ShopHub.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="px-7 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Create your store
          </Link>
          <Link
            to="/login"
            className="px-7 py-3 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
          >
            Log in to your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-5 border-t border-gray-100 flex-wrap gap-4">
        <span className="text-sm font-medium text-blue-600">ShopHub</span>
        <span className="text-xs text-gray-400">© 2025 ShopHub. All rights reserved.</span>
        <div className="flex gap-5">
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Privacy</span>
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Terms</span>
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Contact</span>
        </div>
      </footer>

    </div>
  );
}
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function VendorDashboard() {
  const { user }  = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [stats, setStats] = useState({
    totalOrders:   0,
    totalProducts: 0,
    totalRevenue:  0,
    pendingOrders: 0,
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axiosInstance.get('/orders/vendor-orders'),
          axiosInstance.get('/products/my-products'),
        ]);

        const orders   = ordersRes.data.orders;
        const products = productsRes.data.products;

        const revenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        const pending = orders.filter((o) => o.status === 'pending').length;

        setStats({
          totalOrders:   orders.length,
          totalProducts: products.length,
          totalRevenue:  revenue,
          pendingOrders: pending,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0e1a] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Vendor Dashboard</h1>
            <p className="text-sm text-white/40 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition"
          >
            Logout
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total orders',   value: stats.totalOrders },
            { label: 'Total products', value: stats.totalProducts },
            { label: 'Total revenue',  value: `₹${stats.totalRevenue}` },
            { label: 'Pending orders', value: stats.pendingOrders },
          ].map((c) => (
            <div key={c.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
              <p className="text-xs text-white/40 mb-1">{c.label}</p>
              <p className="text-2xl font-bold text-white">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-sm font-medium text-white mb-4">Quick actions</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/vendor/create-store"
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition no-underline"
            >
              Create store
            </Link>
            <Link
              to="/vendor/add-product"
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition no-underline"
            >
              Add product
            </Link>
            <Link
              to="/vendor/products"
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition no-underline"
            >
              View products
            </Link>
            <Link
              to="/vendor/orders"
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition no-underline"
            >
              View orders
              {stats.pendingOrders > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {stats.pendingOrders}
                </span>
              )}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
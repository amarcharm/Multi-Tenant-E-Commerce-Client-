import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function AdminDashboard() {
  const { user }  = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/admin/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0e1a] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-white/40 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition"
          >
            Logout
          </button>
        </div>

        {/* Stats grid */}
        {loading ? (
          <p className="text-white/30 text-sm text-center py-10">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total users',    value: stats?.totalUsers    ?? 0 },
              { label: 'Total vendors',  value: stats?.totalVendors  ?? 0 },
              { label: 'Total stores',   value: stats?.totalStores   ?? 0 },
              { label: 'Total products', value: stats?.totalProducts ?? 0 },
              { label: 'Total orders',   value: stats?.totalOrders   ?? 0 },
              { label: 'Total revenue',  value: `₹${stats?.totalRevenue ?? 0}` },
              { label: 'Pending stores', value: stats?.pendingStores ?? 0 },
            ].map((c) => (
              <div key={c.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
                <p className="text-xs text-white/40 mb-1">{c.label}</p>
                <p className="text-2xl font-bold text-white">{c.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-sm font-medium text-white mb-4">Quick actions</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/stores"
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition no-underline"
            >
              Manage stores
              {stats?.pendingStores > 0 && (
                <span className="ml-2 bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {stats.pendingStores} pending
                </span>
              )}
            </Link>
            <Link
              to="/admin/vendors"
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition no-underline"
            >
              Manage vendors
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition no-underline"
            >
              View all orders
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function VendorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total orders',   value: '0' },
            { label: 'Total products', value: '0' },
            { label: 'Total revenue',  value: '₹0' },
          ].map((c) => (
            <div key={c.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">{c.label}</p>
              <p className="text-2xl font-bold text-white">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
          <p className="text-sm font-medium text-white mb-4">Quick actions</p>
          <div className="flex flex-wrap gap-3">

            {/* ---- REPLACED BUTTONS START HERE ---- */}

            <Link
              to="/vendor/create-store"
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
            >
              Create store
            </Link>

            <Link
              to="/vendor/add-product"
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition"
            >
              Add product
            </Link>

            <Link
              to="/vendor/products"
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition"
            >
              View products
            </Link>

            <button
              className="px-4 py-2 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/[0.06] transition"
            >
              View orders
            </button>

            {/* ---- REPLACED BUTTONS END HERE ---- */}

          </div>
        </div>

      </div>
    </div>
  );
}
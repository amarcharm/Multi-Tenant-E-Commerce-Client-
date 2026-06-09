import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';

export default function VendorDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Vendor Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total orders',   value: '0' },
            { label: 'Total products', value: '0' },
            { label: 'Total revenue',  value: '₹0' },
          ].map((c) => (
            <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-xs text-gray-400 mb-1">{c.label}</p>
              <p className="text-2xl font-semibold text-white">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm font-medium text-white mb-4">Quick actions</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/vendor/create-store"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Create store
            </Link>
            <button className="px-4 py-2 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-800 transition">
              Add product
            </button>
            <button className="px-4 py-2 border border-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-800 transition">
              View orders
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
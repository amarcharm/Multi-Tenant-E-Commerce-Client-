import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axiosInstance';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      dispatch(setCredentials({ token: res.data.token, user: res.data.user }));
      const role = res.data.user.role;
      if (role === 'superadmin') navigate('/admin/dashboard');
      else if (role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">ShopHub</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <p className="bg-red-50 text-red-600 text-sm text-center px-4 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        {/* Form — all inputs centered with fixed width */}
        <form onSubmit={handleLogin} className="flex flex-col items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            className="w-64 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-64 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-64 py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Divider */}
        <div className="border-t border-gray-200 my-5" />

        {/* Links */}
        <p className="text-center text-sm text-gray-400 mb-1">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}
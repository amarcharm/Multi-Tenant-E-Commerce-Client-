import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axiosInstance';

export default function Register() {

  // These hold whatever the user types in the form
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('customer');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate  = useNavigate(); // used to redirect after register
  // const dispatch  = useDispatch(); // used to save user to Redux

  const handleRegister = async (e) => {
    e.preventDefault(); // stops page from refreshing on form submit
    setError('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      // Save token and user into Redux store
      dispatch(setCredentials({
        token: res.data.token,
        user:  res.data.user,
      }));

      // Redirect based on role
      const userRole = res.data.user.role;
      if (userRole === 'superadmin') navigate('/admin/dashboard');
      else if (userRole === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');

    } catch (err) {
      // Show the error message from the backend
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {/* Error message box — only shows if there is an error */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min 6 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Role dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Register as
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        {/* Link to Login */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
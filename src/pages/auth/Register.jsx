import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import axiosInstance from '../../api/axiosInstance';


export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('customer');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password, role });
      dispatch(setCredentials({ token: res.data.token, user: res.data.user }));
      const userRole = res.data.user.role;
      if (userRole === 'superadmin') navigate('/admin/dashboard');
      else if (userRole === 'vendor') {
        if (res.data.user.approved) {
          navigate('/vendor/dashboard');
        } else {
          alert('Your vendor account is pending approval. Please wait for admin approval.');
          navigate('/');
        }
      } else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#f4f3ef] p-4 font-[DM_Sans,sans-serif]">
        <div className="flex w-full max-w-[860px] min-h-[580px] rounded-[20px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.12)]">

          {/* ── Left panel ── */}
          <div className="relative hidden md:flex w-[42%] bg-[#1a1a2e] flex-col justify-between p-10 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[rgba(99,99,255,0.12)] pointer-events-none" />
            <div className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-[rgba(99,99,255,0.08)] pointer-events-none" />

            {/* Brand */}
            <div className="relative z-10">
              <h1 className="text-[2rem] font-bold text-white tracking-tight font-[Playfair_Display,serif]">
                ShopHub
              </h1>
              <p className="mt-1.5 text-[0.72rem] text-white/40 uppercase tracking-widest">
                Your marketplace, simplified
              </p>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="flex-1 bg-black flex flex-col justify-center px-8 py-10">
            <h2 className="font-[Playfair_Display,serif] text-[1.6rem] font-bold text-[#1a1a2e] mb-1">
              Create an account
            </h2>
            <p className="text-[0.82rem] text-gray-400 mb-6">
              Join ShopHub and start selling or shopping today
            </p>

        
            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[0.72rem] text-gray-300 whitespace-nowrap">
                or register with email
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[0.8rem] text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="flex flex-col gap-3.5">

              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-medium text-gray-400 uppercase tracking-wider">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anbu Kumar"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[0.88rem] text-[#1a1a2e] placeholder-gray-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-medium text-gray-400 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[0.88rem] text-[#1a1a2e] placeholder-gray-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-medium text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[0.88rem] text-[#1a1a2e] placeholder-gray-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                />
              </div>

              {/* Role selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-medium text-gray-400 uppercase tracking-wider">
                  Register as
                </label>
                <div className="flex gap-2">
                  {['customer', 'vendor'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-xl border text-[0.82rem] font-medium capitalize transition-all cursor-pointer ${
                        role === r
                          ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {r === 'customer' ? '🛍 Customer' : '🏪 Vendor'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 rounded-xl bg-[#1a1a2e] text-white text-[0.88rem] font-medium tracking-wide hover:bg-[#2d2d5e] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-5 text-center text-[0.78rem] text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-500 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
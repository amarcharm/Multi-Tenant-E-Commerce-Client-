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
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div className="min-h-screen flex items-center justify-center bg-[#f4f3ef] p-4 font-[DM_Sans,sans-serif]">
        <div className="flex w-full max-w-[860px] min-h-[540px] rounded-[20px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.12)]">

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

            {/* Quote */}
            <div className="relative z-10">
              <span className="block font-[Playfair_Display,serif] text-5xl leading-none text-[rgba(99,99,255,0.4)] -mb-2">
                "
              </span>
              <p className="font-[Playfair_Display,serif] text-base italic leading-relaxed text-white/70">
                The easiest way to run your store and reach thousands of customers.
              </p>
            </div>

            {/* Dots */}
            <div className="relative z-10 flex items-center gap-1.5">
              <div className="w-[18px] h-1.5 rounded-sm bg-[rgba(99,99,255,0.8)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="flex-1 bg-black flex flex-col justify-center px-8 py-10">
            <h2 className="font-[Playfair_Display,serif] text-[1.6rem] font-bold text-[#1a1a2e] mb-1">
              Welcome
            </h2>
            <p className="text-[0.82rem] text-gray-400 mb-6">
              Sign in to continue to your account
            </p>

        

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[0.72rem] text-gray-300 whitespace-nowrap">
                or sign in with email
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
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <div className='flex item-center justify-between'>

                
                <label className="text-[0.72rem] font-medium text-gray-400 uppercase tracking-wider">
                  Email address
                </label>
                </div>
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
                <div className="flex items-center justify-between">
                  <label className="text-[0.72rem] font-medium text-gray-400 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[0.75rem] text-indigo-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[0.88rem] text-[#1a1a2e] placeholder-gray-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-3 rounded-xl bg-[#1a1a2e] text-white text-[0.88rem] font-medium tracking-wide hover:bg-[#2d2d5e] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Sign up link */}
            <p className="mt-5 text-center text-[0.78rem] text-gray-400">
              New to ShopHub?{' '}
              <Link
                to="/register"
                className="text-indigo-500 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
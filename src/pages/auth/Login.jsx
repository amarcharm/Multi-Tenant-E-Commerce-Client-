import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin =async (e) =>{
    e.preventDefault()
    setError('')

    try{
      const res = await axiosInstance.post('/auth/login', {email, password})

      localStorage.setItem('token',res.data.token)
      localStorage.setItem('user'. JSON.stringify(res.data.user))

      const role = res.data.user.role
      if(role === 'superadmin') navigate('/admin/dashboard')
      else if(role === 'vendor') navigate('/vendor/dashboard')
      else navigate('/')
    } 
    catch(err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
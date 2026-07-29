import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData)
      if (res.data.token) {
        login(res.data.user, res.data.token)
        const role = res.data.user.role
        if (role === 'admin') navigate('/admin')
        else if (role === 'doctor') navigate('/doctor-dashboard')
        else navigate('/dashboard')
      } else {
        toast.error(res.data.message || 'Login failed.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40">
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70 transition-colors">
          Home
        </span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Login</span>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10" style={{ background: "#111827" }}>

          <h1
            className="text-2xl font-bold text-center mb-6"
            style={{
              background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SynaptoClin
          </h1>

          <h2 className="text-xl font-medium text-white mb-1">Welcome back</h2>
          <p className="text-sm text-white/45 mb-8">Log in to your SynaptoClin account</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mb-3 px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full mb-2 px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500"
            />

            <div className="text-right mb-6">
              <span onClick={() => navigate('/forgot-password')}
                className="text-xs text-blue-400 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Don't have an account?{' '}
            <span onClick={() => navigate('/get-started')}
              className="text-blue-400 cursor-pointer hover:underline">
              Register here
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
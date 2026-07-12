import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const isProperCase = (str) => str.split(' ').every(w => w[0] === w[0]?.toUpperCase())

const GetStarted = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' })
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isProperCase(formData.name)) {
      alert('Name: each word must start with a capital letter.')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-3"
  const errorClass = "text-xs text-red-400 mt-1 mb-2"

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40">
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70 transition-colors">
          Home
        </span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Register</span>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10" style={{ background: "#111827" }}>

          <h1
            className="text-3xl font-bold text-center mb-6"
            style={{
              background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            SynaptoClin
          </h1>

          <h2 className="text-xl font-medium text-white mb-1">Create account</h2>
          <p className="text-sm text-white/45 mb-8">Join SynaptoClin as a patient</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              required
              onChange={set('name')}
              className={inputClass}
            />
            {formData.name && !isProperCase(formData.name) && (
              <p className={errorClass}>Each word must start with a capital letter.</p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              required
              onChange={set('email')}
              className={inputClass}
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              required
              minLength={6}
              onChange={set('password')}
              className={inputClass}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50 mt-3"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline">
              Log in
            </span>
          </p>

        </div>
      </div>
    </div>
  )
}

export default GetStarted
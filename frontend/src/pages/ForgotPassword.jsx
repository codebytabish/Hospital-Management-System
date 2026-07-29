import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-3"

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email })
      toast.success('OTP sent to your email. Check your inbox.')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp })
      toast.success('OTP verified. Set your new password.')
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword })
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/login')} className="cursor-pointer hover:text-white/70">Login</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Forgot Password</span>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-white/10" style={{ background: "#111827" }}>

          <h1 className="text-2xl font-bold text-center mb-2"
            style={{
              background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            SynaptoClin
          </h1>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step >= s ? 'text-white' : 'text-white/30 border border-white/20'
                }`}
                  style={step >= s ? { background: "linear-gradient(135deg,#4f8ef7,#a855f7)" } : {}}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`w-8 h-px ${step > s ? 'bg-blue-500' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1 — Email */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-medium text-white mb-1">Forgot password</h2>
              <p className="text-sm text-white/45 mb-6">Enter your email to receive an OTP</p>
              <form onSubmit={handleSendOTP}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            </>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-medium text-white mb-1">Enter OTP</h2>
              <p className="text-sm text-white/45 mb-2">We sent a 6-digit code to</p>
              <p className="text-sm text-blue-400 mb-6">{email}</p>
              {message && <p className="text-xs text-green-400 mb-3">{message}</p>}
              <form onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  required
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`${inputClass} text-center text-xl tracking-widest`}
                />
                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-white/40">
                Didn't receive it?{' '}
                <span onClick={handleSendOTP} className="text-blue-400 cursor-pointer hover:underline">
                  Resend OTP
                </span>
              </p>
            </>
          )}

          {/* Step 3 — New password */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-medium text-white mb-1">New password</h2>
              <p className="text-sm text-white/45 mb-6">Choose a strong new password</p>
              {message && <p className="text-xs text-green-400 mb-3">{message}</p>}
              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                />
                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          <p className="mt-6 text-center text-sm text-white/40">
            Remember your password?{' '}
            <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline">
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
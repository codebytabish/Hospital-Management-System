import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useAuth()
  const { appointmentId, amount = 500 } = location.state || {}

  const [method, setMethod] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()
    if (!method) return alert('Please select a payment method')
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500))

      await axios.post('http://localhost:5000/api/payment', {
        appointmentId,
        amount,
        method,
        transactionId: `TXN-${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setPaid(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-3"

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0f1e" }}>
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(16,185,129,0.15)" }}>
            <i className="ti ti-circle-check text-4xl text-green-400" />
          </div>
          <h1 className="text-2xl font-medium text-white mb-2">Payment Successful!</h1>
          <p className="text-white/40 text-sm mb-2">Amount paid: <span className="text-white">PKR {amount}</span></p>
          <p className="text-white/40 text-sm mb-8">via <span className="text-white capitalize">{method}</span></p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-white font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Payment</span>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-md p-8 rounded-2xl border border-white/10" style={{ background: "#111827" }}>

          <h1 className="text-2xl font-medium text-white mb-1">Complete Payment</h1>
          <p className="text-sm text-white/45 mb-8">Choose your payment method to confirm the appointment</p>

          {/* Amount */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 mb-6"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-sm text-white/50">Consultation fee</span>
            <span className="text-lg font-medium text-white">PKR {amount}</span>
          </div>

          {/* Payment method selection */}
          <p className="text-xs text-white/40 mb-3">Select payment method</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { id: 'easypaisa', label: 'EasyPaisa', color: '#10b981', icon: 'ti-device-mobile' },
              { id: 'jazzcash', label: 'JazzCash', color: '#ef4444', icon: 'ti-device-mobile' },
              { id: 'stripe', label: 'Card', color: '#4f8ef7', icon: 'ti-credit-card' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${
                  method === m.id ? 'border-opacity-100' : 'border-white/10 bg-transparent'
                }`}
                style={{
                  borderColor: method === m.id ? m.color : undefined,
                  background: method === m.id ? `${m.color}15` : undefined
                }}
              >
                <i className={`ti ${m.icon} text-xl`} style={{ color: m.color }} />
                <span className="text-xs text-white/70">{m.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handlePay}>

            {/* EasyPaisa / JazzCash */}
            {(method === 'easypaisa' || method === 'jazzcash') && (
              <div>
                <label className="text-xs text-white/40 mb-1 block">
                  {method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="03XX-XXXXXXX"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  maxLength={11}
                  className={inputClass}
                />
                <div className="px-4 py-3 rounded-lg border border-yellow-400/30 mb-4"
                  style={{ background: "rgba(234,179,8,0.05)" }}>
                  <p className="text-xs text-yellow-400">
                    ⚠️ You will receive a confirmation PIN on your mobile number.
                    Enter it to complete the payment.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  className={inputClass}
                />
              </div>
            )}

            {/* Stripe / Card */}
            {method === 'stripe' && (
              <div>
                <label className="text-xs text-white/40 mb-1 block">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  maxLength={19}
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      maxLength={5}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      maxLength={3}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="px-4 py-3 rounded-lg border border-blue-400/30 mb-4"
                  style={{ background: "rgba(79,142,247,0.05)" }}>
                  <p className="text-xs text-blue-400">
                    🔒 Test mode — use card: 4242 4242 4242 4242, any expiry and CVV
                  </p>
                </div>
              </div>
            )}

            {method && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
              >
                {loading ? (
                  <>
                    <i className="ti ti-loader-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ti ti-lock" />
                    Pay PKR {amount}
                  </>
                )}
              </button>
            )}
          </form>

          <p className="text-center text-xs text-white/20 mt-4">
            🔒 Secure payment — your data is encrypted
          </p>
        </div>
      </div>
    </div>
  )
}

export default Payment
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const methodColor = {
  easypaisa: { text: 'text-green-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: 'EasyPaisa' },
  jazzcash: { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: 'JazzCash' },
  stripe: { text: 'text-blue-400', bg: 'rgba(79,142,247,0.1)', border: 'rgba(79,142,247,0.3)', label: 'Card' },
}

const statusColor = {
  completed: { text: 'text-green-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  pending: { text: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
  failed: { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
}

const MyPayments = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/payment/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPayments(res.data.payments)
      } catch (err) {
        console.error('Failed to fetch payments', err.response?.data)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const total = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">My Payments</span>
      </div>

      <div className="px-8 py-10 max-w-4xl mx-auto">

        <h1 className="text-white text-xl font-medium mb-6">My Payments</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
            <p className="text-xs text-white/40 mb-1">Total Paid</p>
            <p className="text-2xl font-medium"
              style={{
                background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              PKR {total}
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
            <p className="text-xs text-white/40 mb-1">Transactions</p>
            <p className="text-2xl font-medium"
              style={{
                background: "linear-gradient(90deg,#10b981,#4f8ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {payments.length}
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
            <p className="text-xs text-white/40 mb-1">Completed</p>
            <p className="text-2xl font-medium"
              style={{
                background: "linear-gradient(90deg,#a855f7,#4f8ef7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {payments.filter(p => p.status === 'completed').length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20 text-sm animate-pulse">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(79,142,247,0.1)" }}>
              <i className="ti ti-receipt text-2xl" style={{ color: "#4f8ef7" }} />
            </div>
            <p className="text-white/40 text-sm mb-4">No payment history yet</p>
            <button
              onClick={() => navigate('/book-appointment')}
              className="text-sm text-white px-6 py-2 rounded-lg border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              Book an appointment
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {payments.map(payment => (
              <div key={payment._id}
                className="p-6 rounded-2xl border border-white/10"
                style={{ background: "#111827" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">

                    {/* Transaction ID */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(79,142,247,0.15)" }}>
                        <i className="ti ti-receipt text-sm" style={{ color: "#4f8ef7" }} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {payment.transactionId}
                        </p>
                        <p className="text-xs text-white/30">
                          {new Date(payment.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Appointment details */}
                    {payment.appointment && (
                      <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                        <span className="flex items-center gap-1">
                          <i className="ti ti-calendar" />
                          {new Date(payment.appointment.date).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ti ti-clock" />
                          {payment.appointment.timeSlot}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <i className="ti ti-map-pin" />
                          {payment.appointment.type}
                        </span>
                      </div>
                    )}

                    {/* Method + Status */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${methodColor[payment.method]?.text}`}
                        style={{
                          background: methodColor[payment.method]?.bg,
                          borderColor: methodColor[payment.method]?.border
                        }}
                      >
                        {methodColor[payment.method]?.label || payment.method}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[payment.status]?.text}`}
                        style={{
                          background: statusColor[payment.status]?.bg,
                          borderColor: statusColor[payment.status]?.border
                        }}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right ml-4">
                    <p className="text-lg font-medium text-white">PKR {payment.amount}</p>
                    <p className="text-xs text-white/30">Consultation fee</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyPayments
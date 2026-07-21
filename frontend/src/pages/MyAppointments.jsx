import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const statusColor = {
  pending: { text: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
  confirmed: { text: 'text-green-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  cancelled: { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
}

const MyAppointments = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointment', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppointments(res.data)
    } catch (err) {
      console.error('Failed to fetch appointments', err.response?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await axios.delete(`http://localhost:5000/api/appointment/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAppointments()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel.')
    }
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
        <span className="text-white/70">My Appointments</span>
      </div>

      <div className="px-8 py-10 max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-xl font-medium">My Appointments</h1>
          <button
            onClick={() => navigate('/book-appointment')}
            className="text-sm text-white font-medium px-5 py-2 rounded-lg border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
          >
            + Book New
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20 text-sm animate-pulse">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(79,142,247,0.1)" }}>
              <i className="ti ti-calendar-off text-2xl" style={{ color: "#4f8ef7" }} />
            </div>
            <p className="text-white/40 text-sm mb-4">No appointments yet</p>
            <button
              onClick={() => navigate('/book-appointment')}
              className="text-sm text-white px-6 py-2 rounded-lg border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              Book your first appointment
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map(appt => (
              <div key={appt._id}
                className="p-6 rounded-2xl border border-white/10"
                style={{ background: "#111827" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white text-sm font-medium">
                        Dr. {appt.doctor?.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[appt.status]?.text}`}
                        style={{
                          background: statusColor[appt.status]?.bg,
                          borderColor: statusColor[appt.status]?.border
                        }}
                      >
                        {appt.status}
                      </span>
                      <span className="text-xs text-white/30 border border-white/10 px-2 py-0.5 rounded-full capitalize">
                        {appt.type}
                      </span>
                    </div>

                    {appt.doctor?.specialization && (
                      <p className="text-xs text-white/40 mb-3">{appt.doctor.specialization}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-white/50 mb-2">
                      <span className="flex items-center gap-1">
                        <i className="ti ti-calendar" />
                        {new Date(appt.date).toLocaleDateString('en-US', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ti ti-clock" />
                        {appt.timeSlot}
                      </span>
                    </div>

                    {appt.symptoms && (
                      <p className="text-xs text-white/40">
                        Symptoms: {appt.symptoms}
                      </p>
                    )}
                  </div>

                  {appt.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(appt._id)}
                      className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-red-400/10 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointments
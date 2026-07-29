import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const statusColor = {
  pending: { text: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
  confirmed: { text: 'text-green-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  cancelled: { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  completed: { text: 'text-blue-400', bg: 'rgba(79,142,247,0.1)', border: 'rgba(79,142,247,0.3)' },
  'no-show': { text: 'text-white/40', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
}

const MyAppointments = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

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
      toast.error(err.response?.data?.message || 'Failed to cancel.')
    }
  }

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
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

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-4 py-2 rounded-lg border cursor-pointer capitalize transition-all ${
                filter === f
                  ? 'text-white border-blue-500/50'
                  : 'text-white/40 border-white/10 bg-transparent hover:text-white/70'
              }`}
              style={filter === f ? { background: "rgba(79,142,247,0.15)" } : {}}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20 text-sm animate-pulse">
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(79,142,247,0.1)" }}>
              <i className="ti ti-calendar-off text-2xl" style={{ color: "#4f8ef7" }} />
            </div>
            <p className="text-white/40 text-sm mb-4">No {filter} appointments</p>
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
            {filtered.map(appt => (
              <div key={appt._id}
                className="p-6 rounded-2xl border border-white/10"
                style={{ background: "#111827" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">

                    {/* Doctor + status */}
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
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
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize flex items-center gap-1 ${
                        appt.type === 'online' || appt.type === 'telemedicine'
                          ? 'text-blue-400 border-blue-400/30'
                          : 'text-white/30 border-white/10'
                      }`}
                        style={{
                          background: appt.type === 'online' || appt.type === 'telemedicine'
                            ? 'rgba(79,142,247,0.1)'
                            : 'transparent'
                        }}>
                        {appt.type === 'online' || appt.type === 'telemedicine'
                          ? <><i className="ti ti-video" /> Online</>
                          : <><i className="ti ti-building-hospital" /> In-person</>
                        }
                      </span>
                    </div>

                    {appt.doctor?.specialization && (
                      <p className="text-xs text-white/40 mb-3">{appt.doctor.specialization}</p>
                    )}

                    {/* Date & time */}
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

                    {/* Symptoms */}
                    {appt.symptoms && (
                      <p className="text-xs text-white/40 mb-3">
                        Symptoms: {appt.symptoms}
                      </p>
                    )}

                    {/* Doctor notes */}
                    {appt.notes && (
                      <div className="mt-2 px-3 py-2 rounded-lg text-xs border border-white/8"
                        style={{ background: "rgba(79,142,247,0.05)" }}>
                        <span className="text-white/30 mr-1">Doctor's notes:</span>
                        <span className="text-white/60">{appt.notes}</span>
                      </div>
                    )}

                    {/* Join video call button */}
                    {(appt.type === 'online' || appt.type === 'telemedicine') &&
                      appt.status === 'confirmed' &&
                      appt.meetingUrl && (
                      <a
                        href={appt.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg hover:bg-blue-400/10 transition-colors"
                      >
                        <i className="ti ti-video" />
                        Join Video Call
                      </a>
                    )}
                  </div>

                  {/* Cancel button */}
                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <button
                      onClick={() => handleCancel(appt._id)}
                      className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-red-400/10 transition-colors ml-4"
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
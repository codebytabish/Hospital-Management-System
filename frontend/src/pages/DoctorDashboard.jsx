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

const DoctorDashboard = () => {
  const navigate = useNavigate()
  const { user, token, logout } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [notes, setNotes] = useState({})
  const [savingNotes, setSavingNotes] = useState({})

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

  const handleStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/appointment/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleSaveNotes = async (id) => {
    setSavingNotes(prev => ({ ...prev, [id]: true }))
    try {
      await axios.patch(
        `http://localhost:5000/api/appointment/${id}/status`,
        { status: 'confirmed', notes: notes[id] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Notes saved successfully')
      fetchAppointments()
    } catch (err) {
      toast.error('Failed to save notes')
    } finally {
      setSavingNotes(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

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

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10"
        style={{ background: "#111827" }}>
        <h1 className="text-xl font-bold"
          style={{
            background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          SynaptoClin
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-white">{user?.name}</p>
            <p className="text-xs text-white/40">{user?.specialization || 'Doctor'}</p>
          </div>
          <button
            onClick={() => navigate('/doctor-profile')}
            className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-lg hover:border-blue-400/50 hover:text-blue-400 transition-colors cursor-pointer bg-transparent">
            Profile
          </button>
          <button
            onClick={() => navigate('/prescriptions')}
            className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-lg hover:border-blue-400/50 hover:text-blue-400 transition-colors cursor-pointer bg-transparent">
            Prescriptions
          </button>
          <button onClick={handleLogout}
            className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-lg hover:border-red-400/50 hover:text-red-400 transition-colors cursor-pointer bg-transparent">
            Log out
          </button>
        </div>
      </div>

      <div className="px-8 py-10 max-w-5xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: counts.all, color: '#4f8ef7' },
            { label: 'Pending', value: counts.pending, color: '#eab308' },
            { label: 'Confirmed', value: counts.confirmed, color: '#10b981' },
            { label: 'Cancelled', value: counts.cancelled, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} className="p-5 rounded-2xl border border-white/10"
              style={{ background: "#111827" }}>
              <p className="text-xs text-white/40 mb-1">{stat.label}</p>
              <p className="text-3xl font-medium" style={{
                background: `linear-gradient(90deg, ${stat.color}, #a855f7)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>{stat.value}</p>
            </div>
          ))}
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

        {/* Appointments */}
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
            <p className="text-white/40 text-sm">No {filter} appointments</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(appt => (
              <div key={appt._id}
                className="p-6 rounded-2xl border border-white/10"
                style={{ background: "#111827" }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">

                    {/* Patient info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
                        <i className="ti ti-user text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{appt.patient?.name}</p>
                        <p className="text-xs text-white/40">{appt.patient?.email}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ml-2 ${statusColor[appt.status]?.text}`}
                        style={{
                          background: statusColor[appt.status]?.bg,
                          borderColor: statusColor[appt.status]?.border
                        }}
                      >
                        {appt.status}
                      </span>
                      {(appt.type === 'online' || appt.type === 'telemedicine') && (
                        <span className="text-xs text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: "rgba(79,142,247,0.1)" }}>
                          <i className="ti ti-video" /> Online
                        </span>
                      )}
                    </div>

                    {/* Appointment details */}
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
                      <span className="flex items-center gap-1 capitalize">
                        <i className="ti ti-map-pin" />
                        {appt.type}
                      </span>
                    </div>

                    {/* Symptoms */}
                    {appt.symptoms && (
                      <div className="mt-2 px-3 py-2 rounded-lg text-xs text-white/50 border border-white/8"
                        style={{ background: "rgba(255,255,255,0.03)" }}>
                        <span className="text-white/30 mr-1">Symptoms:</span>
                        {appt.symptoms}
                      </div>
                    )}

                    {/* Doctor notes — editable when confirmed */}
                    {appt.status === 'confirmed' && (
                      <div className="mt-3">
                        <label className="text-xs text-white/30 mb-1 block">
                          <i className="ti ti-notes mr-1" />
                          Doctor Notes
                        </label>
                        <textarea
                          value={notes[appt._id] ?? appt.notes ?? ''}
                          onChange={(e) => setNotes(prev => ({ ...prev, [appt._id]: e.target.value }))}
                          rows={2}
                          placeholder="Add notes for this patient..."
                          className="w-full px-3 py-2 rounded-lg text-xs text-white placeholder-white/20 border border-white/8 bg-white/5 focus:outline-none focus:border-blue-500 resize-none mb-2"
                        />
                        <button
                          onClick={() => handleSaveNotes(appt._id)}
                          disabled={savingNotes[appt._id]}
                          className="text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-blue-400/10 transition-colors disabled:opacity-50"
                        >
                          {savingNotes[appt._id] ? 'Saving...' : 'Save Notes'}
                        </button>
                      </div>
                    )}

                    {/* Show notes read-only for other statuses */}
                    {appt.status !== 'confirmed' && appt.notes && (
                      <div className="mt-3 px-3 py-2 rounded-lg border border-white/8 text-xs"
                        style={{ background: "rgba(79,142,247,0.05)" }}>
                        <p className="text-white/30 mb-1">
                          <i className="ti ti-notes mr-1" />
                          Doctor Notes
                        </p>
                        <p className="text-white/60">{appt.notes}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <button
                        onClick={() => navigate(`/patient-history/${appt.patient?._id}`)}
                        className="text-xs text-purple-400 border border-purple-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-purple-400/10 transition-colors"
                      >
                        <i className="ti ti-brain mr-1" />
                        Symptom History
                      </button>
                      <button
                        onClick={() => navigate('/prescriptions')}
                        className="text-xs text-blue-400 border border-blue-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-blue-400/10 transition-colors"
                      >
                        <i className="ti ti-file-text mr-1" />
                        Write Prescription
                      </button>
                      {(appt.type === 'online' || appt.type === 'telemedicine') &&
                        appt.status === 'confirmed' &&
                        appt.meetingUrl && (
                          <a
                            href={appt.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-400 border border-green-400/30 px-3 py-1.5 rounded-lg hover:bg-green-400/10 transition-colors inline-flex items-center gap-1"
                          >
                            <i className="ti ti-video" />
                            Join Video Call
                          </a>
                        )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {appt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatus(appt._id, 'confirmed')}
                          className="text-xs text-green-400 border border-green-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-green-400/10 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatus(appt._id, 'cancelled')}
                          className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-red-400/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatus(appt._id, 'cancelled')}
                        className="text-xs text-red-400 border border-red-400/30 px-3 py-1.5 rounded-lg bg-transparent cursor-pointer hover:bg-red-400/10 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
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

export default DoctorDashboard
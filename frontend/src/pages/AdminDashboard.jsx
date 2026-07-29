import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('doctors')
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [apptFilter, setApptFilter] = useState('all')
  const [formData, setFormData] = useState({ name: '', email: '', password: '', specialization: '' })

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })
  const headers = { Authorization: `Bearer ${token}` }

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/doctors', { headers })
      setDoctors(res.data.doctors)
    } catch (err) { console.error(err) }
  }

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/patients', { headers })
      setPatients(res.data.patients)
    } catch (err) { console.error(err) }
  }

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointment/all', { headers })
      setAppointments(res.data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    fetchDoctors()
    fetchPatients()
    fetchAppointments()
  }, [])

  const handleAddDoctor = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/users/add-doctor', formData, { headers })
      toast.success('Doctor added successfully!')
      setFormData({ name: '', email: '', password: '', specialization: '' })
      setShowForm(false)
      fetchDoctors()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { headers })
      fetchPatients()
      fetchDoctors()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-3"

  const statusColor = {
    pending: { text: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
    confirmed: { text: 'text-green-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
    cancelled: { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  }

  const filteredAppointments = apptFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === apptFilter)

  const apptCounts = {
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
          SynaptoClin — Admin
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white">{user?.name}</span>
          <button onClick={handleLogout}
            className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-lg hover:border-red-400/50 hover:text-red-400 transition-colors cursor-pointer bg-transparent">
            Log out
          </button>
        </div>
      </div>

      <div className="px-8 py-10 max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Doctors', value: doctors.length, color: '#4f8ef7' },
            { label: 'Total Patients', value: patients.length, color: '#10b981' },
            { label: 'Total Appointments', value: appointments.length, color: '#a855f7' },
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

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {['doctors', 'patients', 'appointments'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-4 py-2 rounded-lg border cursor-pointer capitalize transition-all ${
                tab === t
                  ? 'text-white border-blue-500/50'
                  : 'text-white/40 border-white/10 bg-transparent hover:text-white/70'
              }`}
              style={tab === t ? { background: "rgba(79,142,247,0.15)" } : {}}>
              {t}
            </button>
          ))}
        </div>

        {/* Doctors tab */}
        {tab === 'doctors' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-medium">Doctors</h2>
              <button onClick={() => setShowForm(!showForm)}
                className="text-sm text-white font-medium px-5 py-2 rounded-lg border-none cursor-pointer"
                style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                {showForm ? 'Cancel' : '+ Add Doctor'}
              </button>
            </div>

            {showForm && (
              <div className="p-6 rounded-2xl border border-white/10 mb-6" style={{ background: "#111827" }}>
                <h3 className="text-white text-sm font-medium mb-4">New Doctor</h3>
                <form onSubmit={handleAddDoctor}>
                  <input type="text" placeholder="Full Name" value={formData.name}
                    required onChange={set('name')} className={inputClass} />
                  <input type="email" placeholder="Email" value={formData.email}
                    required onChange={set('email')} className={inputClass} />
                  <input type="password" placeholder="Password" value={formData.password}
                    required minLength={6} onChange={set('password')} className={inputClass} />
                  <input type="text" placeholder="Specialization (e.g. Cardiologist)"
                    value={formData.specialization} required onChange={set('specialization')} className={inputClass} />
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                    {loading ? 'Adding...' : 'Add Doctor'}
                  </button>
                </form>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "#111827" }}>
              {doctors.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">No doctors added yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Name</th>
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Email</th>
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Specialization</th>
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc, i) => (
                      <tr key={doc._id} className={i !== doctors.length - 1 ? 'border-b border-white/6' : ''}>
                        <td className="px-6 py-4 text-sm text-white">{doc.name}</td>
                        <td className="px-6 py-4 text-sm text-white/50">{doc.email}</td>
                        <td className="px-6 py-4 text-sm text-white/50">{doc.specialization || '—'}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDeleteUser(doc._id, doc.name)}
                            className="text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded-lg bg-transparent cursor-pointer hover:bg-red-400/10 transition-colors">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Patients tab */}
        {tab === 'patients' && (
          <>
            <h2 className="text-white text-lg font-medium mb-4">Patients</h2>
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "#111827" }}>
              {patients.length === 0 ? (
                <div className="p-8 text-center text-white/40 text-sm">No patients yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Name</th>
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Email</th>
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Phone</th>
                      <th className="text-left px-6 py-3 text-xs text-white/40 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p, i) => (
                      <tr key={p._id} className={i !== patients.length - 1 ? 'border-b border-white/6' : ''}>
                        <td className="px-6 py-4 text-sm text-white">{p.name}</td>
                        <td className="px-6 py-4 text-sm text-white/50">{p.email}</td>
                        <td className="px-6 py-4 text-sm text-white/50">{p.phone || '—'}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDeleteUser(p._id, p.name)}
                            className="text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded-lg bg-transparent cursor-pointer hover:bg-red-400/10 transition-colors">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Appointments tab */}
        {tab === 'appointments' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-medium">All Appointments</h2>
              <div className="flex items-center gap-2">
                {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                  <button key={f} onClick={() => setApptFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer capitalize transition-all ${
                      apptFilter === f
                        ? 'text-white border-blue-500/50'
                        : 'text-white/40 border-white/10 bg-transparent hover:text-white/70'
                    }`}
                    style={apptFilter === f ? { background: "rgba(79,142,247,0.15)" } : {}}>
                    {f} ({apptCounts[f]})
                  </button>
                ))}
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-8 text-center text-white/40 text-sm rounded-2xl border border-white/10"
                style={{ background: "#111827" }}>
                No {apptFilter} appointments
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredAppointments.map(appt => (
                  <div key={appt._id} className="p-6 rounded-2xl border border-white/10"
                    style={{ background: "#111827" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-white text-sm font-medium">{appt.patient?.name}</p>
                          <span className="text-white/30 text-xs">→</span>
                          <p className="text-white/70 text-sm">Dr. {appt.doctor?.name}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[appt.status]?.text}`}
                            style={{
                              background: statusColor[appt.status]?.bg,
                              borderColor: statusColor[appt.status]?.border
                            }}>
                            {appt.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span>
                            <i className="ti ti-calendar mr-1" />
                            {new Date(appt.date).toLocaleDateString('en-US', {
                              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </span>
                          <span><i className="ti ti-clock mr-1" />{appt.timeSlot}</span>
                          <span className="capitalize"><i className="ti ti-map-pin mr-1" />{appt.type}</span>
                        </div>
                        {appt.symptoms && (
                          <p className="text-xs text-white/30 mt-2">Symptoms: {appt.symptoms}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
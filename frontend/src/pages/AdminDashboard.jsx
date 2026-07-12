import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', specialization: '' })
  const [showForm, setShowForm] = useState(false)

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDoctors(res.data.doctors)
    } catch (err) {
      console.error('Failed to fetch doctors')
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  const handleAddDoctor = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/users/add-doctor', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Doctor added successfully!')
      setFormData({ name: '', email: '', password: '', specialization: '' })
      setShowForm(false)
      fetchDoctors()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add doctor.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-3"

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
          <span className="text-sm text-white/50">
            <span className="text-white">{user?.name}</span>
          </span>
          <button onClick={handleLogout}
            className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-lg hover:border-red-400/50 hover:text-red-400 transition-colors cursor-pointer bg-transparent">
            Log out
          </button>
        </div>
      </div>

      <div className="px-8 py-10 max-w-5xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-6 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
            <p className="text-xs text-white/40 mb-1">Total Doctors</p>
            <p className="text-3xl font-medium"
              style={{
                background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {doctors.length}
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
            <p className="text-xs text-white/40 mb-1">Platform</p>
            <p className="text-sm text-white font-medium mt-2">SynaptoClin AI</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
            <p className="text-xs text-white/40 mb-1">Role</p>
            <p className="text-sm text-green-400 font-medium mt-2 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Doctors list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-medium">Doctors</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm text-white font-medium px-5 py-2 rounded-lg border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
          >
            {showForm ? 'Cancel' : '+ Add Doctor'}
          </button>
        </div>

        {/* Add doctor form */}
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
              <input type="text" placeholder="Specialization (e.g. Cardiologist)" value={formData.specialization}
                required onChange={set('specialization')} className={inputClass} />
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                {loading ? 'Adding...' : 'Add Doctor'}
              </button>
            </form>
          </div>
        )}

        {/* Doctors table */}
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
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <tr key={doc._id} className={i !== doctors.length - 1 ? 'border-b border-white/6' : ''}>
                    <td className="px-6 py-4 text-sm text-white">{doc.name}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{doc.email}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{doc.specialization || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 
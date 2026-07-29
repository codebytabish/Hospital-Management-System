import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const BookAppointment = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [formData, setFormData] = useState({
    doctorId: '', date: '', time: '', reason: '', type: 'in-person'
  })
  const [loading, setLoading] = useState(false)

  const fetchDoctors = async (query = '') => {
    setSearching(true)
    try {
      const url = query
        ? `http://localhost:5000/api/users/doctors/search?specialization=${query}`
        : `http://localhost:5000/api/users/doctors`
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setDoctors(res.data.doctors)
    } catch (err) {
      console.error('Failed to fetch doctors')
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDoctors(search)
    }, 400)
    return () => clearTimeout(timeout)
  }, [search])

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/api/appointment', {
        doctorId: formData.doctorId,
        date: formData.date,
        timeSlot: formData.time,
        symptoms: formData.reason,
        type: formData.type,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (formData.type === 'online') {
        // Online → must pay now
        toast.success('Appointment booked! Complete payment to confirm.')
        setTimeout(() => {
          navigate('/payment', {
            state: {
              appointmentId: res.data._id,
              amount: 500
            }
          })
        }, 1500)
      } else {
        // In-person → pay at clinic
        toast.success('Appointment booked! You can pay at the clinic.')
        setTimeout(() => navigate('/dashboard'), 1500)
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-4"

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Book Appointment</span>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-md p-8 rounded-2xl border border-white/10" style={{ background: "#111827" }}>

          <h1 className="text-2xl font-medium text-white mb-1">Book Appointment</h1>
          <p className="text-sm text-white/45 mb-8">Schedule a visit with a verified doctor</p>

          <form onSubmit={handleSubmit}>

            {/* Search by specialization */}
            <label className="text-xs text-white/40 mb-1 block">Search by Specialization</label>
            <div className="relative mb-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Cardiologist, Neurologist..."
                className="w-full px-4 py-2.5 pl-9 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500"
              />
              <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              {searching && (
                <i className="ti ti-loader-2 animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
              )}
            </div>

            {/* Doctor */}
            <label className="text-xs text-white/40 mb-1 block mt-3">Select Doctor</label>
            <select
              value={formData.doctorId}
              onChange={set('doctorId')}
              required
              className={inputClass}
              style={{ background: "#1f2937" }}
            >
              <option value="">
                {doctors.length === 0 ? 'No doctors found' : 'Choose a doctor...'}
              </option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}{doc.specialization ? ` — ${doc.specialization}` : ''}
                </option>
              ))}
            </select>

            {/* Date */}
            <label className="text-xs text-white/40 mb-1 block">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={set('date')}
              required
              min={new Date().toISOString().split('T')[0]}
              className={inputClass}
              style={{ colorScheme: 'dark' }}
            />

            {/* Time */}
            <label className="text-xs text-white/40 mb-1 block">Time Slot</label>
            <select
              value={formData.time}
              onChange={set('time')}
              required
              className={inputClass}
              style={{ background: "#1f2937" }}
            >
              <option value="">Choose a time...</option>
              {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Type */}
            <label className="text-xs text-white/40 mb-1 block">Appointment Type</label>
            <select
              value={formData.type}
              onChange={set('type')}
              required
              className={inputClass}
              style={{ background: "#1f2937" }}
            >
              <option value="in-person">🏥 In-person</option>
              <option value="online">🎥 Online (Video Call)</option>
            </select>

            {/* Symptoms */}
            <label className="text-xs text-white/40 mb-1 block">Symptoms / Reason for visit</label>
            <textarea
              value={formData.reason}
              onChange={set('reason')}
              required
              rows={3}
              placeholder="Describe your symptoms or reason..."
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-4 resize-none"
            />
            {/* Payment notice */}
            {formData.type === 'online' ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-blue-400/30 mb-4"
                style={{ background: "rgba(79,142,247,0.05)" }}>
                <i className="ti ti-credit-card text-blue-400 text-sm" />
                <p className="text-xs text-blue-400">Online payment required — PKR 500</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-green-400/30 mb-4"
                style={{ background: "rgba(16,185,129,0.05)" }}>
                <i className="ti ti-building-hospital text-green-400 text-sm" />
                <p className="text-xs text-green-400">Pay at clinic during your visit</p>
              </div>
            )}

            {/* Consultation fee notice */}
            <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/10 mb-4"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <span className="text-xs text-white/40">Consultation fee</span>
              <span className="text-sm font-medium text-white">PKR 500</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              {loading ? 'Processing...' : formData.type === 'online' ? 'Continue to Payment →' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
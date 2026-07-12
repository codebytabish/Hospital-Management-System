import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const BookAppointment = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [formData, setFormData] = useState({ doctorId: '', date: '', time: '', reason: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
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
    fetchDoctors()
  }, [])

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:5000/api/appointment', {
        doctorId: formData.doctorId,
        date: formData.date,
        timeSlot: formData.time,
        symptoms: formData.reason,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Appointment booked successfully!')
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-4"

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40">
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

            {/* Doctor */}
            <label className="text-xs text-white/40 mb-1 block">Select Doctor</label>
            <select
              value={formData.doctorId}
              onChange={set('doctorId')}
              required
              className={inputClass}
              style={{ background: "#1f2937" }}
            >
              <option value="">Choose a doctor...</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name}</option>
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
            <label className="text-xs text-white/40 mb-1 block">Time</label>
            <select
              value={formData.time}
              onChange={set('time')}
              required
              className={inputClass}
              style={{ background: "#1f2937" }}
            >
              <option value="">Choose a time...</option>
              {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Reason */}
            <label className="text-xs text-white/40 mb-1 block">Reason for visit</label>
            <textarea
              value={formData.reason}
              onChange={set('reason')}
              required
              rows={3}
              placeholder="Describe your symptoms or reason..."
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-4 resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
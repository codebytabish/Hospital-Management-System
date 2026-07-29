import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Prescriptions = () => {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [formData, setFormData] = useState({
    appointmentId: '',
    patientId: '',
    diagnosis: '',
    notes: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
  })

  const headers = { Authorization: `Bearer ${token}` }

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/prescription/doctor', { headers })
      setPrescriptions(res.data.prescriptions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointment', { headers })
      setAppointments(res.data.filter(a => a.status === 'confirmed'))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
    fetchAppointments()
  }, [])

  const handleAppointmentChange = (e) => {
    const appt = appointments.find(a => a._id === e.target.value)
    setFormData({
      ...formData,
      appointmentId: e.target.value,
      patientId: appt?.patient?._id || ''
    })
  }

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    })
  }

  const removeMedicine = (index) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== index)
    })
  }

  const updateMedicine = (index, field, value) => {
    const updated = [...formData.medicines]
    updated[index][field] = value
    setFormData({ ...formData, medicines: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/prescription', formData, { headers })
      toast.success('Prescription created successfully!')
      setShowForm(false)
      setFormData({
        appointmentId: '',
        patientId: '',
        diagnosis: '',
        notes: '',
        medicines: [{ name: '', dosage: '', frequency: '', duration: '' }]
      })
      fetchPrescriptions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prescription.')
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500"

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/doctor-dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Prescriptions</span>
      </div>

      <div className="px-8 py-10 max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-xl font-medium">Prescriptions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm text-white font-medium px-5 py-2 rounded-lg border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
          >
            {showForm ? 'Cancel' : '+ New Prescription'}
          </button>
        </div>

        {/* Create prescription form */}
        {showForm && (
          <div className="p-6 rounded-2xl border border-white/10 mb-6" style={{ background: "#111827" }}>
            <h3 className="text-white text-sm font-medium mb-4">New Prescription</h3>
            <form onSubmit={handleSubmit}>

              {/* Select appointment */}
              <label className="text-xs text-white/40 mb-1 block">Select Appointment</label>
              <select
                value={formData.appointmentId}
                onChange={handleAppointmentChange}
                required
                className={`${inputClass} mb-4`}
                style={{ background: "#1f2937" }}
              >
                <option value="">Choose confirmed appointment...</option>
                {appointments.map(appt => (
                  <option key={appt._id} value={appt._id}>
                    {appt.patient?.name} — {new Date(appt.date).toLocaleDateString()} {appt.timeSlot}
                  </option>
                ))}
              </select>

              {/* Diagnosis */}
              <label className="text-xs text-white/40 mb-1 block">Diagnosis</label>
              <input
                type="text"
                placeholder="e.g. Viral fever, Hypertension"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                required
                className={`${inputClass} mb-4`}
              />

              {/* Medicines */}
              <label className="text-xs text-white/40 mb-2 block">Medicines</label>
              {formData.medicines.map((med, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/8 mb-3"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text" placeholder="Medicine name"
                      value={med.name}
                      onChange={(e) => updateMedicine(i, 'name', e.target.value)}
                      required className={inputClass}
                    />
                    <input
                      type="text" placeholder="Dosage (e.g. 500mg)"
                      value={med.dosage}
                      onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                      required className={inputClass}
                    />
                    <input
                      type="text" placeholder="Frequency (e.g. Twice daily)"
                      value={med.frequency}
                      onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
                      required className={inputClass}
                    />
                    <input
                      type="text" placeholder="Duration (e.g. 7 days)"
                      value={med.duration}
                      onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
                      required className={inputClass}
                    />
                  </div>
                  {formData.medicines.length > 1 && (
                    <button type="button" onClick={() => removeMedicine(i)}
                      className="text-xs text-red-400 bg-transparent border-none cursor-pointer hover:underline">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addMedicine}
                className="text-xs text-blue-400 bg-transparent border-none cursor-pointer hover:underline mb-4">
                + Add another medicine
              </button>

              {/* Notes */}
              <label className="text-xs text-white/40 mb-1 block">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional instructions..."
                rows={3}
                className={`${inputClass} mb-4 resize-none`}
              />

              <button type="submit"
                className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer"
                style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                Create Prescription
              </button>
            </form>
          </div>
        )}

        {/* Prescriptions list */}
        {loading ? (
          <div className="text-center text-white/40 py-20 text-sm animate-pulse">
            Loading prescriptions...
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(79,142,247,0.1)" }}>
              <i className="ti ti-file-text text-2xl" style={{ color: "#4f8ef7" }} />
            </div>
            <p className="text-white/40 text-sm">No prescriptions yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {prescriptions.map(rx => (
              <div key={rx._id} className="p-6 rounded-2xl border border-white/10"
                style={{ background: "#111827" }}>

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
                        <i className="ti ti-user text-white text-sm" />
                      </div>
                      <p className="text-white text-sm font-medium">{rx.patient?.name}</p>
                      <span className="text-xs text-white/30">{rx.patient?.email}</span>
                    </div>
                    <p className="text-xs text-white/30 ml-11">
                      {new Date(rx.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-xs text-blue-400 border border-blue-400/30 px-3 py-1 rounded-full"
                    style={{ background: "rgba(79,142,247,0.1)" }}>
                    <i className="ti ti-file-text mr-1" />
                    Prescription
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="px-4 py-3 rounded-lg border border-white/8 mb-3"
                  style={{ background: "rgba(79,142,247,0.05)" }}>
                  <p className="text-xs text-white/30 mb-1">🔍 Diagnosis</p>
                  <p className="text-sm text-white">{rx.diagnosis}</p>
                </div>

                {/* Medicines */}
                <div className="mb-3">
                  <p className="text-xs text-white/30 mb-2">💊 Medicines</p>
                  <div className="flex flex-col gap-2">
                    {rx.medicines.map((med, i) => (
                      <div key={i} className="flex items-center gap-4 px-4 py-2 rounded-lg border border-white/8 text-xs"
                        style={{ background: "rgba(255,255,255,0.02)" }}>
                        <span className="text-white font-medium">{med.name}</span>
                        <span className="text-white/40">{med.dosage}</span>
                        <span className="text-white/40">{med.frequency}</span>
                        <span className="text-white/40">{med.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {rx.notes && (
                  <div className="px-4 py-3 rounded-lg border border-white/8"
                    style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="text-xs text-white/30 mb-1">📝 Notes</p>
                    <p className="text-sm text-white/60">{rx.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Prescriptions
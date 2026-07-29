import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const MyPrescriptions = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/prescription/patient', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPrescriptions(res.data.prescriptions)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPrescriptions()
  }, [])

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">My Prescriptions</span>
      </div>

      <div className="px-8 py-10 max-w-4xl mx-auto">

        <h1 className="text-white text-xl font-medium mb-6">My Prescriptions</h1>

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
            <p className="text-white/40 text-sm mb-4">No prescriptions yet</p>
            <p className="text-white/25 text-xs">Your doctor will add prescriptions after your appointment</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {prescriptions.map(rx => (
              <div key={rx._id} className="p-6 rounded-2xl border border-white/10"
                style={{ background: "#111827" }}>

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                      <i className="ti ti-stethoscope text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{rx.doctor?.name}</p>
                      <p className="text-xs text-white/40">{rx.doctor?.specialization}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/30 text-right">
                      {new Date(rx.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                    {rx.appointment && (
                      <p className="text-xs text-white/20 text-right mt-1">
                        {new Date(rx.appointment.date).toLocaleDateString()} — {rx.appointment.timeSlot}
                      </p>
                    )}
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
                      <div key={i}
                        className="grid grid-cols-4 gap-3 px-4 py-3 rounded-lg border border-white/8 text-xs"
                        style={{ background: "rgba(255,255,255,0.02)" }}>
                        <div>
                          <p className="text-white/30 mb-0.5">Medicine</p>
                          <p className="text-white font-medium">{med.name}</p>
                        </div>
                        <div>
                          <p className="text-white/30 mb-0.5">Dosage</p>
                          <p className="text-white/70">{med.dosage}</p>
                        </div>
                        <div>
                          <p className="text-white/30 mb-0.5">Frequency</p>
                          <p className="text-white/70">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-white/30 mb-0.5">Duration</p>
                          <p className="text-white/70">{med.duration}</p>
                        </div>
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

export default MyPrescriptions
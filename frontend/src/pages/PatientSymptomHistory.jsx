import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const urgencyColor = {
  low: { text: 'text-green-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', label: '🟢 Low' },
  moderate: { text: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', label: '🟡 Moderate' },
  high: { text: 'text-orange-400', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', label: '🟠 High' },
  emergency: { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', label: '🔴 Emergency' },
}

const PatientSymptomHistory = () => {
  const navigate = useNavigate()
  const { patientId } = useParams()
  const { token } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [patientName, setPatientName] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/ai/history/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setLogs(res.data.logs)
        if (res.data.logs.length > 0 && res.data.logs[0].patient?.name) {
          setPatientName(res.data.logs[0].patient?.name)
        }
      } catch (err) {
        console.error('Failed to fetch symptom history', err.response?.data)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [patientId])

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/doctor-dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Symptom History</span>
      </div>

      <div className="px-8 py-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10">
            <i className="ti ti-user text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-medium">
              {patientName || 'Patient'} — Symptom History
            </h1>
            <p className="text-xs text-white/40">AI-generated symptom analysis logs</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20 text-sm animate-pulse">
            Loading symptom history...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(168,85,247,0.1)" }}>
              <i className="ti ti-brain text-2xl" style={{ color: "#a855f7" }} />
            </div>
            <p className="text-white/40 text-sm">No symptom history found for this patient</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {logs.map((log, i) => {
              const userMsg = log.messages?.find(m => m.role === 'user')
              const aiResult = log.aiResult

              return (
                <div key={log._id || i}
                  className="p-6 rounded-2xl border border-white/10"
                  style={{ background: "#111827" }}>

                  {/* Date */}
                  <p className="text-xs text-white/30 mb-4">
                    {new Date(log.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>

                  {/* Symptoms */}
                  {userMsg && (
                    <div className="mb-4 px-4 py-3 rounded-lg border border-white/8"
                      style={{ background: "rgba(255,255,255,0.03)" }}>
                      <p className="text-xs text-white/30 mb-1">Patient described:</p>
                      <p className="text-sm text-white/70">{userMsg.content}</p>
                    </div>
                  )}

                  {/* AI Result */}
                  {aiResult && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="px-4 py-3 rounded-lg border border-white/8"
                        style={{ background: "rgba(79,142,247,0.05)" }}>
                        <p className="text-xs text-white/30 mb-1">🔍 Likely Cause</p>
                        <p className="text-sm text-white">{aiResult.likelyCause}</p>
                      </div>

                      <div className="px-4 py-3 rounded-lg border"
                        style={{
                          background: urgencyColor[aiResult.urgency]?.bg || 'rgba(255,255,255,0.03)',
                          borderColor: urgencyColor[aiResult.urgency]?.border || 'rgba(255,255,255,0.08)'
                        }}>
                        <p className="text-xs text-white/30 mb-1">⚠️ Urgency</p>
                        <p className={`text-sm font-medium ${urgencyColor[aiResult.urgency]?.text || 'text-white'}`}>
                          {urgencyColor[aiResult.urgency]?.label || aiResult.urgency}
                        </p>
                      </div>

                      <div className="px-4 py-3 rounded-lg border border-white/8"
                        style={{ background: "rgba(168,85,247,0.05)" }}>
                        <p className="text-xs text-white/30 mb-1">👨‍⚕️ Suggested Specialist</p>
                        <p className="text-sm text-white">{aiResult.suggestedSpecialist}</p>
                      </div>

                      <div className="px-4 py-3 rounded-lg border border-white/8"
                        style={{ background: "rgba(16,185,129,0.05)" }}>
                        <p className="text-xs text-white/30 mb-1">💡 Advice</p>
                        <p className="text-sm text-white/70">{aiResult.advice}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientSymptomHistory
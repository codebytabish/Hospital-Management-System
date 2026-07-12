import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const SymptomChecker = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm SynaptoClin AI. Describe your symptoms and I'll help you understand what might be going on."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/symptom-check',
        { symptoms: input },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const result = res.data.result

      const urgencyColor = {
        low: '🟢',
        moderate: '🟡',
        high: '🟠',
        emergency: '🔴'
      }

      const reply = `🔍 Likely Cause: ${result.likelyCause}

${urgencyColor[result.urgency] || '⚪'} Urgency: ${result.urgency?.toUpperCase()}

👨‍⚕️ Suggested Specialist: ${result.suggestedSpecialist}

💡 Advice: ${result.advice}`

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.response?.data?.message || 'Sorry, I could not process your request. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40 flex items-center justify-between"
        style={{ background: "#111827" }}>
        <div>
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
          <span className="mx-2 text-white/20">/</span>
          <span onClick={() => navigate('/dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">AI Symptom Checker</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-400 border border-purple-400/30 px-3 py-1 rounded-full"
          style={{ background: "rgba(168,85,247,0.1)" }}>
          <i className="ti ti-brain" />
          Powered by AI
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>

            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
                <i className="ti ti-brain text-white text-sm" />
              </div>
            )}

            <div
              className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' ? 'text-white rounded-br-sm' : 'text-white/85 rounded-bl-sm'
              }`}
              style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg,#4f8ef7,#a855f7)'
                  : '#111827',
                border: msg.role === 'assistant' ? '0.5px solid rgba(255,255,255,0.08)' : 'none'
              }}
            >
              {typeof msg.content === 'string'
                ? msg.content.split('\n').map((line, j) => (
                    <p key={j} className={line === '' ? 'mt-2' : ''}>{line}</p>
                  ))
                : <p>...</p>
              }
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center ml-3 flex-shrink-0 bg-white/10">
                <i className="ti ti-user text-white text-sm" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex mb-4 justify-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
              <i className="ti ti-brain text-white text-sm" />
            </div>
            <div className="px-4 py-3 rounded-2xl border border-white/8 text-sm text-white/40 flex items-center gap-2"
              style={{ background: "#111827" }}>
              <span className="animate-pulse">Analyzing symptoms...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 py-4 border-t border-white/10" style={{ background: "#111827" }}>
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms... (e.g. headache, fever, sore throat for 2 days)"
            rows={2}
            className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl text-white border-none cursor-pointer disabled:opacity-40 flex items-center gap-2 text-sm font-medium self-end"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
          >
            <i className="ti ti-send" />
            Send
          </button>
        </div>
        <p className="text-center text-xs text-white/20 mt-2">
          This is not a medical diagnosis. Always consult a qualified doctor.
        </p>
      </div>
    </div>
  )
}

export default SymptomChecker
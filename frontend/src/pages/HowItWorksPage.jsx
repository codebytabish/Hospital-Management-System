import { useNavigate } from 'react-router-dom'

const steps = [
  {
    num: '01',
    title: 'Create your account',
    desc: 'Sign up as a patient in under a minute. No paperwork, no waiting rooms — just fill in your name, email, and password.',
    icon: 'ti-user-plus',
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.15)',
  },
  {
    num: '02',
    title: 'Describe your symptoms',
    desc: 'Use our AI-powered symptom checker to describe how you feel. SynaptoClin AI analyzes your symptoms and suggests the most likely causes.',
    icon: 'ti-brain',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
  },
  {
    num: '03',
    title: 'Book an appointment',
    desc: 'Choose from a list of verified doctors filtered by specialty. Pick a date and time slot that works for you — instantly confirmed.',
    icon: 'ti-calendar-plus',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
  },
  {
    num: '04',
    title: 'See your doctor',
    desc: 'Attend your appointment in-person. Your doctor reviews your AI symptom report to provide faster, more accurate care.',
    icon: 'ti-stethoscope',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.15)',
  },
  {
    num: '05',
    title: 'Track your health',
    desc: 'View all your past and upcoming appointments from your dashboard. Cancel or reschedule anytime with one click.',
    icon: 'ti-clipboard-list',
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.15)',
  },
]

const HowItWorksPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Hero */}
      <div className="text-center px-8 py-20"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,142,247,0.15) 0%, transparent 70%), #0a0f1e"
        }}>
        <p className="text-xs font-medium uppercase tracking-widest text-blue-400 mb-3">
          How it works
        </p>
        <h1 className="text-4xl font-medium text-white mb-4">
          Healthcare made <span style={{
            background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>simple</span>
        </h1>
        <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
          From signing up to seeing a doctor — SynaptoClin makes the entire process fast, smart, and stress-free.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-8 pb-20">
        <div className="relative">

          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, #4f8ef7, #a855f7)" }} />

          <div className="flex flex-col gap-10">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8 relative">

                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center z-10"
                  style={{ background: step.bg, border: `0.5px solid ${step.color}40` }}>
                  <i className={`ti ${step.icon} text-xl`} style={{ color: step.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-white/30">{step.num}</span>
                    <h3 className="text-white text-base font-medium">{step.title}</h3>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl border border-white/10"
          style={{ background: "#111827" }}>
          <h2 className="text-white text-xl font-medium mb-2">Ready to get started?</h2>
          <p className="text-white/40 text-sm mb-6">Join thousands of patients already using SynaptoClin.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/get-started')}
              className="text-sm text-white font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              Create free account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-white/60 font-medium px-8 py-3 rounded-lg border border-white/10 bg-transparent cursor-pointer hover:text-white transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage
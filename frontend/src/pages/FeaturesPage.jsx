import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: 'ti-brain',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
    title: 'AI Symptom Checker',
    desc: 'Describe your symptoms in plain language and get an instant AI-powered analysis — possible causes, urgency level, and which specialist to see.',
    badge: 'Powered by AI',
  },
  {
    icon: 'ti-calendar-plus',
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.15)',
    title: 'Smart Appointment Booking',
    desc: 'Browse verified doctors by specialty, pick an available time slot, and book instantly. No phone calls, no waiting.',
    badge: 'Instant confirmation',
  },
  {
    icon: 'ti-shield-check',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    title: 'Role-Based Dashboards',
    desc: 'Patients, doctors, and admins each get a tailored dashboard. Everyone sees exactly what they need — nothing more, nothing less.',
    badge: '3 roles',
  },
  {
    icon: 'ti-clipboard-list',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.15)',
    title: 'Appointment Management',
    desc: 'View all upcoming and past appointments. Cancel anytime with one click. Doctors can confirm or reschedule from their dashboard.',
    badge: 'Full control',
  },
  {
    icon: 'ti-lock',
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.15)',
    title: 'Secure Authentication',
    desc: 'JWT-based authentication with role-based access control. Your data is protected at every step.',
    badge: 'JWT + bcrypt',
  },
  {
    icon: 'ti-users',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
    title: 'Admin Panel',
    desc: 'Admins can add verified doctors, manage users, and oversee all appointments from a dedicated control panel.',
    badge: 'Admin only',
  },
]

const FeaturesPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70 transition-colors">
          Home
        </span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">Features</span>
      </div>

      {/* Hero */}
      <div className="text-center px-8 py-20"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,142,247,0.15) 0%, transparent 70%), #0a0f1e"
        }}>
        <p className="text-xs font-medium uppercase tracking-widest text-blue-400 mb-3">
          Features
        </p>
        <h1 className="text-4xl font-medium text-white mb-4">
          Everything you need,{' '}
          <span style={{
            background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            in one place
          </span>
        </h1>
        <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
          SynaptoClin combines AI-powered symptom analysis, smart scheduling, and role-based access — built for modern healthcare.
        </p>
      </div>

      {/* Features grid */}
      <div className="max-w-5xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
              style={{ background: "#111827" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: f.bg }}>
                  <i className={`ti ${f.icon} text-xl`} style={{ color: f.color }} />
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    color: f.color,
                    background: f.bg,
                    borderColor: `${f.color}40`
                  }}
                >
                  {f.badge}
                </span>
              </div>
              <h3 className="text-white text-sm font-medium mb-2">{f.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl border border-white/10"
          style={{ background: "#111827" }}>
          <h2 className="text-white text-xl font-medium mb-2">Start using SynaptoClin today</h2>
          <p className="text-white/40 text-sm mb-6">Free to sign up. No credit card required.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/get-started')}
              className="text-sm text-white font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              Create free account
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="text-sm text-white/60 font-medium px-8 py-3 rounded-lg border border-white/10 bg-transparent cursor-pointer hover:text-white transition-colors"
            >
              How it works
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesPage
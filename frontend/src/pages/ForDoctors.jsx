import { useNavigate } from 'react-router-dom'

const benefits = [
  {
    icon: 'ti-calendar-check',
    color: '#4f8ef7',
    bg: 'rgba(79,142,247,0.15)',
    title: 'Manage your schedule',
    desc: 'View all your upcoming appointments in one place. Confirm, reschedule, or manage your availability with ease.',
  },
  {
    icon: 'ti-brain',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.15)',
    title: 'AI pre-screening',
    desc: 'Patients arrive with an AI symptom report already generated. You get a head start before the appointment even begins.',
  },
  {
    icon: 'ti-users',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    title: 'Patient history',
    desc: 'Access patient symptom history and appointment records to provide more informed, accurate care.',
  },
  {
    icon: 'ti-shield-check',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.15)',
    title: 'Verified profiles only',
    desc: 'Doctors are added exclusively by platform admins — ensuring only qualified, verified professionals are listed.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Get added by admin',
    desc: 'Contact the SynaptoClin admin to get your doctor account created with your specialization.',
  },
  {
    num: '02',
    title: 'Log in to your dashboard',
    desc: 'Use your credentials to access your personal doctor dashboard.',
  },
  {
    num: '03',
    title: 'View your appointments',
    desc: 'See all upcoming patient appointments, their symptoms, and booking details.',
  },
  {
    num: '04',
    title: 'Confirm and treat',
    desc: 'Confirm appointments and deliver better care with AI-assisted pre-screening.',
  },
]

const ForDoctors = () => {
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
        <span className="text-white/70">For Doctors</span>
      </div>

      {/* Hero */}
      <div className="text-center px-8 py-20"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,142,247,0.15) 0%, transparent 70%), #0a0f1e"
        }}>
        <p className="text-xs font-medium uppercase tracking-widest text-blue-400 mb-3">
          For Doctors
        </p>
        <h1 className="text-4xl font-medium text-white mb-4">
          Practice smarter with{' '}
          <span style={{
            background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            AI assistance
          </span>
        </h1>
        <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed mb-8">
          SynaptoClin helps doctors spend less time on admin and more time delivering quality care — with AI pre-screening, smart scheduling, and a clean dashboard.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-white font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
          style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
        >
          Doctor login
        </button>
      </div>

      {/* Benefits */}
      <div className="max-w-5xl mx-auto px-8 pb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-blue-400 text-center mb-3">
          Benefits
        </p>
        <h2 className="text-2xl font-medium text-white text-center mb-10">
          Why doctors love SynaptoClin
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
              style={{ background: "#111827" }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: b.bg }}>
                <i className={`ti ${b.icon} text-xl`} style={{ color: b.color }} />
              </div>
              <h3 className="text-white text-sm font-medium mb-2">{b.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* How to join */}
        <p className="text-xs font-medium uppercase tracking-widest text-blue-400 text-center mb-3">
          How to join
        </p>
        <h2 className="text-2xl font-medium text-white text-center mb-10">
          Getting started as a doctor
        </h2>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, #4f8ef7, #a855f7)" }} />

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center z-10 border border-white/10"
                  style={{ background: "#111827" }}>
                  <span className="text-xs font-mono"
                    style={{
                      background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>
                    {step.num}
                  </span>
                </div>
                <div className="flex-1 pb-2">
                  <h3 className="text-white text-sm font-medium mb-1">{step.title}</h3>
                  <p className="text-xs text-white/45 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-8 rounded-2xl border border-white/10"
          style={{ background: "#111827" }}>
          <h2 className="text-white text-xl font-medium mb-2">Already have an account?</h2>
          <p className="text-white/40 text-sm mb-6">
            Log in to your doctor dashboard to manage appointments and view patient records.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-white font-medium px-8 py-3 rounded-lg border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              Doctor login
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

export default ForDoctors
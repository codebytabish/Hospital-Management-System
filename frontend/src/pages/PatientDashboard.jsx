import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const PatientDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-white/10"
        style={{ background: "#111827" }}>
        <h1
          className="text-xl font-bold"
          style={{
            background: "linear-gradient(90deg,#4f8ef7,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SynaptoClin AI
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">
            Welcome, <span className="text-white">{user?.name}</span>
          </span>
          <button
            onClick={() => navigate('/profile')}
            className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-lg hover:border-blue-400/50 hover:text-blue-400 transition-colors cursor-pointer bg-transparent"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-white/50 border border-white/10 px-4 py-2 rounded-lg hover:border-red-400/50 hover:text-red-400 transition-colors cursor-pointer bg-transparent"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-10 max-w-5xl mx-auto">

        <h2 className="text-white text-lg font-medium mb-6">What would you like to do?</h2>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div
            onClick={() => navigate('/book-appointment')}
            className="p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-blue-400/40 transition-all"
            style={{ background: "#111827" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(79,142,247,0.15)" }}>
              <i className="ti ti-calendar-plus text-xl" style={{ color: "#4f8ef7" }} />
            </div>
            <h3 className="text-white text-sm font-medium mb-1">Book Appointment</h3>
            <p className="text-xs text-white/40">Schedule a visit with a verified doctor</p>
          </div>

          <div
            onClick={() => navigate('/symptom-checker')}
            className="p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-purple-400/40 transition-all"
            style={{ background: "#111827" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(168,85,247,0.15)" }}>
              <i className="ti ti-brain text-xl" style={{ color: "#a855f7" }} />
            </div>
            <h3 className="text-white text-sm font-medium mb-1">AI Symptom Checker</h3>
            <p className="text-xs text-white/40">Describe symptoms and get AI analysis</p>
          </div>

          <div
            onClick={() => navigate('/my-appointments')}
            className="p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-green-400/40 transition-all"
            style={{ background: "#111827" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(16,185,129,0.15)" }}>
              <i className="ti ti-clipboard-list text-xl" style={{ color: "#10b981" }} />
            </div>
            <h3 className="text-white text-sm font-medium mb-1">My Appointments</h3>
            <p className="text-xs text-white/40">View and manage your appointments</p>
          </div>

          <div
            onClick={() => navigate('/profile')}
            className="p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-orange-400/40 transition-all"
            style={{ background: "#111827" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(251,146,60,0.15)" }}>
              <i className="ti ti-user-edit text-xl" style={{ color: "#fb923c" }} />
            </div>
            <h3 className="text-white text-sm font-medium mb-1">My Profile</h3>
            <p className="text-xs text-white/40">Update your personal information</p>
          </div>
        </div>

        {/* User info card */}
        <div className="p-6 rounded-2xl border border-white/10" style={{ background: "#111827" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm font-medium">Your Profile</h3>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-blue-400 hover:underline cursor-pointer bg-transparent border-none"
            >
              Edit →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/40 mb-1">Name</p>
              <p className="text-sm text-white">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Email</p>
              <p className="text-sm text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Phone</p>
              <p className="text-sm text-white">{user?.phone || <span className="text-white/30">Not set</span>}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Role</p>
              <p className="text-sm text-white capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Account status</p>
              <p className="text-sm text-green-400">Active</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default PatientDashboard
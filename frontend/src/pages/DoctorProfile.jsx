import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const DoctorProfile = () => {
  const navigate = useNavigate()
  const { user, token, login } = useAuth()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })
  const setPass = (field) => (e) => setPasswordData({ ...passwordData, [field]: e.target.value })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoadingProfile(true)
    setProfileMsg('')
    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      login(res.data.user, token)
      setProfileMsg('✅ Profile updated successfully')
    } catch (err) {
      setProfileMsg(err.response?.data?.message || '❌ Failed to update profile')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setPasswordMsg('')
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg('❌ Passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg('❌ Password must be at least 6 characters')
      return
    }
    setLoadingPassword(true)
    try {
      await axios.put(
        'http://localhost:5000/api/users/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPasswordMsg('✅ Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || '❌ Failed to change password')
    } finally {
      setLoadingPassword(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 mb-3"

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>

      {/* Breadcrumb */}
      <div className="px-8 py-3 border-b border-white/10 text-sm text-white/40"
        style={{ background: "#111827" }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white/70">Home</span>
        <span className="mx-2 text-white/20">/</span>
        <span onClick={() => navigate('/doctor-dashboard')} className="cursor-pointer hover:text-white/70">Dashboard</span>
        <span className="mx-2 text-white/20">/</span>
        <span className="text-white/70">My Profile</span>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10">

        <h1 className="text-white text-xl font-medium mb-8">My Profile</h1>

        {/* Avatar & info */}
        <div className="flex items-center gap-4 p-6 rounded-2xl border border-white/10 mb-6"
          style={{ background: "#111827" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-medium"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}>
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium">{user?.name}</p>
            <p className="text-sm text-white/40">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-green-400 border border-green-400/30 px-2 py-0.5 rounded-full capitalize"
                style={{ background: "rgba(16,185,129,0.1)" }}>
                {user?.role}
              </span>
              {user?.specialization && (
                <span className="text-xs text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(79,142,247,0.1)" }}>
                  {user?.specialization}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile update */}
        <div className="p-6 rounded-2xl border border-white/10 mb-6"
          style={{ background: "#111827" }}>
          <h2 className="text-white text-sm font-medium mb-4">Personal Information</h2>

          <form onSubmit={handleProfileUpdate}>
            <label className="text-xs text-white/40 mb-1 block">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={set('name')}
              required
              placeholder="Full Name"
              className={inputClass}
            />

            <label className="text-xs text-white/40 mb-1 block">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg text-sm text-white/30 border border-white/5 bg-white/3 mb-3 cursor-not-allowed"
            />

            <label className="text-xs text-white/40 mb-1 block">Specialization</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={set('specialization')}
              placeholder="e.g. Cardiologist, Neurologist"
              className={inputClass}
            />

            <label className="text-xs text-white/40 mb-1 block">
              Phone Number
              <span className="text-white/20 ml-1">(format: +923001234567)</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={set('phone')}
              placeholder="+923001234567"
              className={inputClass}
            />

            {profileMsg && (
              <p className={`text-xs mb-3 ${profileMsg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                {profileMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              {loadingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="p-6 rounded-2xl border border-white/10"
          style={{ background: "#111827" }}>
          <h2 className="text-white text-sm font-medium mb-4">Change Password</h2>

          <form onSubmit={handlePasswordUpdate}>
            <label className="text-xs text-white/40 mb-1 block">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={setPass('currentPassword')}
              required
              placeholder="Current password"
              className={inputClass}
            />

            <label className="text-xs text-white/40 mb-1 block">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={setPass('newPassword')}
              required
              placeholder="New password (min 6 characters)"
              className={inputClass}
            />

            <label className="text-xs text-white/40 mb-1 block">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={setPass('confirmPassword')}
              required
              placeholder="Confirm new password"
              className={inputClass}
            />

            {passwordMsg && (
              <p className={`text-xs mb-3 ${passwordMsg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
                {passwordMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full py-2.5 rounded-lg text-sm text-white font-medium border-none cursor-pointer disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#a855f7)" }}
            >
              {loadingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
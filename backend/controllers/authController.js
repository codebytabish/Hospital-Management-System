const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: "Email already in use" })

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'patient'
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" })

    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account found with this email' })

    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    user.otp = otp
    user.otpExpires = otpExpires
    await user.save()

    await sendEmail({
      to: email,
      subject: '🔐 Your SynaptoClin Password Reset OTP',
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0a0f1e;color:#fff;padding:32px;border-radius:16px;">
          <h2 style="background:linear-gradient(90deg,#4f8ef7,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;">
            SynaptoClin AI
          </h2>
          <p style="color:rgba(255,255,255,0.6);margin-bottom:24px;">Password Reset Request</p>
          <div style="background:#111827;border-radius:12px;padding:24px;border:1px solid rgba(255,255,255,0.1);">
            <p style="color:rgba(255,255,255,0.6);margin-bottom:16px;">
              Hi <strong style="color:#fff">${user.name}</strong>, here is your OTP to reset your password:
            </p>
            <div style="text-align:center;padding:24px;background:rgba(79,142,247,0.1);border-radius:8px;border:1px solid rgba(79,142,247,0.3);margin-bottom:20px;">
              <p style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#4f8ef7;margin:0;">${otp}</p>
            </div>
            <p style="color:rgba(255,255,255,0.4);font-size:13px;">
              This OTP expires in <strong style="color:#fff">10 minutes</strong>. Do not share it with anyone.
            </p>
          </div>
          <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:24px;text-align:center;">
            If you didn't request this, ignore this email.
          </p>
        </div>
      `
    })

    res.json({ success: true, message: 'OTP sent to your email' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' })

    if (user.otpExpires < new Date())
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })

    res.json({ success: true, message: 'OTP verified' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' })

    if (user.otpExpires < new Date())
      return res.status(400).json({ message: 'OTP has expired' })

    user.password = newPassword
    user.otp = undefined
    user.otpExpires = undefined
    await user.save()

    res.json({ success: true, message: 'Password reset successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { register, login, forgotPassword, verifyOTP, resetPassword }
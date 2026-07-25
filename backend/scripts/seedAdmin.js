require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL })
  if (existing) {
    console.log('Admin already exists')
    process.exit()
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin'
  })

  console.log(`✅ Admin created: ${process.env.ADMIN_EMAIL}`)
  process.exit()
}

seed()
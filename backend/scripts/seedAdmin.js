require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  
  const existing = await User.findOne({ email: 'admin@synaptoclin.com' })
  if (existing) {
    console.log('Admin already exists')
    process.exit()
  }

  await User.create({
    name: 'Admin',
    email: 'admin@synaptoclin.com',
    password: 'admin123456',
    role: 'admin'
  })

  console.log('✅ Admin created: admin@synaptoclin.com / admin123456')
  process.exit()
}

seed()
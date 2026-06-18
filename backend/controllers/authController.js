const User = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try{

  const { name, email, password } = req.body
  

  // step 2 - check duplicate
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: "Email already in use" })

  // step 3 - create (bcrypt runs automatically in User model)
  const user = await User.create({ name, email, password })




  // step 4 - sign token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

  // step 5 - respond
  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
}catch (err){
   res.status(500).json({message:err.message})
}
};


const login = async (req, res) => {
  const { email, password } = req.body
   if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

  // 1. find user by email
  const user = await User.findOne({ email })
  
  // 2. check user exists + password matches
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  // 3. sign token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

  // 4. return token + user
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  })
}
module.exports = { register,login };

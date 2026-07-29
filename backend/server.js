require('dotenv').config()
const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();


dotenv.config();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Test route
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/appointment", require("./routes/appointmentRoutes"));
app.use("/api/prescription", require("./routes/prescriptionRoute"));
app.use("/api/ai", require("./routes/ai"));
app.use('/api/payment', require('./routes/paymentRoutes'))


app.get('/', (req, res) => {
    res.send('Hospital Management Backend is running...');
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
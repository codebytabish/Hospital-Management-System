import { Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import Login from './pages/Login'
import GetStarted from './pages/GetStarted'
import PatientDashboard from './pages/PatientDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import BookAppointment from './pages/BookAppointment'
import AdminDashboard from './pages/AdminDashboard'
import SymptomChecker from './pages/SymptomChecker'

const Landing = () => (
  <>
    <Hero />
    <Stats />
    <Features />
    <HowItWorks />
    <Footer />
  </>
)

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/book-appointment" element={
  <ProtectedRoute>
    <BookAppointment />
  </ProtectedRoute>
} />

<Route path="/admin" element={
  <ProtectedRoute role="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
<Route path="/symptom-checker" element={
  <ProtectedRoute>
    <SymptomChecker />
  </ProtectedRoute>
} />
      </Routes>
    </>
  )
}

export default App
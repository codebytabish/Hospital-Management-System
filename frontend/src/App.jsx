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
import MyAppointments from './pages/MyAppointments'
import HowItWorksPage from "./pages/HowItWorksPage";
import FeaturesPage from "./pages/FeaturesPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import ForDoctors from "./pages/ForDoctors";
import Profile from './pages/Profile'
import PatientSymptomHistory from './pages/PatientSymptomHistory'
import NotFound from './pages/NotFound'
import Prescriptions from './pages/Prescriptions'
import ForgotPassword from './pages/ForgotPassword'
import MyPrescriptions from './pages/MyPrescriptions'
import DoctorProfile from './pages/DoctorProfile'
import Payment from './pages/Payment'
import MyPayments from './pages/MyPayments'

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
<Route path="/my-appointments" element={
  <ProtectedRoute>
    <MyAppointments />
  </ProtectedRoute>
} />

<Route path="/doctor-dashboard" element={
  <ProtectedRoute role="doctor">
    <DoctorDashboard />
  </ProtectedRoute>
} />


<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
<Route path="/patient-history/:patientId" element={
  <ProtectedRoute role="doctor">
    <PatientSymptomHistory />
  </ProtectedRoute>
} />

<Route path="/prescriptions" element={
  <ProtectedRoute role="doctor">
    <Prescriptions />
  </ProtectedRoute>
} />

<Route path="/my-prescriptions" element={
  <ProtectedRoute>
    <MyPrescriptions />
  </ProtectedRoute>
} />
<Route path="/doctor-profile" element={
  <ProtectedRoute role="doctor">
    <DoctorProfile />
  </ProtectedRoute>
} />
<Route path="/payment" element={
  <ProtectedRoute>
    <Payment />
  </ProtectedRoute>
} />
<Route path="/my-payments" element={
  <ProtectedRoute>
    <MyPayments />
  </ProtectedRoute>
} />
<Route path="/how-it-works" element={<HowItWorksPage />} />
<Route path="/features" element={<FeaturesPage />} />
<Route path="/for-doctors" element={<ForDoctors />} />
<Route path="*" element={<NotFound />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  )
}

export default App
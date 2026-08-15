# SynaptoClin AI — Hospital Management System

A full-stack AI-powered hospital management system built with the MERN stack. Connects patients with doctors, provides AI symptom analysis, manages appointments, and supports online video consultations.

---

## 🚀 Live Demo

- **Frontend:** [Coming soon]
- **Backend API:** [Coming soon]

---

## 📋 Features

### 🧑‍💼 Patient
- Register and login securely
- AI-powered symptom checker (via OpenRouter)
- Book appointments with verified doctors (in-person or online)
- Search doctors by specialization
- View and cancel appointments
- Join video calls for online appointments (Jitsi Meet)
- View doctor prescriptions
- View payment history
- Update profile and change password
- Forgot password via OTP email

### 👨‍⚕️ Doctor
- Dedicated doctor dashboard
- View and manage appointments (confirm/cancel)
- Add notes to patient appointments
- Write and view prescriptions
- View patient AI symptom history
- Join video calls for online appointments
- Update profile and specialization

### 🛡️ Admin
- Add verified doctors with specialization
- View and delete doctors
- View and delete patients
- View all appointments filtered by status

### 💳 Payment
- Online payment required for video appointments
- In-person appointments pay at clinic
- Supports EasyPaisa, JazzCash, and Card (sandbox/demo mode)

### 📧 Notifications
- Email notification on appointment confirmation
- Email notification on appointment cancellation
- Video call link included in confirmation email

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | Frontend framework |
| Tailwind CSS | Styling |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Toast notifications |
| Context API | Global state (auth) |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | Backend framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email notifications |
| OpenRouter API | AI symptom checker |
| Jitsi Meet | Video consultations |

---




## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- OpenRouter API key
- Gmail App Password

### 1. Clone the repository
git clone https://github.com/codebytabish/synaptoclin.git
cd synaptoclin

### 2. Backend setup
cd backend
npm install

Create .env file:
MONGO_URI=mongodb://localhost:27017/synaptoclin
JWT_SECRET=your_jwt_secret
PORT=5000
GMAIL_USER=your@gmail.com
GMAIL_PASS=your_app_password
OPENROUTER_API_KEY=sk-or-your-key
ADMIN_EMAIL=admin@synaptoclin.com
ADMIN_PASSWORD=your_strong_password

Seed admin:
node scripts/seedAdmin.js

Start backend:
npm start

### 3. Frontend setup
cd frontend
npm install
npm run dev

---

## 👤 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@synaptoclin.com | set in .env |
| Doctor | Added by admin | Set by admin |
| Patient | Register via /get-started | Your choice |

---


# 👨‍💻 Developer

**Tabish Hassan Soomra**
- GitHub: [@codebytabish](https://github.com/codebytabish)
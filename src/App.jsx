import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import komponen landing page
import Header from './components/Header'
import Hero from './components/Hero'
import Partners from './components/Partners'
import Features from './components/Features'
import VisionMission from './components/VisionMission'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

// Import halaman dashboard dan auth
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage'

// Component Helper untuk Route yang Terproteksi
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token')
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Component untuk Landing Page
const LandingPage = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Partners />
      <VisionMission />
      <Features />
      <Testimonials />
    </main>
    <Footer />
  </>
)


function App() {
  return (
    <Router>
      <div className="bg-white font-sans">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoice-generator"
            element={
              <ProtectedRoute>
                <InvoiceGeneratorPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
                <p className="text-xl text-slate-600 mb-8">Halaman tidak ditemukan</p>
                <a
                  href="/"
                  className="bg-sky-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors"
                >
                  Kembali ke Beranda
                </a>
              </div>
            </div>
          } />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  )
}

export default App
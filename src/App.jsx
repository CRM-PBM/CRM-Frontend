import React from 'react'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getAccessToken } from './services/storage'

// Import komponen landing page
import Header from './components/Header'
import Hero from './components/Hero'
import Partners from './components/Partners'
import Features from './components/Features'
import VisionMission from './components/VisionMission'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Pricing from './components/Pricing'

// Import halaman dashboard dan auth
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage'

// Component Helper untuk Route yang Terproteksi
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = getAccessToken()
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
      <Pricing />
      <Features />
      <Testimonials />
    </main>
    <Footer />
  </>
)


function App() {
  return (
    <Router>
      <div className="font-sans bg-white">
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
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
              <div className="text-center">
                <h1 className="mb-4 text-6xl font-bold text-slate-800">404</h1>
                <p className="mb-8 text-xl text-slate-600">Halaman tidak ditemukan</p>
                <a
                  href="/"
                  className="px-6 py-3 font-medium text-white transition-colors rounded-lg bg-sky-500 hover:bg-sky-600"
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
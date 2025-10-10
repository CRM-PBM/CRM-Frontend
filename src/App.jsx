import React from 'react'
import './index.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Partners from './components/Partners'
import Features from './components/Features'
import VisionMission from './components/VisionMission'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  const isDashboard = path.startsWith('/dashboard')

  return (
    <div className="bg-white font-sans">
      {!isDashboard && <Header />}
      <main>
        {isDashboard ? <Dashboard /> : (
          <>
            <Hero />
            <Partners />
            <VisionMission />
            <Features />
            <Testimonials />
          </>
        )}
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}

export default App

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-md" />
          <div>
            <div className="text-lg font-bold text-slate-900">UMKM<span className="text-sky-600">.crm</span></div>
            <div className="text-xs text-slate-400">CRM untuk UMKM</div>
          </div>
        </a>

        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#features" className="text-slate-600 hover:text-slate-900 transition">Fitur</a>
          <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">Harga</a>
          <a href="#about" className="text-slate-600 hover:text-slate-900 transition">Tentang Kami</a>
          <a href="#" className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold px-4 py-2 rounded-lg shadow">Masuk</a>
        </nav>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 border-t border-slate-100">
          <nav className="flex flex-col space-y-3">
            <a href="#features" className="text-slate-700">Fitur</a>
            <a href="#pricing" className="text-slate-700">Harga</a>
            <a href="#about" className="text-slate-700">Tentang Kami</a>
            <a href="/dashboard" className="mt-2 inline-flex items-center justify-center bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg">Dashboard</a>
          </nav>
        </div>
      )}
    </header>
  )
}

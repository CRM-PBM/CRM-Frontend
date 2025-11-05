import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg shadow-md bg-gradient-to-br from-sky-500 to-sky-600" />
          <div>
            <div className="text-lg font-bold text-slate-900">UMKM<span className="text-sky-600">.crm</span></div>
            <div className="text-xs text-slate-400">CRM untuk UMKM</div>
          </div>
        </a>

        <nav className="items-center hidden space-x-8 md:flex">
          <a href="#features" className="transition text-slate-600 hover:text-slate-900">Fitur</a>
          <a href="#about" className="transition text-slate-600 hover:text-slate-900">Tentang Kami</a>
          <a href="#pricing" className="transition text-slate-600 hover:text-slate-900">Harga</a>
          <a href="/login" className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-lg shadow bg-gradient-to-r from-sky-500 to-sky-600">Masuk</a>
        </nav>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="px-6 py-4 bg-white border-t md:hidden border-slate-100">
          <nav className="flex flex-col space-y-3">
            <a href="#features" className="text-slate-700">Fitur</a>
            <a href="#pricing" className="text-slate-700">Harga</a>
            <a href="#about" className="text-slate-700">Tentang Kami</a>
            <a href="/dashboard" className="inline-flex items-center justify-center px-4 py-2 mt-2 font-semibold text-white rounded-lg bg-sky-500">Dashboard</a>
            <a href="/login" className="inline-flex items-center justify-center px-4 py-2 mt-2 font-semibold text-white rounded-lg bg-gradient-to-r from-sky-500 to-sky-600">Masuk</a>
          </nav>
        </div>
      )}
    </header>
  )
}

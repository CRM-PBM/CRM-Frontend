import React, { useEffect, useState } from 'react'
import { Search, Bell, Menu } from 'lucide-react'

export default function DashboardTopbar({ title = 'Dashboard', onToggleSidebar = () => {} }) {
  const [umkmData, setUmkmData] = useState({
    nama_umkm: 'UMKM Saya',
    nama_pemilik: 'Pemilik Usaha'
  })

  useEffect(() => {
    // Ambil data umkm dari localStorage (pastikan diset waktu login)
    const storedUmkm = localStorage.getItem('umkmData')
    if (storedUmkm) {
      setUmkmData(JSON.parse(storedUmkm))
    }
  }, [])

  // Fungsi buat ambil inisial dari nama UMKM
  const getInitials = (name) => {
    if (!name) return 'U'
    const words = name.trim().split(' ')
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase()
    // kalau 3 kata atau lebih, ambil huruf pertama tiap kata sampai 3 huruf
    return words.slice(0, 3).map(w => w[0].toUpperCase()).join('')
  }

  return (
    <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>

          <div className="min-w-0 flex-shrink">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">{title}</h1>
            <p className="text-xs text-slate-500 truncate">Ringkasan dan pengelolaan usaha Anda</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-64">
            <Search className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari pelanggan, invoice..."
              className="text-sm outline-none bg-transparent w-full placeholder:text-slate-400"
            />
          </div>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 ml-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm flex-shrink-0">
              {getInitials(umkmData.nama_umkm)}
            </div>
            <div className="hidden lg:block min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">
                {umkmData.nama_umkm}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {umkmData.nama_pemilik}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

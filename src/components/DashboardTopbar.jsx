import React from 'react'
import { Search, Bell, Plus, Menu } from 'lucide-react'

export default function DashboardTopbar({ title = 'Dashboard', onToggleSidebar = () => {} }){
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
          {/* Search - Hidden on small screens */}
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
              U
            </div>
            <div className="hidden lg:block min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">Pemilik Usaha</div>
              <div className="text-xs text-slate-500 truncate">UMKM Saya</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

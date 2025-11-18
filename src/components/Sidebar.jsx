import React, { useEffect } from 'react'
import { Home, Users, Package, CreditCard, MessageSquare, FileText, Settings, LogOut, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import { clearTokens } from '../services/storage'

export default function Sidebar({ view, setView, sidebarOpen, setSidebarOpen, collapsed, setCollapsed }){
  const navigate = useNavigate()
  
  const items = [
    { key: 'overview', label: 'Ringkasan', icon: Home },
    { key: 'customers', label: 'Pelanggan', icon: Users },
    { key: 'products', label: 'Produk', icon: Package },
    { key: 'transactions', label: 'Transaksi', icon: CreditCard },
    { key: 'wa', label: 'Kirim WA', icon: MessageSquare },
    { key: 'invoices', label: 'Nota & Laporan', icon: FileText },
    { key: 'wablast', label: 'Kirim WA', icon: MessageSquare }
  ]

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.info('Anda telah keluar', { position: "top-center" })
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, clear tokens and redirect
      clearTokens()
      toast.info('Anda telah keluar', { position: "top-center" })
      navigate('/login')
    }
  }

  useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape' && sidebarOpen){
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[sidebarOpen, setSidebarOpen])

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={()=>setSidebarOpen(false)} 
      />

      {/* Mobile Sidebar - Only visible on small screens */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl md:hidden transform transition-transform duration-300 ease-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-lg bg-gradient-to-br from-sky-500 to-sky-600">
                UM
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">UMKM Saya</div>
                <div className="text-xs text-slate-500">Kelola usaha Anda</div>
              </div>
            </div>
            <button 
              onClick={()=>setSidebarOpen(false)} 
              className="p-2 transition-colors rounded-lg hover:bg-slate-100"
              aria-label="Tutup sidebar"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Mobile Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map(item => {
              const Icon = item.icon
              const isActive = view === item.key
              return (
                <button 
                  key={item.key}
                  onClick={()=>{ setView(item.key); setSidebarOpen(false) }} 
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky-50 text-sky-600 font-medium shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 space-y-1 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
              <span>Pengaturan</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar - Sticky sidebar with proper height */}
      <div className={`hidden md:block h-full transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
        <aside className="flex flex-col h-full overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200">
          {/* Desktop Header */}
          <div className={`p-5 border-b border-slate-100 ${collapsed ? 'p-3' : ''}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-bold text-white rounded-lg shadow-md bg-gradient-to-br from-sky-500 to-sky-600">
                UM
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate text-slate-900">UMKM Saya</div>
                    <div className="text-xs truncate text-slate-500">Kelola usaha Anda</div>
                  </div>
                  <button 
                    onClick={()=>setCollapsed(!collapsed)} 
                    className="p-2 transition-colors rounded-lg hover:bg-slate-50"
                    aria-label="Sempitkan sidebar"
                    title="Sempitkan sidebar"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>
                </>
              )}
              {collapsed && (
                <button 
                  onClick={()=>setCollapsed(!collapsed)} 
                  className="w-full p-2 transition-colors rounded-lg hover:bg-slate-50"
                  aria-label="Perluas sidebar"
                  title="Perluas sidebar"
                >
                  <ChevronRight className="w-4 h-4 mx-auto text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={()=>{ setView(item.key); setSidebarOpen(false) }}
                  aria-current={view===item.key ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    view === item.key 
                      ? 'bg-sky-50 text-sky-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${view === item.key ? 'text-sky-600' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Desktop Footer */}
          <div className={`p-4 border-t border-slate-100 space-y-1 ${collapsed ? 'p-2' : ''}`}>
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors ${collapsed ? 'justify-center' : ''}`} title={collapsed ? 'Pengaturan' : ''}>
              <Settings className="flex-shrink-0 w-5 h-5 text-slate-400" />
              {!collapsed && <span>Pengaturan</span>}
            </button>
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors ${collapsed ? 'justify-center' : ''}`} 
              title={collapsed ? 'Keluar' : ''}
            >
              <LogOut className="flex-shrink-0 w-5 h-5 text-slate-400" />
              {!collapsed && <span>Keluar</span>}
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}

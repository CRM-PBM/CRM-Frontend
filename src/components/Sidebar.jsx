import React, { useEffect } from 'react'
import { 
  Home, Users, Package, CreditCard, MessageSquare, 
  FileText, Settings, LogOut, X, ChevronLeft, ChevronRight, ShoppingBasket 
} from 'lucide-react'

// 🔹 Helper untuk ambil inisial dari nama UMKM
function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
}

export default function Sidebar({ view, setView, sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
  const items = [
    { key: 'overview', label: 'Ringkasan', icon: Home },
    { key: 'customers', label: 'Pelanggan', icon: Users },
    { key: 'products', label: 'Produk', icon: Package },
    { key: 'categories', label: 'Kategori & Jenis Produk', icon: ShoppingBasket },
    { key: 'transactions', label: 'Transaksi', icon: CreditCard },
    { key: 'wa', label: 'Kirim WA', icon: MessageSquare },
    { key: 'invoices', label: 'Nota & Laporan', icon: FileText },
  ]

  // 🔹 Ambil user dari localStorage
  const user = JSON.parse(localStorage.getItem('user'))
  const umkmName = user?.nama_umkm || 'UMKM Saya'
  const initials = getInitials(umkmName)

  // 🔹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('umkmData')
    window.location.href = '/login'
  }

  // Tutup sidebar kalau ESC ditekan
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen, setSidebarOpen])

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* 📱 Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl md:hidden transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 truncate">{umkmName}</div>
                <div className="text-xs text-slate-500">Kelola usaha Anda</div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Tutup sidebar"
            >
              <X className="h-5 w-5 text-slate-400" />
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
                  onClick={() => {
                    setView(item.key)
                    setSidebarOpen(false)
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-50 text-sky-600 font-medium shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-sky-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-slate-100 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Settings className="h-5 w-5 text-slate-400" />
              <span>Pengaturan</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 text-red-400" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 💻 Desktop Sidebar */}
      <div className={`hidden md:block h-full transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
        <aside className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className={`p-5 border-b border-slate-100 ${collapsed ? 'p-3' : ''}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
              <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {initials}
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{umkmName}</div>
                    <div className="text-xs text-slate-500 truncate">Kelola usaha Anda</div>
                  </div>
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Sempitkan sidebar"
                  >
                    <ChevronLeft className="h-4 w-4 text-slate-400" />
                  </button>
                </>
              )}
              {collapsed && (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="w-full p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Perluas sidebar"
                >
                  <ChevronRight className="h-4 w-4 text-slate-400 mx-auto" />
                </button>
              )}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {items.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setView(item.key)
                    setSidebarOpen(false)
                  }}
                  aria-current={view === item.key ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    view === item.key
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      view === item.key ? 'text-sky-600' : 'text-slate-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t border-slate-100 space-y-1 ${collapsed ? 'p-2' : ''}`}>
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? 'Pengaturan' : ''}
            >
              <Settings className="h-5 w-5 text-slate-400 flex-shrink-0" />
              {!collapsed && <span>Pengaturan</span>}
            </button>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? 'Keluar' : ''}
            >
              <LogOut className="h-5 w-5 text-red-400 flex-shrink-0" />
              {!collapsed && <span>Keluar</span>}
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}

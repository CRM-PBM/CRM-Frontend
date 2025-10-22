import React, { useState, useEffect } from 'react'
import { Search, Bell, Plus, Menu, LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getUser, clearTokens } from '../services/storage'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'

export default function DashboardTopbar({ title = 'Dashboard', onToggleSidebar = () => {} }){
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    // Load user data from storage
    const userData = getUser()
    if (userData) {
      setUser(userData)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      clearTokens()
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

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U'
    const nameParts = name.split(' ')
    if (nameParts.length >= 2) {
      return nameParts[0][0] + nameParts[1][0]
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'Pengguna'
    return user.nama_pemilik || user.email || 'Pengguna'
  }

  // Get business name
  const getBusinessName = () => {
    if (!user) return 'UMKM'
    return user.nama_umkm || 'UMKM Saya'
  }

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 15) return 'Selamat Siang'
    if (hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  // Get user role display
  const getRoleDisplay = () => {
    if (!user) return ''
    const roleMap = {
      'umkm': 'Pemilik UMKM',
      'admin': 'Administrator',
      'staff': 'Staff'
    }
    return roleMap[user.role] || user.role
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
            <p className="text-xs text-slate-500 truncate">
              {user ? `${getGreeting()}, ${getDisplayName()}! 👋` : 'Ringkasan dan pengelolaan usaha Anda'}
            </p>
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

          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 ml-2 hover:bg-slate-50 rounded-lg p-1 transition-colors"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm flex-shrink-0">
                {getInitials(user?.nama_pemilik || user?.email)}
              </div>
              <div className="hidden lg:block min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate text-left">
                  {getDisplayName()}
                </div>
                <div className="text-xs text-slate-500 truncate text-left">
                  {getBusinessName()}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Overlay to close menu when clicking outside */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                ></div>

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center font-semibold shadow-sm flex-shrink-0">
                        {getInitials(user?.nama_pemilik || user?.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {getDisplayName()}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-sky-600 font-medium truncate">
                            {getBusinessName()}
                          </span>
                          {user?.role && (
                            <span className="inline-block px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded text-xs">
                              {getRoleDisplay()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Profil Saya</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Pengaturan</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

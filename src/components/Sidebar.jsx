import React, { useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
    Home, Users, Package, CreditCard, MessageSquare,
    FileText, Settings, LogOut, X, ChevronLeft, ChevronRight, ShoppingBasket, Globe
} from 'lucide-react';


function getInitials(name) {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) {
    const location = useLocation();

    // 🔹 Ambil user dari localStorage (termasuk role!)
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = localStorage.getItem('userRole'); // Ambil role yang sudah disimpan

    
    const role = userRole || 'umkm';

    const umkmName = user?.nama_umkm || (role === 'admin' ? 'Super Admin' : 'UMKM Saya');
    const initials = getInitials(umkmName);

    // --- Daftar Link Navigasi ---
    const umkmLinks = [
        // Ringkasan tidak perlu path anak, langsung ke /dashboard
        { path: '/dashboard', label: 'Ringkasan', icon: Home, key: 'overview' },
        { path: '/dashboard/customers', label: 'Pelanggan', icon: Users, key: 'customers' },
        { path: '/dashboard/product-management', label: 'Manajemen Produk', icon: ShoppingBasket, key: 'product-management' },
        { path: '/dashboard/transactions', label: 'Manajemen Transaksi & POS', icon: CreditCard, key: 'transactions' },
        { path: '/dashboard/wa', label: 'Kirim WA', icon: MessageSquare, key: 'wa' },
        { path: '/dashboard/reports', label: 'Laporan', icon: FileText, key: 'reports' },
    ];

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Ringkasan Admin', icon: Globe, key: 'admin-dashboard' },
        { path: '/admin/umkm', label: 'Manajemen UMKM', icon: Users, key: 'admin-umkm' },
        { path: '/admin/reports', label: 'Laporan', icon: FileText, key: 'admin-reports' },
    ];

    const currentLinks = role === 'admin' ? adminLinks : umkmLinks;
    const homePath = role === 'admin' ? '/admin/dashboard' : '/dashboard';

    // 🔹 Logout handler
    const handleLogout = () => {
        // Hapus semua data yang relevan
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('umkmData');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    };

    // Tutup sidebar kalau ESC ditekan
    useEffect(() => {
        function onKey(e) {
            if (e.key === 'Escape' && sidebarOpen) {
                setSidebarOpen(false);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [sidebarOpen, setSidebarOpen]);

    // Fungsi untuk menentukan apakah link aktif
    const isLinkActive = (path) => {
        return location.pathname.startsWith(path) && path !== homePath;
    };

    // Kasus khusus: /dashboard atau /admin/dashboard
    const isHomeActive = location.pathname === homePath;


    return (
        <>
            {/* Mobile Overlay (TIDAK BERUBAH) */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 print:hidden ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* 📱 Mobile Sidebar (TIDAK BERUBAH) */}
            <aside
                className={`app-sidebar fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl md:hidden transform transition-transform duration-300 ease-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <Link to={homePath} className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                                {initials}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900 truncate">{umkmName}</div>
                                <div className="text-xs text-slate-500">{role === 'admin' ? 'Akses Global' : 'Kelola usaha Anda'}</div>
                            </div>
                        </Link>
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
                        {currentLinks.map(item => {
                            const Icon = item.icon;
                            // Tentukan isActive berdasarkan React Router
                            const isActive = isLinkActive(item.path) || (item.path === homePath && isHomeActive);

                            return (
                                <Link
                                    to={item.path}
                                    key={item.key}
                                    onClick={() => setSidebarOpen(false)}
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
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Footer (Logout dan Settings) - TIDAK BERUBAH FUNGSI */}
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

            {/* 💻 Desktop Sidebar (PERBAIKAN POSISI TOMBOL COLLAPSE ADA DI SINI) */}
            <div 
                className={`app-sidebar hidden md:block h-full transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-72'}`}
            >
                <aside className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className={`p-5 border-b border-slate-100 ${collapsed ? 'p-3' : ''}`}>
                        <Link to={homePath} className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
                            <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {initials}
                            </div>
                            {!collapsed && (
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 truncate">{umkmName}</div>
                                    <div className="text-xs text-slate-500 truncate">{role === 'admin' ? 'Akses Global' : 'Kelola usaha Anda'}</div>
                                </div>
                            )}
                        </Link>
                        
                        {/* Tombol Collapse (Saat Collapsed) - TETAP DI SINI */}
                        {collapsed && (
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="w-full p-2 rounded-lg hover:bg-slate-50 transition-colors mt-2"
                                title="Perluas sidebar"
                            >
                                <ChevronRight className="h-4 w-4 text-slate-400 mx-auto" />
                            </button>
                        )}
                        {/* CATATAN: Tombol untuk !collapsed (ChevronLeft) dipindahkan ke luar <aside> */}
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {currentLinks.map(item => {
                            const Icon = item.icon;
                            const isActive = isLinkActive(item.path) || (item.path === homePath && isHomeActive);

                            return (
                                <Link
                                    to={item.path}
                                    key={item.key}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        collapsed ? 'justify-center' : ''
                                    } ${
                                        isActive
                                            ? 'bg-sky-50 text-sky-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                    title={collapsed ? item.label : ''}
                                >
                                    <Icon
                                        className={`h-5 w-5 flex-shrink-0 ${
                                            isActive ? 'text-sky-600' : 'text-slate-400'
                                        }`}
                                    />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer (Logout dan Settings) - TIDAK BERUBAH FUNGSI */}
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
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute top-6 right-3 transform p-1.5 rounded-full bg-white border border-slate-200 shadow-lg hover:bg-slate-50 transition- colors hidden md:block z-10" 
                        title="Sempitkan sidebar"
                    >
                        <ChevronLeft className="h-4 w-4 text-slate-400" />
                    </button>
                )}
            </div>
        </>
    );
}
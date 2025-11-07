import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; 
import Sidebar from '../components/Sidebar';
import DashboardTopbar from '../components/DashboardTopbar';

// Daftar komponen anak yang akan dipetakan ke judul Topbar (untuk UMKM)
const umkmTitleMap = {
    '/dashboard': 'Ringkasan',
    '/dashboard/customers': 'Manajemen Pelanggan',
    '/dashboard/products': 'Manajemen Produk',
    '/dashboard/categories': 'Manajemen Kategori & Jenis Produk',
    '/dashboard/transactions': 'Pencatatan Transaksi',
    '/dashboard/wa': 'WA Blast',
    '/dashboard/reports': 'Manajemen Laporan',
};

// Daftar komponen anak yang akan dipetakan ke judul Topbar (untuk ADMIN)
const adminTitleMap = {
    '/admin/dashboard': 'Dashboard Analitik Global',
    '/admin/umkm': 'Manajemen UMKM',
    '/admin/reports': 'Laporan Global',
};


// Fungsi untuk mendapatkan judul berdasarkan path saat ini
function getTitle(pathname) {
    const role = localStorage.getItem('userRole');
    
    if (role === 'admin') {
        const pathBase = pathname.startsWith('/admin') ? pathname : '/admin/dashboard';
        return adminTitleMap[pathBase] || 'Admin Panel';
    } else {
        const pathBase = pathname.startsWith('/dashboard') ? pathname : '/dashboard';
        return umkmTitleMap[pathBase] || 'Ringkasan Bisnis';
    }
}


export default function Dashboard() {
    const location = useLocation(); // Ambil lokasi saat ini
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    
    // Perbarui judul setiap kali rute berubah
    const currentTitle = getTitle(location.pathname);

    // Hilangkan view, setView, loading, dan dashboardData state/logic

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex h-screen overflow-hidden">
                {/* 1. Sidebar Container */}
                <div className={`hidden md:block flex-shrink-0 p-4 transition-all duration-300 ${collapsed ? 'md:w-20' : 'md:w-72'}`}>
                    <Sidebar 
                        sidebarOpen={sidebarOpen} 
                        setSidebarOpen={setSidebarOpen} 
                        collapsed={collapsed} 
                        setCollapsed={setCollapsed} 
                    />
                </div>

                {/* 2. Mobile Sidebar (Sidebar Component handles mobile view) */}
                <div className="md:hidden">
                    <Sidebar 
                        sidebarOpen={sidebarOpen} 
                        setSidebarOpen={setSidebarOpen} 
                        collapsed={collapsed} 
                        setCollapsed={setCollapsed} 
                    />
                </div>

                {/* 3. Main Content */}
                <main className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto">
                    {/* Topbar: Tetap di sini untuk tombol toggle dan judul */}
                    <DashboardTopbar 
                        onToggleSidebar={() => setSidebarOpen(s => !s)} 
                        title={currentTitle}
                    />

                    {/* Ini adalah tempat di mana komponen anak (Overview, Customers, AdminDashboard, dll.) akan dirender */}
                    <Outlet /> 

                </main>
            </div>
        </div>
    );
}
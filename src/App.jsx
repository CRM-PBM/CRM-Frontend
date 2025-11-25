import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import komponen landing page
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';
import Features from './components/Features';
import VisionMission from './components/VisionMission';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

// Import halaman dashboard dan auth
import Dashboard from './pages/Dashboard'; // Layout Wrapper
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Import Komponen Halaman Anak UMKM BARU & yang Dipindahkan
import Overview from './pages/dashboard/Overview';
import Customers from './pages/dashboard/Customers'; 
import Products from './pages/dashboard/Products';
import CategoriesAndType from './pages/dashboard/CategoriesAndType';
import Transactions from './pages/dashboard/Transactions';
import WaBlast from './pages/dashboard/WaBlast'; 
import Reports from './pages/dashboard/Reports'; 
import ProductManagement from './pages/dashboard/ManagementProducts';

// Import komponen Admin
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminUmkmManagementPage from './pages/Admin/AdminUmkmManagementPage';


// --- 1. Component Helper untuk Route UMKM/Otentikasi Dasar ---
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token'); 
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// --- 2. Component Helper untuk Route ADMIN (Otorisasi Role) ---
const PrivateAdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); 
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Cek Otorisasi (Role harus 'admin')
    if (userRole !== 'admin') {
        // Alihkan ke dashboard user biasa jika bukan admin
        return <Navigate to="/dashboard" replace />; 
    }
    
    return children;
};


// Component untuk Landing Page
const LandingPage = () => (
    <>
        <Header />
        <main>
            <Hero />
            <Partners />
            <VisionMission />
            <Features />
            <Testimonials />
        </main>
        <Footer />
    </>
);


function App() {
    return (
        <Router>
            <div className="bg-white font-sans">
                <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* ==================================================== */}
                    {/* 1. PROTECTED ROUTES (UMKM) - Dashboard sebagai Layout */}
                    {/* ==================================================== */}
                    {/* Menggunakan path="/dashboard/*" diganti dengan path="/dashboard" untuk Nested Routes yang benar */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard /> {/* Dashboard = Layout Wrapper */}
                            </ProtectedRoute>
                        }
                    >
                        {/* Rute Indeks: /dashboard -> Overview */}
                        <Route index element={<Overview />} /> 
                        
                        {/* Rute anak UMKM */}
                        <Route path="customers" element={<Customers />} />
                        <Route path="products" element={<Products />} />
                        <Route path="product-management" element={<ProductManagement />} />
                        <Route path="categories" element={<CategoriesAndType />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="wa" element={<WaBlast />} />
                        <Route path="reports" element={<Reports />} /> 

                    </Route>


                    {/* ==================================================== */}
                    {/* 2. PROTECTED ROUTES (ADMIN) - Dashboard sebagai Layout */}
                    {/* ==================================================== */}
                    <Route
                        path="/admin"
                        element={
                            <PrivateAdminRoute>
                                {/* Menggunakan Dashboard sebagai Layout (menggantikan <AdminLayout />) */}
                                <Dashboard /> 
                            </PrivateAdminRoute>
                        }
                    >
                        {/* Rute Indeks /admin otomatis redirect ke dashboard */}
                        <Route index element={<Navigate to="dashboard" replace />} /> 
                        
                        {/* Rute Halaman Admin */}
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="umkm" element={<AdminUmkmManagementPage />} />
                        {/* Tambahkan rute admin lainnya di sini */}
                    </Route>


                    {/* 404 Route */}
                    <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center bg-slate-50">
                            <div className="text-center">
                                <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
                                <p className="text-xl text-slate-600 mb-8">Halaman tidak ditemukan</p>
                                <a
                                    href="/"
                                    className="bg-sky-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-600 transition-colors"
                                >
                                    Kembali ke Beranda
                                </a>
                            </div>
                        </div>
                    } />
                </Routes>

                <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </Router>
    );
}

export default App;
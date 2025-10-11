// CRM-frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import komponen-komponen yang telah kita buat
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InvoiceGeneratorPage from './pages/InvoiceGeneratorPage';

// Component Helper untuk Route yang Terproteksi
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function App() {
    return (
        <Router>
            <Routes>
                {/* --- PUBLIC ROUTES (Akses tanpa login) --- */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* Route Login dan Register */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* --- PROTECTED ROUTES (Membutuhkan login) --- */}

                {/* Contoh Dashboard */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            {/* Ini adalah halaman placeholder dashboard */}
                            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                                <h1 className="text-3xl text-slate-800 font-bold">
                                    Dashboard Utama - Selamat Datang!
                                </h1>
                            </div>
                        </ProtectedRoute>
                    } 
                />

                {/* Route Invoice Generator */}
                <Route 
                    path="/invoice-generator" 
                    element={
                        <ProtectedRoute>
                            <InvoiceGeneratorPage />
                        </ProtectedRoute>
                    } 
                />

                {/* Route untuk 404 Not Found (Opsional) */}
                <Route path="*" element={<h1 className="text-center mt-20">404: Halaman Tidak Ditemukan</h1>} />

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
        </Router>
    );
}

export default App;
// CRM-frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSpinner } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:3000/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
            
            // Simpan token & data user
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            alert('Login berhasil! Anda akan diarahkan ke Dashboard.');
            navigate('/dashboard'); // Arahkan ke halaman utama/dashboard
        } catch (err) {
            setError(err.response?.data?.msg || 'Login gagal. Coba periksa kembali email dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-6">
                    <FaSignInAlt className="text-sky-500 mx-auto text-4xl mb-3" />
                    <h2 className="text-3xl font-bold text-slate-800">
                        Masuk ke Akun Anda
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Akses sistem CRM UMKM Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Pesan Error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-slate-800 text-sm font-semibold mb-2" htmlFor="email">Email</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-150"
                            placeholder="email@contoh.com" required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-800 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input
                            type="password" name="password" value={formData.password} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-150"
                            placeholder="Masukkan password Anda" required
                        />
                    </div>
                    
                    {/* Tombol Masuk */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-500 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-600 transition duration-200 mt-4 flex items-center justify-center disabled:bg-sky-400"
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin mr-2" />
                        ) : (
                            'Masuk'
                        )}
                    </button>

                    <p className="mt-6 text-center text-gray-600 text-sm">
                        Belum punya akun? 
                        <a href="/register" className="text-sky-500 hover:text-sky-600 font-medium ml-1">Daftar sekarang</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
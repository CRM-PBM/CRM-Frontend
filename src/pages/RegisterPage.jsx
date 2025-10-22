import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserPlus, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import { setTokens, setUser } from '../services/storage'

const RegisterPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nama_pemilik: '',
        nama_umkm: '',
        telepon: '',
        alamat: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await authService.register(formData)

            // Simpan token & data user jika ada
            if (res.accessToken && res.refreshToken) {
                setTokens(res.accessToken, res.refreshToken)
            } else if (res.token) {
                // Fallback untuk API lama yang masih mengembalikan single token
                setTokens(res.token, res.token)
            }
            
            if (res.user) {
                setUser(res.user)
            }

            toast.success('🎉 Registrasi berhasil! Selamat datang di UMKM.CRM.', {
                position: "top-center"
            })
            navigate('/login')
        } catch (err) {
            const errMsg = err.response?.data?.msg || 'Registrasi gagal. Coba periksa koneksi atau data.'
            toast.error(errMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-6">
                    <FaUserPlus className="text-sky-500 mx-auto text-4xl mb-3" />
                    <h2 className="text-3xl font-bold text-slate-800">
                        Daftar Akun UMKM.CRM
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Daftarkan UMKM dan pemilik akun pertama Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Pesan Error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* FIELD UMKM */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Nama UMKM" name="nama_umkm" type="text" value={formData.nama_umkm} onChange={handleChange} placeholder="Contoh: Kopi Nusantara Jaya" required />
                        <InputGroup label="Nama Pemilik/Admin" name="nama_pemilik" type="text" value={formData.nama_pemilik} onChange={handleChange} placeholder="Budi Santoso" required />
                        <InputGroup label="Nomor Telepon" name="telepon" type="text" value={formData.telepon} onChange={handleChange} placeholder="081xxx" />
                    </div>
                    
                    {/* FIELD USER */}
                    <div className="mt-4 border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Email Login" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@contoh.com" required />
                        <InputGroup label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Minimal 8 Karakter" required />
                    </div>
                    
                    {/* Field Alamat (Full Width) */}
                    <div className="mt-4">
                        <label className="block text-slate-800 text-sm font-semibold mb-2" htmlFor="alamat">Alamat Lengkap</label>
                        <textarea
                            name="alamat"
                            value={formData.alamat}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-150"
                            placeholder="Alamat UMKM Anda"
                            rows="2"
                        ></textarea>
                    </div>

                    {/* Tombol Daftar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-500 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-600 transition duration-200 mt-6 flex items-center justify-center disabled:bg-sky-400"
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin mr-2" />
                        ) : (
                            'Daftar Sekarang'
                        )}
                    </button>

                    <p className="mt-6 text-center text-gray-600 text-sm">
                        Sudah punya akun? 
                        <a href="/login" className="text-sky-500 hover:text-sky-600 font-medium ml-1">Masuk di sini</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

// Komponen helper untuk input field
const InputGroup = ({ label, name, type, value, onChange, placeholder, required = false }) => (
    <div className="mb-4">
        <label className="block text-slate-800 text-sm font-semibold mb-2" htmlFor={name}>{label}</label>
        <input
            type={type} name={name} value={value} onChange={onChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-150"
            placeholder={placeholder} required={required}
        />
    </div>
);


export default RegisterPage;
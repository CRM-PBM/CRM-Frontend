import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSignInAlt, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'

const LoginPage = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
            const res = await authService.login(formData)
            console.log('Login response:', res)

            // Cek jika login berhasil dan respons memiliki token
            if (res.token && res.user) {
                
                localStorage.setItem('token', res.token)
                console.log('Token saved to localStorage as authToken')

                const userRole = res.user.role || 'umkm'; 
                localStorage.setItem('userRole', userRole);
                console.log('User Role saved:', userRole);

                // Simpan user dan umkmData
                const namaUmkm = res.user.Umkm?.nama_umkm || res.user.nama_umkm || 'UMKM Saya';
                const namaPemilik = res.user.Umkm?.nama_pemilik || res.user.nama_pemilik || 'Pemilik Usaha';

                localStorage.setItem('user', JSON.stringify(res.user));
                localStorage.setItem('umkmData', JSON.stringify({
                    nama_umkm: namaUmkm,
                    nama_pemilik: namaPemilik
                }));

                // 🚀 SOLUSI 3: Logika Redirect Berdasarkan Role
                // Arahkan ke rute yang benar setelah login sukses
                if (userRole === 'adm' || userRole === 'admin') {
                    // Jika role adalah admin, arahkan ke halaman admin
                    navigate('/admin', { replace: true })
                } else {
                    // Jika role adalah umkm, arahkan ke dashboard biasa
                    navigate('/dashboard', { replace: true })
                }
                
                toast.success('Login berhasil!');

            } else {
                // Kasus jika respons sukses tapi tidak ada token/user (jarang terjadi jika API benar)
                 throw new Error('Respons login tidak lengkap.'); 
            }
            
        } catch (err) {
            console.error('Login error:', err)
            // Menggunakan err.message jika error dari 'throw new Error' di atas
            const errMsg = err.response?.data?.msg || err.message || 'Login gagal. Coba periksa kembali email dan password Anda.'
            toast.error(errMsg)
        } finally {
            setLoading(false)
        }
    }

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
                        <label className="block text-slate-800 text-sm font-semibold mb-2" htmlFor="email">Email UMKM</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-150"
                            placeholder="Masukan email UMKM Anda" required
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
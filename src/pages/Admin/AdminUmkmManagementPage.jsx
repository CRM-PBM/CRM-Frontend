import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService'; 
import { FaCheck, FaBan, FaSearch, FaUser } from 'react-icons/fa'; 

const AdminUmkmManagementPage = () => {
    const [umkmList, setUmkmList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. FUNGSI AMBIL DATA UMKM ---
    const fetchUmkmList = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminService.getAllUmkm();
            setUmkmList(data);
        } catch (err) {
            console.error("Gagal fetch UMKM:", err);
            setError("Gagal memuat daftar UMKM. Cek koneksi API.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUmkmList();
    }, []);

    // --- 2. FUNGSI AKSI ADMIN (VERIFIKASI/SUSPEND) ---
    const handleAction = async (umkmId, actionType) => {
        if (!window.confirm(`Apakah Anda yakin ingin ${actionType} UMKM ini?`)) {
            return;
        }

        try {
            let response;
            if (actionType === 'verifikasi') {
                response = await adminService.verifyUmkm(umkmId);
            } else if (actionType === 'suspend') {
                response = await adminService.suspendUmkm(umkmId);
            }
            
            // Menggunakan SweetAlert atau notifikasi yang lebih baik daripada alert()
            alert(response.msg); 
            fetchUmkmList(); // Refresh daftar setelah aksi berhasil

        } catch (err) {
            const errorMsg = err.response?.data?.msg || `Gagal ${actionType} UMKM.`;
            alert(errorMsg);
            console.error(err);
        }
    };

    // --- 3. RENDERING UI ---
    if (isLoading) return <div className="p-6">Memuat Daftar UMKM...</div>;
    if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

    return (
        <div className="p-6 bg-slate-50 min-h-full">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen UMKM</h1>
            <p className="text-gray-500 mb-6">Kelola semua UMKM terdaftar di platform. Total: <span className='font-bold text-lg text-slate-700'>{umkmList.length.toLocaleString('id-ID')}</span></p>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                
                {/* Search Bar (Contoh) */}
                <div className="mb-4 flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Cari UMKM berdasarkan nama atau email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                            // Tambahkan state dan onChange handler di sini untuk fitur pencarian
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {/* Tabel Daftar UMKM */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama UMKM</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Pemilik</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Telepon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tgl. Daftar</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {umkmList.map((umkm) => (
                                <tr key={umkm.umkm_id} className="hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{umkm.nama_umkm}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                        <div className="flex items-center">
                                            <FaUser className="mr-2 text-xs text-gray-400" />
                                            {umkm.nama_pemilik}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{umkm.telepon}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-sky-600 font-medium">{umkm.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        {/* Tampilkan status dalam badge warna */}
                                        {umkm.status === 'active' && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">AKTIF</span>
                                        )}
                                        {umkm.status === 'pending' && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">PENDING</span>
                                        )}
                                        {umkm.status === 'suspended' && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">SUSPENDED</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">{new Date(umkm.tanggal_daftar).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                        {umkm.status === 'pending' && (
                                            <button 
                                                onClick={() => handleAction(umkm.umkm_id, 'verifikasi')}
                                                className="text-white bg-emerald-500 hover:bg-emerald-600 transition duration-150 py-1 px-3 rounded-lg text-xs font-semibold shadow-md"
                                                title="Verifikasi UMKM"
                                            >
                                                <FaCheck className='inline mr-1' /> Verifikasi
                                            </button>
                                        )}
                                        {umkm.status === 'active' && (
                                            <button 
                                                onClick={() => handleAction(umkm.umkm_id, 'suspend')}
                                                className="text-red-600 hover:text-red-700 transition duration-150 py-1 px-3 rounded-lg text-xs font-semibold border border-red-300 hover:bg-red-50"
                                                title="Tangguhkan UMKM"
                                            >
                                                <FaBan className='inline mr-1' /> Suspend
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Catatan: Tambahkan fitur Pagination di sini jika daftar UMKM terlalu panjang */}
            </div>
        </div>
    );
};

export default AdminUmkmManagementPage;
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService'; 
import { FaCheck, FaBan, FaSearch, FaUser } from 'react-icons/fa'; 
import { Loader } from 'lucide-react'

const AdminUmkmManagementPage = () => {
    const [umkmList, setUmkmList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState({}); 

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

    const handleAction = async (umkmId, actionType) => {
        const actionText = actionType === 'verifikasi' ? 'Verifikasi' : 'Tangguhkan (Suspend)';
        if (!window.confirm(`Apakah Anda yakin ingin ${actionText} UMKM ini? Tindakan ini akan mengirim notifikasi email otomatis.`)) {
            return;
        }

        setIsActionLoading(prev => ({ ...prev, [umkmId]: true })); 

        try {
            let response;
            if (actionType === 'verifikasi') {
                response = await adminService.verifyUmkm(umkmId);
            } else if (actionType === 'suspend') {
                response = await adminService.suspendUmkm(umkmId);
            }
            
            // Mengatasi bug Axios wrapping dan mengambil pesan
            const apiResponseData = response.data || response; 
            const successMsg = apiResponseData.msg || `Aksi ${actionText} berhasil!`;
            
            // PERUBAHAN KRUSIAL: Memperbarui state secara lokal untuk refresh instan
            setUmkmList(prevList => 
                prevList.map(item => 
                    item.umkm_id === umkmId 
                        ? { 
                            ...item, 
                            status: actionType === 'verifikasi' ? 'active' : 'suspended',
                            verified_at: actionType === 'verifikasi' ? new Date().toISOString() : item.verified_at
                          }
                        : item
                )
            );

            alert(successMsg); 

        } catch (err) {
            const errorMsg = err.response?.data?.msg || `Gagal ${actionText} UMKM.`;
            alert(errorMsg);
            console.error(err);
        } finally {
            setIsActionLoading(prev => ({ ...prev, [umkmId]: false })); 
        }
    };

    if (isLoading) return <div className="p-8 text-center">
        <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Memuat data...</p>
    </div>;
    if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

    return (
        <div className="p-6 bg-slate-50 min-h-full">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Manajemen UMKM</h1>
            <p className="text-gray-500 mb-6">Kelola semua UMKM terdaftar di platform. Total: <span className='font-bold text-lg text-slate-700'>{umkmList.length.toLocaleString('id-ID')}</span></p>
            
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                
                <div className="mb-4 flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Cari UMKM berdasarkan nama atau email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

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
                                        {(() => {
                                            const loading = isActionLoading[umkm.umkm_id];

                                            if (umkm.status === 'pending') {
                                                return (
                                                    <button 
                                                        onClick={() => handleAction(umkm.umkm_id, 'verifikasi')}
                                                        className="text-white bg-emerald-500 hover:bg-emerald-600 transition duration-150 py-1 px-3 rounded-lg text-xs font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={loading}
                                                    >
                                                        {loading ? <Loader className='h-3 w-3 inline mr-1 animate-spin' /> : <FaCheck className='inline mr-1' />} Verifikasi
                                                    </button>
                                                );
                                            } else if (umkm.status === 'active') {
                                                return (
                                                    <button 
                                                        onClick={() => handleAction(umkm.umkm_id, 'suspend')}
                                                        className="text-red-600 hover:text-red-700 transition duration-150 py-1 px-3 rounded-lg text-xs font-semibold border border-red-300 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={loading}
                                                    >
                                                        {loading ? <Loader className='h-3 w-3 inline mr-1 animate-spin' /> : <FaBan className='inline mr-1' />} Suspend
                                                    </button>
                                                );
                                            }
                                            return null; 
                                        })()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUmkmManagementPage;
import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService'; 
import { Bar } from 'react-chartjs-2'; 
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { FaStore, FaCheckCircle, FaHourglassHalf, FaChartLine, FaUsers, FaCalendarAlt } from 'react-icons/fa'; 
import { Loader } from 'lucide-react'

// 🛑 DAFTARKAN KOMPONEN CHART.JS (Diperbarui untuk Bar Chart)
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement, 
    Title,
    Tooltip,
    Legend
);

// --- Komponen Pembantu Analytic Card (TIDAK BERUBAH) ---
const AnalyticCard = ({ title, value, color = 'gray', icon: Icon }) => {
    const colorMap = {
        gray: 'text-gray-500 bg-gray-100',
        green: 'text-emerald-500 bg-emerald-100',
        orange: 'text-amber-500 bg-amber-100',
        blue: 'text-sky-500 bg-sky-100'
    };
    
    const formattedValue = title.includes('Volume Transaksi') 
        ?  `${value.toLocaleString('id-ID')} x` 
        : value.toLocaleString('id-ID');

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 transition hover:shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{formattedValue}</h3>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-full ${colorMap[color]}`}>
                        <Icon className="text-xl" />
                    </div>
                )}
            </div>
            <div className='text-xs text-gray-400'>Total akumulasi data platform.</div>
        </div>
    );
};


const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [growthData, setGrowthData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    
    // Penentuan Ikon untuk Card (TIDAK BERUBAH)
    const getIconForCard = (title) => {
        if (title.includes('Total UMKM')) return FaStore;
        if (title.includes('Aktif')) return FaCheckCircle;
        if (title.includes('Menunggu Verifikasi')) return FaHourglassHalf;
        if (title.includes('Transaksi Global')) return FaChartLine;
        return FaUsers;
    };


    // Fungsi Ambil Data Dinamis (TIDAK BERUBAH)
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const globalStats = await adminService.getGlobalStats();
            setStats(globalStats);

            const growthChartData = await adminService.getUmkmGrowthData(selectedPeriod); 
            setGrowthData(growthChartData);

        } catch (err) {
            console.error("Gagal memuat Dashboard Admin:", err);
            setError("Gagal memuat data analitik. Cek koneksi backend.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedPeriod]); 

    const handlePeriodChange = (e) => {
        setSelectedPeriod(e.target.value);
    };


    // Konfigurasi Data Bar Chart (Disesuaikan untuk Bar Chart)
    const chartData = {
        labels: growthData.map(item => Object.values(item)[0]), 
        datasets: [
            {
                label: 'Total Akumulasi UMKM Aktif', 
                data: growthData.map(item => item.cumulative_active_umkm), 
                backgroundColor: 'rgba(4, 120, 87, 0.8)', // Hijau Tua (emerald-700)
                borderColor: 'rgb(4, 120, 87)',
                borderWidth: 1,
            },
            {
                label: 'Pertumbuhan UMKM Baru', 
                data: growthData.map(item => item.new_umkm), 
                backgroundColor: 'rgba(14, 165, 233, 0.8)', // Biru (sky-500)
                borderColor: 'rgb(14, 165, 233)', 
                borderWidth: 1,
            },
        ],
    };

    // Konfigurasi Options Bar Chart (Disesuaikan untuk Bar Chart)
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'top',
            },
            title: { 
                display: false,
            },
        },
        scales: {
            x: {
                stacked: false, 
            },
            y: {
                stacked: false,
                beginAtZero: true,
                ticks: {
                    precision: 0 
                }
            }
        },
    };

    if (isLoading) return <div className="p-8 text-center">
                    <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Memuat data admin...</p>
                </div>;
    if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;
    if (!stats) return <div>Data tidak tersedia.</div>;

    // Rendering Halaman (Diperbarui menggunakan komponen <Bar />)
    return (
        <div className="p-6 bg-slate-50 min-h-full">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Admin</h1>
            <p className="text-gray-500 mb-8">Ringkasan performa platform CRM-UMKM secara keseluruhan.</p>
            
            {/* Bagian A: Card Analitik Global (TIDAK BERUBAH) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalyticCard 
                    title="Total UMKM Terdaftar" 
                    value={stats.totalUmkm} 
                    icon={getIconForCard('Total UMKM')} 
                    color="gray" 
                />
                <AnalyticCard 
                    title="UMKM Aktif" 
                    value={stats.activeUmkm} 
                    icon={getIconForCard('Aktif')} 
                    color="green" 
                />
                <AnalyticCard 
                    title="Menunggu Verifikasi" 
                    value={stats.pendingUmkm} 
                    icon={getIconForCard('Menunggu Verifikasi')} 
                    color="orange" 
                />
                <AnalyticCard 
                    title="Volume Transaksi" 
                    value={stats.totalTransaksiVolume} 
                    icon={getIconForCard('Transaksi Global')} 
                    color="blue" 
                />
            </div>

            {/* Bagian B: Grafik Pertumbuhan UMKM (Menggunakan Bar Chart) */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
                <div className='flex justify-between items-center mb-4'>
                    <h2 className="text-xl font-semibold text-slate-700">📈 Grafik Pertumbuhan UMKM</h2>
                    
                    {/* Dropdown Filter Periode (TIDAK BERUBAH) */}
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-gray-500" />
                        <select
                            value={selectedPeriod}
                            onChange={handlePeriodChange}
                            className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-sky-500 focus:border-sky-500"
                        >
                            <option value="day">Per Hari</option>
                            <option value="week">Per Minggu</option>
                            <option value="month">Per Bulan</option>
                            <option value="year">Per Tahun</option>
                        </select>
                    </div>
                </div>
                
                <div style={{ height: '350px' }}>
                    {growthData.length > 0 ? (
                        // GANTI KOMPONEN LINE MENJADI BAR
                        <Bar data={chartData} options={options} />
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            Tidak ada data pertumbuhan UMKM pada periode ini.
                        </div>
                    )}
                </div>
            </div>
            
            {/* Bagian C: Shortcut ke Manajemen UMKM (TIDAK BERUBAH) */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg text-sm">
                <a href="/admin/umkm" className="text-sky-700 hover:text-sky-800 font-medium flex items-center">
                    <FaStore className='mr-2 text-lg' /> Akses cepat: Kelola & Verifikasi UMKM Pending ({stats.pendingUmkm.toLocaleString('id-ID')})
                </a>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
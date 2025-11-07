import React, { useState, useEffect } from 'react';
import { 
    Users, CreditCard, Package, ShoppingCart, Calendar, DollarSign, 
    AlertCircle, ArrowUpRight, ArrowDownRight, TrendingUp, BarChart2
} from 'lucide-react';
import { pelangganService } from '../../services/pelangganService';
import { produkService } from '../../services/produkService';
import { transaksiService } from '../../services/transaksiService';
import { Link } from 'react-router-dom';

// Data Dummy Awal
const initialDashboardData = {
    pelanggan: { total: 0, baru_bulan_ini: 0, pertumbuhan: 0 },
    produk: { total: 0, aktif: 0, stok_rendah: 0, nilai_inventori: 0 },
    transaksi: { 
        total_hari_ini: 0, 
        total_bulan_ini: 0, 
        pendapatan_hari_ini: 0, 
        pendapatan_bulan_ini: 0,
        rata_rata: 0,
        pertumbuhan: 0
    },
    recentTransactions: [],
    topProducts: [],
    lowStockProducts: []
};


// Format currency
const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return 'Rp 0';
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (isNaN(numValue)) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(numValue);
};

// Format number with K/M suffix
const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
};


export default function Overview() {
    const [loading, setLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState(initialDashboardData);

    useEffect(() => {
        loadDashboardData();
    }, []); // Muat hanya sekali saat komponen dimount

    async function loadDashboardData() {
        setLoading(true);
        try {
            // Logika pemrosesan data tetap sama seperti yang Anda berikan
            let produkData = [];
            let transaksiStats = {};
            let recentTransactions = [];
            let pelangganStats = {};

            try {
                pelangganStats = await pelangganService.getStatistik();
            } catch (error) {
                console.error('Error loading pelanggan statistik:', error);
            }

            try {
                const produkRes = await produkService.getAll({ limit: 1000 });
                produkData = produkRes.data || [];
            } catch (error) {
                console.error('Error loading produk:', error);
            }

            try {
                const transaksiRes = await transaksiService.getStatistics();
                transaksiStats = transaksiRes.data || {};
            } catch (error) {
                console.error('Error loading transaksi statistics:', error);
            }

            try {
                const transaksiListRes = await transaksiService.getAll({ limit: 5, page: 1 });
                recentTransactions = transaksiListRes.data || [];
            } catch (error) {
                console.error('Error loading recent transactions:', error);
            }
            
            // --- Pemrosesan Data ---
            const produkAktif = produkData.filter(p => p.aktif).length;
            const stokRendah = produkData.filter(p => p.stok > 0 && p.stok < 10).length;
            const nilaiInventori = produkData.reduce((sum, p) => sum + (parseFloat(p.harga || 0) * parseInt(p.stok || 0)), 0);

            const topProducts = produkData
                .map(p => ({ ...p, nilai: (parseFloat(p.harga || 0) * parseInt(p.stok || 0)) }))
                .sort((a, b) => b.nilai - a.nilai)
                .slice(0, 5);

            const lowStockProducts = produkData
                .filter(p => p.aktif && p.stok <= 10)
                .sort((a, b) => a.stok - b.stok)
                .slice(0, 5);
            // --- Akhir Pemrosesan Data ---


            setDashboardData(prev => ({
                ...prev,
                pelanggan: {
                    total: pelangganStats.total || prev.pelanggan.total,
                    baru_bulan_ini: pelangganStats.baru_bulan_ini || prev.pelanggan.baru_bulan_ini,
                    pertumbuhan: pelangganStats.pertumbuhan || prev.pelanggan.pertumbuhan
                },
                produk: {
                    total: produkData.length,
                    aktif: produkAktif,
                    stok_rendah: stokRendah,
                    nilai_inventori: nilaiInventori
                },
                transaksi: {
                    total_hari_ini: transaksiStats.total_hari_ini || 0,
                    total_bulan_ini: transaksiStats.total_transaksi || 0,
                    pendapatan_hari_ini: transaksiStats.pendapatan_hari_ini || 0,
                    pendapatan_bulan_ini: transaksiStats.total_pendapatan || 0,
                    rata_rata: transaksiStats.rata_rata || 0,
                    pertumbuhan: transaksiStats.pertumbuhan || 0
                },
                recentTransactions: recentTransactions.slice(0, 5),
                topProducts,
                lowStockProducts
            }));
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    }


    // --- Komponen Penuh View Overview Anda ---
    return (
        <div className="pt-2"> {/* Tambahkan padding atas sedikit */}
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Pendapatan Bulan Ini */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        {dashboardData.transaksi.pertumbuhan !== 0 && (
                            <div className={`flex items-center gap-1 text-sm font-medium ${dashboardData.transaksi.pertumbuhan > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {dashboardData.transaksi.pertumbuhan > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {Math.abs(dashboardData.transaksi.pertumbuhan)}%
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-slate-600 mb-1">Pendapatan Bulan Ini</div>
                    <div className="text-2xl font-bold text-slate-900">
                        {loading ? '...' : formatCurrency(dashboardData.transaksi.pendapatan_bulan_ini)}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        Hari ini: {loading ? '...' : formatCurrency(dashboardData.transaksi.pendapatan_hari_ini)}
                    </div>
                </div>

                {/* Total Pelanggan */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-sky-100 rounded-lg">
                            <Users className="h-6 w-6 text-sky-600" />
                        </div>
                        <div className="text-green-600 text-sm font-medium">
                            +{dashboardData.pelanggan.baru_bulan_ini} baru
                        </div>
                    </div>
                    <div className="text-sm text-slate-600 mb-1">Total Pelanggan</div>
                    <div className="text-2xl font-bold text-slate-900">
                        {loading ? '...' : formatNumber(dashboardData.pelanggan.total)}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        Pertumbuhan {dashboardData.pelanggan.pertumbuhan}% bulan ini
                    </div>
                </div>

                {/* Total Transaksi */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <ShoppingCart className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-sky-600 text-sm font-medium">
                            {dashboardData.transaksi.total_hari_ini} hari ini
                        </div>
                    </div>
                    <div className="text-sm text-slate-600 mb-1">Transaksi Bulan Ini</div>
                    <div className="text-2xl font-bold text-slate-900">
                        {loading ? '...' : dashboardData.transaksi.total_bulan_ini}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        Rata-rata: {loading ? '...' : formatCurrency(dashboardData.transaksi.rata_rata)}
                    </div>
                </div>

                {/* Nilai Inventori */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Package className="h-6 w-6 text-amber-600" />
                        </div>
                        {dashboardData.produk.stok_rendah > 0 && (
                            <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                <AlertCircle className="h-4 w-4" />
                                {dashboardData.produk.stok_rendah}
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-slate-600 mb-1">Nilai Inventori</div>
                    <div className="text-2xl font-bold text-slate-900">
                        {loading ? '...' : formatCurrency(dashboardData.produk.nilai_inventori)}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        {dashboardData.produk.aktif} dari {dashboardData.produk.total} produk aktif
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top 5 Products */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-sky-600" />
                        <h3 className="font-semibold text-slate-900">Top 5 Produk</h3>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">Berdasarkan nilai stok</div>
                    {loading ? (
                        <div className="text-center py-4 text-slate-400">Loading...</div>
                    ) : dashboardData.topProducts.length === 0 ? (
                        <div className="text-center py-4 text-slate-400">Belum ada data</div>
                    ) : (
                        <div className="space-y-3">
                            {dashboardData.topProducts.map((produk, index) => (
                                <div key={produk.produk_id} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900 truncate">
                                            {produk.nama_produk}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Stok: {produk.stok} × {formatCurrency(produk.harga)}
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">
                                        {formatCurrency(produk.nilai)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-slate-900">Transaksi Terbaru</h3>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">5 transaksi terakhir</div>
                    {loading ? (
                        <div className="text-center py-4 text-slate-400">Loading...</div>
                    ) : dashboardData.recentTransactions.length === 0 ? (
                        <div className="text-center py-4 text-slate-400">Belum ada transaksi</div>
                    ) : (
                        <div className="space-y-3">
                            {dashboardData.recentTransactions.map((transaksi) => (
                                <div key={transaksi.transaksi_id} className="border-b border-slate-100 pb-3 last:border-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-slate-900">
                                                {transaksi.Pelanggan?.nama || 'N/A'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                #{transaksi.transaksi_id} • {transaksi.metode_pembayaran}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            {new Date(transaksi.tanggal_transaksi).toLocaleDateString('id-ID')}
                                        </span>
                                        <span className="text-sm font-semibold text-sky-600">
                                            {formatCurrency(transaksi.total_harga || transaksi.totalHarga || transaksi.total || 0)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold text-slate-900">Stok Rendah (&le;10 Stok)</h3>
                    </div>
                    <div className="text-xs text-slate-500 mb-3">Produk perlu restock</div>
                    {loading ? (
                        <div className="text-center py-4 text-slate-400">Loading...</div>
                    ) : dashboardData.lowStockProducts.length === 0 ? (
                        <div className="text-center py-4 text-green-600 text-sm">
                            ✓ Semua stok aman
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dashboardData.lowStockProducts.map((produk) => (
                                <div key={produk.produk_id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-slate-900 truncate">
                                            {produk.nama_produk}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {formatCurrency(produk.harga)}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className={`text-sm font-bold px-2 py-1 rounded ${
                                            produk.stok === 0 
                                                ? 'bg-red-200 text-red-800' 
                                                : 'bg-amber-200 text-amber-800'
                                        }`}>
                                            {produk.stok === 0 ? 'Habis' : `${produk.stok} unit`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Business Insights */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-xl shadow-lg text-white">
                    <h3 className="text-lg font-semibold mb-4">Ringkasan Bisnis</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sky-100">Pendapatan per Transaksi (AOV)</span>
                            <span className="font-bold">{loading ? '...' : formatCurrency(dashboardData.transaksi.rata_rata)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sky-100">Pendapatan per Pelanggan (Perkiraan)</span>
                            <span className="font-bold">
                                {loading ? '...' : formatCurrency(
                                    dashboardData.pelanggan.total > 0 
                                        ? dashboardData.transaksi.pendapatan_bulan_ini / dashboardData.pelanggan.total 
                                        : 0
                                )}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sky-100">Nilai Stok per Produk</span>
                            <span className="font-bold">
                                {loading ? '...' : formatCurrency(
                                    dashboardData.produk.total > 0 
                                        ? dashboardData.produk.nilai_inventori / dashboardData.produk.total 
                                        : 0
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            to="/dashboard/transactions"
                            className="p-4 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors text-left"
                        >
                            <ShoppingCart className="h-5 w-5 text-sky-600 mb-2" />
                            <div className="text-sm font-medium text-slate-900">Transaksi Baru</div>
                            <div className="text-xs text-slate-500">Buat transaksi</div>
                        </Link>
                        <Link
                            to="/dashboard/customers"
                            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
                        >
                            <Users className="h-5 w-5 text-purple-600 mb-2" />
                            <div className="text-sm font-medium text-slate-900">Kelola Pelanggan</div>
                            <div className="text-xs text-slate-500">Lihat & tambah</div>
                        </Link>
                        <Link
                            to="/dashboard/products"
                            className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors text-left"
                        >
                            <Package className="h-5 w-5 text-amber-600 mb-2" />
                            <div className="text-sm font-medium text-slate-900">Kelola Produk</div>
                            <div className="text-xs text-slate-500">Update stok</div>
                        </Link>
                        <Link
                             to="/dashboard/wa" // Sesuaikan dengan rute WA Blast
                            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
                        >
                            <BarChart2 className="h-5 w-5 text-green-600 mb-2" />
                            <div className="text-sm font-medium text-slate-900">Broadcast WA</div>
                            <div className="text-xs text-slate-500">Kirim promo</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
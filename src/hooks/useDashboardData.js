import { useState, useEffect, useCallback } from 'react';
import { pelangganService } from '../services/pelangganService';
import { produkService } from '../services/produkService';
import { transaksiService } from '../services/transaksiService';

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

export const useDashboardData = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(initialDashboardData);
    const [error, setError] = useState(null);

    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Fetching Data secara paralel
            const [pelangganStatsRes, produkRes, transaksiStatsRes, transaksiListRes] = await Promise.allSettled([
                pelangganService.getStatistik(),
                produkService.getAll({ limit: 1000 }),
                transaksiService.getStatistics(),
                transaksiService.getAll({ limit: 5, page: 1 })
            ]);

            // Mengekstrak Data
            const pelangganStats = pelangganStatsRes.status === 'fulfilled' ? pelangganStatsRes.value.data || {} : {};
            const produkData = produkRes.status === 'fulfilled' ? produkRes.value.data || [] : [];
            const transaksiStats = transaksiStatsRes.status === 'fulfilled' ? transaksiStatsRes.value.data || {} : {};
            const recentTransactions = transaksiListRes.status === 'fulfilled' ? transaksiListRes.value.data || [] : [];
            
            // --- Pemrosesan Data (di sini kita memproses data produk dari semua list) ---
            const produkAktif = produkData.filter(p => p.aktif).length;
            const stokRendah = produkData.filter(p => p.stok > 0 && p.stok < 10).length;
            
            // Hitung nilai inventori total
            const nilaiInventori = produkData.reduce((sum, p) => sum + (parseFloat(p.harga || 0) * parseInt(p.stok || 0)), 0);

            // LOGIKA TOP 5 PRODUK SAAT INI (Berdasarkan Nilai Stok)
            const topProducts = produkData
                .map(p => ({ ...p, nilai: (parseFloat(p.harga || 0) * parseInt(p.stok || 0)) }))
                .sort((a, b) => b.nilai - a.nilai)
                .slice(0, 5);

            // LOGIKA STOK RENDAH
            const lowStockProducts = produkData
                .filter(p => p.aktif && p.stok <= 10)
                .sort((a, b) => a.stok - b.stok)
                .slice(0, 5);
            // --- Akhir Pemrosesan Data ---

            setDashboardData({
                pelanggan: {
                    total: pelangganStats.total || initialDashboardData.pelanggan.total,
                    baru_bulan_ini: pelangganStats.baru_bulan_ini || initialDashboardData.pelanggan.baru_bulan_ini,
                    pertumbuhan: pelangganStats.pertumbuhan || initialDashboardData.pelanggan.pertumbuhan
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
            });

        } catch (err) {
            console.error('Error loading full dashboard data:', err);
            setError('Gagal memuat data dashboard. Periksa koneksi API Anda.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    return { loading, dashboardData, error, reloadData: loadDashboardData };
};
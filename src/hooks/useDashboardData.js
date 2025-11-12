import { useState, useEffect, useCallback } from 'react';
import { pelangganService } from '../services/pelangganService';
import { produkService } from '../services/produkService';
import { transaksiService } from '../services/transaksiService';

const initialDashboardData = {
    pelanggan: {
        total: 0,
        baru_bulan_ini: 0,
        pertumbuhan: 0
    },
    produk: {
        total: 0,
        aktif: 0,
        stok_rendah: 0,
        nilai_inventori: 0
    },
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
            const [pelangganStatsRes, produkRes, transaksiStatsRes] = await Promise.allSettled([
                pelangganService.getStatistik(),
                produkService.getAll({ limit: 1000 }),
                transaksiService.getStatistik()
            ]);

            const pelangganStats = pelangganStatsRes.status === 'fulfilled' ? (pelangganStatsRes.value.data?.data || pelangganStatsRes.value || {}): {};

            const produkData = produkRes.status === 'fulfilled' ? produkRes.value.data || [] : [];
            const transaksiStats = transaksiStatsRes.status === 'fulfilled' ? transaksiStatsRes.value.data || {} : {};
            
            // Ambil 5 transaksi terbaru
            const transaksiListRes = await transaksiService.getAll({ limit: 5, page: 1 });
            const recentTransactions = transaksiListRes.data || [];
            
            // --- Pemrosesan Data Produk Lokal (Inventori dan Stok Rendah) ---
            const produkAktif = produkData.filter(p => p.aktif).length;
            
            const nilaiInventori = produkData.reduce((sum, p) => sum + (parseFloat(p.harga || 0) * parseInt(p.stok || 0)), 0);

            const lowStockProducts = produkData
                .filter(p => p.aktif && p.stok <= 10)
                .sort((a, b) => a.stok - b.stok)
                .slice(0, 5);
            // --- Akhir Pemrosesan Data Produk Lokal ---

            
            const topProducts = transaksiStats.top_products || []; 
            
            const produkMap = new Map(produkData.map(p => [p.produk_id, parseFloat(p.harga || 0)]));
            
            const formattedTopProducts = topProducts.map(p => {
                 const produkId = p.produk_id;
                 const hargaSatuan = produkMap.get(produkId) || 0; 
                 
                 return {
                     produk_id: produkId,
                     nama_produk: p['Produk.nama_produk'],
                     total_terjual: parseInt(p.total_terjual),
                     total_pendapatan: parseFloat(p.total_pendapatan),
                     harga_satuan: hargaSatuan, 
                 };
            });
            


            setDashboardData({
                pelanggan: {
                    total: pelangganStats.total || initialDashboardData.pelanggan.total,
                    baru_bulan_ini: pelangganStats.baru_bulan_ini || initialDashboardData.pelanggan.baru_bulan_ini,
                    pertumbuhan: pelangganStats.pertumbuhan || initialDashboardData.pelanggan.pertumbuhan
                },
                produk: {
                    total: produkData.length,
                    aktif: produkAktif,
                    stok_rendah: lowStockProducts.length,
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
                recentTransactions,
                topProducts: formattedTopProducts,
                lowStockProducts
            });

        } catch (err) {
            console.error('Error loading full dashboard data:', err);
            setError('Error: Gagal memuat data dashboard.'); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    return { loading, dashboardData, error, reloadData: loadDashboardData };
};
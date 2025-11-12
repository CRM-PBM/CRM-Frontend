import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';

// Impor komponen anak dari folder baru
import MetricSummaryCards from '../../components/Overview/MetricSummaryCard';
import Top5ProductsCard from '../../components/Overview/TopProductsCard';
import RecentTransactionsCard from '../../components/Overview/RecentTransactionCard'; 
import LowStockAlertCard from '../../components/Overview/LowStockAlertCard';
import BusinessSummaryCard from '../../components/Overview/BusinessSummaryCard'; 
import QuickActionsCard from '../../components/Overview/QuickActionsCard'; 

// Impor komponen chart (asumsi lokasinya tetap)
import CustomerGrowthChart from '../../components/Charts/CustomerGrowthChart';
import TransactionGrowthChart from '../../components/Charts/TransactionGrowthChart';

export default function Overview() {
    // Panggil Custom Hook untuk mendapatkan data dan status loading
    const { loading, dashboardData, error } = useDashboardData(); 

    return (
        <div className="pt-2"> 
            {/* Metric Cards (4 Kolom) */}
            <MetricSummaryCards 
                data={dashboardData} 
                loading={loading} 
            />

            {/* Grafik Pertumbuhan (2 Kolom) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart2 className="h-5 w-5 text-sky-600" />
                    <h3 className="font-semibold text-slate-900">Grafik Pertumbuhan</h3>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/2">
                        {/* Jika chart membutuhkan data dari dashboardData, tambahkan prop di sini */}
                        <CustomerGrowthChart />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <TransactionGrowthChart />
                    </div>
                </div>
            </div>

            {/* Top 5 Produk, Transaksi Terbaru, Stok Rendah (3 Kolom) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Top5ProductsCard 
                    data={dashboardData.topProducts} 
                    loading={loading} 
                />
                
                <RecentTransactionsCard 
                    data={dashboardData.recentTransactions} 
                    loading={loading} 
                />

                <LowStockAlertCard 
                    data={dashboardData.lowStockProducts} 
                    loading={loading} 
                />
            </div>

            {/* Business Insights & Quick Actions (2 Kolom) */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BusinessSummaryCard 
                    data={dashboardData} 
                    loading={loading} 
                />
                
                <QuickActionsCard />
            </div>
            
            {/* Tampilkan pesan error jika ada */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    ⚠️ Error: {error}
                </div>
            )}
        </div>
    );
}
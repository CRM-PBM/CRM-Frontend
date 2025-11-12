import React from 'react';
import { 
    Users, DollarSign, ShoppingCart, Package, 
    ArrowUpRight, ArrowDownRight, AlertCircle 
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../utils/formatters'; 

const StatCard = ({ title, value, subValue, icon: Icon, iconBg, trend, footer, loading }) => {
    const trendIcon = trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
    const trendColor = trend > 0 ? 'text-green-600' : 'text-red-600';
    
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${iconBg} rounded-lg`}>
                    <Icon className="h-6 w-6 text-current" />
                </div>
                
                {(trend !== null && trend !== undefined && trend !== 0) && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                        {trendIcon}
                        {Math.abs(trend)}%
                    </div>
                )}
                
                {/* Untuk Nilai Inventori, tampilkan AlertCircle jika ada stok rendah */}
                {Icon === Package && subValue > 0 && (
                    <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        {subValue}
                    </div>
                )}
                
                {/* Untuk Total Transaksi, tampilkan total hari ini */}
                {Icon === ShoppingCart && subValue !== null && subValue !== undefined && (
                    <div className="text-sky-600 text-sm font-medium">
                        {subValue} hari ini
                    </div>
                )}
            </div>
            <div className="text-sm text-slate-600 mb-1">{title}</div>
            <div className="text-2xl font-bold text-slate-900">
                {loading ? '...' : value}
            </div>
            <div className="text-xs text-slate-500 mt-2">
                {loading ? '...' : footer}
            </div>
        </div>
    );
};

export default function MetricSummaryCards({ data, loading }) {
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* 1. Pendapatan Bulan Ini */}
            <StatCard
                title="Pendapatan Bulan Ini"
                value={formatCurrency(data.transaksi.pendapatan_bulan_ini)}
                icon={DollarSign}
                iconBg="bg-green-100 text-green-600"
                trend={data.transaksi.pertumbuhan}
                footer={`Hari ini: ${formatCurrency(data.transaksi.pendapatan_hari_ini)}`}
                loading={loading}
            />

            {/* 2. Total Pelanggan */}
            <StatCard
                title="Total Pelanggan"
                value={formatNumber(data.pelanggan.total)}
                icon={Users}
                iconBg="bg-sky-100 text-sky-600"
                subValue={`+${data.pelanggan.baru_bulan_ini} baru`}
                footer={`Pertumbuhan ${data.pelanggan.pertumbuhan}% bulan ini`}
                loading={loading}
            />

            {/* 3. Transaksi Bulan Ini */}
            <StatCard
                title="Transaksi Bulan Ini"
                value={data.transaksi.total_bulan_ini}
                icon={ShoppingCart}
                iconBg="bg-purple-100 text-purple-600"
                subValue={data.transaksi.total_hari_ini} 
                footer={`Rata-rata: ${formatCurrency(data.transaksi.rata_rata)}`}
                loading={loading}
            />

            {/* 4. Nilai Inventori */}
            <StatCard
                title="Nilai Inventori"
                value={formatCurrency(data.produk.nilai_inventori)}
                icon={Package}
                iconBg="bg-amber-100 text-amber-600"
                subValue={data.produk.stok_rendah} // Jumlah produk stok rendah
                footer={`${data.produk.aktif} dari ${data.produk.total} produk aktif`}
                loading={loading}
            />
        </div>
    );
}
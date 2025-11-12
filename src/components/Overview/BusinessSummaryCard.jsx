import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function BusinessSummaryCard({ data, loading }) {
    
    // Perhitungan Lanjutan
    const revenuePerCustomer = data.pelanggan.total > 0 
        ? data.transaksi.pendapatan_bulan_ini / data.pelanggan.total 
        : 0;
        
    const stockValuePerProduct = data.produk.total > 0 
        ? data.produk.nilai_inventori / data.produk.total 
        : 0;

    return (
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-lg font-semibold mb-4">Ringkasan Bisnis</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sky-100">Pendapatan per Transaksi (AOV)</span>
                    <span className="font-bold">{loading ? '...' : formatCurrency(data.transaksi.rata_rata)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sky-100">Pendapatan per Pelanggan (Perkiraan)</span>
                    <span className="font-bold">
                        {loading ? '...' : formatCurrency(revenuePerCustomer)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sky-100">Nilai Stok per Produk</span>
                    <span className="font-bold">
                        {loading ? '...' : formatCurrency(stockValuePerProduct)}
                    </span>
                </div>
            </div>
        </div>
    );
}
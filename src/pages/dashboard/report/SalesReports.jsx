import React from 'react';
import { ShoppingCart, Banknote, BarChart, TrendingUp } from 'lucide-react';
// Import utilities
import { formatCurrency, formatDateTime } from '../../../utils/formatters'; 

export default function SalesReports({ summary, list }) {
    return (
        <div className="space-y-6 report-content">
            <h4 className="text-xl font-semibold text-slate-900 print:hidden">Laporan Penjualan</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
                {/* Card Total Pendapatan */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-200 rounded-lg">
                            <Banknote className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Pendapatan</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary?.total_pendapatan || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Jumlah Transaksi */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-200 rounded-lg">
                            <ShoppingCart className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Jumlah Transaksi</p>
                            <p className="text-2xl font-bold text-slate-900">{summary?.jumlah_transaksi || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Rata-rata Transaksi */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-200 rounded-lg">
                            <BarChart className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Rata - rata Transaksi</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary?.rata_rata || 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Profit Kotor */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-200 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Profit Kotor</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(summary?.profit_kotor || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Transaction Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto p-4 report-table-wrapper">
                {/* Judul detail juga disembunyikan saat print */}
                <h4 className="font-semibold text-slate-900 mb-4 print:hidden">Detail Transaksi ({list.length} Item)</h4>
                <table className="min-w-full divide-y divide-slate-200 report-table">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tgl Transaksi</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kode</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pelanggan</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Metode</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Laba Kotor</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {list.map(t => (
                            <tr key={t.transaksi_id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{formatDateTime(t.tanggal_transaksi)}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-sky-600">{t.kode_transaksi || `ID#${t.transaksi_id}`}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">{t.Pelanggan?.nama || 'Umum'}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-xs text-left text-slate-600">{t.metode_pembayaran}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-purple-700">{formatCurrency((parseFloat(t.total || 0) - parseFloat(t.hpp || 0)))}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-right text-green-700">{formatCurrency(t.total || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {list.length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-sm">Tidak ada transaksi dalam periode ini.</div>
                )}
            </div>
        </div>
    );
}
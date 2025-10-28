import React from 'react';
import { Users, Banknote, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters'; 

export default function CustomerReports({ list }) {
    const totalCustomers = list.length;
    // Gunakan fungsi parseFloat yang lebih aman
    const totalPurchases = list.reduce((sum, c) => sum + (parseFloat(c.total_pembelian) || 0), 0);
    const topSpender = list.length > 0 ? list.reduce((prev, current) => (parseFloat(prev.total_pembelian) > parseFloat(current.total_pembelian) ? prev : current)) : null;
    
    return (
        <div className="space-y-6 report-content">
            <h4 className="text-xl font-semibold text-slate-900 print:hidden">Laporan Pelanggan</h4>
            
            {/* Summary/Statistics (Sembunyikan saat print) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
                
                {/* Card Total Pelanggan */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-200 rounded-lg">
                            <Users className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Pelanggan Aktif</p>
                            <p className="text-2xl font-bold text-slate-900">{totalCustomers}</p>
                        </div>
                    </div>
                </div>

                {/* Total Pembelian Keseluruhan */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-200 rounded-lg">
                            <Banknote className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Keseluruhan</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPurchases)}</p>
                        </div>
                    </div>
                </div>

                {/* Pelanggan Terbaik */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-200 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Pelanggan Terbaik</p>
                            <p className="text-2xl font-bold text-slate-900">{topSpender ? topSpender.nama : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Pelanggan Terdaftar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-200 rounded-lg">
                            <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Pelanggan Terdaftar</p>
                            <p className="text-2xl font-bold text-slate-900">{list.filter(c => c.created_at).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Customer Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto p-4 report-table-wrapper">
                <h4 className="font-semibold text-slate-900 mb-4 print:hidden">Detail Pelanggan ({totalCustomers} Item)</h4>
                <table className="min-w-full divide-y divide-slate-200 report-table">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama Pelanggan</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Telepon</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tgl Registrasi</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Jumlah Transaksi</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pembelian (LTV)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {list.map(c => (
                            <tr key={c.pelanggan_id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{c.nama}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{c.telepon || '-'}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{formatDate(c.created_at)}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-900">{c.jumlah_transaksi || 0}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-right text-green-700">{formatCurrency(c.total_pembelian || 0)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {totalCustomers === 0 && (
                    <div className="p-4 text-center text-slate-500 text-sm">Tidak ada data pelanggan yang ditemukan.</div>
                )}
            </div>
        </div>
    );
}
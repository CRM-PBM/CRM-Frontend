import React from 'react';
import ActionButtons from './Components/ActionButtons'; 
import ReportHeader from './Components/ReportHeader'; // PASTIKAN SUDAH DI-IMPORT
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import { ChevronDown, ChevronUp, ShoppingCart, Banknote, BarChart, TrendingUp } from 'lucide-react'; 

// Sub-Komponen TransactionFilterSort (Tidak Berubah)
function TransactionFilterSort({ filterState, setFilter }) {
    // ... (Logika sama) ...
    const updateFilter = (newValues) => {
        setFilter(prev => ({
            ...prev,
            transaction: { ...prev.transaction, ...newValues }
        }));
    };
    // ... (Logika sama) ...
    const sortOptions = [
        { value: 'tanggal_transaksi', label: 'Tgl Transaksi' },
        { value: 'total', label: 'Total Transaksi' },
        { value: 'laba_kotor', label: 'Laba Kotor' } 
    ];
    
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 print:hidden">
            <input
                type="text"
                placeholder="Cari Pelanggan/Kode Transaksi/Metode Pembayaran..."
                value={filterState.searchTerm}
                onChange={(e) => updateFilter({ searchTerm: e.target.value })}
                className="w-full md:w-1/3 p-2 border border-slate-300 rounded-lg text-sm print:hidden"
            />
            
            <div className="flex items-center gap-2 w-full md:w-auto">
                <label className="text-sm text-slate-600 whitespace-nowrap">Urutkan:</label>
                <select
                    value={filterState.sortBy}
                    onChange={(e) => updateFilter({ sortBy: e.target.value })}
                    className="p-2 border border-slate-300 rounded-lg text-sm"
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <select
                    value={filterState.sortDirection}
                    onChange={(e) => updateFilter({ sortDirection: e.target.value })}
                    className="p-2 border border-slate-300 rounded-lg text-sm"
                >
                    <option value="desc">Tertinggi/Terbaru</option>
                    <option value="asc">Terendah/Terlama</option>
                </select>
            </div>
        </div>
    );
}

// PERUBAHAN UTAMA: Tambahkan 'reportHeaderData' di prop destructuring
export default function TransactionReports({ summary, list, filterState, setFilter, handleExport, isDataReady, loading, reportHeaderData }) {
    
    // Perhitungan total untuk Footer
    const totalTransactions = list.length;
    const totalPurcashes = list.reduce((sum, t) => sum + (parseFloat(t.total) || 0), 0);
    
    // Fungsi untuk memperbarui filter dari header tabel
    const handleHeaderSort = (sortBy) => {
        setFilter(prev => {
            const currentFilter = prev.transaction;
            const newDirection = currentFilter.sortBy === sortBy && currentFilter.sortDirection === 'desc' ? 'asc' : 'desc';
            return {
                ...prev,
                transaction: { ...currentFilter, sortBy: sortBy, sortDirection: newDirection }
            };
        });
    };
    
    const safeSummary = summary || {};
    
    // Destructuring data header
    const { umkmName, reportTitle, periode, rangeDate } = reportHeaderData || {}; 
    
    return (
        <div className="space-y-6 report-content">
            
            {/* PERUBAHAN UTAMA 1: RENDER REPORT HEADER HANYA SAAT PRINT */}
            <div className="hidden print:block">
                 <ReportHeader 
                    umkmName={umkmName}
                    reportTitle={reportTitle}
                    periode={periode}
                    rangeDate={rangeDate}
                />
            </div>
            {/* -------------------------------------------------------- */}

            {/* Header Laporan (Judul Utama & Action Button di dalam Div ini) */}
            <div className="flex justify-between items-center mb-4 print:hidden">
                <h4 className="text-xl font-semibold text-slate-900">Laporan Transaksi</h4>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
                {/* ... Cards code (omitted for brevity) ... */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-200 rounded-lg">
                            <Banknote className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Pendapatan</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(safeSummary.total_pendapatan || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-200 rounded-lg">
                            <ShoppingCart className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Jumlah Transaksi</p>
                            <p className="text-2xl font-bold text-slate-900">{safeSummary.jumlah_transaksi || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-200 rounded-lg">
                            <BarChart className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Rata - rata Transaksi</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(safeSummary.rata_rata || 0)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-200 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Profit Kotor</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(safeSummary.profit_kotor || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 report-table-wrapper">
                
                <div className="flex justify-between items-center mb-4 print:hidden">
                    <h3 className="text-lg font-semibold text-slate-700">Detail Laporan Transaksi ({list.length} Item)</h3>
                    <ActionButtons loading={loading} isDataReady={isDataReady} handleExport={handleExport} />
                </div>
                
                <TransactionFilterSort filterState={filterState} setFilter={setFilter} />

                {/* Tabel Detail */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 report-table">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-2 py-1.5 w-10 text-center">No</th>
                                <th scope="col" className="px-2 py-1.5 cursor-pointer" onClick={() => handleHeaderSort('tanggal_transaksi')}>
                                    Tanggal Transaksi
                                </th>
                                <th scope="col" className="px-2 py-1.5 cursor-pointer" onClick={() => handleHeaderSort('kode_transaksi')}>
                                    Kode Transaksi 
                                </th>
                                <th scope="col" className="px-2 py-1.5">Pelanggan</th>
                                <th scope="col" className="px-2 py-1.5">Metode Pembayaran</th>
                                <th scope="col" className="px-2 py-1.5">Nomor Transaksi</th>
                                <th scope="col" className="px-2 py-1.5 text-right cursor-pointer" onClick={() => handleHeaderSort('total')}>
                                    Total Transaksi 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ? list.map((t, index) => {
                                return (
                                    <tr key={t.transaksi_id || index} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-2 py-1.5 font-medium text-slate-900 text-center">{index + 1}</td>
                                        <td className="px-2 py-1.5 text-xs">{formatDateTime(t.tanggal_transaksi)}</td>
                                        <td className="px-2 py-1.5 text-sky-600">{t.kode_transaksi || `ID#${t.transaksi_id}`}</td>
                                        <td className="px-2 py-1.5 text-xs">{t.Pelanggan?.nama || 'Umum'}</td>
                                        <td className="px-2 py-1.5 text-xs">{t.metode_pembayaran}</td>
                                        <td className="px-2 py-1.5 text-xs">{t.nomor_transaksi}</td>
                                        <td className="px-2 py-1.5 text-right font-semibold">{formatCurrency(t.total)}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-slate-500">Tidak ada transaksi dalam periode ini atau tidak ada data yang cocok dengan filter.</td>
                                </tr>
                            )}
                        </tbody>
                        
                        {/* Field Total Keseluruhan di Footer - Total 7 Kolom */}
                        <tfoot className="text-sm font-bold bg-slate-100 border-t border-slate-300">
                            <tr>
                                <td colSpan="5" className="px-2 py-2 text-right">TOTAL KESELURUHAN:</td>
                                <td className="px-2 py-2 text-center text-sky-600">{totalTransactions} Transaksi</td>
                                <td className="px-2 py-2 text-right text-green-700">{formatCurrency(totalPurcashes)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
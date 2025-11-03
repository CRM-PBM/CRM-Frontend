import React from 'react';
import { Users, Banknote, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters'; 
import ActionButtons from './Components/ActionButtons'; 
import ReportHeader from './Components/ReportHeader';

// --- Komponen Filter dan Sort ---
function CustomerFilterSort({ filterState, setFilter }) {
    const updateFilter = (newValues) => {
        setFilter(prev => ({
            ...prev,
            customer: { ...prev.customer, ...newValues }
        }));
    };
    
    // Opsi Sorting
    const sortOptions = [
        { value: 'total_pembelian', label: 'Total Pembelian (LTV)' },
        { value: 'jumlah_transaksi', label: 'Jumlah Transaksi' },
        { value: 'nama', label: 'Nama Pelanggan' },
        { value: 'created_at', label: 'Tgl Registrasi' },
    ];

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 print:hidden">
            <input
                type="text"
                placeholder="Cari Pelanggan sesuai kolom..."
                value={filterState.searchTerm}
                onChange={(e) => updateFilter({ searchTerm: e.target.value })}
                className="w-full md:w-1/3 p-2 border border-slate-300 rounded-lg text-sm"
            />
            
            {/* Kontrol Sort/Filter */}
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
                    <option value="desc">Tertinggi/Z-A</option>
                    <option value="asc">Terendah/A-Z</option>
                </select>
            </div>
        </div>
    );
}

// --- Komponen Utama CustomerReports ---
export default function CustomerReports({ list, filterState, setFilter, handleExport, isDataReady, loading, reportHeaderData }) {
    const totalCustomers = list.length;
    const totalTransactions = list.reduce((sum, c) => sum + (c.jumlah_transaksi || 0), 0);
    const totalPurchases = list.reduce((sum, c) => sum + (parseFloat(c.total_pembelian) || 0), 0);
    const topSpender = list.length > 0 ? list.reduce((prev, current) => (parseFloat(prev.total_pembelian) > parseFloat(current.total_pembelian) ? prev : current)) : null;

    // Fungsi untuk memperbarui filter dari header tabel
    const handleHeaderSort = (sortBy) => {
        setFilter(prev => {
            const currentFilter = prev.customer;
            let newDirection = 'desc';
            if (currentFilter.sortBy === sortBy) {
                newDirection = currentFilter.sortDirection === 'desc' ? 'asc' : 'desc';
            } else if (sortBy === 'nama' || sortBy === 'level') { 
                newDirection = 'asc';
            }
            
            return {
                ...prev,
                customer: { ...currentFilter, sortBy: sortBy, sortDirection: newDirection }
            };
        });
    };
    
    // Destructuring data header
    const { umkmName, reportTitle, periode, rangeDate } = reportHeaderData || {};
    
    return (
        <div className="space-y-6 report-content">
            
            {/* Report Header untuk Print */}
            <div className="hidden print:block">
                 <ReportHeader 
                     umkmName={umkmName}
                     reportTitle={reportTitle}
                     periode={periode}
                     rangeDate={rangeDate}
                 />
            </div>
            
            {/* Header Laporan (Judul Utama & Action Button) */}
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold text-slate-900 print:hidden">Laporan Pelanggan</h4>
            </div>

            {/* Summary/Statistics (tetap sama) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
                
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-200 rounded-lg">
                            <Users className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Pelanggan Aktif</p>
                            <p className="text-2xl font-bold text-sky-600">{totalCustomers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-200 rounded-lg">
                            <Banknote className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Pembelian (LTV)</p>
                            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPurchases)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-200 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Pelanggan Terbaik</p>
                            <p className="text-xl font-bold text-purple-600 truncate" title={topSpender ? topSpender.nama : 'N/A'}>{topSpender ? topSpender.nama : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-200 rounded-lg">
                            <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Jumlah Transaksi</p>
                            <p className="text-2xl font-bold text-orange-600">{totalTransactions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Customer Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 report-table-wrapper">
                
                <div className="flex justify-between items-center mb-4 print:hidden">
                    <h3 className="text-lg font-semibold text-slate-700">Detail Pelanggan ({list.length} Pelanggan)</h3>
                    <ActionButtons loading={loading} isDataReady={isDataReady} handleExport={handleExport} />
                </div>
                
                <CustomerFilterSort filterState={filterState} setFilter={setFilter} />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 report-table">
                        <thead className="bg-slate-100">
                            <tr>
                                <th scope="col" className="px-2 py-1.5 w-10 text-center text-xs font-semibold text-slate-700 whitespace-nowrap">No</th>
                                <th scope="col" className="px-2 py-1.5 text-left text-xs font-semibold text-slate-700 w-1/6 whitespace-nowrap" onClick={() => handleHeaderSort('nama')}>
                                    Nama
                                </th>
                                <th scope="col" className="px-2 py-1.5 text-center text-xs font-semibold text-slate-700 whitespace-nowrap" onClick={() => handleHeaderSort('Kode_pelanggan')}>
                                    Kode Pelanggan
                                </th>
                                <th scope="col" className="px-2 py-1.5 text-center text-xs font-semibold text-slate-700 whitespace-nowrap">Gender</th>
                                <th scope="col" className="px-2 py-1.5 text-center text-xs font-semibold text-slate-700 whitespace-nowrap">Telepon</th>
                                <th scope="col" className="px-2 py-1.5 text-left text-xs font-semibold text-slate-700 w-1/6 whitespace-nowrap">Email</th> 
                                <th scope="col" className="px-2 py-1.5 text-left text-xs font-semibold text-slate-700 w-1/5 whitespace-nowrap">Alamat</th> 
                                <th scope="col" className="px-2 py-1.5 text-center text-xs font-semibold text-slate-700 whitespace-nowrap" onClick={() => handleHeaderSort('level')}>
                                    Level
                                </th> 
                                <th scope="col" className="px-2 py-1.5 text-center text-xs font-semibold text-slate-700 whitespace-nowrap" onClick={() => handleHeaderSort('created_at')}>
                                    Tanggal Daftar
                                </th>
                                <th scope="col" className="px-2 py-1.5 text-right text-xs font-semibold text-slate-700 whitespace-nowrap" onClick={() => handleHeaderSort('jumlah_transaksi')}>
                                    Jml Transaksi
                                </th>
                                <th scope="col" className="px-2 py-1.5 text-right text-xs font-semibold text-slate-700 whitespace-nowrap" onClick={() => handleHeaderSort('total_pembelian')}>
                                    Total LTV 
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {list.length > 0 ? list.map((c, index) => (
                                <tr key={c.pelanggan_id || index} className="border-b hover:bg-slate-50">
                                    <td className="px-2 py-1.5 font-medium text-slate-900 text-center text-xs whitespace-nowrap">{index + 1}</td>
                                    <td className="px-2 py-1.5 text-xs text-slate-800 font-medium whitespace-nowrap">{c.nama}</td>
                                    <td className="px-2 py-1.5 text-xs text-slate-600 text-center whitespace-nowrap">{c.Kode_pelanggan || '-'}</td>
                                    <td className="px-2 py-1.5 text-xs text-slate-600 text-center whitespace-nowrap">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.gender == 'Pria' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                            {c.gender}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-xs text-slate-600 text-center whitespace-nowrap">{c.telepon || '-'}</td>
                                    <td className="px-2 py-1.5 text-xs text-slate-600 truncate max-w-xs">{c.email || '-'}</td>
                                    <td className="px-2 py-1.5 text-xs text-slate-600 truncate max-w-xs">{c.alamat || '-'}</td>
                                    <td className="px-2 py-1.5 text-xs text-slate-800 font-semibold text-center whitespace-nowrap">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            c.level === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                                            c.level === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                                            c.level === 'Silver' ? 'bg-slate-100 text-slate-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {c.level}
                                        </span>
                                    </td>
                                    <td className="px-2 py-1.5 text-xs text-slate-600 text-center whitespace-nowrap">{formatDate(c.created_at)}</td>
                                    <td className="px-2 py-1.5 text-right text-xs text-orange-600 whitespace-nowrap">{c.jumlah_transaksi || 0} Transaksi</td>
                                    <td className="px-2 py-1.5 text-right font-semibold text-xs text-green-700 whitespace-nowrap">{formatCurrency(c.total_pembelian || 0)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={10} className="text-center py-4 text-slate-500">Tidak ada data pelanggan dalam periode ini atau tidak ada data yang cocok dengan filter.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="text-sm font-bold bg-slate-100 border-t border-slate-300">
                            <tr>
                                <td colSpan={8} className="px-4 py-2 text-right whitespace-nowrap">TOTAL KESELURUHAN:</td>
                                <td className="px-2 py-2 text-right text-sky-600 whitespace-nowrap">{totalCustomers} Pelanggan</td>
                                <td className="px-2 py-2 text-right text-orange-600 whitespace-nowrap">{totalTransactions} Transaksi</td>
                                <td className="px-2 py-2 text-right text-green-700 whitespace-nowrap">{formatCurrency(totalPurchases)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
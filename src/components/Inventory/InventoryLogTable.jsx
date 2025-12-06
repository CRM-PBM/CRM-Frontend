import React from 'react';
import { formatCurrency, formatTimeStamp } from '../../utils/formatters';
import { ArrowUp, ArrowDown } from 'lucide-react';

const getChangeDisplay = (change) => {
    const isPositive = change > 0;
    const absChange = Math.abs(change);
    const color = isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
    const Icon = isPositive ? ArrowUp : ArrowDown;

    return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {absChange} Unit
        </span>
    );
};

export default function InventoryLogTable({ logs, loading }) {
    if (loading) {
        return <div className="p-4 text-center text-sky-600">Memuat data inventori...</div>;
    }

    if (logs.length === 0) {
        return <div className="p-4 text-center text-slate-500 border rounded-md">Belum ada riwayat pergerakan stok.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Waktu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Produk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipe</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Perubahan</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Stok Akhir</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">HPP Log</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Keterangan</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {logs.map((log) => (
                        <tr key={log.log_id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {formatTimeStamp(log.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                {log.Produk?.nama_produk || 'Produk Dihapus'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${log.tipe_gerak === 'SALE' ? 'bg-sky-100 text-sky-800' :
                                      log.tipe_gerak === 'IN' ? 'bg-green-100 text-green-800' :
                                      log.tipe_gerak === 'ADJUST' ? 'bg-amber-100 text-amber-800' :
                                      'bg-red-100 text-red-800'}`}>
                                    {log.tipe_gerak}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                {getChangeDisplay(log.perubahan)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 font-semibold">
                                {log.jumlah_sesudah.toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-700">
                                {formatCurrency(log.harga_beli)}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                {log.keterangan || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
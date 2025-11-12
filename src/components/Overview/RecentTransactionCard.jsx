import React from 'react';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function RecentTransactionsCard({ data, loading }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-slate-900">Transaksi Terbaru</h3>
            </div>
            <div className="text-xs text-slate-500 mb-3">5 transaksi terakhir</div>
            
            {loading ? (
                <div className="text-center py-4 text-slate-400">Loading...</div>
            ) : data.length === 0 ? (
                <div className="text-center py-4 text-slate-400">Belum ada transaksi</div>
            ) : (
                <div className="space-y-3">
                    {data.map((transaksi) => (
                        <div key={transaksi.transaksi_id} className="border-b border-slate-100 pb-3 last:border-0">
                            <div className="flex items-start justify-between mb-1">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-slate-900 truncate">
                                        {transaksi.Pelanggan?.nama || `ID Transaksi #${transaksi.transaksi_id}`}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        #{transaksi.transaksi_id} • {transaksi.metode_pembayaran}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    {new Date(transaksi.tanggal_transaksi).toLocaleDateString('id-ID')}
                                </span>
                                <span className="text-sm font-semibold text-sky-600">
                                    {formatCurrency(transaksi.total_harga || transaksi.totalHarga || transaksi.total || 0)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
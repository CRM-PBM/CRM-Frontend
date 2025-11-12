import React from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function Top5ProductsCard({ data, loading }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-sky-600" />
                <h3 className="font-semibold text-slate-900">Top 5 Produk</h3>
            </div>
            {/* LABEL SAAT INI (AKAN KITA GANTI NANTI) */}
            <div className="text-xs text-slate-500 mb-3">Berdasarkan banyaknya produk yang dibeli</div> 
            
            {loading ? (
                <div className="text-center py-4 text-slate-400">Loading...</div>
            ) : data.length === 0 ? (
                <div className="text-center py-4 text-slate-400">Belum ada data</div>
            ) : (
                <div className="space-y-3">
                    {data.map((produk, index) => (
                        <div key={produk.produk_id || index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-semibold text-sm">
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">
                                    {produk.nama_produk}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Stok: {produk.stok} × {formatCurrency(produk.harga)}
                                </div>
                            </div>
                            {/* Nilai berdasarkan perhitungan inventori (nilai) */}
                            <div className="text-sm font-semibold text-slate-900">
                                {formatCurrency(produk.nilai)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
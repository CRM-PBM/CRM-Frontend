import React from 'react';
import { AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function LowStockAlertCard({ data, loading }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-slate-900">Stok Rendah (&le;10 Stok)</h3>
            </div>
            <div className="text-xs text-slate-500 mb-3">Produk perlu restock</div>
            
            {loading ? (
                <div className="text-center py-4 text-slate-400">Loading...</div>
            ) : data.length === 0 ? (
                <div className="text-center py-4 text-green-600 text-sm">
                    ✓ Semua stok aman
                </div>
            ) : (
                <div className="space-y-3">
                    {data.map((produk) => (
                        <div key={produk.produk_id || produk.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 truncate">
                                    {produk.nama_produk}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {formatCurrency(produk.harga)}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className={`text-sm font-bold px-2 py-1 rounded ${
                                    produk.stok === 0 
                                        ? 'bg-red-200 text-red-800' 
                                        : 'bg-amber-200 text-amber-800'
                                }`}>
                                    {produk.stok === 0 ? 'Habis' : `${produk.stok} unit`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
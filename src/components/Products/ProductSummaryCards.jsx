import React from 'react'
import { Package, CheckCircle, TrendingUp, DollarSign } from 'lucide-react'

export default function ProductSummaryCards({ statistics, formatCurrency }) {
  if (!statistics) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Produk */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-lg">
            <Package className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Produk</p>
            <p className="text-2xl font-bold text-slate-900">{statistics.total_produk || 0}</p>
          </div>
        </div>
      </div>

      {/* Produk Aktif */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Produk Aktif</p>
            <p className="text-2xl font-bold text-slate-900">{statistics.produk_aktif || 0}</p>
          </div>
        </div>
      </div>

      {/* Total Stok */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Total Stok</p>
            <p className="text-2xl font-bold text-slate-900">{statistics.total_stok || 0}</p>
          </div>
        </div>
      </div>

      {/* Nilai Inventori */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-600">Nilai Inventori</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(statistics.nilai_inventori || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
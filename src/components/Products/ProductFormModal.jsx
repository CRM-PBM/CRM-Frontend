import React from 'react'
import { Plus, Loader, X, TrendingUp } from 'lucide-react'

function Modal({ show, onClose, title, children }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900 bg-opacity-50 flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} 
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h4 className="font-bold text-xl text-slate-900">{title}</h4>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}


export default function ProductFormModal({
  showModal,
  onClose,
  form,
  setForm,
  handleSubmit,
  loading,
  editMode,
  jenisProdukList,
  formatCurrency,
}) {
  const isUpdating = editMode && form.nama_produk

  return (
    <Modal 
      show={showModal} 
      onClose={onClose} 
      title={isUpdating ? `Edit Produk: ${form.nama_produk}` : 'Tambah Produk Baru'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Nama Produk */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={form.nama_produk}
                onChange={e => setForm({...form, nama_produk: e.target.value})}
                placeholder="Contoh: Kopi Arabica Premium"
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Jenis Produk */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Jenis Produk <span className="text-red-500">*</span>
            </label>
            <select
              value={form.jenis_produk_id}
              onChange={e => setForm({...form, jenis_produk_id: e.target.value})}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Pilih Jenis Produk</option>
              {jenisProdukList.map(j => (
                <option key={j.jenis_produk_id} value={j.jenis_produk_id}>
                  {j.nama_jenis} 
                </option>
              ))}
            </select>
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Harga <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.harga}
                onChange={e => setForm({...form, harga: e.target.value})}
                placeholder="25000"
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            {form.harga && (
              <p className="text-xs text-slate-500 mt-1">
                {formatCurrency(parseFloat(form.harga) || 0)}
              </p>
            )}
          </div>

          {/* Stok */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Stok
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                min="0"
                value={form.stok}
                onChange={e => setForm({...form, stok: e.target.value})}
                placeholder="0"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Aktif */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.aktif}
                onChange={e => setForm({...form, aktif: e.target.checked})}
                className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Produk Aktif (dapat dijual)
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-2 pt-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-sky-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>{editMode ? 'Update Produk' : 'Tambah Produk'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
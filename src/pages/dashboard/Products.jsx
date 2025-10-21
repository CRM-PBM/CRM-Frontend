import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { produkService } from '../../services/produkService'
import { Package, Edit2, Trash2, Plus, Search, Loader, ChevronLeft, ChevronRight, TrendingUp, AlertCircle, CheckCircle, XCircle, Currency, DollarSign } from 'lucide-react'

export default function Products(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)
  const [statistics, setStatistics] = useState(null)
  const [jenisProdukList, setJenisProdukList] = useState([])
  const [form, setForm] = useState({
    nama_produk: '',
    harga: '',
    stok: '0',
    aktif: true,
    jenis_produk_id: ''
  })
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    loadProduk()
    loadStatistics()
    loadJenisProduk()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  async function loadJenisProduk() {
    try {
      const response = await produkService.getJenisProduk() 
      if (response.success) {
        // Asumsi response adalah { success: true, data: [ {jenis1}, {jenis2} ] }
        setJenisProdukList(response.data.data || response.data || []) 
      }
    } catch (error) {
      console.error('Error loading jenis produk:', error)
      toast.error('Gagal memuat jenis produk')
    }
  }

  async function loadProduk() {
    setLoading(true)
    try {
      const response = await produkService.getAll({ 
        page: currentPage, 
        limit: itemsPerPage 
      })
      if (response.success) {
        setList(response.data || [])
        setTotalPages(response.totalPages || 1)
        setTotalItems(response.total || 0)
      }
    } catch (error) {
      console.error('Error loading produk:', error)
      toast.error('Gagal memuat data produk')
    } finally {
      setLoading(false)
    }
  }

  async function loadStatistics() {
    try {
      const response = await produkService.getStatistics()
      if (response.success) {
        setStatistics(response.data)
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nama_produk || !form.harga) {
      toast.error('Nama produk dan harga wajib diisi')
      return
    }

    setLoading(true)
    try {
      const dataToSend = {
        ...form,
        harga: parseFloat(form.harga),
        stok: parseInt(form.stok) || 0
      }

      if (editMode) {
        const response = await produkService.update(editId, dataToSend)
        if (response.success) {
          toast.success('Produk berhasil diupdate')
          setEditMode(false)
          setEditId(null)
        }
      } else {
        const response = await produkService.create(dataToSend)
        if (response.success) {
          toast.success('Produk berhasil ditambahkan')
        }
      }
      
      // Reset form
      setForm({
        nama_produk: '',
        harga: '',
        stok: '0',
        aktif: true
      })
      
      // Reload data
      setCurrentPage(1)
      await loadProduk()
      await loadStatistics()
    } catch (error) {
      console.error('Error saving produk:', error)
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan produk'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    setLoading(true)
    try {
      const response = await produkService.delete(id)
      if (response.success) {
        toast.success('Produk berhasil dihapus')
        if (list.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          await loadProduk()
        }
        await loadStatistics()
      }
    } catch (error) {
      console.error('Error deleting produk:', error)
      toast.error('Gagal menghapus produk')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleActive(id, currentStatus) {
    setLoading(true)
    try {
      const response = await produkService.toggleActive(id)
      if (response.success) {
        toast.success(`Produk ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}`)
        await loadProduk()
        await loadStatistics()
      }
    } catch (error) {
      console.error('Error toggling active:', error)
      toast.error('Gagal mengubah status produk')
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(produk) {
    setEditMode(true)
    setEditId(produk.produk_id)
    setForm({
      nama_produk: produk.nama_produk || '',
      harga: produk.harga?.toString() || '',
      stok: produk.stok?.toString() || '0',
      aktif: produk.aktif !== false
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditMode(false)
    setEditId(null)
    setForm({
      nama_produk: '',
      harga: '',
      stok: '0',
      aktif: true,
      jenis_produk_id: ''
    })
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  // Filter produk based on search
  const filteredList = searchTerm
    ? list.filter(p => 
        p.nama_produk?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : list

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Manajemen Produk</h3>
          <p className="text-sm text-slate-500 mt-1">Kelola produk dan stok UMKM Anda</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Nilai Inventori</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(statistics.nilai_inventori || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-sky-600" />
          <h4 className="font-semibold text-slate-900">
            {editMode ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Produk */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                    {j.nama_jenis} ({j.kode_jenis})
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
                <span className="absolute left-3 top-1/3 -translate-y-1/2 h-4 w-4 text-slate-400">Rp</span>
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
              <label className="flex items-center gap-2 cursor-pointer">
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
          <div className="flex gap-2 pt-2">
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
            
            {editMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari produk berdasarkan nama..."
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Daftar Produk</h4>
              <p className="text-sm text-slate-500 mt-1">
                Menampilkan {list.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} produk
              </p>
            </div>
            {totalPages > 1 && (
              <div className="hidden md:flex items-center gap-1 text-sm text-slate-600">
                Halaman {currentPage} dari {totalPages}
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {loading && list.length === 0 ? (
            <div className="p-8 text-center">
              <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Memuat data produk...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-1">
                {searchTerm ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
              </p>
              <p className="text-sm text-slate-500">
                {searchTerm ? 'Coba gunakan kata kunci lain' : 'Tambahkan produk pertama Anda'}
              </p>
            </div>
          ) : (
            filteredList.map(produk => (
              <div
                key={produk.produk_id}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-slate-900">{produk.nama_produk}</h5>
                      {produk.aktif ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Aktif
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Nonaktif
                        </span>
                      )}
                      {produk.stok === 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Stok Habis
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        
                        <span className="font-medium">{formatCurrency(produk.harga)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>Stok: <span className="font-medium">{produk.stok}</span></span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <Package className="h-3.5 w-3.5" />
                        <span>Nilai: <span className="font-medium">{formatCurrency(produk.harga * produk.stok)}</span></span>
                      </div>
                    </div>

                    {produk.Umkm && (
                      <div className="mt-2 text-xs text-slate-500">
                        UMKM: {produk.Umkm.nama_umkm}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(produk.produk_id, produk.aktif)}
                      disabled={loading}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                        produk.aktif 
                          ? 'text-amber-600 hover:bg-amber-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={produk.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      {produk.aktif ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(produk)}
                      disabled={loading}
                      className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(produk.produk_id)}
                      disabled={loading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600 sm:hidden">
                Halaman {currentPage} dari {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = []
                    const showEllipsisStart = currentPage > 3
                    const showEllipsisEnd = currentPage < totalPages - 2

                    if (totalPages > 0) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          disabled={loading}
                          className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === 1
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          1
                        </button>
                      )
                    }

                    if (showEllipsisStart) {
                      pages.push(
                        <span key="ellipsis-start" className="px-2 text-slate-400">...</span>
                      )
                    }

                    const start = Math.max(2, currentPage - 1)
                    const end = Math.min(totalPages - 1, currentPage + 1)
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          disabled={loading}
                          className={`hidden sm:flex w-10 h-10 items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                            currentPage === i
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {i}
                        </button>
                      )
                    }

                    if (showEllipsisEnd) {
                      pages.push(
                        <span key="ellipsis-end" className="hidden sm:inline px-2 text-slate-400">...</span>
                      )
                    }

                    if (totalPages > 1) {
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={loading}
                          className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === totalPages
                              ? 'bg-sky-600 text-white'
                              : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {totalPages}
                        </button>
                      )
                    }

                    return pages
                  })()}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="hidden sm:block text-sm text-slate-600">
                {itemsPerPage} per halaman
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

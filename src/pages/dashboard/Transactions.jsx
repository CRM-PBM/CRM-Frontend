import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { transaksiService } from '../../services/transaksiService'
import { pelangganService } from '../../services/pelangganService'
import { produkService } from '../../services/produkService'
import { 
  ShoppingCart, DollarSign, CreditCard, Calendar, Plus, Search, 
  Loader, ChevronLeft, ChevronRight, Eye, Trash2, X, Package, User, TrendingUp
} from 'lucide-react'

export default function Transactions(){
  const [list, setList] = useState([])
  const [pelangganList, setPelangganList] = useState([])
  const [produkList, setProdukList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)
  const [statistics, setStatistics] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [form, setForm] = useState({
    pelanggan_id: '',
    metode_pembayaran: 'Cash',
    keterangan: '',
    items: []
  })

  useEffect(() => {
    loadTransaksi()
    loadStatistics()
    loadPelanggan()
    loadProduk()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  async function loadTransaksi() {
    setLoading(true)
    try {
      const response = await transaksiService.getAll({ 
        page: currentPage, 
        limit: itemsPerPage 
      })
      if (response.success) {
        setList(response.data || [])
        setTotalPages(response.totalPages || 1)
        setTotalItems(response.total || 0)
      }
    } catch (error) {
      console.error('Error loading transaksi:', error)
      toast.error('Gagal memuat data transaksi')
    } finally {
      setLoading(false)
    }
  }

  async function loadStatistics() {
    try {
      const response = await transaksiService.getStatistics()
      if (response.success) {
        setStatistics(response.data)
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  async function loadPelanggan() {
    try {
      const response = await pelangganService.getAll({ limit: 1000 })
      if (response.success) {
        setPelangganList(response.data || [])
      }
    } catch (error) {
      console.error('Error loading pelanggan:', error)
    }
  }

  async function loadProduk() {
    try {
      const response = await produkService.getAll({ limit: 1000 })
      if (response.success) {
        setProdukList(response.data?.filter(p => p.aktif) || [])
      }
    } catch (error) {
      console.error('Error loading produk:', error)
    }
  }

  function handleRemoveItem(index) {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index)
    })
  }

  function calculateTotal() {
    return form.items.reduce((sum, item) => {
      return sum + (item.harga * item.jumlah)
    }, 0)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.pelanggan_id || form.items.length === 0) {
      toast.error('Pilih pelanggan dan tambahkan minimal 1 produk')
      return
    }

    setLoading(true)
    try {
      const dataToSend = {
        pelanggan_id: parseInt(form.pelanggan_id),
        metode_pembayaran: form.metode_pembayaran,
        keterangan: form.keterangan || '',
        items: form.items.map(item => ({
          produk_id: item.produk_id,
          jumlah: item.jumlah
        }))
      }

      const response = await transaksiService.create(dataToSend)
      if (response.success) {
        toast.success('Transaksi berhasil dibuat')
        setForm({
          pelanggan_id: '',
          metode_pembayaran: 'Cash',
          keterangan: '',
          items: []
        })
        setCurrentPage(1)
        await loadTransaksi()
        await loadStatistics()
      }
    } catch (error) {
      console.error('Error saving transaksi:', error)
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan transaksi'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return

    setLoading(true)
    try {
      const response = await transaksiService.delete(id)
      if (response.success) {
        toast.success('Transaksi berhasil dihapus')
        if (list.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          await loadTransaksi()
        }
        await loadStatistics()
      }
    } catch (error) {
      console.error('Error deleting transaksi:', error)
      toast.error('Gagal menghapus transaksi')
    } finally {
      setLoading(false)
    }
  }

  async function handleViewDetail(id) {
    setLoading(true)
    try {
      const response = await transaksiService.getById(id)
      if (response.success) {
        setSelectedTransaction(response.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error loading transaction detail:', error)
      toast.error('Gagal memuat detail transaksi')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get total harga from various possible field names
  const getTotalHarga = (transaksi) => {
    return transaksi.total_harga || transaksi.totalHarga || transaksi.total || transaksi.Total || 0
  }

  // Format currency
  const formatCurrency = (value) => {
    // Handle invalid values
    if (value === null || value === undefined || value === '') {
      return 'Rp 0'
    }
    
    // Convert to number (handles both string and number)
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value)
    
    // Check if conversion resulted in valid number
    if (isNaN(numValue)) {
      return 'Rp 0'
    }
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numValue)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Filter transaksi based on search
  const filteredList = searchTerm
    ? list.filter(t => 
        t.Pelanggan?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transaksi_id?.toString().includes(searchTerm)
      )
    : list

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Manajemen Transaksi</h3>
          <p className="text-sm text-slate-500 mt-1">Kelola transaksi penjualan UMKM Anda</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Transaksi</p>
                <p className="text-2xl font-bold text-slate-900">{statistics.total_transaksi || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Pendapatan</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(statistics.total_pendapatan || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Rata-rata Transaksi</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(statistics.rata_rata || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Bulan Ini</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(statistics.bulan_ini || 0)}
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
          <h4 className="font-semibold text-slate-900">Buat Transaksi Baru</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pelanggan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pelanggan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={form.pelanggan_id}
                  onChange={e => setForm({...form, pelanggan_id: e.target.value})}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Pilih Pelanggan</option>
                  {pelangganList.map(p => (
                    <option key={p.pelanggan_id} value={p.pelanggan_id}>
                      {p.nama} - {p.telepon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  value={form.metode_pembayaran}
                  onChange={e => setForm({...form, metode_pembayaran: e.target.value})}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="Cash">Cash</option>
                  <option value="Transfer">Transfer Bank</option>
                  <option value="E-Wallet">E-Wallet</option>
                  <option value="Debit">Kartu Debit</option>
                  <option value="Credit">Kartu Kredit</option>
                </select>
              </div>
            </div>

            {/* Keterangan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Keterangan (Opsional)
              </label>
              <textarea
                value={form.keterangan}
                onChange={e => setForm({...form, keterangan: e.target.value})}
                placeholder="Catatan tambahan untuk transaksi ini"
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Item Section - Simplified */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <h5 className="font-medium text-slate-900 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pilih Produk <span className="text-red-500">*</span>
            </h5>
            
            {/* Product Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1">
              {produkList.map(produk => {
                const existingItem = form.items.find(item => item.produk_id === produk.produk_id)
                const currentQty = existingItem ? existingItem.jumlah : 0
                
                return (
                  <div
                    key={produk.produk_id}
                    className={`border rounded-lg p-3 transition-all ${
                      currentQty > 0
                        ? 'border-sky-500 bg-sky-50'
                        : 'border-slate-200 hover:border-sky-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h6 className="font-medium text-slate-900 text-sm truncate">
                          {produk.nama_produk}
                        </h6>
                        <p className="text-sky-600 font-semibold text-sm">
                          {formatCurrency(produk.harga)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Stok: {produk.stok}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {currentQty > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              const index = form.items.findIndex(item => item.produk_id === produk.produk_id)
                              if (index >= 0) {
                                const updatedItems = [...form.items]
                                if (updatedItems[index].jumlah > 1) {
                                  updatedItems[index].jumlah -= 1
                                  setForm({ ...form, items: updatedItems })
                                } else {
                                  handleRemoveItem(index)
                                }
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center font-semibold text-slate-900">
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const index = form.items.findIndex(item => item.produk_id === produk.produk_id)
                              if (index >= 0 && currentQty < produk.stok) {
                                const updatedItems = [...form.items]
                                updatedItems[index].jumlah += 1
                                setForm({ ...form, items: updatedItems })
                              }
                            }}
                            disabled={currentQty >= produk.stok}
                            className="w-8 h-8 flex items-center justify-center bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const index = form.items.findIndex(item => item.produk_id === produk.produk_id)
                              if (index >= 0) handleRemoveItem(index)
                            }}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setForm({
                              ...form,
                              items: [...form.items, {
                                produk_id: produk.produk_id,
                                jumlah: 1,
                                nama_produk: produk.nama_produk,
                                harga: produk.harga
                              }]
                            })
                          }}
                          disabled={produk.stok === 0}
                          className="w-full py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Tambah
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            {form.items.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">
                    {form.items.length} Produk Dipilih
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, items: [] })}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {item.nama_produk} <span className="text-slate-400">x{item.jumlah}</span>
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatCurrency(item.harga * item.jumlah)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-300 pt-2 mt-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-lg font-bold text-sky-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading || form.items.length === 0}
              className="flex items-center gap-2 bg-sky-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Buat Transaksi</span>
                </>
              )}
            </button>
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
            placeholder="Cari transaksi berdasarkan ID atau nama pelanggan..."
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Daftar Transaksi</h4>
              <p className="text-sm text-slate-500 mt-1">
                Menampilkan {list.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} transaksi
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
              <p className="text-sm text-slate-500">Memuat data transaksi...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-1">
                {searchTerm ? 'Tidak ada transaksi yang cocok' : 'Belum ada transaksi'}
              </p>
              <p className="text-sm text-slate-500">
                {searchTerm ? 'Coba gunakan kata kunci lain' : 'Buat transaksi pertama Anda'}
              </p>
            </div>
          ) : (
            filteredList.map(transaksi => (
              <div
                key={transaksi.transaksi_id}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-slate-900">
                        Transaksi #{transaksi.transaksi_id}
                      </h5>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
                        {transaksi.metode_pembayaran}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="h-3.5 w-3.5" />
                        <span>{transaksi.Pelanggan?.nama || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(transaksi.tanggal_transaksi)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-600">
                        <Package className="h-3.5 w-3.5" />
                        <span>{transaksi.DetailTransaksis?.length || 0} item</span>
                      </div>

                      <div className="flex items-center gap-2 font-semibold text-sky-600">  
                        <span>{formatCurrency(getTotalHarga(transaksi))}</span>
                      </div>
                    </div>

                    {transaksi.keterangan && (
                      <div className="mt-2 text-xs text-slate-500 italic">
                        {transaksi.keterangan}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(transaksi.transaksi_id)}
                      disabled={loading}
                      className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaksi.transaksi_id)}
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

      {/* Detail Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">
                Detail Transaksi #{selectedTransaction.transaksi_id}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Nomor Transaksi</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(selectedTransaction.nomor_transaksi)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Tanggal </p>
                  <p className="font-medium text-slate-900">
                    {formatDate(selectedTransaction.tanggal_transaksi)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Nama Pelanggan</p>
                  <p className="font-medium text-slate-900">
                    {selectedTransaction.Pelanggan?.nama || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Metode Pembayaran</p>
                  <p className="font-medium text-slate-900">
                    {selectedTransaction.metode_pembayaran}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total</p>
                  <p className="font-semibold text-lg text-sky-600">
                    {formatCurrency(getTotalHarga(selectedTransaction))}
                  </p>
                </div>
              
              {selectedTransaction.keterangan && (
                <div>
                  <p className="text-sm text-slate-500 mb-1">Keterangan</p>
                  <p className="text-slate-700 italic">{selectedTransaction.keterangan}</p>
                </div>
              )}
              </div>

              {/* Detail Items */}
              <div>
                <h5 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Detail Produk
                </h5>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-slate-700">Produk</th>
                        <th className="text-center px-4 py-2 font-medium text-slate-700">Harga Satuan</th>
                        <th className="text-center px-4 py-2 font-medium text-slate-700">Jumlah</th>
                        <th className="text-right px-4 py-2 font-medium text-slate-700">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedTransaction.DetailTransaksis?.map((detail) => (
                        <tr key={detail.detail_id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">{detail.Produk?.nama_produk || 'N/A'}</td>
                          <td className="px-4 py-3 text-center">
                            {formatCurrency(detail.harga_satuan || 0)}
                          </td>
                          <td className="px-4 py-3 text-center">{detail.jumlah || 0}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(detail.subtotal || 0)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-semibold">
                        <td colSpan="3" className="px-4 py-3 text-right">Total:</td>
                        <td className="px-4 py-3 text-right text-lg text-sky-600">
                          {formatCurrency(getTotalHarga(selectedTransaction))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

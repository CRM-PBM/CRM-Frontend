import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { pelangganService } from '../../services/pelangganService'
import { User, Phone, Mail, MapPin, Edit2, Trash2, Plus, Search, Loader, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Customers(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)
  const [form, setForm] = useState({
    nama: '',
    telepon: '',
    email: '',
    alamat: '',
    gender: 'Pria',
    // Level diinisiasi sebagai default, tapi TIDAK dikirim saat CREATE
    level: 'Bronze' 
  })
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    loadPelanggan()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    } else {
      loadPelanggan()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  async function loadPelanggan() {
    setLoading(true)
    try {
      const response = await pelangganService.getAll({ 
        page: currentPage, 
        limit: itemsPerPage,
        search: searchTerm 
      })
      if (response.success) {
        setList(response.data || [])
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1)
          setTotalItems(response.pagination.total || 0)
        } else {
          setTotalPages(1)
          setTotalItems(response.data.length || 0)
        }
      }
    } catch (error) {
      console.error('Error loading pelanggan:', error)
      toast.error('Gagal memuat data pelanggan')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nama || !form.telepon) {
      toast.error('Nama dan telepon wajib diisi')
      return
    }

    setLoading(true)
    try {
      // Data yang dikirim ke backend. Level hanya dikirim saat edit, 
      // tetapi di backend Level akan diabaikan atau ditimpa
      const dataToSave = {
        nama: form.nama,
        telepon: form.telepon,
        email: form.email,
        alamat: form.alamat,
        gender: form.gender,
        // Level TIDAK diikutsertakan di sini, biarkan backend yang menentukan
      }

      if (editMode) {
        // Saat update, kita tetap kirim form.level, meskipun backend mengabaikannya.
        // Kita tidak menghapus form.level dari form state, hanya untuk tampilan di handleEdit.
        const response = await pelangganService.update(editId, form) 
        if (response.success) {
          toast.success('Pelanggan berhasil diupdate')
          setEditMode(false)
          setEditId(null)
        }
      } else {
        // Saat create, kita gunakan dataToSave yang tidak menyertakan level
        const response = await pelangganService.create(dataToSave) 
        if (response.success) {
          toast.success('Pelanggan berhasil ditambahkan')
        }
      }
      
      setForm({
        nama: '',
        telepon: '',
        email: '',
        alamat: '',
        gender: 'Pria',
        level: 'Bronze'
      })
      
      setCurrentPage(1)
      await loadPelanggan()
    } catch (error) {
      console.error('Error saving pelanggan:', error)
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan pelanggan'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) return

    setLoading(true)
    try {
      const response = await pelangganService.delete(id)
      if (response.success) {
        toast.success('Pelanggan berhasil dihapus')
        if (list.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        } else {
          await loadPelanggan()
        }
      }
    } catch (error) {
      console.error('Error deleting pelanggan:', error)
      toast.error('Gagal menghapus pelanggan')
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(pelanggan) {
    setEditMode(true)
    setEditId(pelanggan.pelanggan_id)
    setForm({
      nama: pelanggan.nama || '',
      telepon: pelanggan.telepon || '',
      email: pelanggan.email || '',
      alamat: pelanggan.alamat || '',
      gender: pelanggan.gender || 'Pria',
      // Ambil level dari data, hanya untuk ditampilkan
      level: pelanggan.level || 'Bronze' 
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditMode(false)
    setEditId(null)
    setForm({
      nama: '',
      telepon: '',
      email: '',
      alamat: '',
      gender: 'Pria',
      level: 'Bronze'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Manajemen Pelanggan</h3>
          <p className="text-sm text-slate-500 mt-1">Kelola data pelanggan UMKM Anda</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="h-4 w-4" />
          <span className="font-medium">{totalItems} Pelanggan</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-sky-600" />
          <h4 className="font-semibold text-slate-900">
            {editMode ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
          </h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nama Pelanggan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={form.nama}
                  onChange={e => setForm({...form, nama: e.target.value})}
                  placeholder="Contoh: John Doe"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  value={form.telepon}
                  onChange={e => setForm({...form, telepon: e.target.value})}
                  placeholder="Contoh: 08123456789"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="Contoh: john@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={form.gender}
                onChange={e => setForm({...form, gender: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </select>
            </div>

            {/* Alamat */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Alamat
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  value={form.alamat}
                  onChange={e => setForm({...form, alamat: e.target.value})}
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
                  rows={2}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Level (Hanya Tampil saat Edit dan Disabled) */}
            {editMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Level Pelanggan (Otomatis)
                  </label>
                  <select
                    value={form.level}
                    disabled={true} 
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed text-slate-600 focus:outline-none focus:ring-0 focus:border-slate-300"
                  >
                    <option value="Bronze">Bronze (Otomatis)</option>
                    <option value="Silver">Silver (Otomatis)</option>
                    <option value="Gold">Gold (Otomatis)</option>
                    <option value="Platinum">Platinum (Otomatis)</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-500">Level dihitung otomatis berdasarkan transaksi 3 bulan terakhir.</p>
                </div>
            )}
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
                  <span>{editMode ? 'Update Pelanggan' : 'Tambah Pelanggan'}</span>
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
            placeholder="Cari pelanggan berdasarkan nama, telepon, email atau alamat..."
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="p-4 border-b border-slate-200 bg-slate-50  ">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Daftar Pelanggan</h4>
              <p className="text-sm text-slate-500 mt-1">
                Menampilkan {list.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} - {Math.min((currentPage - 1) * itemsPerPage + list.length, totalItems)} dari {totalItems} pelanggan
              </p>
            </div>
            {totalPages > 1 && (
              <div className="hidden md:flex items-center gap-1 pr-6 text-sm text-slate-600">
                Halaman {currentPage} dari {totalPages}
              </div>
            )}
          </div>
        </div>

        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider w-18">
                No
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                Nama
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider hidden sm:table-cell">
                Kode Pelanggan
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-800 uppercase tracking-wider hidden lg:table-cell">
                Gender
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-800 uppercase tracking-wider hidden sm:table-cell">
                Telepon
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-800 uppercase tracking-wider hidden md:table-cell">
                Email
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider hidden md:table-cell">
                Level
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider hidden xl:table-cell">
                Alamat
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-slate-800 uppercase tracking-wider w-36">
                Aksi 
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-slate-200">
            
            {loading && totalItems === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center">
                  <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Memuat data pelanggan...</p>
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center">
                  <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium mb-1">
                    {searchTerm ? 'Tidak ada pelanggan yang cocok' : 'Belum ada pelanggan'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {searchTerm ? 'Coba gunakan kata kunci lain' : 'Tambahkan pelanggan pertama Anda'}
                  </p>
                </td>
              </tr>
            ) : (
              list.map((pelanggan, index) => (
                <tr key={pelanggan.pelanggan_id} className="hover:bg-slate-50 transition-colors">
                  {/* Kolom 1: Nomor Urut */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}.
                  </td>

                  {/* Kolom 2: Nama */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-slate-900">
                    {pelanggan.nama}
                  </td>

                  {/* Kolom 3: Kode Pelanggan */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-600 hidden sm:table-cell">
                    {pelanggan.kode_pelanggan || '-'}
                  </td>

                  {/* Kolom 4: Jenis Kelamin (Badge Warna) */}
                  <td className="px-3 py-2 whitespace-nowrap hidden text-center lg:table-cell">
                    <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                        pelanggan.gender === 'Pria' ? 'bg-blue-100 text-blue-700' :
                        pelanggan.gender === 'Wanita' ? 'bg-pink-100 text-pink-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                      {pelanggan.gender}
                    </span>
                  </td>
                  
                  {/* Kolom 5: Kontak (Telepon) */}
                  <td className="px-3 py-2 whitespace-nowrap text-center text-sm text-slate-900 hidden sm:table-cell">
                    {pelanggan.telepon || '-'}
                  </td>

                  {/* Kolom 6: Email */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-slate-500 hidden md:table-cell">
                    {pelanggan.email || '-'}
                  </td>
                  
                  {/* Kolom 7: Level */}
                  <td className="px-3 py-2 whitespace-nowrap hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        pelanggan.level === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                        pelanggan.level === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                        pelanggan.level === 'Silver' ? 'bg-slate-100 text-slate-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                      {pelanggan.level}
                    </span>
                  </td>

                  {/* Kolom 8: Alamat */}
                  <td className="px-3 py-2 max-w-xs truncate text-sm text-slate-500 hidden xl:table-cell">
                    {pelanggan.alamat || '-'}
                  </td>

                  {/* Kolom 9: Aksi (Edit/Hapus) - Tombol Aksi Diperbaiki */}
                  <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium w-34">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(pelanggan)}
                        disabled={loading}
                        className="flex items-center gap-1 p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pelanggan.pelanggan_id)}
                        disabled={loading}
                        className="flex items-center gap-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Mobile Page Info */}
              <div className="text-sm text-slate-600 sm:hidden">
                Halaman {currentPage} dari {totalPages}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = []
                    const showEllipsisStart = currentPage > 3
                    const showEllipsisEnd = currentPage < totalPages - 2

                    // First page
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

                    // Ellipsis start
                    if (showEllipsisStart) {
                      pages.push(
                        <span key="ellipsis-start" className="px-2 text-slate-400">
                          ...
                        </span>
                      )
                    }

                    // Middle pages
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

                    // Ellipsis end
                    if (showEllipsisEnd) {
                      pages.push(
                        <span key="ellipsis-end" className="hidden sm:inline px-2 text-slate-400">
                          ...
                        </span>
                      )
                    }

                    // Last page
                    if (totalPages > 1 && totalPages !== 1) {
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

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Items per page info (desktop only) */}
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
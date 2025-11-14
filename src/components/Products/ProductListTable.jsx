import React from 'react'
import { Search, Loader, Package, Edit2, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react'
import ProductPagination from './ProductPagination'

export default function ProductListTable({
  list,
  loading,
  searchTerm,
  setSearchTerm,
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  setCurrentPage,
  getJenisProdukName,
  formatCurrency,
  handleToggleActive,
  handleEdit,
  handleDelete,
  onAddProductClick // Prop untuk membuka Modal
}) {
  return (
    <div className="space-y-4">
      
      {/* Search & Add Button Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-auto md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari produk berdasarkan nama atau kode..."
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onAddProductClick}
          className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        
        {/* Table Header/Summary */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 lg:min-w-[1119px]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">Daftar Produk</h4>
              <p className="text-sm text-slate-500 mt-1">
                Menampilkan {list.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) : 0} - {Math.min((currentPage - 1) * itemsPerPage + list.length, totalItems)} dari {totalItems} produk
              </p>
            </div>
            {/* Tampilan halaman di desktop */}
            {totalPages > 1 && (
              <div className="hidden md:flex items-center gap-1 text-sm text-slate-600">
                Halaman {currentPage} dari {totalPages}
              </div>
            )}
          </div>
        </div>

        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                No
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nama Produk
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Kode Produk
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Jenis Produk
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Stok
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Harga
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Nilai
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading && totalItems === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center">
                  <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Memuat data produk...</p>
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-8 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium mb-1">
                    {searchTerm ? 'Tidak ada produk yang cocok' : 'Belum ada produk'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {searchTerm ? 'Coba gunakan kata kunci lain' : 'Tambahkan produk pertama Anda'}
                  </p>
                </td>
              </tr>
            ) : (list.map((produk, index) => {
              const nilaiInventori = (produk.harga || 0) * (produk.stok || 0);
              const no = (currentPage - 1) * itemsPerPage + index + 1;

              return (
                <tr key={produk.produk_id} className="hover:bg-slate-50">
                  {/* NO */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">
                    {no}.
                  </td>
                  
                  {/* NAMA PRODUK */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{produk.nama_produk}</div>
                  </td>
                  
                  {/* KODE PRODUK */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500 text-center">
                    {produk.kode_produk || '-'}
                  </td>

                  {/* JENIS PRODUK */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-500">
                    {getJenisProdukName(produk.jenis_produk_id)}
                  </td>

                  {/* STOK */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium text-slate-700">
                    {produk.stok}
                  </td>

                  {/* HARGA */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right text-slate-700">
                    {formatCurrency(produk.harga)}
                  </td>

                  {/* NILAI */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-semibold text-slate-900">
                    {formatCurrency(nilaiInventori)}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
                    <div className="flex flex-col items-center">
                        {produk.aktif ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium w-max">Aktif</span>
                        ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium w-max">Nonaktif</span>
                        )}
                        {produk.stok === 0 && (
                            <span className="text-xs mt-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium w-max">Stok Habis</span>
                        )}
                    </div>
                  </td>

                  {/* AKSI */}
                  <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
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
                        {produk.aktif ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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
                  </td>
                </tr>
              )}))}
          </tbody>
        </table>

        {/* Pagination Component */}
        {totalPages > 1 && (
            <ProductPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                loading={loading}
                itemsPerPage={itemsPerPage}
            />
        )}
      </div>
    </div>
  )
}
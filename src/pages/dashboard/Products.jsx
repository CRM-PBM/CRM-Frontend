import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

import { produkService } from '../../services/produkService' 

import ProductSummaryCards from '../../components/Products/ProductSummaryCards'
import ProductFormModal from '../../components/Products/ProductFormModal'
import ProductListTable from '../../components/Products/ProductListTable'

import { formatCurrency } from '../../utils/formatters'

export default function Products(){
  // --- States Manajemen Data ---
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)
  const [statistics, setStatistics] = useState(null)
  const [jenisProdukList, setJenisProdukList] = useState([])

  // --- States Modal & Form ---
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    nama_produk: '',
    harga: '',
    stok: '0',
    aktif: true,
    jenis_produk_id: ''
  })
  
  // --- Utility Functions (Dibuat useCallback untuk kinerja) ---
  const getJenisProdukName = useCallback((id) => {
    const jenis = jenisProdukList.find(j => j.jenis_produk_id === id);
    return jenis ? jenis.nama_jenis : 'N/A';
  }, [jenisProdukList])


  // --- Data Loading Functions ---
  const loadJenisProduk = useCallback(async () => {
    try {
      const response = await produkService.getJenisProduk() 
      if (response.success) {
        setJenisProdukList(response.data.data || response.data || []) 
      }
    } catch (error) {
      console.error('Error loading jenis produk:', error)
      toast.error('Gagal memuat jenis produk')
    }
  }, [])

  const loadProduk = useCallback(async () => {
    setLoading(true)
    try {
      const response = await produkService.getAll({ 
        page: currentPage, 
        limit: itemsPerPage,
        search: searchTerm
      })
      if (response.success) {
        setList(response.data || [])

        const pagination = response.pagination || {};

        setTotalPages(pagination.totalPages || 1) 
        setTotalItems(pagination.total || 0)
      }
    } catch (error) {
      console.error('Error loading produk:', error)
      toast.error('Gagal memuat data produk')
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm])

  const loadStatistics = useCallback(async () => {
    try {
      const response = await produkService.getStatistics();

      if (response && response.data) {
        setStatistics(response.data); 
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }, [])

  
  // --- Effect Hooks ---
  useEffect(() => {
    loadProduk()
    loadStatistics()
    loadJenisProduk()
  }, [currentPage, loadProduk, loadStatistics, loadJenisProduk]) 

  useEffect(() => {
      // Logic for search: reset page to 1 on search term change
      if (currentPage !== 1) {
        setCurrentPage(1)
      } else {
        loadProduk()
        loadStatistics() 
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]) 


  // --- Modal & Form Handlers ---
  const resetForm = () => {
    setForm({
      nama_produk: '',
      harga: '',
      stok: '0',
      jenis_produk_id: '',
      aktif: true
    })
    setEditMode(false)
    setEditId(null)
  }

  const handleOpenModal = (produk = null) => {
    if (produk) {
      setEditMode(true)
      setEditId(produk.produk_id)
      setForm({
        nama_produk: produk.nama_produk || '',
        harga: produk.harga?.toString() || '',
        stok: produk.stok?.toString() || '0',
        aktif: produk.aktif !== false,
        jenis_produk_id: produk.jenis_produk_id || ''
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nama_produk || !form.harga || !form.jenis_produk_id) {
      toast.error('Nama produk, harga, dan jenis produk wajib diisi')
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
        await produkService.update(editId, dataToSend)
        toast.success('Produk berhasil diupdate')
      } else {
        await produkService.create(dataToSend)
        toast.success('Produk berhasil ditambahkan')
      }
      
      handleCloseModal() // Close modal on success
      
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
  
  // --- Action Handlers ---
  async function handleDelete(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    setLoading(true)
    try {
      await produkService.delete(id)
      toast.success('Produk berhasil dihapus')
      
      if (list.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        await loadProduk()
      }
      await loadStatistics()
    } catch (error) {
      console.error('Error deleting produk:', error)
      toast.error('Gagal menghapus produk')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleActive(id, currentStatus) {
    // Optimistic update
    setList(list.map(p => 
      p.produk_id === id ? { ...p, aktif: !currentStatus } : p
    ));
    toast.success(`Produk ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}`);

    setLoading(true);
    try {
      await produkService.toggleActive(id); 
      loadProduk(); 
      loadStatistics(); 

    } catch (error) {
      // Rollback on error
      setList(list.map(p => 
        p.produk_id === id ? { ...p, aktif: currentStatus } : p
      ));
      console.error('Error toggling active:', error);
      toast.error(error.response?.data?.message || 'Gagal mengubah status produk');

    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="space-y-6">

      {/* 1. Statistics Cards Component */}
      <ProductSummaryCards 
        statistics={statistics} 
        formatCurrency={formatCurrency}
      />

      {/* 2. Product Table Component (Includes Search & Add Button) */}
      <ProductListTable
        list={list}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        getJenisProdukName={getJenisProdukName}
        formatCurrency={formatCurrency}
        handleToggleActive={handleToggleActive}
        handleEdit={handleOpenModal} // Membuka modal dengan data produk
        handleDelete={handleDelete}
        onAddProductClick={() => handleOpenModal()} // Membuka modal untuk tambah
      />
      
      {/* 3. Product Form Modal Component */}
      <ProductFormModal
        showModal={showModal}
        onClose={handleCloseModal}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        loading={loading}
        editMode={editMode}
        jenisProdukList={jenisProdukList}
        formatCurrency={formatCurrency}
      />
      
    </div>
  )
}
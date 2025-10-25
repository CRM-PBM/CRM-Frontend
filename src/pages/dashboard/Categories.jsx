import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { kategoriService } from '../../services/kategoriService'
import { jenisProdukService } from '../../services/jenisProdukService'
import { toast } from 'react-toastify'

export default function Categories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ nama_kategori: '', deskripsi: '' })
    const [editingKategoriId, setEditingKategoriId] = useState(null)

    // state untuk jenis produk
    const [jenisList, setJenisList] = useState([])
    const [loadingJenis, setLoadingJenis] = useState(false)
    const [jenisForm, setJenisForm] = useState({ nama_jenis: '', kategori_id: '' })
    const [editingJenisId, setEditingJenisId] = useState(null)

    useEffect(() => {
        loadCategories();
        loadJenis();
    }, [])

    async function loadCategories() {
        setLoading(true)
        try {
            const res = await kategoriService.getAllKategori()
            console.log('Response kategori:', res.data)

            setCategories(res.data.data || [])
        } catch (error) {
            console.error('Gagal memuat kategori:', error)
            toast.error('Gagal memuat kategori')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
        if (editingKategoriId) {
            await kategoriService.updateKategori(editingKategoriId, formData)
            toast.success('Kategori berhasil diperbarui')
        } else {
            await kategoriService.createKategori(formData)
            toast.success('Kategori berhasil ditambahkan')
        }
        setFormData({ nama_kategori: '', deskripsi: '' })
        setEditingKategoriId(null)
        await loadCategories()
        } catch (error) {
        console.error('Gagal menyimpan kategori:', error)
        toast.error('Gagal menyimpan kategori')
        }
    }

    function handleEdit(kategori) {
        // ✅ gunakan kategori_id
        setFormData({ nama_kategori: kategori.nama_kategori, deskripsi: kategori.deskripsi })
        setEditingKategoriId(kategori.kategori_id)
    }

    async function handleDelete(id) {
        if (!window.confirm('Hapus kategori ini?')) return
        try {
            await kategoriService.deleteKategori(id)
            toast.success('Kategori dihapus')
            loadCategories() 
        } catch (error) {
            console.error('Gagal menghapus kategori:', error)
            toast.error('Gagal menghapus kategori')
        }

        console.log('hapus kategori id:', id)

    }

    // --- Fungsi untuk jenis produk ---
    async function loadJenis() {
    setLoadingJenis(true);
        try {
            const res = await jenisProdukService.getAllJenis();
            setJenisList(res.data.data || []);
        } catch (error) {
            console.error('Gagal memuat jenis:', error);
            toast.error('Gagal memuat jenis produk');
        } finally {
            setLoadingJenis(false);
        }
    }

    async function handleJenisSubmit(e) {
        e.preventDefault();
        try {
            setLoadingJenis(true);
            if (editingJenisId) {
                await jenisProdukService.updateJenis(editingJenisId, jenisForm);
                toast.success('Jenis produk diperbarui');
            } else {
                await jenisProdukService.createJenis(jenisForm);
                toast.success('Jenis produk ditambahkan');
            }
                await loadJenis();
        } catch (error) {
            console.error('Gagal menyimpan jenis:', error);
            toast.error('Gagal menyimpan jenis produk');
        } finally {
            setLoadingJenis(false);
        }
    }

    async function handleEditJenis(jenis) {
        setJenisForm({
            nama_jenis: jenis.nama_jenis,
            kategori_id: jenis.kategori_id,
        });
        // 🔧 perbaikan di sini
        setEditingJenisId(jenis.jenis_produk_id);
    }

    async function handleDeleteJenis(id) {
    if (!window.confirm('Hapus jenis produk ini?')) return;
    try {
        await jenisProdukService.deleteJenis(id);
        toast.success('Jenis produk dihapus');
        loadJenis();
    } catch (error) {
        console.error('Gagal menghapus jenis:', error);
        toast.error('Gagal menghapus jenis produk');
    }
    }

    async function handleCancelEditKategori() {
        setEditingKategoriId(null);
        setFormData({ nama_kategori: '', deskripsi: '' });
    }
    async function handleCancelEditJenis() {
        setEditingJenisId(null);
        setJenisForm({ nama_jenis: '', kategori_id: '' });
    }


return (
    <div className="p-y-6">

            {/* Manajemen Kategori Produk */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Manajemen Kategori Produk</h2>

                <div className="flex items-center gap-2 mb-4">
                        <Plus className="h-5 w-5 text-sky-600" />
                        <h4 className="font-semibold text-slate-900">
                            {editingKategoriId ? 'Edit Kategori' : 'Tambah Kategori Produk'}
                        </h4>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                    type="text"
                    placeholder="Nama kategori..."
                    value={formData.nama_kategori ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama_kategori: e.target.value }))}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                    />
                    <input
                    type="text"
                    placeholder="Deskripsi..."
                    value={formData.deskripsi ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                    />
                    <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
                    >
                    {editingKategoriId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingKategoriId ? 'Update' : 'Tambah'}
                    </button>
                    {editingKategoriId && (
                        <button type="button" onClick={handleCancelEditKategori} className="px-4 py-2 border border-slate-700 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-700 hover:text-slate-300 transition-colors" disabled={loading}>Batal</button>
                    )}
                </form>
                
                <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                    {loading ? (
                    <div className="p-4 text-center text-slate-500">Memuat data...</div>
                    ) : categories.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">Belum ada kategori</div>
                    ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-100 text-slate-700 text-sm">
                            <th className="px-4 py-3 border-b">No</th>
                            <th className="px-4 py-3 border-b">Nama Kategori</th>
                            <th className="px-4 py-3 border-b">Deskripsi</th>
                            <th className="px-4 py-3 border-b text-right">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((kategori, index) => (
                            <tr key={kategori.kategori_id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 border-b">{index + 1}</td>
                            <td className="px-4 py-3 border-b">{kategori.nama_kategori}</td>
                            <td className="px-4 py-3 border-b">{kategori.deskripsi || '-'}</td>
                            <td className="px-4 py-3 border-b text-right space-x-2">
                                <button
                                onClick={() => handleEdit(kategori)}
                                className="text-sky-600 hover:text-sky-800"
                                >
                                <Edit className="w-4 h-4 inline" />
                                </button>
                                <button
                                onClick={() => handleDelete(kategori.kategori_id)}
                                className="text-red-600 hover:text-red-800"
                                >
                                <Trash2 className="w-4 h-4 inline" />
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>


            {/* Manajemen Jenis Produk */}
        <div className="mt-4">   
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Manajemen Jenis Produk</h2>

                    <div className="flex items-center gap-2 mb-4">
                            <Plus className="h-5 w-5 text-sky-600" />
                            <h4 className="font-semibold text-slate-900">
                                {editingJenisId ? 'Edit Jenis Produk' : 'Tambah Jenis Produk'}
                            </h4>
                    </div>

                    <form onSubmit={handleJenisSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                            <input
                            type="text"
                            placeholder="Nama jenis..."
                            value={jenisForm.nama_jenis}
                            onChange={(e) => setJenisForm({ ...jenisForm, nama_jenis: e.target.value })}
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            required
                            />
                            <select
                            value={jenisForm.kategori_id}
                            onChange={(e) => setJenisForm({ ...jenisForm, kategori_id: e.target.value })}
                            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            required
                            >
                            <option value="">Pilih kategori</option>
                            {categories.map((kat) => (
                                <option key={kat.kategori_id} value={kat.kategori_id}>
                                {kat.nama_kategori}
                                </option>
                            ))}
                            </select>
                            <button
                            type="submit"
                            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
                            >
                            {editingJenisId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {editingJenisId ? 'Update' : 'Tambah'}
                            </button>
                            {editingJenisId && (
                                <button type="button" onClick={handleCancelEditJenis} className="px-4 py-2 border border-slate-700 bg-slate-50 text-slate-700 rounded-lg font-medium hover:bg-slate-500 hover:text-slate-300  transition-colors" disabled={loadingJenis}>Batal</button>
                            )}
                    </form>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                            {loadingJenis ? (
                            <div className="p-4 text-center text-slate-500">Memuat data...</div>
                            ) : jenisList.length === 0 ? (
                            <div className="p-4 text-center text-slate-500">Belum ada jenis produk</div>
                            ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-slate-100 text-slate-700 text-sm">
                                    <th className="px-4 py-3 border-b">No</th>
                                    <th className="px-4 py-3 border-b">Nama Jenis</th>
                                    <th className="px-4 py-3 border-b">Kategori</th>
                                    <th className="px-4 py-3 border-b text-right">Aksi</th>
                                </tr>
                                </thead>
                                <tbody>
                                {jenisList.map((jenis, index) => (
                                    <tr key={jenis.jenis_produk_id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 border-b">{index + 1}.</td>
                                    <td className="px-4 py-3 border-b text-left">{jenis.nama_jenis}</td>
                                    <td className="px-4 py-3 border-b">
                                        {jenis.KategoriProduk?.nama_kategori || '-'}
                                    </td>
                                    <td className="px-4 py-3 border-b text-right space-x-2">
                                        <button
                                        onClick={() => handleEditJenis(jenis)}
                                        className="text-sky-600 hover:text-sky-800"
                                        >
                                        <Edit className="w-4 h-4 inline" />
                                        </button>
                                        <button
                                        onClick={() => handleDeleteJenis(jenis.jenis_produk_id)}
                                        className="text-red-600 hover:text-red-800"
                                        >
                                        <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            )}
                    </div>
            </div>
        </div>
    </div>

    
  )
}

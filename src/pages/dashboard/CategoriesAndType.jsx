import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Layers, Tag, Star, Package, Loader, Search } from 'lucide-react'
import { kategoriService } from '../../services/kategoriService'
import { jenisProdukService } from '../../services/jenisProdukService'
import { toast } from 'react-toastify'

// --- Component MetricCard ---
const MetricCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${color} rounded-lg`}>
            {icon && React.createElement(icon, { className: 'h-5 w-5 text-white' })}
          </div>
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className="text-xl font-bold text-slate-900">{value}</p>
          </div>
        </div>
    </div>
);


export default function CategoriesAndTypePage() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ nama_kategori: '', deskripsi: '' })
    const [editingKategoriId, setEditingKategoriId] = useState(null)

    const [jenisList, setJenisList] = useState([])
    const [loadingJenis, setLoadingJenis] = useState(false)
    const [jenisForm, setJenisForm] = useState({ nama_jenis: '', kategori_id: '' })
    const [editingJenisId, setEditingJenisId] = useState(null)
    const [kategoriSearchTerm, setKategoriSearchTerm] = useState('')
    const [jenisSearchTerm, setJenisSearchTerm] = useState('');
    
    // --- STATE BARU UNTUK STATISTIK & TAB ---
    const [loadingStatistics, setLoadingStatistics] = useState(false);
    const [statistics, setStatistics] = useState(null);
    const [jenisStatistics, setJenisStatistics] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState('kategori'); // Default tab
    // --- END STATISTIC STATE ---


    useEffect(() => {
        loadStatistics();
        loadCategories();
        loadJenis();
    }, [])

    async function loadStatistics() {
        setLoadingStatistics(true);

        try {
            // Ambil statistik kategori
            const kategoriRes = await kategoriService.getStatistik();
            const kategoriData = kategoriRes.data?.data ?? null;

            // Ambil statistik jenis produk
            const jenisRes = await jenisProdukService.getStatistikJenis();
            const jenisData = jenisRes.data?.data ?? null;

            setStatistics(kategoriData);
            setJenisStatistics(jenisData);
        } 
        catch (error) {
            console.error("Gagal memuat statistik:", error);
            toast.error("Gagal memuat statistik");
            
            setStatistics(null);
            setJenisStatistics(null);
        } 
        finally {
            setLoadingStatistics(false);
        }
    }



    async function loadCategories() {
        setLoading(true)
        try {
            const res = await kategoriService.getAllKategori()
            setCategories(res.data.data || [])
        } catch (error) {
            console.error('Gagal memuat kategori:', error)
            toast.error('Gagal memuat kategori')
        } finally {
            setLoading(false)
        }
    }

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

    // --- CRUD KATEGORI ---
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
            await loadStatistics() // Refresh statistik setelah perubahan
        } catch (error) {
            console.error('Gagal menyimpan kategori:', error)
            toast.error(error.response?.data?.message || 'Gagal menyimpan kategori')
        }
    }

    function handleEdit(kategori) {
        setFormData({ nama_kategori: kategori.nama_kategori, deskripsi: kategori.deskripsi })
        setEditingKategoriId(kategori.kategori_id)
        // Pindah ke tab Kategori saat mengedit
        setActiveSubTab('kategori');
    }

    async function handleDelete(id) {
        if (!window.confirm('Hapus kategori ini? Menghapus kategori juga akan menghapus jenis produk terkait.')) return
        try {
            await kategoriService.deleteKategori(id)
            toast.success('Kategori dihapus')
            loadCategories() 
            loadJenis() // Reload jenis produk
            loadStatistics() // Refresh statistik
        } catch (error) {
            console.error('Gagal menghapus kategori:', error)
            toast.error(error.response?.data?.message || 'Gagal menghapus kategori')
        }
    }

    function handleCancelEditKategori() {
        setEditingKategoriId(null);
        setFormData({ nama_kategori: '', deskripsi: '' });
    }

    // Filter Kategori
    const filteredCategories = categories.filter(kategori =>
        kategori.nama_kategori.toLowerCase().includes(kategoriSearchTerm.toLowerCase()) ||
        kategori.deskripsi?.toLowerCase().includes(kategoriSearchTerm.toLowerCase())
    );

    
    // --- CRUD JENIS PRODUK ---
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
                setJenisForm({ nama_jenis: '', kategori_id: '' });
                setEditingJenisId(null);
                await loadJenis();
                await loadStatistics(); // Refresh statistik setelah perubahan
        } catch (error) {
            console.error('Gagal menyimpan jenis:', error);
            toast.error(error.response?.data?.message || 'Gagal menyimpan jenis produk');
        } finally {
            setLoadingJenis(false);
        }
    }

    const filteredJenisList = jenisList.filter(jenis => {
        // Cari berdasarkan nama jenis
        const matchesJenis = jenis.nama_jenis.toLowerCase().includes(jenisSearchTerm.toLowerCase());
        
        const categoryName = jenis.KategoriProduk?.nama_kategori || '';
        const matchesCategory = categoryName.toLowerCase().includes(jenisSearchTerm.toLowerCase());

        return matchesJenis || matchesCategory;
    });

    async function handleEditJenis(jenis) {
        setJenisForm({
            nama_jenis: jenis.nama_jenis,
            kategori_id: jenis.kategori_id,
        });
        setEditingJenisId(jenis.jenis_produk_id);
        // Pindah ke tab Jenis Produk saat mengedit
        setActiveSubTab('jenis-produk');
    }

    async function handleDeleteJenis(id) {
        if (!window.confirm('Hapus jenis produk ini?')) return;
        try {
            await jenisProdukService.deleteJenis(id);
            toast.success('Jenis produk dihapus');
            loadJenis();
            loadStatistics(); // Refresh statistik
        } catch (error) {
            console.error('Gagal menghapus jenis:', error);
            toast.error(error.response?.data?.message || 'Gagal menghapus jenis produk');
        }
    }

    function handleCancelEditJenis() {
        setEditingJenisId(null);
        setJenisForm({ nama_jenis: '', kategori_id: '' });
    }
    
    // Untuk mendapatkan nama kategori berdasarkan ID saat menampilkan jenis produk
    const getCategoryName = (catId) => {
        const cat = categories.find(c => c.kategori_id === catId);
        return cat ? cat.nama_kategori : 'N/A';
    };

    const unggulanTitle =
        activeSubTab === "kategori"
        ? "Kategori Unggulan"
        : "Jns Produk Unggulan";

    const unggulanValue =
        activeSubTab === "kategori"
        ? statistics?.kategoriUnggulan || "Belum ada"
        : jenisStatistics?.unggulanJenis || "Belum ada";



    return (
        <div className="space-y-6">

            {/* 4. Statistics Cards (Metric Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loadingStatistics && !statistics ? (
                    <div className="col-span-4 p-4 text-center bg-white rounded-xl shadow-sm">
                        <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto" />
                        <p className="text-sm text-slate-500 mt-2">Memuat statistik...</p>
                    </div>
                ) : (
                    <>
                        <MetricCard
                            icon={Layers}
                            title="Total Kategori"
                            value={statistics?.totalKategori ?? 0}
                            color="bg-sky-600"
                        />
                        <MetricCard
                            icon={Tag}
                            title="Total Jenis Produk"
                            value={statistics?.totalJenisProduk ?? 0}
                            color="bg-purple-600"
                        />
                        <MetricCard
                            icon={Star}
                            title={unggulanTitle}
                            value={unggulanValue}
                            color="bg-green-600"
                        />
                        <MetricCard
                            icon={Package}
                            title="Total Produk Terkait"
                            value={statistics?.totalProdukTerkait ?? 0}
                            color="bg-amber-600"
                        />
                    </>
                )}
            </div>
            
            {/* Main Content Area with Tabs (POIN 2) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
                <div className="p-4 border-b border-slate-200">
                    <div className="flex space-x-4">
                        {/* Tabs for Kategori and Jenis Produk */}
                        <button
                            onClick={() => setActiveSubTab('kategori')}
                            className={`text-sm font-medium pb-2 ${activeSubTab === 'kategori' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Daftar Kategori ({categories.length})
                        </button>
                        <button
                            onClick={() => setActiveSubTab('jenis-produk')}
                            className={`text-sm font-medium pb-2 ${activeSubTab === 'jenis-produk' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Daftar Jenis Produk ({jenisList.length})
                        </button>
                    </div>
                </div>

                <div className="p-6">

                    {/* Formulir dan Tabel Kategori */}
                    {activeSubTab === 'kategori' && (
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-3">
                                {editingKategoriId ? 'Edit Kategori Produk' : 'Tambah Kategori Produk'}
                            </h3>

                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                                <input
                                type="text"
                                placeholder="Nama kategori..."
                                value={formData.nama_kategori ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, nama_kategori: e.target.value }))}
                                className="flex-1 border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                                required
                                />
                                <input
                                type="text"
                                placeholder="Deskripsi kategori (Opsional)..."
                                value={formData.deskripsi ?? ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                                className="flex-1 border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                                />
                                <button
                                type="submit"
                                className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded-lg transition text-base"
                                disabled={loading}
                                >
                                {editingKategoriId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {editingKategoriId ? 'Update' : 'Tambah'}
                                </button>
                                {editingKategoriId && (
                                    <button type="button" onClick={handleCancelEditKategori} className="px-2 py-1 border border-slate-300 bg-white text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors" disabled={loading}>Batal</button>
                                )}
                            </form>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={`Cari kategori...`}
                                    value={kategoriSearchTerm}
                                    onChange={(e) => setKategoriSearchTerm(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-1 focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Tabel Kategori */}
                            <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-slate-500">Memuat data...</div>
                                ) : filteredCategories.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500">Belum ada kategori</div>
                                ) : (
                                    <table className="min-w-full text-left border-collapse">
                                        <thead>
                                        <tr className="bg-slate-100 text-slate-700 text-sm">
                                            <th className="px-4 py-3 border-b">No</th>
                                            <th className="px-4 py-3 border-b">Nama Kategori</th>
                                            <th className="px-4 py-3 border-b">Deskripsi</th>
                                            <th className="px-4 py-3 border-b">Jml. Jns Produk</th>
                                            <th className="px-4 py-3 border-b text-right">Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredCategories.map((kategori, index) => (
                                            <tr key={kategori.kategori_id} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 border-b text-sm">{index + 1}</td>
                                            <td className="px-4 py-2 border-b text-sm">  
                                                {kategori.nama_kategori}</td>
                                            <td className="px-4 py-2 border-b text-sm">     
                                                {kategori.deskripsi || '-'}</td>
                                            <td className="px-4 py-2 border-b text-center text-sm">
                                                {kategori.totalJenis ?? 0} Jenis
                                            </td>
                                            <td className="px-4 py-2 border-b text-right space-x-2">
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
                    )}

                    {/* Formulir dan Tabel Jenis Produk */}
                    {activeSubTab === 'jenis-produk' && (
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-3">
                                {editingJenisId ? 'Edit Jenis Produk' : 'Tambah Jenis Produk'}
                            </h3>

                            <form onSubmit={handleJenisSubmit} className="flex flex-col sm:flex-row gap-3 mb-5">
                                <input
                                type="text"
                                placeholder="Nama jenis..."
                                value={jenisForm.nama_jenis}
                                onChange={(e) => setJenisForm({ ...jenisForm, nama_jenis: e.target.value })}
                                className="flex-1 border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
                                required
                                />
                                <select
                                value={jenisForm.kategori_id}
                                onChange={(e) => setJenisForm({ ...jenisForm, kategori_id: e.target.value })}
                                className="border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-sky-500 focus:outline-none text-sm"
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
                                className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded-lg transition text-sm"
                                disabled={loadingJenis}
                                >
                                {editingJenisId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {editingJenisId ? 'Update' : 'Tambah'}
                                </button>
                                {editingJenisId && (
                                    <button type="button" onClick={handleCancelEditJenis} className="px-3 py-1 border border-slate-300 bg-white text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm" disabled={loadingJenis}>Batal</button>
                                )}
                            </form>

                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={`Cari jenis produk...`}
                                    value={jenisSearchTerm}
                                    onChange={(e) => setJenisSearchTerm(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-1 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                />
                            </div>

                            {/* Tabel Jenis Produk */}
                            <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
                                {loadingJenis ? (
                                    <div className="p-4 text-center text-slate-500">Memuat data...</div>
                                ) : filteredJenisList.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500">Belum ada jenis produk</div>
                                ) : (
                                    <table className="min-w-full text-left border-collapse">
                                        <thead>
                                        <tr className="bg-slate-100 text-slate-700 text-sm">
                                            <th className="px-3 py-2 border-b">No</th>
                                            <th className="px-3 py-2 border-b">Nama Jenis</th>
                                            <th className="px-3 py-2 border-b">Kategori</th>
                                            <th className="px-2 py-2 border-b text-center">Jumlah Produk</th>
                                            <th className="px-3 py-2 border-b text-right">Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredJenisList.map((jenis, index) => (
                                            <tr key={jenis.jenis_produk_id} className="hover:bg-slate-50 text-sm">
                                            <td className="px-3 py-2 border-b text-sm">{index + 1}.</td>
                                            <td className="px-3 py-2 border-b text-left text-sm">{jenis.nama_jenis}</td>
                                            <td className="px-3 py-2 border-b text-sm">
                                                {getCategoryName(jenis.kategori_id) || '-'}
                                            </td>
                                            <td className="px-2 py-2 border-b text-center text-sm">
                                                {jenis.totalProduk ?? 0} Produk
                                            </td>
                                            <td className="px-3 py-2 border-b text-right space-x-2">
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
                    )}
                </div>
            </div>
        </div>
    );
}
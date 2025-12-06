import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, ListChecks, TrendingUp, TrendingDown, Package, Search, RotateCcw } from 'lucide-react'; 
import inventoryLogService from '../../services/inventoryLogService';
import StockInModal from '../../components/Inventory/StockInModal'; 
import StockOutModal from '../../components/Inventory/StockOutModal'; 
import StockAdjustModal from '../../components/Inventory/StockAdjustModal'; 
import InventoryLogTable from '../../components/Inventory/InventoryLogTable';

// Komponen Card tetap sama
const MetricCard = ({ title, value, icon: Icon, colorClass, footerText }) => (
    <div className={`p-5 bg-white rounded-xl shadow-sm border-l-4 ${colorClass}`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full text-white ${colorClass.replace('border-', 'bg-')}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {footerText && (
            <div className="mt-4 text-xs text-slate-500 border-t pt-2">
                {footerText}
            </div>
        )}
    </div>
);

// Helper function untuk Pagination
const PaginationButtons = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [...Array(totalPages).keys()].map(i => i + 1);

    return (
        <div className="flex items-center justify-end space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
                {'<'}
            </button>
            
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md text-sm transition ${
                        currentPage === page
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
                {'>'}
            </button>
        </div>
    );
};


export default function InventoryLogPage() {
    const [logs, setLogs] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showInModal, setShowInModal] = useState(false);
    const [showOutModal, setShowOutModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    
    const [metrics, setMetrics] = useState({
        totalStockIn: 0,
        totalStockOut: 0,
        lowStockCount: 0,
    });
    
    // ----------------------------------------------------
    // STATE UNTUK FILTER DAN PAGINATION
    const [filters, setFilters] = useState({
        page: 1, 
        limit: 10,
        type: '', 
        startDate: '',
        endDate: '',
        keyword: ''
    });
    const [pagination, setPagination] = useState({ 
        currentPage: 1, 
        totalPages: 1, 
        limit: 10, 
        totalItems: 0 
    });
    // STATE LOCAL UNTUK INPUT (digunakan sebelum disubmit ke filters)
    const [localFilters, setLocalFilters] = useState(filters);
    // ----------------------------------------------------


    const fetchLogs = useCallback(async (currentFilters) => {
        setLoading(true);
        setError(null);
        try {
            // Mengambil logs dengan filter dan pagination
            const logsRes = await inventoryLogService.getInventoryLogs(currentFilters);
            
            const logsData = logsRes.data || [];
            const paginationData = logsRes.pagination || {};

            setLogs(logsData);
            setPagination(paginationData);
            setFilters(currentFilters); // Sinkronisasi filters state
        } catch (err) {
            console.error('Gagal mengambil log inventori:', err);
            setError('Gagal mengambil data riwayat inventori: ' + (err.response?.data?.message || err.message));
            setLogs([]);
            setPagination({ currentPage: 1, totalPages: 1, limit: 10, totalItems: 0 });
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Mengambil data Statis dan Produk (tanpa filter)
            const [statsRes, productsRes] = await Promise.all([
                inventoryLogService.getStatistics(),
                inventoryLogService.getProducts(),
            ]);

            const statsData = statsRes.data || {};
            const productData = productsRes.data || [];

            setProducts(Array.isArray(productData) ? productData : []);

            const totalIn = statsData.totalStockIn || 0;
            const totalOut = statsData.totalStockOut || 0;
            const lowStock = productData.filter(p => p.stok < 10).length;

            setMetrics({
                totalStockIn: totalIn,
                totalStockOut: totalOut,
                lowStockCount: lowStock,
            });
            
            // Panggil fetchLogs dengan filter awal/terakhir
            fetchLogs(filters); 

        } catch (err) {
            console.error('Gagal mengambil data inventori:', err);
            setError('Gagal mengambil data inventori: ' + (err.response?.data?.message || err.message));
            setLogs([]);
            setProducts([]);
        } 
    }, [fetchLogs, filters]); // Ditambahkan fetchLogs dan filters dependency

    // ----------------------------------------------------
    // HANDLER UNTUK FILTER DAN PAGINATION
    // ----------------------------------------------------

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        
        // Buat objek filter bersih (hilangkan key kosong dan page/limit)
        const newFilters = Object.keys(localFilters).reduce((acc, key) => {
            if (localFilters[key] !== '' && key !== 'page' && key !== 'limit') {
                acc[key] = localFilters[key];
            }
            return acc;
        }, {});

        // Gabungkan filter baru dengan pagination default (page 1, limit 10)
        const submitFilters = {
            ...newFilters,
            page: 1, 
            limit: pagination.limit 
        };
        
        // Panggil ulang data
        fetchLogs(submitFilters);
    };

    const handleResetFilter = () => {
        const resetFilters = { page: 1, limit: pagination.limit, type: '', startDate: '', endDate: '', keyword: '' };
        setLocalFilters(resetFilters);
        fetchLogs(resetFilters);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            const newFilters = { ...filters, page: newPage };
            setLocalFilters(newFilters); // Update local state untuk sinkronisasi
            fetchLogs(newFilters);
        }
    };
    
    const handleLocalFilterChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };
    

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    if (loading && logs.length === 0) return <div className="p-6 text-sky-600">Memuat data inventori...</div>;
    if (error) return <div className="p-6 text-red-600 font-semibold">Error: {error}</div>;

    const metricData = [
        // ... (data metric tetap sama) ...
        {
            title: 'Total Stok Masuk (Terakhir)',
            value: metrics.totalStockIn.toLocaleString('id-ID'),
            icon: TrendingUp,
            colorClass: 'border-green-600',
            footerText: 'Total unit masuk dari IN saja',
        },
        {
            title: 'Total Stok Keluar (Terakhir)',
            value: metrics.totalStockOut.toLocaleString('id-ID'),
            icon: TrendingDown,
            colorClass: 'border-red-600',
            footerText: 'Total unit keluar (SALE, OUT, ADJUST-)',
        },
        {
            title: 'Produk Stok Rendah',
            value: metrics.lowStockCount,
            icon: ListChecks,
            colorClass: 'border-amber-600',
            footerText: `Ada ${metrics.lowStockCount} produk di bawah batas aman (10 unit)`,
        },
        {
            title: 'Total Produk',
            value: products.length,
            icon: Package,
            colorClass: 'border-sky-600',
            footerText: 'Jumlah produk aktif',
        },
    ];

    return (
        <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
            <h2 className="text-2xl font-semibold text-slate-800">Aktivitas Stok & Inventori</h2>

            {/* CARD METRIC */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricData.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                
                {/* FORM FILTER DITAMBAHKAN DI SINI */}
                <form onSubmit={handleFilterSubmit} className="pb-4 border-b">
                    <h4 className="text-lg font-semibold text-slate-700 mb-3">Filter Riwayat</h4>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                        
                        {/* Filter Tipe Gerak */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipe</label>
                            <select
                                name="type"
                                value={localFilters.type}
                                onChange={handleLocalFilterChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            >
                                <option value="">Semua</option>
                                <option value="IN">Masuk (IN)</option>
                                <option value="OUT">Keluar (OUT)</option>
                                <option value="SALE">Penjualan (SALE)</option>
                                <option value="ADJUST">Penyesuaian</option>
                            </select>
                        </div>
                        
                        {/* Filter Tanggal Awal */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tgl. Awal</label>
                            <input
                                type="date"
                                name="startDate"
                                value={localFilters.startDate}
                                onChange={handleLocalFilterChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>
                        
                        {/* Filter Tanggal Akhir */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tgl. Akhir</label>
                            <input
                                type="date"
                                name="endDate"
                                value={localFilters.endDate}
                                onChange={handleLocalFilterChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>
                        
                        {/* Filter Keterangan */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                            <input
                                type="text"
                                name="keyword"
                                value={localFilters.keyword}
                                onChange={handleLocalFilterChange}
                                placeholder="Cari di Keterangan..."
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                            />
                        </div>

                        {/* Tombol Aksi Filter */}
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full"
                            >
                                <Search className="w-4 h-4 mr-1" /> Cari
                            </button>
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="flex items-center justify-center p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
                
                {/* TOMBOL AKSI STOK */}
                <div className="flex justify-between items-center pt-2">
                    <h3 className="text-xl font-semibold text-slate-800">Riwayat Pergerakan Stok</h3>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowOutModal(true)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-red-100 bg-red-600 hover:bg-red-700 rounded-md border border-red-300 transition-colors" 
                        >
                            <Minus className="w-4 h-4 mr-2" /> Stock Out/Keluar
                        </button>
                        <button
                            onClick={() => setShowAdjustModal(true)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-amber-50 bg-amber-500 hover:bg-amber-600 rounded-md border border-amber-300 transition-colors"
                        >
                            <ListChecks className="w-4 h-4 mr-2" /> Penyesuaian Stok
                        </button>
                        <button
                            onClick={() => setShowInModal(true)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Stock In Baru
                        </button>
                    </div>
                </div>

                {/* TABEL LOG */}
                <InventoryLogTable 
                    logs={logs || []} 
                    loading={loading}
                />
                
                {/* PAGINATION DITAMBAHKAN DI BAWAH TABEL */}
                <div className="flex justify-between items-center pt-4">
                    <p className="text-sm text-gray-600">
                        Menampilkan {logs.length} dari {pagination.totalItems} total entri.
                    </p>
                    <PaginationButtons 
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>

            </div>

            {/* MODALS */}
            <StockInModal 
                isOpen={showInModal} 
                onClose={() => setShowInModal(false)}
                onSuccess={() => fetchLogs(filters)} // Panggil fetchLogs saja
                products={products}
            />

            <StockOutModal
                isOpen={showOutModal} 
                onClose={() => setShowOutModal(false)}
                onSuccess={() => fetchLogs(filters)}
                products={products}
            />

            <StockAdjustModal 
                isOpen={showAdjustModal} 
                onClose={() => setShowAdjustModal(false)}
                onSuccess={() => fetchLogs(filters)}
                products={products}
            />

        </div>
    );
}
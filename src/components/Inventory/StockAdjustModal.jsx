import React, { useState } from 'react';
import inventoryLogService from '../../services/inventoryLogService';
import {  ListChecksIcon } from 'lucide-react'; 

export default function StockAdjustModal({ isOpen, onClose, onSuccess, products }) {
    const [formData, setFormData] = useState({
        produk_id: '',
        stok_akhir_diinginkan: '',
        keterangan: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cari produk yang dipilih untuk mendapatkan stok saat ini
    const selectedProduct = products.find(p => p.produk_id === parseInt(formData.produk_id));
    const currentStock = selectedProduct?.stok || 0;
    const stokAkhir = parseInt(formData.stok_akhir_diinginkan);
    const perubahan = stokAkhir - currentStock;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setFormData({ produk_id: '', stok_akhir_diinginkan: '', keterangan: '' });
        setError(null);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.produk_id) {
             setError("Pilih produk yang akan disesuaikan.");
             setLoading(false);
             return;
        }

        if (isNaN(stokAkhir) || stokAkhir < 0) {
            setError("Stok akhir harus berupa angka positif.");
            setLoading(false);
            return;
        }

        if (perubahan === 0) {
             setError("Stok akhir sama dengan stok saat ini. Tidak ada penyesuaian yang dilakukan.");
             setLoading(false);
             return;
        }

        try {
            await inventoryLogService.adjustStock({
                produk_id: parseInt(formData.produk_id),
                tipe_gerak: 'ADJUST',
                stok_akhir_diinginkan: stokAkhir,
                keterangan: formData.keterangan,
            });

            onSuccess();
            handleClose();

        } catch (err) {
            setError(err.response?.data?.message || 'Gagal melakukan penyesuaian stok.');
        } finally {
            setLoading(false);
        }
    };

    const perubahanStokText = currentStock === 0 ? "" : (
        perubahan > 0 
        ? `Akan menambah: +${perubahan} unit` 
        : `${perubahan} unit`
    );

    // Conditional rendering untuk menampilkan/menyembunyikan modal
    if (!isOpen) return null;

    return (
        // Backdrop dan Modal Container
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleClose}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50"></div> 

            {/* Modal Content */}
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div 
                    className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                    onClick={e => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
                >
                    
                    <div className="text-xl font-semibold leading-6 text-slate-900 border-b pb-3 flex justify-between items-center">
                        Form Penyesuaian Stok
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        {/* 1. Produk Dropdown */}
                        <div>
                            <label htmlFor="produk_id" className="block text-sm font-medium text-slate-700">Produk</label>
                            <select
                                id="produk_id"
                                name="produk_id"
                                value={formData.produk_id}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                                required
                            >
                                <option value="">Pilih Produk</option>
                                {products.map(p => (
                                    <option key={p.produk_id} value={p.produk_id}>
                                        {p.nama_produk} (Stok saat ini: {p.stok})
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* 2. Stok Akhir Diinginkan */}
                        <div>
                            <label htmlFor="stok_akhir_diinginkan" className="block text-sm font-medium text-slate-700">
                                Stok Akhir yang Diinginkan
                            </label>
                            <input
                                type="number"
                                id="stok_akhir_diinginkan"
                                name="stok_akhir_diinginkan"
                                value={formData.stok_akhir_diinginkan}
                                onChange={handleChange}
                                placeholder={`Masukkan total stok fisik yang benar (Saat ini: ${currentStock})`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                                required
                                min="0"
                            />
                            {formData.produk_id && !isNaN(stokAkhir) && (
                                <p className={`mt-1 text-sm ${perubahan > 0 ? 'text-green-600' : perubahan < 0 ? 'text-red-600' : 'text-slate-500'}`}>
                                    {perubahanStokText}
                                </p>
                            )}
                        </div>

                        {/* 3. Keterangan */}
                        <div>
                            <label htmlFor="keterangan" className="block text-sm font-medium text-slate-700">Keterangan / Alasan Penyesuaian (Opsional)</label>
                            <textarea
                                id="keterangan"
                                name="keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                placeholder="Contoh: Koreksi data, penyesuaian stok akhir tahun"
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 border"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        {/* Footer */}
                        <div className="flex justify-end pt-4 border-t">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="mr-3 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.produk_id}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
                            >
                                {loading ? 'Memproses...' : (
                                    <>
                                        <ListChecksIcon className="w-4 h-4 mr-2" />
                                        Simpan Penyesuaian
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
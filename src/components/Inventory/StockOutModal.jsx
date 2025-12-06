import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import inventoryService from "../../services/inventoryLogService";

export default function StockOutModal({ isOpen, onClose, onSuccess, products }) {
    const emptyForm = {
        produk_id: "",
        jumlah: "",
        tipe_gerak: "OUT",
        keterangan: "",
    };

    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const currentProduct = products.find(
        (p) => p.produk_id === parseInt(formData.produk_id)
    );
    const currentStock = currentProduct ? currentProduct.stok : 0;

    // 🔥 reset form otomatis setiap modal dibuka
    useEffect(() => {
        if (isOpen) {
            setFormData(emptyForm);
            setError("");
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "produk_id") setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.produk_id || !formData.jumlah) {
            setError("Semua kolom wajib diisi.");
            return;
        }
        if (parseInt(formData.jumlah) <= 0) {
            setError("Jumlah harus lebih dari nol.");
            return;
        }

        // ⚠ validasi stok agar tidak minus
        if (parseInt(formData.jumlah) > currentStock) {
            setError(`Stok tidak cukup (${currentStock}).`);
            return;
        }

        setLoading(true);
        try {
            await inventoryService.adjustStock({
                ...formData,
                produk_id: parseInt(formData.produk_id),
                jumlah: parseInt(formData.jumlah),
            });

            toast.success("Penyesuaian stok berhasil dicatat!", {
                position: "top-right",
                autoClose: 2300,
            });

            onSuccess();
            onClose(); // modal tutup
            setFormData(emptyForm); // reset form

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Gagal mencatat penyesuaian stok.",
                { position: "top-right" }
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-xl animate__animated animate__fadeIn">
                <div className="p-5 border-b bg-red-50">
                    <h3 className="text-xl font-semibold text-red-700">Form Stock Out</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Produk */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Produk</label>
                        <select
                            name="produk_id"
                            value={formData.produk_id}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-2 py-2 focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">Pilih Produk</option>
                            {products.map((p) => (
                                <option key={p.produk_id} value={p.produk_id}>
                                    {p.nama_produk} — stok {p.stok}
                                </option>
                            ))}
                        </select>

                        {formData.produk_id && (
                            <p className="text-xs text-slate-500 mt-1">
                                Stok saat ini: <b>{currentStock}</b> unit
                            </p>
                        )}
                    </div>

                    {/* Jumlah */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Pengurangan</label>
                        <input
                            type="number"
                            name="jumlah"
                            value={formData.jumlah}
                            onChange={handleChange}
                            min="1"
                            required
                            className="w-full border rounded-md px-2 py-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
                        <textarea
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                            rows="2"
                            className="w-full border rounded-md px-2 py-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Contoh: barang rusak, sample, koreksi stok, dll"
                        ></textarea>
                    </div>

                    {/* Tombol */}
                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md text-sm font-medium"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium disabled:bg-red-400"
                            disabled={loading}
                        >
                            {loading ? "Memproses..." : "Simpan Penyesuaian"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import inventoryService from "../../services/inventoryLogService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StockInModal({ isOpen, onClose, onSuccess, products }) {
    const emptyForm = {
        produk_id: "",
        jumlah: "",
        harga_beli: "",
        keterangan: ""
    }
    
    const [formData, setFormData] = useState(emptyForm);
    const [loading, setLoading] = useState(false);

    const currentProduct = products.find(
        (p) => p.produk_id === parseInt(formData.produk_id)
    );

    useEffect(() => {
            if (isOpen) {
            setFormData(emptyForm);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.produk_id || !formData.jumlah || !formData.harga_beli) {
            toast.error("⚠ Semua kolom wajib diisi!");
            return;
        }

        if (parseInt(formData.jumlah) <= 0) {
            toast.error("⚠ Jumlah harus lebih dari 0!");
            return;
        }

        setLoading(true);
        try {
            await inventoryService.stockIn({
                ...formData,
                produk_id: parseInt(formData.produk_id),
                jumlah: parseInt(formData.jumlah),
                harga_beli: parseFloat(formData.harga_beli),
            });

            toast.success("✅ Stok masuk berhasil dicatat!");

            setFormData({
                produk_id: "",
                jumlah: "",
                harga_beli: "",
                keterangan: "",
            });

            setTimeout(() => {
                onSuccess();
                onClose();
            }, 700);
        } catch (err) {
            toast.error(err.response?.data?.message || "Gagal mencatat stok masuk");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <ToastContainer />
            <div className="bg-white rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.15)] w-full max-w-lg animate-scaleIn">
                <div className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">
                        📦 Form Stok Masuk
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-2xl font-semibold"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Select Produk */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Produk</label>
                        <select
                            name="produk_id"
                            value={formData.produk_id}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-sky-500 transition"
                        >
                            <option value="">— Pilih Produk —</option>
                            {products.map((p) => (
                                <option key={p.produk_id} value={p.produk_id}>
                                    {p.nama_produk} ( {p.stok} Unit )
                                </option>
                            ))}
                        </select>

                        {currentProduct && (
                            <div className="mt-3 bg-slate-50 p-3 rounded-md border">
                                <p className="text-sm font-medium text-slate-700">
                                    Stok Saat Ini :{" "}
                                    <span className="text-sky-600 font-bold">
                                        {currentProduct.stok} unit
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Input Jumlah + Harga */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium mb-1">Jumlah Masuk</label>
                            <input
                                type="number"
                                name="jumlah"
                                value={formData.jumlah}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 transition"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Harga Beli per Unit (HPP)
                            </label>
                            <input
                                type="number"
                                name="harga_beli"
                                value={formData.harga_beli}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 transition"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Keterangan */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Keterangan / Sumber Stok
                        </label>
                        <textarea
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                            rows="2"
                            className="w-full border rounded-lg px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-sky-500 transition"
                        ></textarea>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 transition font-medium"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-md transition disabled:bg-sky-400"
                            disabled={loading}
                        >
                            {loading ? "Memproses..." : "Simpan Stock In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

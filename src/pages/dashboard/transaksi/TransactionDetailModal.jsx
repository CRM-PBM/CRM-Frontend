import React from 'react';
import { X, Printer, Calendar, DollarSign, CreditCard, User, Tag, Clock } from 'lucide-react';

// Fungsi untuk memformat mata uang
const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(Number(value))) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(Number(value));
};

// Fungsi untuk memformat Tanggal dan Waktu
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        
        // Opsi format tanggal
        const dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        // Opsi format waktu (dengan detik)
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit', // Menambahkan detik
            hour12: false // Memastikan format 24 jam (00-23)
        };

        // Gabungkan tanggal dan waktu
        const formattedDate = date.toLocaleDateString('id-ID', dateOptions);
        const formattedTime = date.toLocaleTimeString('id-ID', timeOptions).replace(/\./g, ':'); // Mengganti titik (jika ada) dengan titik dua

        return `${formattedDate}, ${formattedTime}`;
    };

// Fungsionalitas cetak sederhana
const handlePrint = (transaksi) => {
    const printContent = `
        <style>
            @media print {
                body { font-family: sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 25px; }
                .header h2 { font-size: 1.5em; margin: 5px 0; }
                .header h3 { font-size: 1.1em; color: #555; }
                .info-section { margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
                .info-section p { margin: 5px 0; font-size: 0.9em; }
                .info-section strong { display: inline-block; width: 150px; }
                .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .table th, .table td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 0.9em; }
                .table th { background-color: #f0f0f0; }
                .total-row td { font-weight: bold; font-size: 1.1em; background-color: #e6f7ff; }
            }
        </style>
        <div class="header">
            <h2>INVOICE TRANSAKSI</h2>
            <h3>Nomor Referensi: #${transaksi.kode_transaksi || transaksi.transaksi_id}</h3>
        </div>

        <div class="info-section">
            <p><strong>Pelanggan:</strong> ${transaksi.Pelanggan?.nama || 'N/A'}</p>
            <p><strong>Tanggal & Waktu:</strong> ${formatDateTime(transaksi.tanggal_transaksi)}</p>
            <p><strong>Metode Pembayaran:</strong> ${transaksi.metode_pembayaran}</p>
            <p><strong>Nomor Transaksi:</strong> ${transaksi.nomor_transaksi || 'N/A'}</p>
        </div>
        
        <h4>Detail Produk:</h4>
        <table class="table">
            <thead>
                <tr>
                    <th>Produk</th>
                    <th style="text-align: right;">Harga Satuan</th>
                    <th style="text-align: right;">Jumlah</th>
                    <th style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${transaksi.DetailTransaksis?.map(item => `
                    <tr>
                        <td>${item.Produk?.nama_produk || 'N/A'}</td>
                        <td style="text-align: right;">${formatCurrency(item.harga_satuan)}</td>
                        <td style="text-align: right;">${item.jumlah}</td>
                        <td style="text-align: right;">${formatCurrency(item.harga_satuan * item.jumlah)}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL PEMBAYARAN:</td>
                    <td style="text-align: right;">${formatCurrency(transaksi.total || transaksi.total_harga)}</td>
                </tr>
            </tbody>
        </table>
        ${transaksi.keterangan ? `<p style="margin-top: 20px;"><strong>Keterangan:</strong> ${transaksi.keterangan}</p>` : ''}
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
};

export default function TransactionDetailModal({ showModal, onClose, transaction }) {
    if (!showModal || !transaction) return null;

    const totalHarga = transaction.total || transaction.total_harga || 0;
    const isDetailAvailable = transaction.DetailTransaksis?.length > 0;
    
    // Asumsi: Kita menggunakan kode_transaksi sebagai ID unik utama yang ditampilkan
    const displayId = transaction.kode_transaksi || transaction.transaksi_id;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">
                        Detail Transaksi #{displayId}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePrint(transaction)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                            title="Cetak Invoice"
                        >
                            <Printer className="h-5 w-5" />
                            <span className="hidden sm:inline">Cetak</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Tutup"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 overflow-y-auto space-y-5 flex-1">
                    {/* Customer & Transaction Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-4">
                        <InfoItem icon={User} label="Pelanggan" value={transaction.Pelanggan?.nama || 'N/A'} isBold />
                        <InfoItem icon={CreditCard} label="Metode Pembayaran" value={transaction.metode_pembayaran} isBold/>
                        <InfoItem icon={Calendar} label="Tanggal & Waktu" value={formatDateTime(transaction.tanggal_transaksi)} isBold />
                    </div>

                    {/* Nomor Transaksi & Other Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-4">
                        <InfoItem icon={Tag} label="Nomor Transaksi" value={transaction.nomor_transaksi || 'N/A'} isBold />
                        <InfoItem icon={Clock} label="Keterangan" value={transaction.keterangan || '-'} isLongText />
                    </div>
                    
                    {/* Product Detail Table */}
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3 text-lg">Detail Produk</h4>
                        {isDetailAvailable ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Produk</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Harga Satuan</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Jumlah</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {transaction.DetailTransaksis.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    {item.Produk?.nama_produk || 'Produk Tidak Ditemukan'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 text-right">
                                                    {formatCurrency(item.harga_satuan)}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 text-right">
                                                    {item.jumlah}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-sky-600 text-right">
                                                    {formatCurrency(item.harga_satuan * item.jumlah)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-sky-50 border-t border-slate-300">
                                            <td colSpan="3" className="px-4 py-3 text-right text-base font-bold text-slate-900">
                                                Total Pembayaran:
                                            </td>
                                            <td className="px-4 py-3 text-right text-xl font-bold text-sky-600">
                                                {formatCurrency(totalHarga)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Tidak ada detail produk tersedia.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Komponen Pembantu untuk Item Info
const InfoItem = ({ icon: IconComponent, label, value, isBold = false, isLongText = false }) => (
    <div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-1">
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span>{label}</span>
        </div>
        <p className={`text-slate-900 ${isBold ? 'font-semibold' : 'font-normal'} ${isLongText ? 'text-sm' : 'text-base'}`}>
            {value}
        </p>
    </div>
);
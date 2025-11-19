// Data konfigurasi status per pesan
export const statusConfig = {
    pending: { color: "bg-slate-100 text-slate-700", label: "Pending" },
    sent: { color: "bg-green-50 text-green-700", label: "Terkirim" },
    failed: { color: "bg-red-50 text-red-700", label: "Gagal" },
};

// Logika status per blast
export function getAggregateStatus(b) {
    const { sent = 0, failed = 0, pending = 0, total_penerima = 0 } = b;

    if (pending > 0) {
        return 'sending'; // Sedang dikirim
    } else if (sent === total_penerima) {
        return 'success'; // Terkirim sempurna
    } else if (failed === total_penerima) {
        return 'failed'; // Semua gagal
    } else {
        return 'partial'; // Beberapa gagal
    }
}
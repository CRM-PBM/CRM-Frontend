import React, { useState } from 'react';
import axios from 'axios';
import { FaFilePdf, FaRedo } from 'react-icons/fa'; 
import { toast } from 'react-toastify';
import { getAccessToken } from '../services/storage';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function untuk mendapatkan header dengan token JWT
const getAuthHeaders = () => {
    const token = getAccessToken();
    if (!token) {
        return null;
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const InvoiceGeneratorPage = () => {
    // Default ke ID dummy 1 untuk pengujian
    const [transaksiId, setTransaksiId] = useState('1'); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const headers = getAuthHeaders();
        if (!headers) {
            toast.error('Anda harus login terlebih dahulu untuk membuat invoice.', { position: "top-center" });
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');
        setDownloadUrl(null);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/invoice`,
                { transaksiId: parseInt(transaksiId) },
                headers
            );

            setMessage(res.data.msg);
            setDownloadUrl(`${API_BASE_URL.replace('/api', '')}${res.data.download_url}`); 
            
        } catch (err) {
            const errMsg = err.response?.data?.msg || 'Gagal membuat Invoice. Cek Konsol.';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8"> {/* bg-slate-50 */}
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-slate-200"> {/* border-slate-200 */}
                
                <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b border-sky-100 pb-3"> {/* text-slate-800, border-sky-100 */}
                    Nota Digital / Invoice Generator
                </h2>

                {/* Form Input Transaksi ID */}
                <form onSubmit={handleSubmit} className="mb-8">
                    <label htmlFor="transaksiId" className="block text-gray-600 font-medium mb-2"> {/* text-gray-600 */}
                        ID Transaksi yang akan dibuatkan Invoice:
                    </label>
                    <div className="flex space-x-3">
                        <input
                            type="number"
                            name="transaksiId"
                            value={transaksiId}
                            onChange={(e) => setTransaksiId(e.target.value)}
                            className="flex-grow px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-150"
                            placeholder="Masukkan ID Transaksi (Contoh: 1)"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-sky-500 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-sky-600 transition duration-200 disabled:bg-sky-400 flex items-center"
                        > {/* bg-sky-500, hover:bg-sky-600 */}
                            {loading ? (
                                <FaRedo className="animate-spin mr-2" />
                            ) : (
                                'Buat Invoice'
                            )}
                        </button>
                    </div>
                </form>

                {/* Area Hasil / Notifikasi */}
                <div className="mt-8 p-4 border rounded-lg">
                    {error && (
                        toast.error('Gagal!', { position: "top-center" })
                    )}

                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                            <p className="font-bold">Sukses!</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    )}

                    {downloadUrl && (
                        <div className="mt-4 p-4 bg-sky-50 border border-sky-100 rounded-lg"> {/* bg-sky-50 */}
                            <p className="font-semibold text-slate-800 mb-2">Invoice berhasil dibuat!</p>
                            <a
                                href={downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition"
                            >
                                <FaFilePdf className="mr-2" /> Unduh Invoice PDF
                            </a>
                            <p className="text-gray-500 text-xs mt-2">File disimpan di: {downloadUrl}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceGeneratorPage;
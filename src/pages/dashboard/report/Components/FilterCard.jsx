import React from 'react';
import { Search, Download, Loader } from 'lucide-react';

export default function FilterCard({ state, handlers, isDataReady }) {
    const { startDate, endDate, loading, today } = state;
    const { setStartDate, setEndDate, fetchReports, handleExport } = handlers;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm print:hidden">
            <div className="flex flex-col md:flex-row items-end gap-3">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dari Tanggal</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        max={endDate}
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sampai Tanggal</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        min={startDate}
                        max={today}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={fetchReports}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
                    >
                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Lihat Laporan
                    </button>
                </div>
            </div>
            
            {/* Export & Print */}
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                <button
                    onClick={() => window.print()}
                    disabled={loading || !isDataReady}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 disabled:opacity-50 print-button"
                >
                    Cetak (Print)
                </button>
                <button
                    onClick={handleExport}
                    disabled={loading || !isDataReady}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 disabled:opacity-50 export-button"
                >
                    <Download className="h-4 w-4" /> Export Excel
                </button>
            </div>
        </div>
    );
}
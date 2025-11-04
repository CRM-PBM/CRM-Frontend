import React from 'react';
import { Download } from 'lucide-react';

export default function ActionButtons({ loading, isDataReady, handleExport }) {
    return (
        <div className="flex justify-end gap-2 mb-3 print:hidden">
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
    );
}
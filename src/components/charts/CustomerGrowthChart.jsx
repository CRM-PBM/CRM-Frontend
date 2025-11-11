import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2'; 
import {
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
} from 'chart.js';
import { pelangganService } from '../../services/pelangganService'; 
import { Calendar, Loader } from 'lucide-react'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, 
  Title,
  Tooltip,
  Legend
);

const PERIOD_OPTIONS = [ 
    { label: 'Per Hari', value: 'day' },
    { label: 'Per Minggu', value: 'week' },
    { label: 'Per Bulan', value: 'month' },
    { label: 'Per Tahun', value: 'year' },
];

const formatPeriodLabel = (period, periodType) => { 
    if (typeof period !== 'string') return period; 
    
    if (periodType === 'day') {
        const date = new Date(period);
        return `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })}`;
    }
    if (periodType === 'month') {
        return new Date(`${period}-01`).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
    }
    if (periodType === 'year') return period;
    if (periodType === 'week') {
        const weekNumber = period.slice(period.indexOf('-') + 1); 
        return `Minggu ${weekNumber}`; 
    }
    return period;
};

export default function PelangganGrowthChart() {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('day'); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await pelangganService.getPelangganGrowthData(period); 
                setChartData(response);
                setError(null);
            } catch (err) {
                console.error("Gagal mengambil data pelanggan growth:", err);
                // Menampilkan pesan error 
                setError("Gagal memuat data grafik. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period]); 

    const data = useMemo(() => ({
        labels: chartData.map(d => formatPeriodLabel(d.period, period)), 
        datasets: [
            {
                label: 'Total Pelanggan Baru', 
                data: chartData.map(d => d.new_customers),
                backgroundColor: 'rgba(75, 192, 192, 0.8)', // Biru muda
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            },
            {
                label: 'Total Pelanggan Aktif', 
                data: chartData.map(d => d.cumulative_customers), 
                backgroundColor: 'rgba(4, 120, 87, 0.8)', // Hijau Tua (emerald-700)
                borderColor: 'rgb(4, 120, 87)',
                borderWidth: 1
            },
        ],
    }), [chartData, period]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { 
                display: true, 
                text: `Pertumbuhan Pelanggan (${PERIOD_OPTIONS.find(o => o.value === period)?.label || period})` 
            },
        },
        scales: {
            x: {
                stacked: false,
                title: { display: true, text: PERIOD_OPTIONS.find(o => o.value === period)?.label || 'Periode' },
            },
            y: {
                stacked: false,
                beginAtZero: true,
                title: { display: true, text: 'Jumlah Pelanggan' },
            }
        },
    };

    if (loading) {
        return <div className="p-8 text-center">
                    <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Memuat data grafik...</p>
                </div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-xl font-semibold text-slate-700">📈 Grafik Pertumbuhan Pelanggan</h2>
                <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-500 h-5 w-5" />
                    <select 
                        value={period} 
                        onChange={(e) => setPeriod(e.target.value)} 
                        className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-sky-500 focus:border-sky-500 cursor-pointer"
                    >
                        {PERIOD_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            {/* Div ini memiliki tinggi tetap 350px */}
            <div style={{ height: '350px' }}>
                {chartData.length > 0 ? (
                    <Bar options={options} data={data} />
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        Tidak ada data pertumbuhan pelanggan pada periode ini.
                    </div>
                )}
            </div>
        </div>
    );
}
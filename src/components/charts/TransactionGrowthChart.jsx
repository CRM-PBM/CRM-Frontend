import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'; // Import Line Chart
import { transaksiService } from '../../services/transaksiService'; 
import { Calendar, Loader } from 'lucide-react'; 

ChartJS.register (
    CategoryScale, 
    LinearScale, 
    PointElement,  
    LineElement,  
    Title, 
    Tooltip, 
    Filler,
    Legend
);

const PERIOD_OPTIONS = [ 
    { label: 'Per Hari', value: 'day' },
    { label: 'Per Minggu', value: 'week' },
    { label: 'Per Bulan', value: 'month' },
    { label: 'Per Tahun', value: 'year' },
];

const formatPeriodLabel = (period, periodType) => { 
    if (typeof period !== 'string') return period || ''; 
    
    if (periodType === 'day') {
        const date = new Date(period);
        if (isNaN(date)) return period; 
        return `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })}`;
    }
    if (periodType === 'month') {
        return new Date(`${period}-01`).toLocaleString('id-ID', { month: 'short', year: 'numeric' });
    }
    if (periodType === 'year') return period;
    if (periodType === 'week') {
        const hyphenIndex = period.indexOf('-');
        if (hyphenIndex === -1) return period;
        const weekNumber = period.slice(hyphenIndex + 1); 
        return `Minggu ${weekNumber}`; 
    }
    return period;
};

export default function TransactionGrowthChart() {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('day'); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await transaksiService.getTransaksiGrowthData(period); 
                setChartData(response);
                setError(null);
            } catch (err) {
                console.error("Gagal mengambil data transaksi growth:", err);
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
                label: 'Transaksi Baru', 
                data: chartData.map(d => d.new_transactions), 
                borderColor: 'rgb(255, 159, 64)', // Orange Line
                backgroundColor: 'rgba(255, 159, 64, 0.5)', 
                fill: false,
                tension: 0.4,
                pointRadius: 5
            },
            {
                label: 'Total Transaksi', 
                data: chartData.map(d => d.cumulative_transactions), 
                borderColor: 'rgb(54, 162, 235)', // Blue Line
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true, // Area di bawah garis diisi (optional)
                tension: 0.4,
                pointRadius: 5
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
                text: `Pertumbuhan Transaksi (${PERIOD_OPTIONS.find(o => o.value === period)?.label || period})` 
            },
        },
        scales: {
            x: {
                title: { display: true, text: PERIOD_OPTIONS.find(o => o.value === period)?.label || 'Periode' },
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Jumlah Transaksi' },
                ticks: {
                    callback: function(value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    }
                }
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
                <h5 className="text-xl font-semibold text-slate-700">Grafik Pertumbuhan Transaksi</h5>
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
            
            <div style={{ height: '350px' }}>
                {chartData.length > 0 ? (
                    // DIGANTI DARI <Bar> MENJADI <Line>
                    <Line options={options} data={data} />
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        Tidak ada data pertumbuhan transaksi pada periode ini.
                    </div>
                )}
            </div>
        </div>
    );
}
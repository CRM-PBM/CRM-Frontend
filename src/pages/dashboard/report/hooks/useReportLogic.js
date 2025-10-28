import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

// Perhatikan: Path laporanService disesuaikan dari hooks/ ke services/
import laporanService from '../../../../services/laporanService';
// Perhatikan: Path formatters disesuaikan dari hooks/ ke utils/
import { formatDate, formatDateTime, formatRangeDate, formatMonthPeriod } from '../../../../utils/formatters'; 

export default function useReportLogic() {
    
    // --- State Tanggal & Laporan ---
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(thirtyDaysAgo);
    const [endDate, setEndDate] = useState(today);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('sales'); 
    
    const [salesReportData, setSalesReportData] = useState(null); 
    const [salesTransactionList, setSalesTransactionList] = useState([]); 
    const [customerReportData, setCustomerReportData] = useState([]); 

    // --- Computed Values (useMemo) ---
    const getDynamicUmkmName = () => {
        try {
            const umkmDataString = localStorage.getItem('umkmData'); 
            if (umkmDataString) {
                const umkmData = JSON.parse(umkmDataString);
                return umkmData.nama_umkm || 'Nama UMKM Tidak Ditemukan';
            }
        } catch (error) {
            console.error("Gagal membaca umkmData dari localStorage", error);
        }
        return 'Nama UMKM Default'; 
    };

    const dynamicUmkmName = useMemo(getDynamicUmkmName, []); 
    const periodDisplay = formatMonthPeriod(startDate, endDate);
    const rangeDateDisplay = formatRangeDate(startDate, endDate);
    const isDataReady = useMemo(() => 
        (activeTab === 'sales' && salesTransactionList.length > 0) || 
        (activeTab === 'customer' && customerReportData.length > 0)
    , [activeTab, salesTransactionList.length, customerReportData.length]);

    // --- Fetch Logic ---
    const fetchReports = async () => {
        setLoading(true);
        try {
            if (activeTab === 'sales') {
                const salesResponse = await laporanService.getSalesReports({ startDate, endDate }); 
                if (salesResponse.success && salesResponse.data) {
                    setSalesReportData(salesResponse.data.summary);
                    setSalesTransactionList(salesResponse.data.detail || []);
                    toast.success('Laporan Penjualan dimuat');
                } else {
                    setSalesReportData(null);
                    setSalesTransactionList([]);
                    toast.warn(salesResponse.message || 'Gagal memuat data penjualan.');
                }
            } else if (activeTab === 'customer') {
                const customerResponse = await laporanService.getCustomerReport({ startDate, endDate }); 
                if (customerResponse.success) {
                    setCustomerReportData(customerResponse.data || []); 
                    toast.success('Laporan Pelanggan dimuat');
                } else {
                    setCustomerReportData([]);
                    toast.warn(customerResponse.message || 'Gagal memuat data pelanggan.');
                }
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            toast.error('Gagal memuat data laporan');
            setSalesReportData(null);
            setSalesTransactionList([]);
            setCustomerReportData([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]); 

    // --- Export Logic ---
    const exportToExcelWithHeader = (dataRows, reportType, tableHeaders) => {
        const fileName = reportType === 'sales' ? 'Penjualan_Bulanan' : 'Pelanggan_Bulanan';
        const reportTitle = reportType === 'sales' ? 'LAPORAN PENJUALAN BULANAN' : 'LAPORAN PELANGGAN BULANAN';

        if (dataRows.length === 0) {
            toast.warn('Tidak ada data untuk dieksport.');
            return;
        }
        
        const headerTitle = [
            [dynamicUmkmName], 
            [reportTitle], 
            [periodDisplay], 
            [], 
        ];

        const rangeDateRow = [];
        const lastColIndex = tableHeaders.length > 0 ? tableHeaders.length - 1 : 0; 
        rangeDateRow[lastColIndex] = rangeDateDisplay; 
        
        const finalData = [
            ...headerTitle,
            rangeDateRow, 
            tableHeaders, 
            ...dataRows
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(finalData); 
        
        const wsRangeRef = XLSX.utils.decode_range(ws['!ref'] || "A1:A1");
        const maxColIndex = wsRangeRef.e.c;
        
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: maxColIndex } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: maxColIndex } },
            { s: { r: 2, c: 0 }, e: { r: 2, c: maxColIndex } },
        ];
        
        for(let r = 0; r <= 2; r++) {
            const cellRef = XLSX.utils.encode_cell({ r, c: 0 });
            if(ws[cellRef]) {
                ws[cellRef].s = { alignment: { horizontal: 'center' }, font: { bold: true, sz: 14 } };
            }
        }

        const rangeDateCellRef = XLSX.utils.encode_cell({ r: 4, c: maxColIndex });
        if(ws[rangeDateCellRef]) {
             ws[rangeDateCellRef].s = { alignment: { horizontal: 'right' } };
        }
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, fileName.split('_')[0]);
        XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success(`Berhasil mengexport ${fileName}.xlsx`);
    };

    const handleExport = () => {
        if (activeTab === 'sales') {
            const tableHeaders = [
                'No', 'Tgl Transaksi', 'Kode Transaksi', 'Pelanggan', 'Metode Pembayaran', 'Total Penjualan', 'Total HPP', 'Laba Kotor'
            ];
            const dataRows = salesTransactionList.map((t, index) => [
                index + 1, formatDateTime(t.tanggal_transaksi), t.kode_transaksi || `ID#${t.transaksi_id}`, t.Pelanggan?.nama || 'Umum',
                t.metode_pembayaran, parseFloat(t.total) || 0, parseFloat(t.hpp) || 0, (parseFloat(t.total) || 0) - (parseFloat(t.hpp) || 0), 
            ]);
            exportToExcelWithHeader(dataRows, 'sales', tableHeaders);
        } else if (activeTab === 'customer') {
            const tableHeaders = [
                'No', 'Nama Pelanggan', 'Telepon', 'Tgl Registrasi', 'Jumlah Transaksi', 'Total Pembelian (LTV)'
            ];
            const dataRows = customerReportData.map((c, index) => [
                index + 1, c.nama, c.telepon || '-', formatDate(c.created_at), 
                c.jumlah_transaksi || 0, parseFloat(c.total_pembelian) || 0, 
            ]);
            exportToExcelWithHeader(dataRows, 'customer', tableHeaders);
        }
    };

    // --- Return Value ---
    return {
        state: {
            startDate, endDate, loading, activeTab, 
            salesReportData, salesTransactionList, customerReportData, today
        },
        handlers: {
            setStartDate, setEndDate, setActiveTab, fetchReports, handleExport
        },
        computed: {
            dynamicUmkmName, periodDisplay, rangeDateDisplay, isDataReady
        }
    };
}
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

import laporanService from '../../../../services/laporanService'; 
import { formatDate, formatDateTime, formatRangeDate, formatMonthPeriod } from '../../../../utils/formatters'; 

export default function useReportLogic() {
    
    // --- State Tanggal & Laporan ---
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(thirtyDaysAgo);
    const [endDate, setEndDate] = useState(today);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('transaction'); 
    
    const [transactionReportData, setTransactionReportData] = useState(null); 
    const [TransactionList, setTransactionList] = useState([]); 
    const [customerReportData, setCustomerReportData] = useState([]); 

    // --- State BARU untuk Filter & Sort ---
    const [filter, setFilter] = useState({
        transaction: {
            searchTerm: '', 
            sortBy: 'tanggal_transaksi', 
            sortDirection: 'desc',
            filterField: 'none' 
        },
        customer: {
            searchTerm: '',
            sortBy: 'total_pembelian', // Default pelanggan terbaik
            sortDirection: 'desc',
            filterField: 'none' 
        }
    });

    // --- Computed Values ---
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
    
    // --- FUNGSI BARU: Filter dan Sort Data (Client-Side) ---
    const getFilteredAndSortedData = (dataList, reportType) => {
        const currentFilter = filter[reportType];
        
        // 1. Filtering Logic
        let filteredData = dataList;
        const searchTerm = currentFilter.searchTerm.toLowerCase();

        if (searchTerm) {
            filteredData = dataList.filter(item => {
                
                if (reportType === 'transaction') {
                    const pelangganNama = item.Pelanggan?.nama?.toLowerCase() || 'umum';
                    const kode = item.kode_transaksi?.toLowerCase() || '';
                    const metode = item.metode_pembayaran?.toLowerCase() || '';

                    return pelangganNama.includes(searchTerm) || kode.includes(searchTerm) || metode.includes(searchTerm);
                }

                if (reportType === 'customer') {
                    const nama = item.nama?.toLowerCase() || '';
                    const telepon = item.telepon?.toLowerCase() || '';
                    const email = item.email?.toLowerCase() || '';
                    const level = item.level?.toLowerCase() || '';
                    const gender = item.gender?.toLowerCase() || '';
                    const kodePelanggan = item.Kode_pelanggan?.toLowerCase() || '';
                    const alamat = item.alamat?.toLowerCase() || '';
                    
                    return ( 
                        nama.includes(searchTerm) || 
                        telepon.includes(searchTerm) || 
                        email.includes(searchTerm) || 
                        level.includes(searchTerm) || 
                        gender.includes(searchTerm) || 
                        kodePelanggan.includes(searchTerm) || 
                        alamat.includes(searchTerm)
                    );
                }
                return true;
            });
        }


        // 2. Sorting Logic
        filteredData.sort((a, b) => {
            let aValue, bValue;
            
            if (reportType === 'transaction') {
                if (currentFilter.sortBy === 'tanggal_transaksi') {
                    aValue = new Date(a.tanggal_transaksi).getTime();
                    bValue = new Date(b.tanggal_transaksi).getTime();
                } else if (currentFilter.sortBy === 'total') {
                    aValue = parseFloat(a.total) || 0;
                    bValue = parseFloat(b.total) || 0;
                } else if (currentFilter.sortBy === 'kode_transaksi') {
                    aValue = a.kode_transaksi || `ID#${a.transaksi_id}`;
                    bValue = b.kode_transaksi || `ID#${b.transaksi_id}`;
                }
            } else if (reportType === 'customer') {
                if (currentFilter.sortBy === 'nama') {
                    aValue = a.nama || '';
                    bValue = b.nama || '';
                } else if (currentFilter.sortBy === 'jumlah_transaksi') {
                    aValue = a.jumlah_transaksi || 0;
                    bValue = b.jumlah_transaksi || 0;
                } else if (currentFilter.sortBy === 'total_pembelian') {
                    aValue = parseFloat(a.total_pembelian) || 0;
                    bValue = parseFloat(b.total_pembelian) || 0;
                } 
            }

            // Lakukan perbandingan
            if (typeof aValue === 'string') {
                const comparison = aValue.localeCompare(bValue);
                return currentFilter.sortDirection === 'asc' ? comparison : -comparison;
            } else { // Angka atau Tanggal
                const comparison = aValue - bValue;
                return currentFilter.sortDirection === 'asc' ? comparison : -comparison;
            }
        });

        return filteredData;
    };
    
    // --- Computed List Data (Menggunakan useMemo untuk efisiensi) ---
    const processedTransactionList = useMemo(() => 
        getFilteredAndSortedData(TransactionList, 'transaction')
    , [TransactionList, filter.transaction]);

    const processedCustomerList = useMemo(() => 
        getFilteredAndSortedData(customerReportData, 'customer')
    , [customerReportData, filter.customer]);

    const isDataReady = useMemo(() => 
        (activeTab === 'transaction' && processedTransactionList.length > 0) || 
        (activeTab === 'customer' && processedCustomerList.length > 0)
    , [activeTab, processedTransactionList.length, processedCustomerList.length]);

    // --- Fetch Logic (Sama seperti sebelumnya) ---
    const fetchReports = async () => {
        setLoading(true);
        // ... (Logic fetch Reports sama seperti sebelumnya) ...
        try {
            if (activeTab === 'transaction') {
                const transactionResponse = await laporanService.getTransactionReports({ startDate, endDate }); 
                if (transactionResponse.success && transactionResponse.data) {
                    setTransactionReportData(transactionResponse.data.summary);
                    setTransactionList(transactionResponse.data.detail || []);
                    toast.success('Laporan Transaksi dimuat');
                } else {
                    setTransactionReportData(null);
                    setTransactionList([]);
                    toast.warn(transactionResponse.message || 'Gagal memuat data transaksi.');
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
            setTransactionReportData(null);
            setTransactionList([]);
            setCustomerReportData([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]); 

    // --- Export Logic (Menggunakan data yang sudah difilter/disortir dan kolom baru) ---
    const exportToExcelWithHeader = (dataRows, reportType, tableHeaders) => {
        const fileName = reportType === 'transaction' ? 'Transaksi_Bulanan' : 'Pelanggan_Bulanan';
        const reportTitle = reportType === 'transaction' ? 'LAPORAN TRANSAKSI BULANAN' : 'LAPORAN PELANGGAN BULANAN';

        if (dataRows.length === 0) {
            toast.warn('Tidak ada data untuk dieksport.');
            return;
        }
        
        // ... (Header creation logic sama seperti sebelumnya) ...
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
        if (activeTab === 'transaction') {
            // Header Baru: Menambahkan HPP dan Laba Kotor
            const tableHeaders = [
                'No', 'Tgl Transaksi', 'Kode Transaksi', 'Pelanggan', 'Metode Pembayaran', 
                'Total Transaksi'
            ];
            
            // Mapping Data: Menggunakan processedTransactionList dan menambahkan HPP/Laba Kotor
            const dataRows = processedTransactionList.map((t, index) => [
                index + 1, formatDateTime(t.tanggal_transaksi), t.kode_transaksi || `ID#${t.transaksi_id}`, t.Pelanggan?.nama || 'Umum', 
                t.metode_pembayaran, t.pelanggan?.level,
                parseFloat(t.total) || 0,  
            ]);
            exportToExcelWithHeader(dataRows, 'transaction', tableHeaders);

        } else if (activeTab === 'customer') {
            // Header Baru: Menambahkan Email, Alamat, Level
            const tableHeaders = [
                'No', 'Nama Pelanggan', 'Telepon', 'Email', 'Alamat', 'Level', 
                'Tgl Registrasi', 'Jumlah Transaksi', 'Total Pembelian (LTV)'
            ];
            
            // Mapping Data: Menggunakan processedCustomerList dan menambahkan kolom baru
            const dataRows = processedCustomerList.map((c, index) => [
                index + 1, c.nama, c.telepon || '-', c.email || '-', c.alamat || '-', c.level || '-', 
                formatDate(c.created_at), 
                c.jumlah_transaksi || 0, 
                parseFloat(c.total_pembelian) || 0, 
            ]);
            exportToExcelWithHeader(dataRows, 'customer', tableHeaders);
        }
    };

    // --- Return Value ---
    return {
        state: {
            startDate, endDate, loading, activeTab, 
            transactionReportData, customerReportData, today,
        },
        list: {
            transaction: processedTransactionList,
            customer: processedCustomerList
        },
        handlers: {
            setStartDate, setEndDate, setActiveTab, fetchReports, handleExport,
            setFilter
        },
        computed: {
            dynamicUmkmName, periodDisplay, rangeDateDisplay, isDataReady,
            filter
        }
    };
}
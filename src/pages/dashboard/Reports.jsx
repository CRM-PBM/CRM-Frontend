// --- src/pages/dashboard/Reports.jsx (Disesuaikan) ---

import React from 'react';
import { Loader, ShoppingCart, Users, FileText } from 'lucide-react';

// Import Logic dan Komponen dari folder report/
import useReportLogic from './report/hooks/useReportLogic';
import TabButton from './report/Components/TabButton';
import FilterCard from './report/Components/FilterCard';
// import ReportHeader from './report/Components/ReportHeader'; // Hapus impor ReportHeader dari sini

// Import komponen anak yang sudah ada di folder report/
import CustomerReports from './report/CustomerReports'; 
import TransactionReports from './report/TransactionReports';

export default function Reports() {
    
    // --- 1. Ambil semua logic dari Custom Hook, termasuk list yang sudah diproses ---
    const { 
        state, handlers, computed, list 
    } = useReportLogic();
    
    const { loading, activeTab, transactionReportData, customerReportData } = state;
    const { setActiveTab, handleExport, setFilter } = handlers;
    const { isDataReady, dynamicUmkmName, periodDisplay, rangeDateDisplay, filter } = computed;

    // Ambil list yang sudah difilter/disortir
    const processedTransactionList = list.transaction;
    const processedCustomerList = list.customer;

    // --- 2. Siapkan Data Header untuk Dioper ke Komponen Anak ---
    const reportHeaderData = {
        umkmName: dynamicUmkmName,
        periode: periodDisplay,
        rangeDate: rangeDateDisplay,
    };
    
    // --- 3. Tentukan Judul Laporan Dinamis ---
    const transactionReportTitle = 'LAPORAN PENJUALAN BULANAN';
    const customerReportTitle = 'LAPORAN PELANGGAN BULANAN';

    // --- 4. JSX RENDER ---
    return (
        <div className="space-y-6">

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 print:hidden">
                <TabButton 
                    label="Laporan Penjualan" 
                    icon={ShoppingCart} 
                    isActive={activeTab === 'transaction'} 
                    onClick={() => setActiveTab('transaction')} 
                />
                <TabButton 
                    label="Laporan Pelanggan" 
                    icon={Users} 
                    isActive={activeTab === 'customer'} 
                    onClick={() => setActiveTab('customer')} 
                />
            </div>

            {/* Filter Card */}
            <FilterCard 
                state={state} 
                handlers={handlers} 
            />

            {/* Loading State */}
            {loading && (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm">
                    <Loader className="h-8 w-8 animate-spin text-sky-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Memuat data laporan...</p>
                </div>
            )}
            
            {/* Laporan Content */}
            {!loading && (
                <div className="print-area">
                    {/* HAPUS ReportHeader DI SINI */}
                    {/* ReportHeader AKAN DIRENDER DI DALAM TransactionReports & CustomerReports */}

                    {/* Transaction Report */}
                    {activeTab === 'transaction' && (
                        <TransactionReports 
                            summary={transactionReportData} 
                            list={processedTransactionList} 
                            filterState={filter.transaction}
                            setFilter={setFilter}
                            handleExport={handleExport}
                            isDataReady={isDataReady}
                            loading={loading}
                            // PERUBAHAN UTAMA: Oper data header + title
                            reportHeaderData={{...reportHeaderData, reportTitle: transactionReportTitle}}
                        />
                    )}
                    
                    {/* Customer Report */}
                    {activeTab === 'customer' && (
                        <CustomerReports
                            summary={customerReportData}
                            list={processedCustomerList} 
                            filterState={filter.customer}
                            setFilter={setFilter}
                            handleExport={handleExport}
                            isDataReady={isDataReady}
                            loading={loading}
                            // PERUBAHAN UTAMA: Oper data header + title
                            reportHeaderData={{...reportHeaderData, reportTitle: customerReportTitle}}
                        />
                    )}
                </div>
            )}

            {/* No Data State */}
            {!loading && !isDataReady && (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium mb-1">Pilih rentang tanggal atau tab untuk melihat laporan.</p>
                </div>
            )}
        </div>
    );
}
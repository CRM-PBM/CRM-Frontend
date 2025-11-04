import React from 'react';
import { Loader, ShoppingCart, Users, FileText } from 'lucide-react';

// Import Logic dan Komponen dari folder report/
import useReportLogic from './report/hooks/useReportLogic';
import TabButton from './report/Components/TabButton';
import FilterCard from './report/Components/FilterCard';

import CustomerReports from './report/CustomerReports'; 
import TransactionReports from './report/TransactionReports';

export default function Reports() {
    
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
    
    const transactionReportTitle = 'LAPORAN TRANSAKSI BULANAN';
    const customerReportTitle = 'LAPORAN PELANGGAN BULANAN';

    return (
        <div className="space-y-6">

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 print:hidden">
                <TabButton 
                    label="Laporan Transaksi" 
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
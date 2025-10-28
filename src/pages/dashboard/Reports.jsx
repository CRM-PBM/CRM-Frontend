import React from 'react';
import { Loader, ShoppingCart, Users, FileText } from 'lucide-react';

// Import Logic dan Komponen dari folder report/
import useReportLogic from './report/hooks/useReportLogic';
import TabButton from './report/Components/TabButton';
import FilterCard from './report/Components/FilterCard';
import ReportHeader from './report/Components/ReportHeader';

// Import komponen anak yang sudah ada di folder report/
import SalesReports from './report/SalesReports'; 
import CustomerReports from './report/CustomerReports'; 

export default function Reports() {
    
    // --- 1. Ambil semua logic dari Custom Hook ---
    const { 
        state, handlers, computed 
    } = useReportLogic();
    
    const { loading, activeTab, salesReportData, salesTransactionList, customerReportData } = state;
    const { setActiveTab } = handlers;
    const { isDataReady, dynamicUmkmName, periodDisplay, rangeDateDisplay } = computed;


    // --- 2. JSX RENDER ---
    return (
        <div className="space-y-6">

            {/* Tab Navigation (Menggunakan TabButton) */}
            <div className="flex border-b border-slate-200 print:hidden">
                <TabButton 
                    label="Laporan Penjualan" 
                    icon={ShoppingCart} 
                    isActive={activeTab === 'sales'} 
                    onClick={() => setActiveTab('sales')} 
                />
                <TabButton 
                    label="Laporan Pelanggan" 
                    icon={Users} 
                    isActive={activeTab === 'customer'} 
                    onClick={() => setActiveTab('customer')} 
                />
            </div>

            {/* Filter Card (Menggunakan FilterCard) */}
            <FilterCard 
                state={state} 
                handlers={handlers} 
                isDataReady={isDataReady}
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
                    <ReportHeader 
                        umkmName={dynamicUmkmName}
                        reportTitle={activeTab === 'sales' ? 'LAPORAN PENJUALAN BULANAN' : 'LAPORAN PELANGGAN BULANAN'}
                        periode={periodDisplay}
                        rangeDate={rangeDateDisplay}
                    />

                    {activeTab === 'sales' && (
                        <SalesReports 
                            summary={salesReportData} 
                            list={salesTransactionList} 
                        />
                    )}
                    {activeTab === 'customer' && (
                        <CustomerReports 
                            list={customerReportData} 
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
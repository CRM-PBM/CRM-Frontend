import React from 'react';

// Komponen Header Khusus Print/Cetak
export default function ReportHeader({ umkmName, reportTitle, periode, rangeDate }) {
    return (
        <div className="report-print-header"> 
            <h1 className="umkm-name">{umkmName}</h1>
            <h2 className="report-title">{reportTitle}</h2>
            
            <div className="header-details">
                <p className="report-periode">{periode}</p>
                <p className="report-range-date">{rangeDate}</p>
            </div>
        </div>
    );
}
// 1. Fungsi formatCurrency 
export const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount) || 0; 

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(numericAmount);
};

// 2. Fungsi formatNumber 
export const formatNumber = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return '0';
    
    // Jika angka sangat besar, tampilkan dalam format K (Ribu) atau M (Juta)
    if (numValue >= 1000000) return `${(numValue / 1000000).toFixed(1)}Jt`;
    if (numValue >= 1000) return `${(numValue / 1000).toFixed(1)}Rb`;
    
    
    return new Intl.NumberFormat('id-ID').format(numValue);
};

// 3. Fungsi formatDate 
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
};

// 4. Fungsi formatDateTime 
export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return `${datePart}, ${timePart}`; 
};

// 5. Fungsi formatMonthPeriod 
export const formatMonthPeriod = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return 'Periode Tidak Valid';

    const start = new Date(startDateString);
    const end = new Date(endDateString);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Periode Tidak Valid';

    const startMonth = start.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const endMonth = end.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    if (startMonth === endMonth) {
        return `Periode Bulan ${startMonth}`;
    } 
    else {
        return `Periode ${startMonth} s/d ${endMonth}`;
    }
};

// 6. Fungsi formatRangeDate 
export const formatRangeDate = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return '-';

    const start = new Date(startDateString);
    const end = new Date(endDateString);
    
    const startPart = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
    const endPart = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return `${startPart} - ${endPart}`;
};

// 7. Fungsi Tanggal + Jam
export const formatTimeStamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp);
        if (isNaN(date)) return 'Invalid Date';

        const options = { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        };
        return date.toLocaleDateString('id-ID', options);
    } catch (error) {
        console.error("Error formatting timestamp:", error);
    }
};
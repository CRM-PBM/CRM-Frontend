export const formatCurrency = (amount) => {
    // Memastikan input adalah angka atau 0 jika null/undefined
    const numericAmount = parseFloat(amount) || 0; 

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(numericAmount);
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    // Gabungkan tanggal dan waktu untuk tampilan yang lebih informatif
    const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return `${datePart}, ${timePart}`; 
};

export const formatMonthPeriod = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return 'Periode Tidak Valid';

    const start = new Date(startDateString);
    const end = new Date(endDateString);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Periode Tidak Valid';

    const startMonth = start.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const endMonth = end.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    // Jika bulan dan tahun sama
    if (startMonth === endMonth) {
        return `Periode Bulan ${startMonth}`;
    } 
    // Jika rentang lebih dari satu bulan
    else {
        return `Periode ${startMonth} s/d ${endMonth}`;
    }
};

export const formatRangeDate = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return '-';

    const start = new Date(startDateString);
    const end = new Date(endDateString);
    
    // Format tanggal: 01 Oktober - 31 Oktober 2025
    const startPart = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
    const endPart = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    return `${startPart} - ${endPart}`;
};
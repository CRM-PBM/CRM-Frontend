import api from './authService'

const LaporanService = {
    getSalesReports: async (params = {}) => {
        try {
            const response = await api.get('/laporan/penjualan', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching sales report:', error);
            throw error;
        }
    },

    getCustomerReport: async (params = {}) => {
        try {
            const response = await api.get('/laporan/pelanggan', { params }); 
            return response.data;
        } catch (error) {
            console.error('Error fetching customer report:', error);
            throw error;
        }
    },
};

export default LaporanService;
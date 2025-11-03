import api from './authService'

const LaporanService = {
    getTransactionReports: async (params = {}) => {
        try {
            const response = await api.get('/laporan/transaksi', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching transaction report:', error);
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
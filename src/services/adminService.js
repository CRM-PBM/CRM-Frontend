import api from './authService'

const adminService = {
    // [GET] /api/admin/umkm
    getAllUmkm: async () => {
        const response = await api.get('/admin/umkm');
        return response.data.data;
    },

    // [PUT] /api/admin/umkm/verify/:umkmId
    verifyUmkm: async (umkmId) => {
        const response = await api.put(`/admin/umkm/verify/${umkmId}`);
        return response.data;
    },

    // [PUT] /api/admin/umkm/suspend/:umkmId
    suspendUmkm: async (umkmId) => {
        const response = await api.put(`/admin/umkm/suspend/${umkmId}`);
        return response.data;
    },

    // [GET] /api/admin/stats/global
    getGlobalStats: async () => {
        const response = await api.get('/admin/stats/global');
        return response.data.data;
    },

    // [GET] /api/admin/stats/umkm-growth?period=day/week/month/year
    getUmkmGrowthData: async (period = 'month') => {
        const response = await api.get(`/admin/stats/umkm-growth?period=${period}`);
        return response.data.data;
    },
};

export default adminService;
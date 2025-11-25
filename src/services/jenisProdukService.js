import api from './authService'


export const jenisProdukService = {
    // --- JENIS PRODUK ---
    getAllJenis: () => api.get('/jenis'),
    createJenis: (data) => api.post('/jenis', data),
    updateJenis: (id, data) => api.put(`/jenis/${id}`, data),
    deleteJenis: (id) => api.delete(`/jenis/${id}`),
    getStatistikJenis: () => api.get('/jenis/statistik/jenis-produk'),
};

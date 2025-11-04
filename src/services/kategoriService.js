import api from './authService'


export const kategoriService = {
  // --- KATEGORI PRODUK ---
    getAllKategori: () => api.get('/kategori'),
    createKategori: (data) => api.post('/kategori', data),
    updateKategori: (id, data) => api.put(`/kategori/${id}`, data),
    deleteKategori: (id) => api.delete(`/kategori/${id}`),
};

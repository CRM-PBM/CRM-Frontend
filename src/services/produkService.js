import api from './authService'

const BASE_URL = '/produk'

export const produkService = {
  // Get all products with pagination and filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...params
    })
    const response = await api.get(`${BASE_URL}?${queryParams}`)
    return response.data
  },

  // Get single product by ID
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`)
    return response.data
  },

  // Create new product
  create: async (data) => {
    const response = await api.post(BASE_URL, data)
    return response.data
  },

  // Update product
  update: async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}`, data)
    return response.data
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}`)
    return response.data
  },

  // Toggle product active status
  toggleActive: async (id) => { 
        return api.patch(`/produk/${id}/toggle-active`); 
  },

  // Update stock
  updateStock: async (id, stok) => {
    const response = await api.patch(`${BASE_URL}/${id}/stock`, { stok })
    return response.data
  },

  // Get types product
  getJenisProduk: async () => {
      const response = await api.get('/produk/jenis'); 
      return response.data;
  },

  // Get product statistics
  getStatistics: async () => {
    const response = await api.get(`${BASE_URL}/statistik`)
    return response.data
  }
}

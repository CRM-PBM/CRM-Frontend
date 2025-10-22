import api from './authService'

const PELANGGAN_URL = '/pelanggan'

export const pelangganService = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)

    const url = queryParams.toString() ? `${PELANGGAN_URL}?${queryParams}` : PELANGGAN_URL
    const response = await api.get(url)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`${PELANGGAN_URL}/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post(PELANGGAN_URL, data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`${PELANGGAN_URL}/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`${PELANGGAN_URL}/${id}`)
    return response.data
  },

  // 🧠 pastikan endpoint-nya sesuai backend-mu: /api/pelanggan/statistik
  getStatistik: async () => {
    const response = await api.get(`${PELANGGAN_URL}/statistik`)
    // kadang backend return { data: {...} } bukan langsung object
    return response.data.data || response.data
  }
}

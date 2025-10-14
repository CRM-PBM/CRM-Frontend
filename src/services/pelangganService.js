import api from './authService'

const PELANGGAN_URL = '/pelanggan'

export const pelangganService = {
  // Get all pelanggan
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.search) queryParams.append('search', params.search)
    
    const url = queryParams.toString() ? `${PELANGGAN_URL}?${queryParams}` : PELANGGAN_URL
    const response = await api.get(url)
    return response.data
  },

  // Get pelanggan by id
  getById: async (id) => {
    const response = await api.get(`${PELANGGAN_URL}/${id}`)
    return response.data
  },

  // Create new pelanggan
  create: async (data) => {
    const response = await api.post(PELANGGAN_URL, data)
    return response.data
  },

  // Update pelanggan
  update: async (id, data) => {
    const response = await api.put(`${PELANGGAN_URL}/${id}`, data)
    return response.data
  },

  // Delete pelanggan
  delete: async (id) => {
    const response = await api.delete(`${PELANGGAN_URL}/${id}`)
    return response.data
  }
}

export default pelangganService

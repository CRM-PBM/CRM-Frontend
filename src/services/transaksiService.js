import { api } from './authService'

export const transaksiService = { 
    // Get all transactions with pagination
    getAll: async (params = {}) => {
        try {
            const response = await api.get('/transaksi', { params })
            return response.data
        } catch (error) {
            console.error('Error fetching transaksi:', error)
            throw error
        }
    },

    // Get transaction by ID (with detail items)
    getById: async (id) => {
        try {
            const response = await api.get(`/transaksi/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching transaksi by ID:', error)
            throw error
        }
    },

    // Create new transaction
    create: async (data) => {
        try {
            const response = await api.post('/transaksi', data)
            return response.data
        } catch (error) {
            console.error('Error creating transaksi:', error)
            throw error
        }
    },

    // Update transaction
    update: async (id, data) => {
        try {
            const response = await api.put(`/transaksi/${id}`, data)
            return response.data
        } catch (error) {
            console.error('Error updating transaksi:', error)
            throw error
        }
    },

    // Delete transaction
    delete: async (id) => {
        try {
            const response = await api.delete(`/transaksi/${id}`)
            return response.data
        } catch (error) {
            console.error('Error deleting transaksi:', error)
            throw error
        }
    },

    // Get transaction statistics
    getStatistics: async () => {
        try {
            const response = await api.get('/transaksi/statistik')
            return response.data
        } catch (error) {
            console.error('Error fetching transaksi statistics:', error)
            throw error
        }
    }
}
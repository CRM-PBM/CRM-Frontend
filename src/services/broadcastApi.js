import api from './authService'

// Device Status
export async function checkDeviceStatus() {
  try {
    const response = await api.get('/broadcast/device/status')
    return response.data
  } catch (error) {
    // If endpoint returns 404, backend tidak implement properly
    if (error.response?.status === 404) {
      console.warn('⚠️ Backend /broadcast/device/status endpoint not implemented yet')
      // Return mock data for development
      return {
        data: {
          connected: true,  // Default ke true untuk development
          device_name: 'WhatsApp Web',
          status: 'Connected'
        }
      }
    }
    console.error('Device status check error:', error)
    throw error
  }
}

// Get All Broadcasts
export async function getAllBroadcasts(page = 1, limit = 10, status = null) {
  try {
    let url = `/broadcast?page=${page}&limit=${limit}`
    if (status) url += `&status=${status}`

    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Get broadcasts error:', error)
    throw error
  }
}

// Get Broadcast by ID
export async function getBroadcastById(broadcastId) {
  try {
    const response = await api.get(`/broadcast/${broadcastId}`)
    return response.data
  } catch (error) {
    console.error('Get broadcast by ID error:', error)
    throw error
  }
}

// Create Broadcast (Draft)
export async function createBroadcast(data) {
  try {
    const response = await api.post('/broadcast', data)
    return response.data
  } catch (error) {
    console.error('Create broadcast error:', error)
    throw error
  }
}

// Send Broadcast
export async function sendBroadcast(broadcastId) {
  try {
    const response = await api.post(`/broadcast/${broadcastId}/send`)
    return response.data
  } catch (error) {
    console.error('Send broadcast error:', error)
    throw error
  }
}

// Send Broadcast with Number Key
export async function sendBroadcastWithNumberKey(broadcastId, numberKey) {
  try {
    const response = await api.post(`/broadcast/${broadcastId}/send`, {
      wa_number_key: numberKey
    })
    return response.data
  } catch (error) {
    console.error('Send broadcast with number key error:', error)
    throw error
  }
}

// Delete Broadcast
export async function deleteBroadcast(broadcastId) {
  try {
    const response = await api.delete(`/broadcast/${broadcastId}`)
    return response.data
  } catch (error) {
    console.error('Delete broadcast error:', error)
    throw error
  }
}

// Get Broadcast Statistics
export async function getBroadcastStatistics() {
  try {
    const response = await api.get('/broadcast/statistik')
    return response.data
  } catch (error) {
    console.error('Get statistics error:', error)
    throw error
  }
}

// Get Pelanggan (untuk pilih penerima)
export async function getPelanggan(limit = 100) {
  try {
    const response = await api.get(`/pelanggan?limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Get pelanggan error:', error)
    throw error
  }
}

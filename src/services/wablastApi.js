import api from './authService'

// 1. Set WhatsApp Number Key
export async function setNumberKey(waNumberKey) {
  try {
    const response = await api.post('/watzap/number-key', {
      wa_number_key: waNumberKey
    })
    return response.data
  } catch (error) {
    // If endpoint not found, show helpful message
    if (error.response?.status === 404) {
      console.warn('⚠️ Backend /watzap/number-key endpoint not implemented yet')
      return {
        success: false,
        message: 'Backend endpoint belum diimplementasikan. Hubungi admin backend untuk menambahkan endpoint /api/watzap/number-key'
      }
    }
    console.error('Set number key error:', error)
    throw error
  }
}

// 2. Get WhatsApp Number Key
export async function getNumberKey() {
  try {
    const response = await api.get('/watzap/number-key')
    return response.data
  } catch (error) {
    // Silently return empty if endpoint not available (backend not implemented yet)
    if (error.response?.status === 404) {
      console.warn('⚠️ Backend /watzap/number-key endpoint not implemented yet')
      return { data: { wa_number_key: '' } }
    }
    console.error('Get number key error:', error)
    throw error
  }
}

// 3. Send Broadcast with Number Key
export async function sendBroadcastWithKey(broadcastId) {
  try {
    const response = await api.post(`/broadcast/${broadcastId}/send`)
    return response.data
  } catch (error) {
    console.error('Send broadcast with key error:', error)
    throw error
  }
}

// Get Device Status (untuk check koneksi WhatsApp)
export async function checkWAStatus() {
  try {
    const response = await api.get('/watzap/status')
    return response.data
  } catch (error) {
    console.error('Check WA status error:', error)
    throw error
  }
}

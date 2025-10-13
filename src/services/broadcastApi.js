const BASE_URL = 'http://localhost:3000/api'

// Device Status
export async function checkDeviceStatus() {
  try {
    const response = await fetch(`${BASE_URL}/broadcast/device/status`)
    if (!response.ok) throw new Error('Failed to check device status')
    return await response.json()
  } catch (error) {
    console.error('Device status check error:', error)
    throw error
  }
}

// Get All Broadcasts
export async function getAllBroadcasts(page = 1, limit = 10, status = null) {
  try {
    let url = `${BASE_URL}/broadcast?page=${page}&limit=${limit}`
    if (status) url += `&status=${status}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch broadcasts')
    return await response.json()
  } catch (error) {
    console.error('Get broadcasts error:', error)
    throw error
  }
}

// Get Broadcast by ID
export async function getBroadcastById(broadcastId) {
  try {
    const response = await fetch(`${BASE_URL}/broadcast/${broadcastId}`)
    if (!response.ok) throw new Error('Failed to fetch broadcast')
    return await response.json()
  } catch (error) {
    console.error('Get broadcast by ID error:', error)
    throw error
  }
}

// Create Broadcast (Draft)
export async function createBroadcast(data) {
  try {
    const response = await fetch(`${BASE_URL}/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create broadcast')
    return await response.json()
  } catch (error) {
    console.error('Create broadcast error:', error)
    throw error
  }
}

// Send Broadcast
export async function sendBroadcast(broadcastId) {
  try {
    const response = await fetch(`${BASE_URL}/broadcast/${broadcastId}/send`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to send broadcast')
    return await response.json()
  } catch (error) {
    console.error('Send broadcast error:', error)
    throw error
  }
}

// Delete Broadcast
export async function deleteBroadcast(broadcastId) {
  try {
    const response = await fetch(`${BASE_URL}/broadcast/${broadcastId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete broadcast')
    return await response.json()
  } catch (error) {
    console.error('Delete broadcast error:', error)
    throw error
  }
}

// Get Broadcast Statistics
export async function getBroadcastStatistics() {
  try {
    const response = await fetch(`${BASE_URL}/broadcast/statistik`)
    if (!response.ok) throw new Error('Failed to fetch statistics')
    return await response.json()
  } catch (error) {
    console.error('Get statistics error:', error)
    throw error
  }
}

// Get Pelanggan (untuk pilih penerima)
export async function getPelanggan(limit = 100) {
  try {
    const response = await fetch(`${BASE_URL}/pelanggan?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch pelanggan')
    return await response.json()
  } catch (error) {
    console.error('Get pelanggan error:', error)
    throw error
  }
}

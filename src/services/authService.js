import axios from 'axios'
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './storage'

const API_BASE_URL = 'http://localhost:3000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    console.log('Token exists:', !!token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Authorization header set')
    } else {
      console.log('No token found in storage')
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    console.error('API Error:', error.response?.status, error.response?.data || error.message)
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      
      if (!refreshToken) {
        console.log('No refresh token available - redirecting to login')
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        console.log('Attempting to refresh token...')
        // Call refresh endpoint with refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        })
        
        const { accessToken } = response.data
        
        if (accessToken) {
          console.log('Token refreshed successfully')
          setAccessToken(accessToken)
          
          // Update the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          
          // Process all queued requests
          processQueue(null, accessToken)
          
          isRefreshing = false
          
          // Retry the original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        processQueue(refreshError, null)
        isRefreshing = false
        
        // Clear tokens and redirect to login
        clearTokens()
        window.location.href = '/login'
        
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      clearTokens()
      return response.data
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      clearTokens()
      throw error
    }
  },

  // Refresh token (used internally by interceptor, but can also be called manually)
  refreshToken: async (refreshToken) => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken
    })
    return response.data
  }
}

export { api }
export default api
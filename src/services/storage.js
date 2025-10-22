const CUST_KEY = 'crm_customers_v1'
const TRANS_KEY = 'crm_transactions_v1'
const WA_KEY = 'crm_wa_logs_v1'
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'user'

// Token management functions
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function setAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  // Remove legacy token if exists
  localStorage.removeItem('token')
}

export function getUser() {
  try {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return null
  }
}

export function setUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function loadCustomers(){
  try{
    return JSON.parse(localStorage.getItem(CUST_KEY) || '[]')
  // eslint-disable-next-line no-unused-vars
  }catch(e){ return [] }
}

export function saveCustomers(list){
  localStorage.setItem(CUST_KEY, JSON.stringify(list))
}

export function loadTransactions(){
  // eslint-disable-next-line no-unused-vars
  try{ return JSON.parse(localStorage.getItem(TRANS_KEY) || '[]') }catch(e){ return [] }
}

export function saveTransactions(list){
  localStorage.setItem(TRANS_KEY, JSON.stringify(list))
}

export function loadWaLogs(){
  // eslint-disable-next-line no-unused-vars
  try{ return JSON.parse(localStorage.getItem(WA_KEY) || '[]') }catch(e){ return [] }
}

export function saveWaLogs(list){
  localStorage.setItem(WA_KEY, JSON.stringify(list))
}

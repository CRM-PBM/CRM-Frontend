const CUST_KEY = 'crm_customers_v1'
const TRANS_KEY = 'crm_transactions_v1'
const WA_KEY = 'crm_wa_logs_v1'

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

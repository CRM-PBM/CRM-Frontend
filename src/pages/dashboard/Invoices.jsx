import React, { useEffect, useState } from 'react'
import { loadTransactions } from '../../services/storage'

export default function Invoices(){
  const [tx, setTx] = useState([])

  useEffect(()=>{ setTx(loadTransactions()) }, [])

  const total = tx.reduce((s,t)=> s + (parseInt(t.amount||0)||0), 0)

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Nota & Analitik Sederhana</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-white rounded-lg border">Total Pendapatan<br/><div className="text-xl font-semibold">Rp {total}</div></div>
        <div className="p-3 bg-white rounded-lg border">Jumlah Transaksi<br/><div className="text-xl font-semibold">{tx.length}</div></div>
        <div className="p-3 bg-white rounded-lg border">Rata-rata Transaksi<br/><div className="text-xl font-semibold">Rp {tx.length?Math.round(total/tx.length):0}</div></div>
      </div>

      <div className="space-y-2">
        {tx.map(t=> (
          <div key={t.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
            <div>
              <div className="font-medium">{t.customer}</div>
              <div className="text-xs text-slate-400">{t.date}</div>
            </div>
            <div className="text-sm font-semibold">Rp {t.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

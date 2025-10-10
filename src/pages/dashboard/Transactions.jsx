import React, { useEffect, useState } from 'react'
import { loadTransactions, saveTransactions } from '../../services/storage'

export default function Transactions(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({customer:'', amount:'', notes:''})

  useEffect(()=>{ setList(loadTransactions()) }, [])

  function add(e){
    e.preventDefault()
    if(!form.customer || !form.amount) return
    const next = [{ id: Date.now(), ...form, date: new Date().toISOString().slice(0,10) }, ...list]
    setList(next); saveTransactions(next)
    setForm({customer:'', amount:'', notes:''})
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Pencatatan Transaksi</h3>
      <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <input value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})} placeholder="Nama pelanggan" className="p-2 border rounded" />
        <input value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="Jumlah (Rp)" className="p-2 border rounded" />
        <div className="flex gap-2">
          <input value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Catatan (opsional)" className="flex-1 p-2 border rounded" />
          <button className="bg-sky-600 text-white px-4 rounded">Simpan</button>
        </div>
      </form>

      <div className="space-y-2">
        {list.length===0 && <div className="text-sm text-slate-500">Belum ada transaksi.</div>}
        {list.map(tx=> (
          <div key={tx.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
            <div>
              <div className="font-medium">{tx.customer}</div>
              <div className="text-xs text-slate-500">{tx.date} • {tx.notes}</div>
            </div>
            <div className="font-semibold">Rp {tx.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

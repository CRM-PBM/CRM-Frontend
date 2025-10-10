import React, { useEffect, useState } from 'react'
import { loadCustomers, saveCustomers } from '../../services/storage'

export default function Customers(){
  const [list, setList] = useState([])
  const [form, setForm] = useState({name:'', phone:'', email:''})

  useEffect(()=>{ setList(loadCustomers()) }, [])

  function addCustomer(e){
    e.preventDefault()
    if(!form.name) return
    const next = [{ id: Date.now(), ...form }, ...list]
    setList(next); saveCustomers(next)
    setForm({name:'', phone:'', email:''})
  }

  function remove(id){
    const next = list.filter(c=>c.id!==id)
    setList(next); saveCustomers(next)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Manajemen Pelanggan</h3>
      <form onSubmit={addCustomer} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Nama pelanggan" className="p-2 border rounded" />
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="No. Telepon" className="p-2 border rounded" />
        <div className="flex gap-2">
          <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email (opsional)" className="flex-1 p-2 border rounded" />
          <button className="bg-sky-600 text-white px-4 rounded">Tambah</button>
        </div>
      </form>

      <div className="space-y-2">
        {list.length===0 && <div className="text-sm text-slate-500">Belum ada pelanggan. Tambahkan untuk memulai.</div>}
        {list.map(c=> (
          <div key={c.id} className="p-3 bg-white rounded-lg border flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-slate-500">{c.phone} {c.email && `• ${c.email}`}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-sm text-sky-600">Edit</button>
              <button onClick={()=>remove(c.id)} className="text-sm text-red-600">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

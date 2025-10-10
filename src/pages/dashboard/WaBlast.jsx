import React, { useEffect, useState } from 'react'
import { loadCustomers, loadWaLogs, saveWaLogs } from '../../services/storage'

export default function WaBlast(){
  const [customers, setCustomers] = useState([])
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState([])

  useEffect(()=>{ setCustomers(loadCustomers()); setLogs(loadWaLogs()); }, [])

  function send(){
    if(!message) return
    // Simulate send: create log entries for each customer
    const ts = Date.now()
    const batch = customers.map(c=>({ id: `${ts}-${c.id}`, to: c.phone, name: c.name, message, date: new Date().toISOString() }))
    const next = [...batch, ...logs].slice(0,200)
    setLogs(next); saveWaLogs(next)
    setMessage('')
    alert(`Pesan dikirim ke ${batch.length} pelanggan (simulasi).`)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">WA Blast (Simulasi)</h3>
      <div className="mb-3">
        <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} className="w-full p-2 border rounded" placeholder="Tulis pesan broadcast..." />
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-slate-500">Akan dikirim ke {customers.length} pelanggan</div>
          <button onClick={send} className="bg-sky-600 text-white px-4 py-2 rounded">Kirim Broadcast</button>
        </div>
      </div>

      <div>
        <div className="text-sm text-slate-500 mb-2">Log pengiriman (simulasi)</div>
        <div className="space-y-2">
          {logs.map(l=> (
            <div key={l.id} className="p-2 bg-white rounded border text-sm flex items-center justify-between">
              <div>{l.name} • {l.to}</div>
              <div className="text-xs text-slate-400">{new Date(l.date).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

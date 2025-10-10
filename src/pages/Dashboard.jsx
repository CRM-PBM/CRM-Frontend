import React, { useState } from 'react'
import { Users, CreditCard, BarChart2, PieChart } from 'lucide-react'
import Customers from './dashboard/Customers'
import Transactions from './dashboard/Transactions'
import WaBlast from './dashboard/WaBlast'
import Invoices from './dashboard/Invoices'
import DashboardTopbar from '../components/DashboardTopbar'
import Sidebar from '../components/Sidebar'

const kpis = [
  { id: 1, title: 'Pendapatan (30d)', value: 'Rp 34.8jt', delta: '+12%', icon: <CreditCard className="h-6 w-6 text-sky-500" /> },
  { id: 2, title: 'Pelanggan Aktif', value: '1,248', delta: '+4.2%', icon: <Users className="h-6 w-6 text-sky-500" /> },
  { id: 3, title: 'Transaksi', value: '3,124', delta: '-1.1%', icon: <BarChart2 className="h-6 w-6 text-sky-500" /> },
  { id: 4, title: 'Konversi', value: '6.3%', delta: '+0.4%', icon: <PieChart className="h-6 w-6 text-sky-500" /> }
]

const recent = [
  { id: 'INV-0012', customer: 'Kopi Senja', amount: 'Rp 120.000', status: 'Lunas', date: '2025-09-28' },
  { id: 'INV-0011', customer: 'Rina Fashion', amount: 'Rp 450.000', status: 'Menunggu', date: '2025-09-27' },
  { id: 'INV-0010', customer: 'Bengkel Santoso', amount: 'Rp 380.000', status: 'Lunas', date: '2025-09-26' },
]

function KPI({ kpi }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-50 rounded-md">{kpi.icon}</div>
          <div>
            <div className="text-xs text-slate-500">{kpi.title}</div>
            <div className="text-xl font-semibold text-slate-900">{kpi.value}</div>
          </div>
        </div>
        <div className={`text-sm ${kpi.delta.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{kpi.delta}</div>
      </div>
    </div>
  )
}

function MiniBarChart({ data = [4,6,8,5,9,7,6] }){
  const max = Math.max(...data)
  return (
    <svg viewBox={`0 0 ${data.length*10} 20`} className="w-full h-10">
      {data.map((d,i)=>{
        const h = (d/max)*16 + 2
        return (<rect key={i} x={i*10+2} y={20-h} width={6} height={h} rx={2} fill="#0ea5e9" opacity={0.85}></rect>)
      })}
    </svg>
  )
}

export default function Dashboard(){
  const [view, setView] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Container - Hidden on mobile, transitions width on desktop */}
        <div className={`hidden md:block flex-shrink-0 p-4 transition-all duration-300 ${collapsed ? 'md:w-20' : 'md:w-72'}`}>
          <Sidebar 
            view={view} 
            setView={setView} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            collapsed={collapsed} 
            setCollapsed={setCollapsed} 
          />
        </div>

        {/* Mobile Sidebar is rendered inside Sidebar component */}
        <div className="md:hidden">
          <Sidebar 
            view={view} 
            setView={setView} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            collapsed={collapsed} 
            setCollapsed={setCollapsed} 
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto">
          <DashboardTopbar 
            onToggleSidebar={()=>setSidebarOpen(s => !s)} 
            title={view==='overview'?'Ringkasan': view==='customers'?'Manajemen Pelanggan': view==='transactions'?'Pencatatan Transaksi': view==='wa'?'WA Blast': 'Nota & Laporan'} 
          />

            {view==='overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {kpis.map(k => <KPI key={k.id} kpi={k} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold">Pendapatan Mingguan</div>
                      <div className="text-xs text-slate-500">(dalam IDR)</div>
                    </div>
                    <MiniBarChart data={[6,9,8,14,11,16,13]} />
                    <div className="mt-3 text-xs text-slate-500">Kenaikan 12% dibandingkan minggu lalu</div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
                    <div className="text-sm font-semibold mb-2">Ringkasan Transaksi</div>
                    <div className="text-xs text-slate-500 mb-3">Transaksi terakhir</div>
                    <ul className="space-y-2">
                      {recent.map(r=> (
                        <li key={r.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{r.customer}</div>
                            <div className="text-xs text-slate-400">{r.id} • {r.date}</div>
                          </div>
                          <div className="text-sm font-semibold">{r.amount}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold">Transaksi Terbaru</div>
                    <div className="text-xs text-slate-500">Menampilkan 10 transaksi terakhir</div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-slate-500">
                          <th className="py-2">Invoice</th>
                          <th className="py-2">Pelanggan</th>
                          <th className="py-2">Jumlah</th>
                          <th className="py-2">Status</th>
                          <th className="py-2">Tanggal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {recent.map(r => (
                          <tr key={r.id} className="odd:bg-white even:bg-slate-50">
                            <td className="py-3">{r.id}</td>
                            <td className="py-3">{r.customer}</td>
                            <td className="py-3 font-semibold">{r.amount}</td>
                            <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs ${r.status==='Lunas' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-700'}`}>{r.status}</span></td>
                            <td className="py-3 text-slate-500">{r.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {view==='customers' && <Customers />}
            {view==='transactions' && <Transactions />}
            {view==='wa' && <WaBlast />}
            {view==='invoices' && <Invoices />}
        </main>
      </div>
    </div>
  )
}

import React from 'react'
import Reveal from './Reveal'
import { Users, MessageCircle, TrendingUp } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white via-sky-50 to-white">
      <div className="container mx-auto px-6 py-14 md:py-16">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left - Headline + CTA + benefits */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium"> 
                <span className="font-semibold">Untuk UMKM</span>
                <span className="text-xs text-sky-600">Mudah • Terjangkau</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                CRM sederhana untuk <span className="text-sky-600">tingkatkan penjualan</span> dan operasional
                
              </h1>

              <p className="text-slate-600 max-w-2xl">CRM membantu bisnis mengenal pelanggan lebih baik, menjaga hubungan, dan mengelola penjualan secara efisien.</p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                <a href="#" className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:scale-[1.02] transform transition">Coba Sekarang</a>
                <a href="#" className="w-full sm:w-auto inline-flex items-center justify-center text-slate-700 bg-white border border-slate-200 px-5 py-3 rounded-lg hover:bg-slate-50 transition">Lihat Demo</a>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-100 rounded-md text-sky-600"><Users className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Manajemen Pelanggan</div>
                    <div className="text-sm text-slate-500">Kontak & riwayat lengkap</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-100 rounded-md text-sky-600"><MessageCircle className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">WA Blast</div>
                    <div className="text-sm text-slate-500">Broadcast langsung ke pelanggan</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-100 rounded-md text-sky-600"><TrendingUp className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Laporan Ringkas</div>
                    <div className="text-sm text-slate-500">Insight yang actionable</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - mockup card */}
            <div className="hidden md:flex justify-center md:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="absolute -left-8 -top-6 w-40 h-40 bg-sky-100 rounded-full blur-3xl opacity-40" />
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600" />
                      <div className="text-sm text-slate-400">UMKM.cr</div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-sky-200" />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">Budi Santoso</div>
                          <div className="text-xs text-slate-500">Pelanggan setia • 3 transaksi</div>
                        </div>
                        <div className="text-xs text-sky-600 font-semibold">Rp 1.2jt</div>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">Terakhir: 3 hari lalu</div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">Invoice</div>
                      <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">Kirim WA</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-400 text-center">Tampilan aplikasi (mockup)</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

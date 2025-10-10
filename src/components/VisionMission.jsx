import React from 'react'
import { Target, CheckCircle } from 'lucide-react'
import Reveal from './Reveal'

export default function VisionMission() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-800">Visi & Misi Kami</h3>
            <p className="mt-4 text-gray-600">Landasan kami dalam memberdayakan UMKM.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
               <div className="flex items-center gap-4 mb-4">
                   <div className="flex-shrink-0 bg-sky-100 text-sky-500 rounded-full p-3"><Target className="h-6 w-6" /></div>
                   <h4 className="text-2xl font-semibold text-slate-800">Visi</h4>
               </div>
               <p className="text-gray-600">Menjadi mitra digital terdepan bagi UMKM Indonesia, memberdayakan mereka untuk bertumbuh dan berdaya saing melalui teknologi yang mudah dijangkau.</p>
            </div>
          </Reveal>
          <Reveal>
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
               <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 bg-sky-100 text-sky-500 rounded-full p-3"><CheckCircle className="h-6 w-6" /></div>
                   <h4 className="text-2xl font-semibold text-slate-800">Misi</h4>
               </div>
               <p className="text-gray-600">Menyediakan solusi CRM yang sederhana, terjangkau, dan andal untuk membantu UMKM membangun hubungan pelanggan yang lebih baik, merampingkan operasional, dan meningkatkan penjualan.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

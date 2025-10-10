import React from 'react'
import { features } from '../data.jsx'
import Reveal from './Reveal'

export default function Features() {
  return (
    <section id="features" className="bg-sky-50 py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">Semua yang Anda Butuhkan</h3>
          <p className="mt-4 text-gray-600">Fitur-fitur terbaik yang dirancang untuk kemudahan UMKM.</p>
        </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Reveal key={index}>
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 card-shadow hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-center h-14 w-14 bg-sky-50 rounded-full mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-slate-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

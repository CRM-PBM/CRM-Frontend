import React from 'react'
import { features } from '../data.jsx'
import Reveal from './Reveal'

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container px-6 mx-auto">
        <Reveal>
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold md:text-4xl text-slate-800">Semua yang Anda Butuhkan</h3>
            <p className="mt-4 text-gray-600">Fitur-fitur terbaik yang dirancang untuk kemudahan UMKM.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={index}>
              <div className="p-8 transition-all transform border bg-slate-50 rounded-xl border-slate-200 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-center mb-4 rounded-full h-14 w-14 bg-sky-100 text-sky-500">
                  {feature.icon}
                </div>
                <h4 className="mb-2 text-2xl font-semibold text-slate-800">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

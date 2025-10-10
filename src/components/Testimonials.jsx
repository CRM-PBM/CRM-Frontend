import React from 'react'
import { testimonials } from '../data.jsx'
import { Star } from 'lucide-react'
import Reveal from './Reveal'

export default function Testimonials(){
  return (
    <section className="bg-sky-50 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">Apa Kata Pengguna Kami?</h3>
          <p className="mt-4 text-gray-600">Cerita sukses dari para pemilik UMKM di seluruh Indonesia.</p>
        </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Reveal key={index}>
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">{testimonial.name[0]}</div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-xs text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({length: testimonial.rating}).map((_, i) => <Star key={`s-${i}`} className="text-yellow-400" size={16} />)}
                  </div>
                </div>
                <p className="text-sm text-slate-600">{testimonial.quote}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

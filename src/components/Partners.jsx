import React from 'react'
import { partners } from '../data.jsx'
import Reveal from './Reveal'

export default function Partners() {
  return (
    <section className="bg-white pb-16">
      <div className="container mx-auto px-6">
        <Reveal>
          <h3 className="text-center text-base font-semibold text-slate-600 tracking-wide">DIPERCAYA OLEH RATUSAN UMKM HEBAT</h3>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 items-center">
            {partners.map((partner) => (
              <div key={partner.name} className="col-span-1 flex justify-center items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                <img className="h-8 sm:h-10 object-contain" src={partner.logoUrl} alt={partner.name} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import React from 'react'
import { pricingPlans } from '../data.jsx'
import Reveal from './Reveal'

const Pricing = () => {
  return (
    <section id="pricing" className="py-12 bg-sky-50 md:py-20">
      <div className="container px-6 mx-auto">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold md:text-4xl text-slate-800">Pilih Paket Sesuai Kebutuhan</h3>
          <p className="mt-4 text-gray-600">Harga transparan tanpa biaya tersembunyi.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Reveal key={index}>
              <div className="p-5 transition-all transform bg-white border md:p-6 rounded-2xl border-slate-100 card-shadow hover:shadow-xl hover:-translate-y-1">
                <h4 className="mb-1 text-lg font-semibold text-slate-900">{plan.name}</h4>
                <p className="mb-4 text-sm text-slate-500">{plan.price}</p>
                <ul className="mb-4 space-y-2 text-sm text-slate-600">
                  {plan.features.map((feat, i) => (
                    <li key={i}>• {feat}</li>
                  ))}
                </ul>
                <button className="px-4 py-2 text-white transition rounded-lg bg-sky-600 hover:bg-sky-700">
                  Pilih Paket
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing

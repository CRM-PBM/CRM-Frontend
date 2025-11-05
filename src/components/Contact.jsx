import React from 'react'
import Reveal from './Reveal'

const Contact = () => {
  return (
    <section id="contact" className="py-12 bg-sky-50 md:py-20">
      <div className="container px-6 mx-auto">
        <Reveal>
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold md:text-4xl text-slate-800">Hubungi Kami</h3>
            <p className="mt-4 text-gray-600">Kami siap membantu UMKM Anda. Kirim pesan dan tim kami akan segera merespons.</p>
          </div>
        </Reveal>

        <div className="max-w-3xl mx-auto">
          <Reveal>
            <form className="p-6 space-y-4 bg-white border md:p-8 rounded-2xl border-slate-100 card-shadow">
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700" htmlFor="name">
                  Nama
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Nama Anda"
                  className="w-full px-4 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email Anda"
                  className="w-full px-4 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700" htmlFor="message">
                  Pesan
                </label>
                <textarea
                  id="message"
                  placeholder="Tulis pesan Anda"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 font-semibold text-white transition rounded-lg bg-sky-600 hover:bg-sky-700"
              >
                Kirim Pesan
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Contact
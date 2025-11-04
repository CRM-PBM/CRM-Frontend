import React from "react";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="bg-gradient-to-b from-white via-sky-50 to-white">
      <div className="container mx-auto px-6 py-14 md:py-16">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-8 -left-8 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-40"></div>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/906/906175.png"
                  alt="Ilustrasi UMKM"
                  className="relative w-full rounded-3xl shadow-xl border border-slate-100"
                />
              </div>
            </div>
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-3 bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
                <span className="font-semibold">Tentang Kami</span>
                <span className="text-xs text-sky-600">Inovatif • Kolaboratif</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                Membangun Solusi Digital <br className="hidden md:block" />
                untuk <span className="text-sky-600">Pertumbuhan UMKM</span>
              </h2>

              <p className="text-slate-600 max-w-lg">
                Kami adalah tim yang berfokus membantu pelaku usaha kecil dan menengah (UMKM)
                agar bisa berkembang melalui solusi digital yang sederhana, efisien,
                dan mudah digunakan. Dengan pendekatan yang praktis,
                kami percaya setiap bisnis bisa tumbuh lebih cepat dan berkelanjutan.
              </p>

              <p className="text-slate-600 max-w-lg">
                Kami berkomitmen untuk menghadirkan teknologi yang tidak rumit namun berdampak besar,
                agar UMKM dapat bersaing dan beradaptasi di era digital dengan percaya diri.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

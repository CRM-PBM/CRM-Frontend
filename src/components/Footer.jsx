import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-slate-900 text-white">
  <div className="container mx-auto px-4 md:px-6 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white">UMKM.crm</h3>
            <p className="mt-2 text-slate-400 text-sm">Memberdayakan UMKM Indonesia melalui teknologi yang mudah digunakan.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Produk</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#features" className="text-slate-300 hover:text-white text-sm">Fitur</a></li>
              <li><a href="#pricing" className="text-slate-300 hover:text-white text-sm">Harga</a></li>
              <li><a href="#security" className="text-slate-300 hover:text-white text-sm">Keamanan</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Perusahaan</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#about" className="text-slate-300 hover:text-white text-sm">Tentang Kami</a></li>
              <li><a href="#contact" className="text-slate-300 hover:text-white text-sm">Kontak</a></li>
              <li><a href="#careers" className="text-slate-300 hover:text-white text-sm">Karir</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-200">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#privacy" className="text-slate-300 hover:text-white text-sm">Kebijakan Privasi</a></li>
              <li><a href="#terms" className="text-slate-300 hover:text-white text-sm">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} UMKM.crm. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}

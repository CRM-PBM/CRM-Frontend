/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      // DEFINISI PALET WARNA KHUSUS PROYEK
      colors: {
        'sky': {
          '50': '#f0f9ff',    // Biru Langit (Sangat Terang)
          '100': '#e0f2fe',   // Biru Langit (Latar Ikon)
          '400': '#38bdf8',   // Biru Langit (Footer)
          '500': '#0ea5e9',   // Biru Langit (Utama)
          '600': '#0284c7',   // Biru Langit (Hover/Lebih Tua)
        },
        'slate': {
          '50': '#f8fafc',    // Abu-abu Terang (Latar Belakang Visi & Misi)
          '200': '#e2e8f0',   // Abu-abu Terang (Border)
          '300': '#cbd5e1',   // Abu-abu Footer
          '400': '#94a3b8',   // Abu-abu Footer
          '800': '#1e293b',   // Abu-abu Gelap (Teks Utama)
        },
        'gray': {
          '500': '#6b7280',   // Abu-abu (Teks Halus)
          '600': '#4b5563',   // Abu-abu (Teks Sekunder)
        },
        'yellow': {
          '400': '#facc15',   // Kuning (Bintang Testimoni)
        }
      }
    },
  },
  plugins: [],
}


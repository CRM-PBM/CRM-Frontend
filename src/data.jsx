import React from 'react'
import { Users, MessageCircle, ClipboardList, FileText, TrendingUp, BarChart2, Target, CheckCircle, Star } from 'lucide-react'

export const features = [
  {
    icon: <Users className="h-10 w-10 text-sky-500" />,
    title: "Manajemen Data Pelanggan",
    description: "Kelola semua informasi pelanggan, dari kontak hingga riwayat pembelian, dalam satu platform yang terpusat dan rapi."
  },
  {
    icon: <MessageCircle className="h-10 w-10 text-sky-500" />,
    title: "WA Blast (WhatsApp Broadcasting)",
    description: "Kirim pesan promo, pengingat, atau info terbaru ke banyak pelanggan sekaligus langsung melalui WhatsApp."
  },
  {
    icon: <ClipboardList className="h-10 w-10 text-sky-500" />,
    title: "Manajemen & Pencatatan Transaksi",
    description: "Catat setiap transaksi penjualan dengan cepat dan akurat. Pantau status pembayaran dengan mudah."
  },
  {
    icon: <FileText className="h-10 w-10 text-sky-500" />,
    title: "Nota & Invoice Digital",
    description: "Buat dan kirim nota atau invoice digital kepada pelanggan secara profesional langsung dari aplikasi."
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-sky-500" />,
    title: "Lacak Peluang Penjualan",
    description: "Pantau setiap peluang penjualan dari awal hingga akhir. Jangan pernah kehilangan calon pelanggan potensial lagi."
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-sky-500" />,
    title: "Laporan Analitik Sederhana",
    description: "Dapatkan wawasan berharga tentang kinerja bisnis Anda dengan laporan yang mudah dibaca dan dipahami."
  }
]

export const testimonials = [
  {
    name: "Andi Pratama",
    role: "Pemilik Kedai Kopi 'Senja'",
    quote: "Sejak pakai CRM ini, saya jadi lebih mudah mengingat pelanggan setia dan memberikan promo yang tepat. Penjualan jadi meningkat!",
    rating: 5
  },
  {
    name: "Rina Wulandari",
    role: "Owner Toko Online Fashion",
    quote: "Dulu data pelanggan berantakan di spreadsheet. Sekarang semua rapi dan terpusat. Tim saya jadi lebih produktif melayani customer.",
    rating: 5
  },
  {
    name: "Budi Santoso",
    role: "Jasa Servis Elektronik",
    quote: "Fitur pelacakan penjualannya sangat membantu. Saya jadi tahu mana saja servis yang paling diminati. Sangat direkomendasikan untuk UMKM!",
    rating: 4
  }
]

export const partners = [
  { name: 'Kopi Senja', logoUrl: 'https://placehold.co/150x80/f1f5f9/64748b?text=Kopi+Senja' },
  { name: 'Fashion', logoUrl: 'https://placehold.co/150x80/f1f5f9/64748b?text=Rina+Fashion' },
  { name: 'Bengkel ', logoUrl: 'https://placehold.co/150x80/f1f5f9/64748b?text=Bengkel+Santoso' },
  { name: 'Toko Kue Ibu', logoUrl: 'https://placehold.co/150x80/f1f5f9/64748b?text=Toko+Kue+Ibu' },
  { name: 'Kerajinan Lokal', logoUrl: 'https://placehold.co/150x80/f1f5f9/64748b?text=Kerajinan+Lokal' }
]

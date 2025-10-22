# 📱 Fitur Template Pesan WA Blast

## 📋 Overview
Fitur template pesan memungkinkan Anda untuk menyimpan dan menggunakan kembali format pesan yang sering digunakan untuk broadcast WhatsApp. Ini menghemat waktu dan memastikan konsistensi dalam komunikasi dengan pelanggan.

## ✨ Fitur Utama

### 1. **Template Library**
- 📚 Kumpulan template pesan yang tersimpan
- 🏷️ Kategori template (Promo, Informasi, Pengingat, Ucapan, Follow Up, Lainnya)
- 📊 Jumlah template tersedia ditampilkan
- 🎨 UI Card yang menarik untuk setiap template

### 2. **Default Templates**
Aplikasi dilengkapi dengan 5 template default:
1. **Promo Diskon Spesial** - Template untuk promosi diskon
2. **Pengingat Pembayaran** - Template untuk reminder pembayaran
3. **Ucapan Terima Kasih** - Template ucapan terima kasih ke pelanggan
4. **Produk Baru** - Template informasi produk baru
5. **Follow Up Pelanggan** - Template untuk follow up pelanggan

### 3. **Personalisasi Pesan**
Template mendukung variable placeholder untuk personalisasi:
- `{nama}` - Nama pelanggan
- `{telepon}` - Nomor telepon pelanggan
- `{email}` - Email pelanggan

**Contoh:**
```
Halo {nama}! 👋

Terima kasih sudah menjadi pelanggan setia kami!
Kami dapat dihubungi di {telepon}.
```

### 4. **Manajemen Template**

#### a. Buat Template Baru
Dua cara membuat template:

**Cara 1: Dari Form Broadcast**
1. Isi form "Buat Pesan" dengan judul dan isi pesan
2. Klik tombol "Simpan sebagai Template"
3. Isi nama template dan pilih kategori
4. Klik "Simpan Template"

**Cara 2: Buat Template Langsung**
1. Klik tombol "+ Buat Template Baru" di section Template
2. Isi:
   - Nama Template (wajib)
   - Kategori
   - Judul Pesan (wajib)
   - Isi Pesan (wajib)
3. Klik "Simpan Template"

#### b. Gunakan Template
1. Lihat daftar template di section "Template Pesan"
2. Klik tombol "Gunakan" pada template yang diinginkan
3. Template akan otomatis terisi di form broadcast
4. Edit jika diperlukan
5. Lanjutkan dengan membuat draft atau mengirim broadcast

#### c. Hapus Template
1. Klik tombol 🗑️ (Trash) pada template yang ingin dihapus
2. Konfirmasi penghapusan
3. Template akan dihapus permanen

## 💾 Penyimpanan Data

Template disimpan di **localStorage** browser dengan key: `wa_message_templates`

### Struktur Data Template:
```javascript
{
  id: 1234567890,                    // Timestamp sebagai ID unik
  nama_template: "Promo Diskon",     // Nama template
  kategori: "Promo",                 // Kategori template
  judul_pesan: "Promo Spesial",      // Judul pesan
  isi_pesan: "Halo {nama}...",       // Isi pesan
  created_at: "2025-01-19T..."       // Tanggal pembuatan
}
```

## 🎯 Use Cases

### 1. **Campaign Marketing**
```
Template: Promo Bulanan
Kategori: Promo

Judul: 🎉 Promo Bulan Ini untuk {nama}!
Isi: Dapatkan diskon 30% untuk semua produk...
```

### 2. **Reminder Otomatis**
```
Template: Reminder Pembayaran
Kategori: Pengingat

Judul: ⏰ Pengingat Pembayaran
Isi: Halo {nama}, pembayaran Anda akan jatuh tempo...
```

### 3. **Customer Appreciation**
```
Template: Ucapan Terima Kasih
Kategori: Ucapan

Judul: 💙 Terima Kasih {nama}!
Isi: Terima kasih sudah menjadi pelanggan setia...
```

### 4. **Product Launch**
```
Template: Peluncuran Produk
Kategori: Informasi

Judul: 🆕 Produk Baru Telah Hadir!
Isi: Halo {nama}! Kami punya kabar gembira...
```

### 5. **Follow Up Customer**
```
Template: Follow Up
Kategori: Follow Up

Judul: 📞 Follow Up dari Kami
Isi: Bagaimana pengalaman Anda dengan produk kami?
```

## 🎨 Kategori Template

| Kategori | Deskripsi | Contoh Penggunaan |
|----------|-----------|-------------------|
| **Promo** | Pesan promosi dan diskon | Flash sale, promo akhir tahun |
| **Informasi** | Informasi produk/layanan | Produk baru, update layanan |
| **Pengingat** | Reminder untuk pelanggan | Jatuh tempo, appointment |
| **Ucapan** | Ucapan dan apresiasi | Terima kasih, selamat |
| **Follow Up** | Tindak lanjut pelanggan | Survey, feedback request |
| **Lainnya** | Template umum lainnya | Custom messages |

## 🔧 Fitur Teknis

### 1. **localStorage Management**
```javascript
// Load templates
const savedTemplates = localStorage.getItem('wa_message_templates')

// Save templates
localStorage.setItem('wa_message_templates', JSON.stringify(templates))

// Clear templates (if needed)
localStorage.removeItem('wa_message_templates')
```

### 2. **Default Template Initialization**
- Jika localStorage kosong, aplikasi akan otomatis membuat 5 template default
- Template default hanya dibuat sekali saat pertama kali digunakan
- User dapat menghapus atau memodifikasi template default

### 3. **Template ID Generation**
- Menggunakan `Date.now()` sebagai unique ID
- Memastikan setiap template memiliki ID unik
- ID digunakan untuk operasi hapus dan update

## 📱 User Interface

### Template Card Components:
```jsx
┌─────────────────────────────────┐
│ 📄 Nama Template        [Edit]  │
│ [Kategori Badge]                │
│                                 │
│ Judul Pesan                     │
│ Preview isi pesan...            │
│                                 │
│ [Gunakan]              [Hapus]  │
│                    (Tanggal)    │
└─────────────────────────────────┘
```

### Modal Template:
```jsx
┌──────────────────────────────┐
│ 💾 Simpan Template Pesan  [X]│
│                              │
│ Nama Template: [_________]   │
│ Kategori: [Dropdown____]     │
│                              │
│ [Preview atau Input Fields]  │
│                              │
│ [Batal]  [Simpan Template]   │
└──────────────────────────────┘
```

## 🚀 Best Practices

### 1. **Naming Convention**
- Gunakan nama yang deskriptif dan mudah dicari
- Contoh: ✅ "Promo Ramadan 2025", ❌ "Template 1"

### 2. **Kategori yang Tepat**
- Pilih kategori yang sesuai untuk kemudahan pencarian
- Gunakan kategori "Lainnya" untuk template yang tidak masuk kategori standard

### 3. **Personalisasi**
- Gunakan placeholder `{nama}`, `{telepon}`, `{email}` untuk personalisasi
- Pastikan placeholder dieja dengan benar

### 4. **Konten Template**
- Tulis dengan bahasa yang friendly dan profesional
- Gunakan emoji dengan bijak (tidak berlebihan)
- Sertakan call-to-action yang jelas

### 5. **Manajemen Template**
- Review dan update template secara berkala
- Hapus template yang sudah tidak relevan
- Buat template baru untuk campaign musiman

## 🔍 Tips & Tricks

### 1. **Membuat Template Efektif**
```
✅ DO:
- Singkat dan jelas
- Personalisasi dengan placeholder
- Sertakan call-to-action
- Gunakan emoji dengan bijak

❌ DON'T:
- Terlalu panjang (max 300 kata)
- Terlalu banyak emoji
- Tanpa tujuan yang jelas
- Typo dan grammar error
```

### 2. **Optimasi Broadcast**
- Gunakan template yang sudah terbukti efektif
- A/B testing dengan template berbeda
- Sesuaikan template dengan target audience
- Update template berdasarkan feedback

### 3. **Maintenance**
```javascript
// Export templates (backup)
const templates = localStorage.getItem('wa_message_templates')
console.log(templates) // Copy untuk backup

// Import templates (restore)
localStorage.setItem('wa_message_templates', backupData)
```

## 🐛 Troubleshooting

### Template tidak tersimpan?
**Solusi:**
1. Cek localStorage browser (tidak full/disabled)
2. Cek console untuk error message
3. Refresh browser dan coba lagi

### Template default tidak muncul?
**Solusi:**
1. Clear localStorage: `localStorage.removeItem('wa_message_templates')`
2. Refresh halaman
3. Template default akan otomatis dibuat

### Placeholder tidak diganti?
**Solusi:**
1. Pastikan penulisan placeholder benar: `{nama}`, bukan `{Nama}` atau `{NAMA}`
2. Cek data pelanggan memiliki field yang sesuai
3. Variable hanya diganti saat pesan dikirim, bukan di preview

## 📊 Feature Statistics

| Fitur | Status | Keterangan |
|-------|--------|------------|
| ✅ Simpan Template | Aktif | Save ke localStorage |
| ✅ Load Template | Aktif | Load dari localStorage |
| ✅ Hapus Template | Aktif | Hapus dari localStorage |
| ✅ Default Templates | Aktif | 5 template default |
| ✅ Kategori Template | Aktif | 6 kategori |
| ✅ Personalisasi | Aktif | {nama}, {telepon}, {email} |
| ✅ Template Preview | Aktif | Preview di card |
| ✅ Quick Create | Aktif | Buat template langsung |
| ✅ Save from Form | Aktif | Simpan dari form broadcast |

## 🎓 Tutorial Video (Planned)
- [ ] Video: Cara membuat template
- [ ] Video: Cara menggunakan template
- [ ] Video: Best practices template marketing
- [ ] Video: Personalisasi pesan dengan placeholder

## 📮 Feedback & Support
Jika Anda memiliki saran atau menemukan bug, silakan hubungi tim development.

---

**Version:** 1.0.0  
**Last Updated:** 19 Oktober 2025  
**Feature Owner:** Dandy Wahyudin  
**Status:** ✅ Production Ready


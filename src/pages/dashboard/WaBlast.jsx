import React, { useEffect, useState, useRef } from 'react'
import { Send, Users, Eye, MessageSquare, Wifi, WifiOff, CheckCircle, Clock, XCircle, Trash2, User, Phone, Mail, FileText, Copy } from 'lucide-react'
import * as BroadcastAPI from '../../services/broadcastApi'

export default function WaBlast(){
  const [customers, setCustomers] = useState([])
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [broadcasts, setBroadcasts] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [deviceStatus, setDeviceStatus] = useState({ connected: false, loading: true })
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    judul_pesan: '',
    isi_pesan: '',
  })
  const textareaRef = useRef(null)

  // Template pesan yang sudah jadi
  const messageTemplates = [
    {
      id: 1,
      nama: 'Promo Diskon',
      kategori: 'Promo',
      emoji: '🎉',
      judul: 'Promo Spesial untuk {nama}!',
      isi: 'Halo {nama}! 👋\n\nKami punya kabar gembira untuk Anda! 🎁\n\nDapatkan DISKON 50% untuk semua produk pilihan.\n\nPromo terbatas hanya sampai akhir bulan!\n\nJangan sampai kehabisan ya! 😊'
    },
    {
      id: 2,
      nama: 'Pengingat Pembayaran',
      kategori: 'Pengingat',
      emoji: '⏰',
      judul: 'Pengingat Pembayaran',
      isi: 'Halo {nama},\n\nIni adalah pengingat ramah bahwa pembayaran Anda akan jatuh tempo dalam 3 hari.\n\nMohon segera lakukan pembayaran untuk menghindari keterlambatan.\n\nTerima kasih atas perhatiannya! 🙏'
    },
    {
      id: 3,
      nama: 'Ucapan Terima Kasih',
      kategori: 'Ucapan',
      emoji: '💙',
      judul: 'Terima Kasih {nama}!',
      isi: 'Hai {nama}! 😊\n\nTerima kasih sudah menjadi pelanggan setia kami!\n\nKami sangat menghargai kepercayaan Anda.\n\nSemoga produk/layanan kami bermanfaat untuk Anda.\n\nSampai jumpa di pembelian berikutnya! 🙌'
    },
    {
      id: 4,
      nama: 'Produk Baru',
      kategori: 'Informasi',
      emoji: '🆕',
      judul: 'Produk Baru Telah Hadir!',
      isi: 'Halo {nama}! ✨\n\nKami punya kabar gembira!\n\nProduk terbaru kami sudah tersedia dan siap untuk Anda.\n\n🎯 Fitur unggulan:\n• Kualitas premium\n• Harga terjangkau\n• Garansi resmi\n\nYuk, jadi yang pertama mencoba! 🚀'
    },
    {
      id: 5,
      nama: 'Follow Up',
      kategori: 'Follow Up',
      emoji: '📞',
      judul: 'Follow Up dari Kami',
      isi: 'Halo {nama}, 👋\n\nKami ingin mengetahui bagaimana pengalaman Anda dengan produk/layanan kami?\n\nApakah ada yang bisa kami bantu?\n\nFeedback Anda sangat berharga bagi kami untuk terus meningkatkan pelayanan.\n\nTerima kasih! 💚'
    },
    {
      id: 6,
      nama: 'Konfirmasi Pesanan',
      kategori: 'Informasi',
      emoji: '✅',
      judul: 'Konfirmasi Pesanan Anda',
      isi: 'Halo {nama}! ✅\n\nPesanan Anda telah kami terima dan sedang diproses.\n\nNomor pesanan: #[ISI_NOMOR]\nEstimasi pengiriman: [ISI_TANGGAL]\n\nTerima kasih telah berbelanja dengan kami! 🛍️'
    },
    {
      id: 7,
      nama: 'Reminder Stok',
      kategori: 'Pengingat',
      emoji: '📦',
      judul: 'Stok Terbatas!',
      isi: 'Halo {nama}! 📦\n\nProduk favorit Anda hampir habis!\n\nStok tinggal sedikit, buruan pesan sebelum kehabisan.\n\nJangan sampai menyesal ya! ⚡'
    },
    {
      id: 8,
      nama: 'Undangan Event',
      kategori: 'Informasi',
      emoji: '🎊',
      judul: 'Undangan Spesial untuk {nama}',
      isi: 'Hai {nama}! 🎊\n\nKami mengundang Anda ke acara spesial kami!\n\n📅 Tanggal: [ISI_TANGGAL]\n⏰ Waktu: [ISI_WAKTU]\n📍 Lokasi: [ISI_LOKASI]\n\nDitunggu kehadirannya ya! 🎉'
    }
  ]

  useEffect(()=>{ 
    async function init() {
      await loadInitialData()
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadInitialData() {
    try {
      // Check device status
      try {
        const deviceRes = await BroadcastAPI.checkDeviceStatus()
        setDeviceStatus({ 
          connected: deviceRes.data?.connected || false, 
          loading: false 
        })
      } catch {
        setDeviceStatus({ connected: false, loading: false })
      }

      // Load pelanggan
      const pelangganRes = await BroadcastAPI.getPelanggan(100)
      const pelangganData = pelangganRes.data || []
      const withPhone = pelangganData.filter(p => p.telepon)
      setCustomers(withPhone)
      setSelectedCustomers(withPhone.map(p => p.pelanggan_id)) // Select all by default

      // Load broadcasts
      await loadBroadcasts()

      // Load statistics
      const statsRes = await BroadcastAPI.getBroadcastStatistics()
      setStatistics(statsRes.data)
    } catch (error) {
      console.error('Failed to load data:', error)
      alert('Gagal memuat data. Pastikan backend server berjalan.')
    }
  }

  async function loadBroadcasts() {
    try {
      const response = await BroadcastAPI.getAllBroadcasts(1, 50)
      setBroadcasts(response.data || [])
    } catch (error) {
      console.error('Failed to load broadcasts:', error)
    }
  }

  function handleChange(e){
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function insertPlaceholder(placeholder) {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.isi_pesan
    const before = text.substring(0, start)
    const after = text.substring(end)
    
    const newText = before + placeholder + after
    setForm({ ...form, isi_pesan: newText })
    
    // Set cursor position after inserted placeholder
    setTimeout(() => {
      textarea.focus()
      const newPosition = start + placeholder.length
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  // Fungsi untuk menggunakan template
  function applyTemplate(template) {
    setForm({
      judul_pesan: template.judul,
      isi_pesan: template.isi
    })
    // Scroll ke form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // eslint-disable-next-line no-unused-vars
  function toggleCustomer(customerId) {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  // eslint-disable-next-line no-unused-vars
  function toggleAllCustomers() {
    setSelectedCustomers(prev => 
      prev.length === customers.length ? [] : customers.map(c => c.pelanggan_id)
    )
  }

  async function createDraft() {
    if(!form.judul_pesan || !form.isi_pesan) {
      alert('Judul dan isi pesan harus diisi!')
      return
    }

    if(selectedCustomers.length === 0) {
      alert('Pilih minimal 1 pelanggan!')
      return
    }

    setLoading(true)
    try {
      await BroadcastAPI.createBroadcast({
        judul_pesan: form.judul_pesan,
        isi_pesan: form.isi_pesan,
        pelanggan_ids: selectedCustomers
      })

      alert(`Draft broadcast "${form.judul_pesan}" berhasil dibuat!`)
      setForm({ judul_pesan: '', isi_pesan: '' })
      await loadBroadcasts()
    } catch (error) {
      alert('Gagal membuat broadcast: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  async function sendBroadcastNow(broadcastId) {
    if (!deviceStatus.connected) {
      alert('Device WhatsApp belum terkoneksi! Hubungkan device terlebih dahulu.')
      return
    }

    if (!confirm('Kirim broadcast ini sekarang?')) return

    setLoading(true)
    try {
      const response = await BroadcastAPI.sendBroadcast(broadcastId)
      const results = response.data?.results || {}
      
      alert(
        `Broadcast berhasil dikirim!\n\n` +
        `Total: ${results.total || 0}\n` +
        `Berhasil: ${results.success || 0}\n` +
        `Gagal: ${results.failed || 0}`
      )
      
      await loadBroadcasts()
      if (statistics) {
        const statsRes = await BroadcastAPI.getBroadcastStatistics()
        setStatistics(statsRes.data)
      }
    } catch (error) {
      alert('Gagal mengirim broadcast: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  async function deleteBroadcastItem(broadcastId) {
    if (!confirm('Hapus broadcast ini?')) return

    setLoading(true)
    try {
      await BroadcastAPI.deleteBroadcast(broadcastId)
      alert('Broadcast berhasil dihapus!')
      await loadBroadcasts()
    } catch (error) {
      alert('Gagal menghapus broadcast: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status) {
    const badges = {
      'draft': { color: 'bg-slate-100 text-slate-700', icon: Clock },
      'terkirim': { color: 'bg-green-50 text-green-700', icon: CheckCircle },
      'gagal': { color: 'bg-red-50 text-red-700', icon: XCircle },
    }
    const badge = badges[status?.toLowerCase()] || badges['draft']
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Device Status */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Kirim WA Broadcast</h3>
          <p className="text-sm text-slate-500">Kirim pesan ke pelanggan via WhatsApp</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {deviceStatus.loading ? (
              <span className="text-slate-400">Checking...</span>
            ) : deviceStatus.connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Device Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">Device Offline</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4" />
            <span>{selectedCustomers.length} / {customers.length} Dipilih</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Total Broadcast</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{statistics.total_broadcast || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Total Penerima</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{statistics.total_penerima || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Terkirim</div>
            <div className="text-2xl font-bold text-green-600 mt-1">{statistics.terkirim || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Success Rate</div>
            <div className="text-2xl font-bold text-sky-600 mt-1">{statistics.success_rate || 0}%</div>
          </div>
        </div>
      )}

      {/* Template Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-sky-600" />
          <h4 className="font-semibold text-slate-900">Template Pesan</h4>
          <span className="text-xs text-slate-500">({messageTemplates.length} template siap pakai)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {messageTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template)}
              className="text-left border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-sky-300 transition-all bg-gradient-to-br from-white to-slate-50 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-slate-900 text-sm truncate group-hover:text-sky-600 transition-colors">
                      {template.nama}
                    </h5>
                  </div>
                </div>
              </div>
              
              <span className="inline-block px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-xs mb-2">
                {template.kategori}
              </span>

              <div className="text-xs text-slate-600 mb-2">
                <p className="font-medium text-slate-700 mb-1 line-clamp-1">{template.judul}</p>
                <p className="line-clamp-2 leading-relaxed">{template.isi}</p>
              </div>

              <div className="flex items-center gap-1 text-xs text-sky-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="h-3 w-3" />
                Klik untuk gunakan
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>Tips:</strong> Klik template untuk langsung menggunakannya. Personalisasi otomatis dengan <code className="bg-blue-100 px-1 rounded">{'{nama}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{telepon}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{email}'}</code>
          </p>
        </div>
      </div>

      {/* Form & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Input */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-sky-600" />
            <h4 className="font-semibold text-slate-900">Buat Pesan</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Judul Pesan
              </label>
              <input
                type="text"
                name="judul_pesan"
                value={form.judul_pesan}
                onChange={handleChange}
                placeholder="Contoh: Promo Akhir Tahun"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Isi Pesan
              </label>
              
              {/* Variable Placeholder Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => insertPlaceholder('{nama}')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-xs font-medium hover:bg-sky-100 transition-colors border border-sky-200"
                >
                  <User className="h-3 w-3" />
                  {'{nama}'}
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder('{telepon}')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <Phone className="h-3 w-3" />
                  {'{telepon}'}
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder('{email}')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  <Mail className="h-3 w-3" />
                  {'{email}'}
                </button>
              </div>

              <textarea
                ref={textareaRef}
                name="isi_pesan"
                value={form.isi_pesan}
                onChange={handleChange}
                rows={8}
                placeholder="Tulis pesan broadcast Anda di sini...&#10;&#10;Contoh:&#10;Halo {nama}! 🎉&#10;Dapatkan diskon 50% untuk semua produk.&#10;Promo terbatas hingga akhir bulan!"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              />
              <div className="text-xs text-slate-400 mt-1">
                {form.isi_pesan.length} karakter
              </div>
            </div>

            <button
              onClick={createDraft}
              disabled={!form.judul_pesan || !form.isi_pesan || loading || selectedCustomers.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-3 rounded-lg font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Membuat Draft...' : `Buat Draft (${selectedCustomers.length} Penerima)`}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-sky-600" />
            <h4 className="font-semibold text-slate-900">Preview Pesan</h4>
          </div>

          {/* WhatsApp-like Preview */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg p-4 min-h-[400px]">
            <div className="bg-white rounded-lg shadow-md max-w-xs p-3 space-y-2">
              {form.judul_pesan ? (
                <div className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  {form.judul_pesan}
                </div>
              ) : (
                <div className="text-slate-400 text-sm italic border-b border-slate-100 pb-2">
                  Judul pesan akan muncul di sini
                </div>
              )}

              {form.isi_pesan ? (
                <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {form.isi_pesan}
                </div>
              ) : (
                <div className="text-slate-400 text-sm italic">
                  Isi pesan akan muncul di sini...
                </div>
              )}

              <div className="text-xs text-slate-400 text-right pt-1">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {(form.judul_pesan || form.isi_pesan) && (
              <div className="mt-4 text-xs text-slate-500 text-center">
                Preview pesan WhatsApp
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900">Riwayat Broadcast</h4>
          <button 
            onClick={loadBroadcasts}
            className="text-sm text-sky-600 hover:text-sky-700"
          >
            Refresh
          </button>
        </div>
        
        {broadcasts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada riwayat broadcast</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 font-medium text-slate-700">Judul</th>
                  <th className="pb-3 font-medium text-slate-700">Isi Pesan</th>
                  <th className="pb-3 font-medium text-slate-700">Tanggal</th>
                  <th className="pb-3 font-medium text-slate-700">Penerima</th>
                  <th className="pb-3 font-medium text-slate-700">Status</th>
                  <th className="pb-3 font-medium text-slate-700 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {broadcasts.map(b => (
                  <tr key={b.broadcast_id} className="hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-900">{b.judul_pesan}</td>
                    <td className="py-3 text-slate-600 max-w-xs truncate" title={b.isi_pesan}>{b.isi_pesan}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(b.tanggal_kirim).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 text-slate-600">{b.stats?.total_penerima || 0}</td>
                    <td className="py-3">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        {b.status?.toLowerCase() === 'draft' && (
                          <button
                            onClick={() => sendBroadcastNow(b.broadcast_id)}
                            disabled={loading || !deviceStatus.connected}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={deviceStatus.connected ? 'Kirim sekarang' : 'Device offline'}
                          >
                            <Send className="h-3 w-3" />
                            Kirim
                          </button>
                        )}
                        <button
                          onClick={() => deleteBroadcastItem(b.broadcast_id)}
                          disabled={loading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}


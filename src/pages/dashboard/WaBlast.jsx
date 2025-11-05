import React, { useEffect, useState, useRef } from 'react'
import { Send, Users, Eye, MessageSquare, Wifi, WifiOff, CheckCircle, Clock, XCircle, Trash2, User, Phone, Mail, FileText, Copy, Key, Save, ChevronLeft, ChevronRight } from 'lucide-react'
import * as BroadcastAPI from '../../services/broadcastApi'
import * as WablastAPI from '../../services/wablastApi'
import api from '../../services/authService'

export default function WaBlast(){
  const [customers, setCustomers] = useState([])
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [broadcasts, setBroadcasts] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [deviceStatus, setDeviceStatus] = useState({ connected: false, loading: true })
  const [loading, setLoading] = useState(false)
  const [numberKey, setNumberKey] = useState('')
  const [currentNumberKey, setCurrentNumberKey] = useState('')
  const [showNumberKeyForm, setShowNumberKeyForm] = useState(false)
  const [broadcastPage, setBroadcastPage] = useState(1)
  const itemsPerPage = 5
  const [form, setForm] = useState({
    judul_pesan: '',
    isi_pesan: '',
    image_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState('url') // 'url' or 'upload'
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

      // Load current number key
      try {
        const keyRes = await WablastAPI.getNumberKey()
        setCurrentNumberKey(keyRes.data?.wa_number_key || '')
      } catch {
        // Silently fail if endpoint not available
        console.warn('Number key endpoint not available, will be ready when backend implements it')
        setCurrentNumberKey('')
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
      isi_pesan: template.isi,
      image_url: ''
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

  async function saveNumberKey() {
    if (!numberKey.trim()) {
      alert('Masukkan WhatsApp Number Key!')
      return
    }

    setLoading(true)
    try {
      const result = await WablastAPI.setNumberKey(numberKey)
      
      // Check if backend endpoint is not implemented
      if (result.success === false && result.message?.includes('belum diimplementasikan')) {
        alert('Backend endpoint /api/watzap/number-key belum siap.\n\nHubungi admin backend untuk menambahkan endpoint ini.')
        setLoading(false)
        return
      }
      
      alert('WhatsApp Number Key berhasil disimpan!')
      setCurrentNumberKey(numberKey)
      setNumberKey('')
      setShowNumberKeyForm(false)
    } catch (error) {
      alert('Gagal menyimpan Number Key: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(file) {
    if (!file) return
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP')
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5MB')
      setImageFile(null)
      setImagePreview(null)
      return
    }

    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to backend
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post('/broadcast/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setForm(prev => ({ ...prev, image_url: response.data.data.image_url }))
        alert('Gambar berhasil diupload')
      } else {
        alert('Gagal upload gambar: ' + response.data.message)
        setImageFile(null)
        setImagePreview(null)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Gagal upload gambar'
      alert('Error: ' + errorMsg)
      setImageFile(null)
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
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
        image_url: form.image_url || undefined,
        pelanggan_ids: selectedCustomers
      })

      alert(`Draft broadcast "${form.judul_pesan}" berhasil dibuat!`)
      setForm({ judul_pesan: '', isi_pesan: '', image_url: '' })
      setImageFile(null)
      setImagePreview(null)
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

    if (!currentNumberKey) {
      alert('Masukkan WhatsApp Number Key terlebih dahulu!')
      return
    }

    if (!confirm('Kirim broadcast ini sekarang?')) return

    setLoading(true)
    try {
      const response = await BroadcastAPI.sendBroadcastWithNumberKey(broadcastId, currentNumberKey)
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
    <div className="space-y-4 md:space-y-6">
      {/* Header with Device Status */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-900">Kirim WA Broadcast</h3>
          <p className="text-xs md:text-sm text-slate-500">Kirim pesan ke pelanggan via WhatsApp</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 text-sm">
            {deviceStatus.loading ? (
              <span className="text-slate-400">Checking...</span>
            ) : deviceStatus.connected ? (
              <>
                <Wifi className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-green-600 font-medium">Device Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-red-600 font-medium">Device Offline</span>
              </>
            )}
          </div>
          <button
            onClick={async () => {
              setDeviceStatus({ ...deviceStatus, loading: true })
              try {
                const deviceRes = await BroadcastAPI.checkDeviceStatus()
                setDeviceStatus({ 
                  connected: deviceRes.data?.connected || false, 
                  loading: false 
                })
              } catch {
                setDeviceStatus({ connected: false, loading: false })
              }
            }}
            className="px-2 py-1 text-xs bg-sky-100 text-sky-600 hover:bg-sky-200 rounded transition-colors"
            title="Refresh device status"
          >
            Refresh
          </button>
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">{selectedCustomers.length} / {customers.length} Dipilih</span>
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

      {/* WhatsApp Number Key Configuration */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:rounded-xl border border-green-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-green-600 flex-shrink-0" />
            <h4 className="font-semibold text-slate-900">WhatsApp Number Key</h4>
          </div>
          {currentNumberKey && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-600 text-white rounded-full text-xs font-medium w-fit">
              <CheckCircle className="h-3 w-3" />
              Terkonfigurasi
            </span>
          )}
        </div>

        {!showNumberKeyForm ? (
          <div className="space-y-3">
            {currentNumberKey ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-lg p-3 border border-green-200">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Number Key Aktif:</p>
                  <p className="font-mono text-sm text-slate-900 break-all">{currentNumberKey}</p>
                </div>
                <button
                  onClick={() => setShowNumberKeyForm(true)}
                  className="px-3 py-2 text-sm text-green-600 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Ubah
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs md:text-sm text-yellow-800">⚠️ Belum ada Number Key. Masukkan Number Key untuk mulai mengirim broadcast.</p>
              </div>
            )}
            
            {!currentNumberKey && (
              <button
                onClick={() => setShowNumberKeyForm(true)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
              >
                + Tambah Number Key
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 bg-white rounded-lg p-4 border border-green-200">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                WhatsApp Number Key
              </label>
              <input
                type="text"
                value={numberKey}
                onChange={(e) => setNumberKey(e.target.value)}
                placeholder="Contoh: TEST123"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Masukkan Number Key dari backend Anda (contoh: TEST123, PROD456, dll)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={saveNumberKey}
                disabled={loading || !numberKey.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                onClick={() => {
                  setShowNumberKeyForm(false)
                  setNumberKey('')
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 disabled:opacity-50 transition-all text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 md:mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <p><strong>📌 Cara menggunakan:</strong></p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>Dapatkan Number Key dari admin backend</li>
            <li>Masukkan Number Key di atas</li>
            <li>Buat broadcast dan kirim ke pelanggan</li>
          </ol>
        </div>
      </div>

      {/* Template Section */}
      <div className="bg-white rounded-lg md:rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-sky-600 flex-shrink-0" />
          <h4 className="font-semibold text-slate-900 text-sm md:text-base">Template Pesan</h4>
          <span className="text-xs text-slate-500">({messageTemplates.length})</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          {messageTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template)}
              className="text-left border border-slate-200 rounded-lg p-3 md:p-4 hover:shadow-md hover:border-sky-300 transition-all bg-gradient-to-br from-white to-slate-50 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xl md:text-2xl flex-shrink-0">{template.emoji}</span>
                  <h5 className="font-semibold text-slate-900 text-xs md:text-sm truncate group-hover:text-sky-600 transition-colors">
                    {template.nama}
                  </h5>
                </div>
              </div>
              
              <span className="inline-block px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-xs mb-2">
                {template.kategori}
              </span>

              <div className="text-xs text-slate-600 mb-2 line-clamp-2">
                <p className="font-medium text-slate-700 mb-0.5 line-clamp-1">{template.judul}</p>
              </div>

              <div className="flex items-center gap-1 text-xs text-sky-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="h-3 w-3" />
                <span className="hidden sm:inline">Gunakan</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-3 md:mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 <strong>Tips:</strong> Klik template untuk gunakan. Gunakan <code className="bg-blue-100 px-1 rounded text-xs">{'{nama}'}</code>, <code className="bg-blue-100 px-1 rounded text-xs">{'{telepon}'}</code>
          </p>
        </div>
      </div>

      {/* Form & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Form Input */}
        <div className="bg-white rounded-lg md:rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-sky-600 flex-shrink-0" />
            <h4 className="font-semibold text-slate-900">Buat Pesan</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1">
                Judul Pesan
              </label>
              <input
                type="text"
                name="judul_pesan"
                value={form.judul_pesan}
                onChange={handleChange}
                placeholder="Contoh: Promo Akhir Tahun"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">
                Isi Pesan
              </label>
              
              {/* Variable Placeholder Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => insertPlaceholder('{nama}')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-700 rounded text-xs font-medium hover:bg-sky-100 transition-colors border border-sky-200"
                >
                  <User className="h-3 w-3" />
                  <span className="hidden sm:inline">{'{nama}'}</span>
                  <span className="sm:hidden">Nama</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder('{telepon}')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <Phone className="h-3 w-3" />
                  <span className="hidden sm:inline">{'{telepon}'}</span>
                  <span className="sm:hidden">HP</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder('{email}')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  <Mail className="h-3 w-3" />
                  <span className="hidden sm:inline">{'{email}'}</span>
                  <span className="sm:hidden">Email</span>
                </button>
              </div>

              <textarea
                ref={textareaRef}
                name="isi_pesan"
                value={form.isi_pesan}
                onChange={handleChange}
                rows={6}
                placeholder="Tulis pesan broadcast Anda di sini..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none text-sm"
              />
              <div className="text-xs text-slate-400 mt-1">
                {form.isi_pesan.length} karakter
              </div>
            </div>

            {/* Image Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gambar (Opsional)
              </label>
              
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-3 border border-slate-300 rounded-lg p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode('url')
                    setImageFile(null)
                    setImagePreview(null)
                  }}
                  className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    imageMode === 'url'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📎 Gunakan URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    imageMode === 'upload'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📤 Upload File
                </button>
              </div>

              {/* Mode: URL */}
              {imageMode === 'url' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="Paste URL gambar (contoh: https://...)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-slate-500">Format: HTTP/HTTPS URL yang valid</p>
                  
                  {/* URL Preview */}
                  {form.image_url && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-700">Preview:</p>
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                      <img 
                        src={form.image_url}
                        alt="Preview" 
                        className="max-w-xs h-auto rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Mode: Upload */}
              {imageMode === 'upload' && (
                <div className="space-y-2">
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-4 cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-colors">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <div>
                      <span className="text-sm text-slate-600 font-medium">
                        {imageFile ? imageFile.name : 'Klik untuk pilih gambar'}
                      </span>
                      <p className="text-xs text-slate-500">JPG, PNG, GIF, WebP • Max 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      onChange={(e) => handleImageUpload(e.target.files?.[0])}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>

                  {/* Upload Status */}
                  {uploading && (
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-blue-700">⏳ Sedang mengunggah...</p>
                    </div>
                  )}

                  {/* File Preview */}
                  {imagePreview && (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-slate-700">Preview:</p>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                            setForm(prev => ({ ...prev, image_url: '' }))
                          }}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-w-xs h-auto rounded-lg object-cover"
                      />
                    </div>
                  )}

                  {/* Success Status */}
                  {form.image_url && !uploading && imagePreview && (
                    <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-green-700">✓ Gambar berhasil diupload</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={createDraft}
                disabled={!form.judul_pesan || !form.isi_pesan || loading || selectedCustomers.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-3 rounded-lg font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-sm"
              >
                <Clock className="h-4 w-4" />
                {loading ? 'Menyimpan...' : `Buat Draft`}
              </button>
              <button
                onClick={async () => {
                  if (!form.judul_pesan || !form.isi_pesan || selectedCustomers.length === 0) {
                    alert('Judul, isi pesan, dan penerima harus diisi!')
                    return
                  }

                  if (!currentNumberKey) {
                    alert('Masukkan WhatsApp Number Key terlebih dahulu!')
                    return
                  }

                  if (!deviceStatus.connected) {
                    alert('Device WhatsApp belum terkoneksi!')
                    return
                  }

                  if (!confirm('Kirim broadcast langsung sekarang?')) return

                  setLoading(true)
                  try {
                    // Create broadcast first
                    await BroadcastAPI.createBroadcast({
                      judul_pesan: form.judul_pesan,
                      isi_pesan: form.isi_pesan,
                      image_url: form.image_url || undefined,
                      pelanggan_ids: selectedCustomers
                    })

                    // Get the latest broadcast ID
                    const broadcastsRes = await BroadcastAPI.getAllBroadcasts(1, 1)
                    const latestBroadcast = broadcastsRes.data?.[0]

                    if (latestBroadcast) {
                      // Send immediately
                      const response = await BroadcastAPI.sendBroadcastWithNumberKey(latestBroadcast.broadcast_id, currentNumberKey)
                      const results = response.data?.results || {}
                      
                      alert(
                        `Broadcast berhasil dikirim!\n\n` +
                        `Total: ${results.total || 0}\n` +
                        `Berhasil: ${results.success || 0}\n` +
                        `Gagal: ${results.failed || 0}`
                      )
                      
                      setForm({ judul_pesan: '', isi_pesan: '', image_url: '' })
                      setImageFile(null)
                      setImagePreview(null)
                      await loadBroadcasts()
                      if (statistics) {
                        const statsRes = await BroadcastAPI.getBroadcastStatistics()
                        setStatistics(statsRes.data)
                      }
                    }
                  } catch (error) {
                    alert('Gagal mengirim broadcast: ' + (error.message || 'Unknown error'))
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={!form.judul_pesan || !form.isi_pesan || loading || selectedCustomers.length === 0 || !currentNumberKey || !deviceStatus.connected}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md text-sm"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Mengirim...' : `Kirim Langsung`}
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-lg md:rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-sky-600 flex-shrink-0" />
            <h4 className="font-semibold text-slate-900">Preview Pesan</h4>
          </div>

          {/* WhatsApp-like Preview */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg p-3 md:p-4 min-h-[300px] md:min-h-[400px]">
            <div className="bg-white rounded-lg shadow-md max-w-xs p-3 space-y-2 mx-auto">
              {form.judul_pesan ? (
                <div className="font-semibold text-slate-900 text-xs md:text-sm border-b border-slate-100 pb-2">
                  {form.judul_pesan}
                </div>
              ) : (
                <div className="text-slate-400 text-xs md:text-sm italic border-b border-slate-100 pb-2">
                  Judul pesan akan muncul di sini
                </div>
              )}

              {form.isi_pesan ? (
                <div className="text-slate-700 text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                  {form.isi_pesan}
                </div>
              ) : (
                <div className="text-slate-400 text-xs md:text-sm italic">
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
      <div className="bg-white rounded-lg md:rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h4 className="font-semibold text-slate-900">Riwayat Broadcast</h4>
          <button 
            onClick={loadBroadcasts}
            className="text-xs md:text-sm text-sky-600 hover:text-sky-700"
          >
            Refresh
          </button>
        </div>
        
        {broadcasts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-xs md:text-sm">Belum ada riwayat broadcast</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-3 font-medium text-slate-700 px-4 md:px-0">Judul</th>
                    <th className="pb-3 font-medium text-slate-700 px-4 md:px-0 hidden sm:table-cell">Tanggal</th>
                    <th className="pb-3 font-medium text-slate-700 px-4 md:px-0 text-center">Penerima</th>
                    <th className="pb-3 font-medium text-slate-700 px-4 md:px-0">Status</th>
                    <th className="pb-3 font-medium text-slate-700 px-4 md:px-0 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {broadcasts.slice((broadcastPage - 1) * itemsPerPage, broadcastPage * itemsPerPage).map(b => (
                    <tr key={b.broadcast_id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900 px-4 md:px-0">
                        <div className="truncate max-w-xs">{b.judul_pesan}</div>
                        <div className="text-xs text-slate-500 truncate sm:hidden">{new Date(b.tanggal_kirim).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</div>
                      </td>
                      <td className="py-3 text-slate-500 px-4 md:px-0 hidden sm:table-cell text-xs">
                        {new Date(b.tanggal_kirim).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 text-center text-slate-600 px-4 md:px-0 text-xs">{b.stats?.total_penerima || 0}</td>
                      <td className="py-3 px-4 md:px-0">
                        {getStatusBadge(b.status)}
                      </td>
                      <td className="py-3 px-4 md:px-0">
                        <div className="flex items-center justify-center gap-1">
                          {b.status?.toLowerCase() === 'draft' && (
                            <button
                              onClick={() => sendBroadcastNow(b.broadcast_id)}
                              disabled={loading || !deviceStatus.connected}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={deviceStatus.connected ? 'Kirim sekarang' : 'Device offline'}
                            >
                              <Send className="h-3 w-3" />
                              <span className="hidden sm:inline">Kirim</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteBroadcastItem(b.broadcast_id)}
                            disabled={loading}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-slate-500">
                Menampilkan {Math.min((broadcastPage - 1) * itemsPerPage + 1, broadcasts.length)} - {Math.min(broadcastPage * itemsPerPage, broadcasts.length)} dari {broadcasts.length}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBroadcastPage(prev => Math.max(prev - 1, 1))}
                  disabled={broadcastPage === 1}
                  className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Halaman sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.ceil(broadcasts.length / itemsPerPage) }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setBroadcastPage(i + 1)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        broadcastPage === i + 1
                          ? 'bg-sky-600 text-white'
                          : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setBroadcastPage(prev => Math.min(prev + 1, Math.ceil(broadcasts.length / itemsPerPage)))}
                  disabled={broadcastPage === Math.ceil(broadcasts.length / itemsPerPage)}
                  className="p-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Halaman berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

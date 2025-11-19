import { useEffect, useState, useRef } from "react";
import { Wifi, WifiOff, Users, ChevronDown, FileText, Copy, MessageSquare, User, Phone, Mail, Send, Eye, } from "lucide-react";
import { toast } from "react-toastify";
import { waBlastService } from "../../services/WaBlastApi";
import QrModal from "../../components/QrModal";
import CustomerSelectionModal from "../../components/CustomerSelectionModal";
import { AggregateStatusBadge } from "../../utils/StatusBadge";
import BroadcastDetailModal from "../../components/BroadcastDetailModal";

export default function WaBlast() {
  // ===============================================
  // 1. STATE DECLARATIONS & REFS
  // ===============================================

  // === 1. DATA UTAMA & STATUS GLOBAL ===
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [statistics, setStatistics] = useState(null);

  // === 2. STATUS DEVICE & KONEKSI WA ===
  const [deviceStatus, setDeviceStatus] = useState({
    connected: false,
    loading: true,
  });
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [connecting, setConnecting] = useState(false);

  // === 3. FORM PESAN & UPLOAD ===
  const [form, setForm] = useState({
    judul_pesan: "",
    isi_pesan: "",
    gambar: null,
    media_url: null,
    gambarPreviewUrl: null,
    inputKey: Date.now(),
  });
  const textareaRef = useRef(null); // Ref untuk fokus/posisi kursor di textarea
  const formRef = useRef(null); // Ref untuk scrolling ke form
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false); // Status loading saat send blast

  // === 4. MODAL & LOG DETAIL BLAST ===
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [selectedBroadcastId, setSelectedBroadcastId] = useState(null);

  // === 5. CUSTOMER SELECTION MODAL (FILTER & SORT) ===
  const [showCustomerSelection, setShowCustomerSelection] = useState(false);

  // ===============================================
  // 2. STATIC DATA
  // ===============================================

  /* Template pesan yang sudah jadi */
  const messageTemplates = [
    {
      id: 1,
      nama: "Promo Diskon",
      kategori: "Promo",
      emoji: "🎉",
      judul: "Promo Spesial untuk {nama}!",
      isi: "Halo {nama}! 👋\n\nKami punya kabar gembira untuk Anda! 🎁\n\nDapatkan DISKON 50% untuk semua produk pilihan.\n\nPromo terbatas hanya sampai akhir bulan!\n\nJangan sampai kehabisan ya! 😊",
    },
    {
      id: 2,
      nama: "Pengingat Pembayaran",
      kategori: "Pengingat",
      emoji: "⏰",
      judul: "Pengingat Pembayaran",
      isi: "Halo {nama},\n\nIni adalah pengingat ramah bahwa pembayaran Anda akan jatuh tempo dalam 3 hari.\n\nMohon segera lakukan pembayaran untuk menghindari keterlambatan.\n\nTerima kasih atas perhatiannya! 🙏",
    },
    {
      id: 3,
      nama: "Ucapan Terima Kasih",
      kategori: "Ucapan",
      emoji: "💙",
      judul: "Terima Kasih {nama}!",
      isi: "Hai {nama}! 😊\n\nTerima kasih sudah menjadi pelanggan setia kami!\n\nKami sangat menghargai kepercayaan Anda.\n\nSemoga produk/layanan kami bermanfaat untuk Anda.\n\nSampai jumpa di pembelian berikutnya! 🙌",
    },
    {
      id: 4,
      nama: "Produk Baru",
      kategori: "Informasi",
      emoji: "🆕",
      judul: "Produk Baru Telah Hadir!",
      isi: "Halo {nama}! ✨\n\nKami punya kabar gembira!\n\nProduk terbaru kami sudah tersedia dan siap untuk Anda.\n\n🎯 Fitur unggulan:\n• Kualitas premium\n• Harga terjangkau\n• Garansi resmi\n\nYuk, jadi yang pertama mencoba! 🚀",
    },
    {
      id: 5,
      nama: "Follow Up",
      kategori: "Follow Up",
      emoji: "📞",
      judul: "Follow Up dari Kami",
      isi: "Halo {nama}, 👋\n\nKami ingin mengetahui bagaimana pengalaman Anda dengan produk/layanan kami?\n\nApakah ada yang bisa kami bantu?\n\nFeedback Anda sangat berharga bagi kami untuk terus meningkatkan pelayanan.\n\nTerima kasih! 💚",
    },
    {
      id: 6,
      nama: "Konfirmasi Pesanan",
      kategori: "Informasi",
      emoji: "✅",
      judul: "Konfirmasi Pesanan Anda",
      isi: "Halo {nama}! ✅\n\nPesanan Anda telah kami terima dan sedang diproses.\n\nNomor pesanan: #[ISI_NOMOR]\nEstimasi pengiriman: [ISI_TANGGAL]\n\nTerima kasih telah berbelanja dengan kami! 🛍️",
    },
    {
      id: 7,
      nama: "Reminder Stok",
      kategori: "Pengingat",
      emoji: "📦",
      judul: "Stok Terbatas!",
      isi: "Halo {nama}! 📦\n\nProduk favorit Anda hampir habis!\n\nStok tinggal sedikit, buruan pesan sebelum kehabisan.\n\nJangan sampai menyesal ya! ⚡",
    },
    {
      id: 8,
      nama: "Undangan Event",
      kategori: "Informasi",
      emoji: "🎊",
      judul: "Undangan Spesial untuk {nama}",
      isi: "Hai {nama}! 🎊\n\nKami mengundang Anda ke acara spesial kami!\n\n📅 Tanggal: [ISI_TANGGAL]\n⏰ Waktu: [ISI_WAKTU]\n📍 Lokasi: [ISI_LOKASI]\n\nDitunggu kehadirannya ya! 🎉",
    },
  ];

  // ===============================================
  // 3. SIDE EFFECTS / useEffect (Data Fetching & Polling)
  // ===============================================

  /* Fetch data pelanggan */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const pelangganRes = await waBlastService.getCustomers(100);

        // Filter yang punya nomor telepon
        const withPhone = pelangganRes.filter((pelanggan) => pelanggan.telepon);

        // Simpan ke state dan pilih semua secara default
        setCustomers(withPhone);

        // Pilih semua secara default
        setSelectedCustomers(
          withPhone.map((pelanggan) => pelanggan.pelanggan_id)
        );
      } catch (error) {
        console.error("Gagal mengambil data pelanggan:", error);
        toast.error("Gagal mengambil data pelanggan");
      }
    };

    fetchCustomers();
  }, []);

  /* Polling statistik blast (setiap 5 detik) */
  useEffect(() => {
    const fetchBlastStats = async () => {
      try {
        const blastStats = await waBlastService.getStats();
        setStatistics(blastStats);
      } catch (error) {
        console.log("Gagal mengambil statistics: ", error);
        // toast.error("Gagal mengambil statistik");
      }
    };

    fetchBlastStats();

    const interval = setInterval(fetchBlastStats, 5000);
    return () => clearInterval(interval);
  }, []);

  /* Polling status koneksi device WhatsApp (setiap 5 detik) */
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const statusRes = await waBlastService.getStatus();
        if (isMounted) {
          setDeviceStatus({
            connected: statusRes.status === "connected",
            loading: false,
          });
        }
      } catch {
        if (isMounted) {
          setDeviceStatus({ connected: false, loading: false });
        }
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  /* Load broadcast logs */
  useEffect(() => {
    loadBroadcasts();
  }, []);

  /* Cleanup Gambar */
  useEffect(() => {
    return () => {
      if (form.gambarPreviewUrl) URL.revokeObjectURL(form.gambarPreviewUrl);
    };
  }, [form.gambarPreviewUrl]);

  // ===============================================
  // 4. EVENT HANDLERS & API CALLS
  // ===============================================

  /* Load broadcast logs dari API */
  async function loadBroadcasts() {
    try {
      const response = await waBlastService.getLogs();
      setBroadcasts(response.data || []);
    } catch (error) {
      console.error("Failed to load broadcasts:", error);
      toast.error("Gagal memuat broadcast logs");
    }
  }

  /* Buka modal detail log per pesan */
  function openDetails(broadcastId) {
    setSelectedBroadcastId(broadcastId);
    setBroadcastModalOpen(true);
  }

  /* Koneksi device WhatsApp (QR) */
  async function connectDevice() {
    setConnecting(true);
    try {
      const response = await waBlastService.connect();
      if (response.status === "qr") {
        setQrValue(response.qr);
        setIsQrModalOpen(true);
      } else if (response.status === "connected") {
        setDeviceStatus((prev) => ({ ...prev, connected: true }));
        toast.success(response.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal connect device");
    } finally {
      setConnecting(false);
    }
  }

  /* Disconnect device WhatsApp */
  async function disconnectDevice() {
    setConnecting(true);
    try {
      const response = await waBlastService.disconnect();
      if (response.status === "disconnected") {
        setDeviceStatus((prev) => ({ ...prev, connected: false }));
        toast.success("Device berhasil disconnected");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal disconnect device");
    } finally {
      setConnecting(false);
    }
  }

  /* Handler perubahan file gambar & upload ke server */
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (form.gambarPreviewUrl) URL.revokeObjectURL(form.gambarPreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setForm((f) => ({ ...f, gambar: file, gambarPreviewUrl: previewUrl }));

    setUploadingImage(true);
    try {
      const uploadedUrl = await waBlastService.uploadImage(file);
      // Simpan URL dari server
      setForm((f) => ({ ...f, media_url: uploadedUrl, inputKey: Date.now() }));
    } catch (err) {
      console.error("Upload gagal:", err);
      toast.error("Gagal upload gambar");
      // Reset form jika upload gagal
      setForm((f) => ({
        ...f,
        gambar: null,
        gambarPreviewUrl: null,
        media_url: null,
        inputKey: Date.now(),
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  /* Handler cancel dan hapus gambar yang di upload */
  const removeImage = () => {
    if (form.gambarPreviewUrl) {
      URL.revokeObjectURL(form.gambarPreviewUrl);
    }
    setForm((f) => ({
      ...f,
      gambar: null,
      gambarPreviewUrl: null,
      media_url: null,
      inputKey: Date.now(),
    }));
  };

  /* Handler perubahan input form */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /* Insert placeholder variable ke textarea */
  function insertPlaceholder(placeholder) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.isi_pesan;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newText = before + placeholder + after;
    setForm({ ...form, isi_pesan: newText });

    // Set cursor position after inserted placeholder
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + placeholder.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  // Fungsi untuk menggunakan template
  function applyTemplate(template) {
    setForm({
      judul_pesan: template.judul,
      isi_pesan: template.isi,
    });
    // Scroll ke form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  /* Mengirim pesan blast ke semua pelanggan terpilih */
  const sendBlast = async () => {
    if (!form.judul_pesan || !form.isi_pesan) {
      alert("Judul dan isi pesan wajib diisi!");
      return;
    }

    setLoading(true);
    // Gabungkan judul dan isi pesan
    const fullMessage = `${form.judul_pesan}\n\n${form.isi_pesan}`;

    try {
      const res = await waBlastService.sendBlast({
        message: fullMessage,
        media_url: form.media_url || null,
        customer_ids: selectedCustomers,
      });

      toast.success(res.message || "Pesan berhasil dikirim!");
      // Reset form setelah sukses
      setForm({
        judul_pesan: "",
        isi_pesan: "",
        gambar: null,
        gambarPreviewUrl: null,
        media_url: null,
        inputKey: Date.now(),
      });
    } catch (err) {
      console.error("Blast failed:", err);
      toast.error(
        "Gagal mengirim pesan: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Device Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Kirim WA Broadcast
          </h3>
          <p className="text-sm text-slate-500">
            Kirim pesan ke pelanggan via WhatsApp
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Connect Button di header */}
          <button
            onClick={deviceStatus.connected ? disconnectDevice : connectDevice}
            disabled={connecting}
            className="px-3 py-1.5 bg-white border rounded-xl border-slate-200 shadow-sm text-sky-600 font-medium hover:shadow-md hover:border-sky-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Wifi className="w-4 h-4" />
            {connecting
              ? "Loading..."
              : deviceStatus.connected
              ? "Disconnect Device"
              : "Connect Device"}
          </button>
          {isQrModalOpen && (
            <QrModal
              qrCodeValue={qrValue}
              onClose={() => {
                setIsQrModalOpen(false);
                setQrValue("");
              }}
            />
          )}
          <div className="flex items-center gap-2 text-sm">
            {deviceStatus.loading ? (
              <span className="text-slate-400">Checking...</span>
            ) : deviceStatus.connected ? (
              <>
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">
                  Device Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="font-medium text-red-600">Device Offline</span>
              </>
            )}
          </div>
          <div
            className="flex items-center gap-2 px-2 py-1 text-sm rounded cursor-pointer text-slate-600 hover:bg-slate-100"
            onClick={() => setShowCustomerSelection(true)}
          >
            <Users className="w-4 h-4" />
            <span>
              {selectedCustomers.length} / {customers.length} Dipilih
            </span>
            <ChevronDown className="w-3 h-3" />
          </div>

          {/*Pilih Pelanggan Modal*/}
          {showCustomerSelection && (
            <CustomerSelectionModal
              customers={customers}
              selectedCustomers={selectedCustomers}
              setSelectedCustomers={setSelectedCustomers}
              onClose={() => setShowCustomerSelection(false)}
            />
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="text-sm text-slate-500">Total Broadcast</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {statistics.total_broadcast || 0}
            </div>
          </div>
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="text-sm text-slate-500">Total Penerima</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">
              {statistics.total_penerima || 0}
            </div>
          </div>
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="text-sm text-slate-500">Terkirim</div>
            <div className="mt-1 text-2xl font-bold text-green-600">
              {statistics.terkirim || 0}
            </div>
          </div>
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="text-sm text-slate-500">Gagal</div>
            <div className="mt-1 text-2xl font-bold text-red-600">
              {statistics.gagal || 0}
            </div>
          </div>
          <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
            <div className="text-sm text-slate-500">Success Rate</div>
            <div className="mt-1 text-2xl font-bold text-sky-600">
              {statistics.success_rate || 0}%
            </div>
          </div>
        </div>
      )}

      {/* Template Section */}
      <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-sky-600" />
          <h4 className="font-semibold text-slate-900">Template Pesan</h4>
          <span className="text-xs text-slate-500">
            ({messageTemplates.length} template siap pakai)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {messageTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => applyTemplate(template)}
              className="p-4 text-left transition-all border rounded-lg border-slate-200 hover:shadow-md hover:border-sky-300 bg-gradient-to-br from-white to-slate-50 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold truncate transition-colors text-slate-900 group-hover:text-sky-600">
                      {template.nama}
                    </h5>
                  </div>
                </div>
              </div>

              <span className="inline-block px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-xs mb-2">
                {template.kategori}
              </span>

              <div className="mb-2 text-xs text-slate-600">
                <p className="mb-1 font-medium text-slate-700 line-clamp-1">
                  {template.judul}
                </p>
                <p className="leading-relaxed line-clamp-2">{template.isi}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-medium transition-opacity opacity-0 text-sky-600 group-hover:opacity-100">
                <Copy className="w-3 h-3" />
                Klik untuk gunakan
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50">
          <p className="text-xs text-blue-800">
            💡 <strong>Tips:</strong> Klik template untuk langsung
            menggunakannya. Personalisasi otomatis dengan{" "}
            <code className="px-1 bg-blue-100 rounded">{"{nama}"}</code>,{" "}
            <code className="px-1 bg-blue-100 rounded">{"{telepon}"}</code>,{" "}
            <code className="px-1 bg-blue-100 rounded">{"{email}"}</code>
          </p>
        </div>
      </div>

      {/* Form & Preview Grid */}
      <div ref={formRef} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form Input */}
        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-sky-600" />
            <h4 className="font-semibold text-slate-900">Buat Pesan</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">
                Judul Pesan
              </label>
              <input
                type="text"
                name="judul_pesan"
                value={form.judul_pesan}
                onChange={handleChange}
                placeholder="Contoh: Promo Akhir Tahun"
                className="w-full px-3 py-2 border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Isi Pesan
              </label>

              {/* Variable Placeholder Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => insertPlaceholder("{nama}")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 text-sky-700 rounded-md text-xs font-medium hover:bg-sky-100 transition-colors border border-sky-200"
                >
                  <User className="w-3 h-3" />
                  {"{nama}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder("{telepon}")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  <Phone className="w-3 h-3" />
                  {"{telepon}"}
                </button>
                <button
                  type="button"
                  onClick={() => insertPlaceholder("{email}")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  <Mail className="w-3 h-3" />
                  {"{email}"}
                </button>
              </div>

              <textarea
                ref={textareaRef}
                name="isi_pesan"
                value={form.isi_pesan}
                onChange={handleChange}
                rows={8}
                placeholder="Tulis pesan broadcast Anda di sini...&#10;&#10;Contoh:&#10;Halo {nama}! 🎉&#10;Dapatkan diskon 50% untuk semua produk.&#10;Promo terbatas hingga akhir bulan!"
                className="w-full px-3 py-2 border rounded-lg resize-none border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <div className="mt-1 mb-1 text-xs text-slate-400">
                {form.isi_pesan.length} karakter
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-slate-700">
                  Gambar (Opsional)
                </label>

                <input
                  key={form.inputKey}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />

                {form.gambarPreviewUrl && (
                  <div className="relative inline-block mt-2">
                    <img
                      src={form.gambarPreviewUrl}
                      alt="Preview"
                      className="object-cover w-40 rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute px-2 py-[0.1875rem] text-red-600 bg-white border rounded-full shadow-sm -top-2 -right-2 hover:bg-red-50"
                      title="Hapus gambar"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={sendBlast}
              disabled={
                !form.judul_pesan ||
                !form.isi_pesan ||
                loading ||
                uploadingImage ||
                selectedCustomers.length === 0
              }
              className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-sky-500 to-sky-600 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {loading
                ? "Mengirim pesan..."
                : `Kirim ke ${selectedCustomers.length} Pelanggan`}
            </button>
          </div>
        </div>
        {/* Live Preview */}
        <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-sky-600" />
            <h4 className="font-semibold text-slate-900">Preview Pesan</h4>
          </div>

          {/* WhatsApp-like Preview */}
          <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg p-4 min-h-[400px]">
            <div className="max-w-xs p-3 space-y-2 bg-white rounded-lg shadow-md">
              {form.gambar && (
                <img
                  src={URL.createObjectURL(form.gambar)}
                  alt="Preview WhatsApp"
                  className="w-full mt-2 rounded-lg"
                />
              )}
              {form.judul_pesan ? (
                <div className="pb-2 text-sm font-semibold border-b text-slate-900 border-slate-100">
                  {form.judul_pesan}
                </div>
              ) : (
                <div className="pb-2 text-sm italic border-b text-slate-400 border-slate-100">
                  Judul pesan akan muncul di sini
                </div>
              )}

              {form.isi_pesan ? (
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
                  {form.isi_pesan}
                </div>
              ) : (
                <div className="text-sm italic text-slate-400">
                  Isi pesan akan muncul di sini...
                </div>
              )}

              <div className="pt-1 text-xs text-right text-slate-400">
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {(form.judul_pesan || form.isi_pesan) && (
              <div className="mt-4 text-xs text-center text-slate-500">
                Preview pesan WhatsApp
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
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
          <div className="py-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Belum ada riwayat broadcast</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-3 font-medium text-slate-700">Pesan</th>
                  <th className="pb-3 font-medium text-slate-700">Tanggal</th>
                  <th className="pb-3 font-medium text-slate-700">
                    Total Penerima
                  </th>
                  <th className="pb-3 font-medium text-slate-700">Terkirim</th>
                  <th className="pb-3 font-medium text-slate-700">Gagal</th>
                  <th className="pb-3 font-medium text-slate-700">Status</th>
                  <th className="pb-3 font-medium text-slate-700">Media</th>
                  <th className="pb-3 font-medium text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {broadcasts.map((b) => (
                  <tr key={b.broadcast_id} className="hover:bg-slate-50">
                    <td
                      className="max-w-xs py-3 truncate text-slate-600"
                      title={b.isi_pesan}
                    >
                      {b.isi_pesan}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(b.tanggal_kirim).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 text-slate-600">
                      {b.total_penerima || 0}
                    </td>
                    <td className="py-3 text-slate-600">{b.sent || 0}</td>
                    <td className="py-3 text-slate-600">{b.failed || 0}</td>
                    <td className="py-3">
                      <AggregateStatusBadge broadcast={b} />
                    </td>
                    <td className="py-3">
                      {b.media_url ? (
                        <button
                          onClick={() => waBlastService.openMedia(b.media_url)}
                          className="p-0 border-none cursor-pointer text-sky-600 hover:text-sky-700 bg-none"
                        >
                          Lihat Media
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => openDetails(b.broadcast_id)}
                        className="text-sm text-sky-600 hover:text-sky-700"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Broadcast Detail Modal */}
        {broadcastModalOpen && selectedBroadcastId && (
          <BroadcastDetailModal
            // Pass ID broadcast yang ingin dimuat datanya
            broadcastId={selectedBroadcastId}
            // Pass handler untuk menutup modal
            onClose={() => {
              setBroadcastModalOpen(false);
              setSelectedBroadcastId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

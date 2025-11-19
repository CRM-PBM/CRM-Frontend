import { useState, useMemo } from "react";
import { Users } from "lucide-react";

export default function CustomerSelectionModal({
  customers,
  selectedCustomers,
  setSelectedCustomers,
  onClose,
}) {
  // ===============================================
  // 1. STATE DECLARATIONS
  // ===============================================

  const [search, setSearch] = useState("");
  const [activeLevel, setActiveLevel] = useState("ALL");
  const [sortName, setSortName] = useState("asc");
  const [sortLevel, setSortLevel] = useState(null);

  // ===============================================
  // 2. DERIVED STATES / useMemo
  // ===============================================

  /* Mendapatkan daftar level unik dari pelanggan */
  const uniqueLevels = useMemo(() => {
    // Menghitung daftar level unik hanya saat 'customers' berubah
    return [...new Set(customers.map((pelanggan) => pelanggan.level))];
  }, [customers]);

  // Menyiapkan array level untuk filter (termasuk opsi "ALL") dan tombol pilih cepat
  const allLevels = ["ALL", ...uniqueLevels];
  const selectableLevels = uniqueLevels;

  /* Memproses pelanggan: Filtering (Pencarian & Level) dan Sorting */
  const processedCustomers = useMemo(() => {
    const levelOrder = { Bronze: 1, Silver: 2, Gold: 3, Platinum: 4 };

    // 1. Filtering: Menerapkan pencarian nama/telepon dan filter level aktif
    const filtered = customers.filter((pelanggan) => {
      const matchesSearch =
        pelanggan.nama.toLowerCase().includes(search.toLowerCase()) ||
        pelanggan.telepon.includes(search);

      const matchesLevel =
        activeLevel === "ALL" ? true : pelanggan.level === activeLevel;

      return matchesSearch && matchesLevel;
    });

    // 2. Sorting: Mengurutkan berdasarkan Level, kemudian Nama
    return [...filtered].sort((a, b) => {
      // Urutkan berdasarkan level jika sortLevel aktif
      if (sortLevel) {
        const levelDiff =
          sortLevel === "asc"
            ? levelOrder[a.level] - levelOrder[b.level]
            : levelOrder[b.level] - levelOrder[a.level];
        if (levelDiff !== 0) return levelDiff;
      }

      // Urutkan berdasarkan nama
      return sortName === "asc"
        ? a.nama.localeCompare(b.nama)
        : b.nama.localeCompare(a.nama);
    });
  }, [customers, search, activeLevel, sortName, sortLevel]);

  // ===============================================
  // 3. EVENT HANDLERS
  // ===============================================

  const handleSortLevelClick = (targetOrder) => {
    
    if (sortLevel === targetOrder) {
      setSortLevel(null);
    } else {
      setSortLevel(targetOrder);
    }
  };

  /* Toggle select pelanggan per ID */
  function toggleCustomer(customerId) {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  }

  /* Select/Deselect semua pelanggan berdasarkan level */
  const selectByLevel = (level) => {
    const ids = processedCustomers
      .filter((pelanggan) => pelanggan.level === level)
      .map((pelanggan) => pelanggan.pelanggan_id);

    const allSelected = ids.every((id) => selectedCustomers.includes(id));

    if (allSelected) {
      setSelectedCustomers((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedCustomers((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 w-96 max-w-[90%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h4 className="flex items-center gap-2 mb-4 font-semibold text-slate-900">
          <Users className="w-5 h-5 text-sky-600" />
          Pilih Pelanggan
        </h4>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Cari nama atau nomor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 mb-3 text-sm border rounded-lg border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* Level Filter */}
        <h5 className="text-xs font-semibold text-slate-900">Filter</h5>
        <div
          className={`flex mb-3 overflow-x-auto ${
            allLevels.length <= 3
              ? "justify-start gap-4"
              : allLevels.length === 4
              ? "justify-start gap-2"
              : "justify-between"
          }`}
        >
          {allLevels.map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={`px-3 py-1 text-xs rounded-full border ${
                activeLevel === level
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <h5 className="text-xs font-semibold text-slate-900">Urutkan</h5>

        <div className="flex justify-between gap-4">
          {/* Nama */}
          <div className="flex gap-2 mb-2 overflow-x-auto">
            {[
              { value: "asc", label: "Nama A–Z" },
              { value: "desc", label: "Nama Z–A" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSortName(opt.value)}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  sortName === opt.value
                    ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                    : "border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Level */}
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {[
              { value: "asc", label: "Level ↑" },
              { value: "desc", label: "Level ↓" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortLevelClick(opt.value)}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  sortLevel === opt.value
                    ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white"
                    : "border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Select Buttons */}
        <h5 className="text-xs font-semibold text-slate-900">Pilih cepat</h5>
        <div className="flex gap-2 px-1 mb-2 overflow-x-auto">
          {/* Select All / Deselect All */}
          <button
            onClick={() => {
              if (selectedCustomers.length === processedCustomers.length) {
                setSelectedCustomers([]);
              } else {
                setSelectedCustomers(
                  processedCustomers.map((c) => c.pelanggan_id)
                );
              }
            }}
            className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
              selectedCustomers.length === processedCustomers.length
                ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white "
                : "bg-gray-100 text-slate-700 border-slate-300 hover:bg-slate-200"
            }`}
          >
            Select All
          </button>

          {/* Select by Level */}
          {selectableLevels.map((level) => {
            const levelCustomers = processedCustomers.filter(
              (c) => c.level === level
            );

            const isLevelSelected =
              levelCustomers.length > 0 &&
              levelCustomers.every((c) =>
                selectedCustomers.includes(c.pelanggan_id)
              );

            return (
              <button
                key={level}
                onClick={() => selectByLevel(level)}
                className={`px-3 py-1 text-xs rounded-full border whitespace-nowrap ${
                  isLevelSelected
                    ? "bg-gradient-to-r from-sky-500 to-sky-600 hover:brightness-110 text-white"
                    : "bg-gray-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="flex flex-col space-y-2 overflow-y-auto max-h-[45vh]">
          {processedCustomers.map((cust) => (
            <label
              key={cust.pelanggan_id}
              className="flex items-center justify-between p-2 rounded hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(cust.pelanggan_id)}
                  onChange={() => toggleCustomer(cust.pelanggan_id)}
                />

                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{cust.nama}</span>
                  <span className="text-[10px] text-slate-500">
                    {cust.telepon || "-"}
                  </span>
                </div>
              </div>

              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  cust.level === "Platinum"
                    ? "bg-purple-100 text-purple-700"
                    : cust.level === "Gold"
                    ? "bg-yellow-100 text-yellow-700"
                    : cust.level === "Silver"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {cust.level}
              </span>
            </label>
          ))}
          {processedCustomers.length === 0 && (
            <p className="py-4 text-xs text-center text-slate-400">
              Tidak ada pelanggan
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-slate-400">
            Terpilih: {selectedCustomers.length}
          </span>

          <button
            className="px-3 py-1 text-sm text-white rounded bg-gradient-to-r from-sky-500 to-sky-600"
            onClick={onClose}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

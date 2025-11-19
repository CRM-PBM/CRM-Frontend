import { useState, useEffect } from "react";
import { waBlastService } from "../services/WaBlastApi";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";
import { MessageStatusBadge } from "../utils/StatusBadge";


export default function BroadcastDetailModal({ broadcastId, onClose }) {
  const [details, setDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  /* Buka modal detail log per pesan */
  useEffect(() => {
        if (!broadcastId) return;

        const fetchDetails = async () => {
            setLoadingDetails(true);
            try {
                // Gunakan broadcastId dari props
                const logs = await waBlastService.getBroadcastDetails(broadcastId);
                setDetails(logs);
            } catch (err) {
                console.error("Failed to load broadcast details:", err);
                toast.error("Gagal memuat detail broadcast");
                setDetails([]);
            } finally {
                setLoadingDetails(false);
            }
        };
        
        fetchDetails();
    }, [broadcastId]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-11/12 max-w-2xl p-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-900">Detail Broadcast</h4>
          <button
            onClick={onClose}
            className="text-xl font-bold text-red-500"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {loadingDetails ? (
          <p className="py-4 text-center text-slate-400">Loading...</p>
        ) : details.length === 0 ? (
          <p className="py-4 text-center text-slate-400">
            Belum ada riwayat penerima
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 text-left text-slate-700">Nomor HP</th>
                  <th className="pb-2 text-left text-slate-700">Status</th>
                  <th className="pb-2 text-left text-slate-700">Error</th>
                  <th className="pb-2 text-left text-slate-700">Pesan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {details.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2 text-slate-600">{d.phone_number}</td>
                    <td className="py-2"><MessageStatusBadge status={d.status} /></td>
                    <td className="py-2 text-red-600">{d.error || "-"}</td>
                    <td
                      className="max-w-xs py-2 truncate text-slate-600"
                      title={d.message}
                    >
                      {d.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

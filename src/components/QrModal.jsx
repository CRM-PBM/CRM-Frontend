import QRCode from "react-qr-code";
import { XCircle, Wifi } from "lucide-react";

export default function QrModal({ qrCodeValue, onClose }) {
  if (!qrCodeValue) return null;
  return(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 w-80 max-w-[90%] relative flex flex-col items-center">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
                <h4 className="flex items-center gap-2 mb-4 font-semibold text-center text-slate-900">
                  <Wifi className="w-5 h-5 text-sky-600" />
                  Scan QR untuk Connect
                </h4>
                {qrCodeValue ? (
                  <QRCode value={qrCodeValue} size={200} />
                ) : (
                  <p className="text-sm text-slate-500">Memuat QR...</p>
                )}
                <p className="mt-4 text-xs text-center text-slate-400">
                  Buka WhatsApp di HP dan scan QR untuk menghubungkan device.
                </p>
              </div>
            </div>
  )
}

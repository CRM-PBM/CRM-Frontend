import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { statusConfig, getAggregateStatus } from "./badgeLogic";

// eslint-disable-next-line no-unused-vars
const BaseStatusBadge = ({ color, Icon, label }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
  >
    <Icon className="w-3 h-3" />
    {label}
  </span>
);

export function MessageStatusBadge({ status }) { // Export sebagai Komponen!
    const normalized = status?.toLowerCase();
    const config = statusConfig[normalized] || statusConfig['pending'];
    const Icon = config.label === 'Failed' ? XCircle : (config.label === 'Terkirim' ? CheckCircle : Clock);

    return (
        <BaseStatusBadge 
            color={config.color} 
            Icon={Icon} 
            label={config.label} 
        />
    );
}

export function AggregateStatusBadge({ broadcast }) {
    const statusType = getAggregateStatus(broadcast); // Mengambil status dari logika JS
    
    // Tentukan konfigurasi berdasarkan statusType
    let config = {};
    let Icon = null;
    
    if (statusType === 'sending') {
        config = { color: "bg-sky-50 text-sky-700", label: "Sedang dikirim" }; Icon = Clock;
    } else if (statusType === 'success') {
        config = { color: "bg-green-50 text-green-700", label: "Terkirim sempurna" }; Icon = CheckCircle;
    } else if (statusType === 'failed') {
        config = { color: "bg-red-50 text-red-700", label: "Gagal" }; Icon = XCircle;
    } else {
        config = { color: "bg-amber-50 text-amber-700", label: "Terkirim, beberapa gagal" }; Icon = AlertTriangle;
    }

    return (
        <BaseStatusBadge 
            color={config.color} 
            Icon={Icon} 
            label={config.label} 
        />
    );
}
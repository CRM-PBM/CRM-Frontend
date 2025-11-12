import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, Package, BarChart2 } from 'lucide-react';

const QuickActionItem = ({ to, icon, title, subtitle, bgClass, textClass }) => (
    <Link
        to={to}
        className={`p-4 ${bgClass} hover:opacity-80 rounded-lg border ${textClass.replace('text', 'border')} transition-colors text-left`}
    >
        {React.createElement(icon, { className: `h-5 w-5 ${textClass} mb-2` })}
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
    </Link>
);

export default function QuickActionsCard() {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
                <QuickActionItem
                    to="/dashboard/transactions"
                    icon={ShoppingCart}
                    title="Transaksi Baru"
                    subtitle="Buat transaksi"
                    bgClass="bg-sky-50"
                    textClass="text-sky-600"
                />
                <QuickActionItem
                    to="/dashboard/customers"
                    icon={Users}
                    title="Kelola Pelanggan"
                    subtitle="Lihat & tambah"
                    bgClass="bg-purple-50"
                    textClass="text-purple-600"
                />
                <QuickActionItem
                    to="/dashboard/products"
                    icon={Package}
                    title="Kelola Produk"
                    subtitle="Update stok"
                    bgClass="bg-amber-50"
                    textClass="text-amber-600"
                />
                <QuickActionItem
                    to="/dashboard/wa" // Sesuaikan dengan rute WA Blast Anda
                    icon={BarChart2} 
                    title="Broadcast WA"
                    subtitle="Kirim promo"
                    bgClass="bg-green-50"
                    textClass="text-green-600"
                />
            </div>
        </div>
    );
}
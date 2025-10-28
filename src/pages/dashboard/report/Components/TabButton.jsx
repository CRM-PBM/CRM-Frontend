import React from 'react';

export default function TabButton({ label, icon: Icon, isActive, onClick }) {
    const activeClasses = isActive ? "border-sky-600 text-sky-600 font-semibold" : "border-transparent text-slate-500 hover:text-slate-700";
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeClasses} print:hidden`}
        >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="text-sm">{label}</span>
        </button>
    );
}
import React, { useState } from 'react';
import { Package, Tag, Layers, Settings } from 'lucide-react'; 

import ProductsPage from './Products'; 
import CategoriesAndTypePage from './CategoriesAndType'; 

export default function ProductManagement() {
  const [activeTab, setActiveTab] = useState('products'); // sebagai default tab

  const TABS = [
    { 
      id: 'products', 
      label: 'Produk', 
      icon: Package, 
      Component: ProductsPage 
    },
    { 
      id: 'categories', 
      label: 'Kategori & Jenis Produk', 
      icon: Layers, 
      Component: CategoriesAndTypePage 
    }
  ];

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.Component;

  return (
    <div className="space-y-6">
      {/* Tab Navigation (Sesuai dengan gaya yang Anda inginkan) */}
      <div className="border-b border-slate-200 bg-white rounded-xl shadow-sm">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                ${tab.id === activeTab
                  ? 'border-sky-600 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
                group inline-flex items-center px-1 py-3 border-b-2 text-sm transition-colors
              `}
            >
              <tab.icon 
                className={`
                  ${tab.id === activeTab 
                    ? 'text-sky-600' 
                    : 'text-slate-400 group-hover:text-slate-500'
                  } 
                  -ml-0.5 mr-2 h-5 w-5
                `}
                aria-hidden="true" 
              />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {ActiveComponent ? <ActiveComponent /> : <div className="p-4 text-center text-slate-500">Pilih tab untuk melihat konten.</div>}
      </div>
    </div>
  );
}
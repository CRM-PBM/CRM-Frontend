import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function PageButton({ page, currentPage, onClick, loading, className = '' }) {
    return (
        <button
            onClick={() => onClick(page)}
            disabled={loading}
            className={`w-10 h-10 items-center justify-center text-sm font-medium rounded-lg transition-colors flex ${
                currentPage === page
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {page}
        </button>
    )
}


export default function ProductPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  loading,
  itemsPerPage,
}) {
  const renderPageButtons = () => {
    const pages = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2
    
    // First page button
    if (totalPages > 0) {
        pages.push(
            <PageButton 
                key={1} 
                page={1} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
                loading={loading} 
            />
        )
    }

    // Ellipsis start
    if (showEllipsisStart) {
      pages.push(
        <span key="ellipsis-start" className="px-2 text-slate-400 hidden sm:inline">...</span>
      )
    }

    // Middle pages
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = start; i <= end; i++) {
        pages.push(
            <PageButton 
                key={i} 
                page={i} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
                loading={loading}
                className="hidden sm:flex" // Hide middle buttons on mobile
            />
        )
    }

    // Ellipsis end
    if (showEllipsisEnd) {
      pages.push(
        <span key="ellipsis-end" className="hidden sm:inline px-2 text-slate-400">...</span>
      )
    }
    
    // Last page button
    if (totalPages > 1) {
        pages.push(
            <PageButton 
                key={totalPages} 
                page={totalPages} 
                currentPage={currentPage} 
                onClick={setCurrentPage} 
                loading={loading}
            />
        )
    }

    return pages
  }

  return (
    <div className="p-4 border-t border-slate-200 bg-slate-50 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600 sm:hidden">
          Halaman {currentPage} dari {totalPages}
        </div>

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Page Buttons */}
          <div className="flex items-center gap-1">
            {renderPageButtons()}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Selanjutnya</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden sm:block text-sm text-slate-600">
          {itemsPerPage} per halaman
        </div>
      </div>
    </div>
  )
}
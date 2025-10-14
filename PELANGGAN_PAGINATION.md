# 📄 Pagination pada Manajemen Pelanggan

## ✨ Fitur yang Ditambahkan

### 1. **Server-Side Pagination**
- Pagination dilakukan di server untuk performa optimal
- Mengurangi beban transfer data dari backend
- Mendukung database yang besar tanpa masalah performa

### 2. **Responsive Design**
- Desktop: Tampilan lengkap dengan page numbers
- Mobile: Tampilan compact dengan info minimal
- Adaptive controls untuk berbagai ukuran layar

### 3. **State Management**
```javascript
const [currentPage, setCurrentPage] = useState(1)      // Halaman aktif
const [totalPages, setTotalPages] = useState(1)        // Total halaman
const [totalItems, setTotalItems] = useState(0)        // Total pelanggan
const [itemsPerPage] = useState(10)                    // 10 item per halaman
```

## 🔧 Implementasi

### **Load Data dengan Pagination:**
```javascript
async function loadPelanggan() {
  const response = await pelangganService.getAll({ 
    page: currentPage,      // Halaman yang diminta
    limit: itemsPerPage     // Jumlah item per halaman (10)
  })
  
  setList(response.data)
  setTotalPages(response.totalPages)
  setTotalItems(response.total)
}
```

### **Auto Reload on Page Change:**
```javascript
useEffect(() => {
  loadPelanggan()
}, [currentPage])  // Reload ketika halaman berubah
```

## 🎨 UI Components

### **1. Header dengan Info:**
```
┌─────────────────────────────────────────────────┐
│ Daftar Pelanggan            Halaman 1 dari 5    │
│ Menampilkan 1 - 10 dari 50 pelanggan            │
└─────────────────────────────────────────────────┘
```

### **2. Pagination Controls (Desktop):**
```
┌──────────────────────────────────────────┐
│  ← Sebelumnya  [1] ... [4][5][6] ... [10]  Selanjutnya →  │
└──────────────────────────────────────────┘
```

### **3. Pagination Controls (Mobile):**
```
┌────────────────────────────┐
│    Halaman 5 dari 10       │
│  ←  [1] ... [5] ... [10]  →  │
└────────────────────────────┘
```

## 📱 Responsive Features

### **Desktop (> 768px):**
- ✅ Full page numbers dengan ellipsis
- ✅ Text labels "Sebelumnya" & "Selanjutnya"
- ✅ Items per page info
- ✅ Page info di header

### **Mobile (< 768px):**
- ✅ Compact pagination dengan icon only
- ✅ First & Last page buttons
- ✅ Current page number
- ✅ Page info di atas controls

## 🔄 Smart Pagination Logic

### **1. Ellipsis Management:**
```javascript
// Tampilkan "..." jika ada banyak halaman
const showEllipsisStart = currentPage > 3
const showEllipsisEnd = currentPage < totalPages - 2
```

### **2. Dynamic Page Range:**
```javascript
// Tampilkan current page ± 1
const start = Math.max(2, currentPage - 1)
const end = Math.min(totalPages - 1, currentPage + 1)
```

### **3. Always Show First & Last:**
- Halaman pertama (1) selalu tampil
- Halaman terakhir selalu tampil
- Middle pages menyesuaikan dengan current page

## 🎯 User Interactions

### **1. Navigation Buttons:**
- **← Sebelumnya**: Ke halaman sebelumnya (disabled di page 1)
- **Selanjutnya →**: Ke halaman selanjutnya (disabled di page terakhir)
- **Page Numbers**: Klik langsung ke halaman tertentu

### **2. Smart Reset:**
```javascript
// Reset ke page 1 setelah create/update
setCurrentPage(1)
await loadPelanggan()

// Smart delete: ke page sebelumnya jika hapus item terakhir
if (list.length === 1 && currentPage > 1) {
  setCurrentPage(currentPage - 1)
}
```

### **3. Loading States:**
- Semua button disabled saat loading
- Prevent multiple clicks
- Smooth transitions

## 📊 Display Information

### **Header Info:**
```javascript
Menampilkan {start} - {end} dari {total} pelanggan
// Contoh: "Menampilkan 11 - 20 dari 50 pelanggan"
```

### **Calculation:**
```javascript
const start = (currentPage - 1) * itemsPerPage + 1
const end = Math.min(currentPage * itemsPerPage, totalItems)
```

## 🎨 Styling Classes

### **Active Page:**
```css
bg-sky-600 text-white  /* Blue background, white text */
```

### **Inactive Page:**
```css
bg-white border border-slate-300 hover:bg-slate-50
```

### **Disabled State:**
```css
disabled:opacity-50 disabled:cursor-not-allowed
```

## 🔍 Search Integration

### **Client-Side Filtering:**
```javascript
const filteredList = searchTerm
  ? list.filter(c => /* search logic */)
  : list
```

**Note**: Search bekerja pada data di halaman saat ini (10 items). Untuk search global, perlu implementasi server-side search.

## 📈 Performance Benefits

### **Sebelum Pagination:**
- ❌ Load 100 pelanggan sekaligus
- ❌ Transfer data besar
- ❌ Rendering berat di client

### **Sesudah Pagination:**
- ✅ Load 10 pelanggan per halaman
- ✅ Transfer data minimal
- ✅ Rendering cepat dan smooth
- ✅ Skalabilitas untuk database besar

## 🚀 Next Steps (Optional Enhancements)

1. **Server-Side Search:**
   - Implementasi search API endpoint
   - Real-time search di semua data

2. **Adjustable Items Per Page:**
   - Dropdown: 10, 25, 50, 100 items
   - Save preference di localStorage

3. **URL State Management:**
   - Sync page dengan URL query params
   - Bookmarkable pages

4. **Keyboard Navigation:**
   - Arrow keys untuk navigasi
   - Enter untuk select page

5. **Loading Skeleton:**
   - Skeleton loader untuk UX lebih baik
   - Smooth transitions

## ✅ Testing Checklist

- [x] Page 1 loads correctly
- [x] Navigate to next/previous page
- [x] Click specific page number
- [x] First page button disabled on page 1
- [x] Last page button disabled on last page
- [x] Correct page info display
- [x] Responsive on mobile
- [x] Loading states work properly
- [x] Delete last item navigates correctly
- [x] Create/update resets to page 1

## 📝 API Response Format

```json
{
  "success": true,
  "data": [...],           // Array of pelanggan (10 items)
  "total": 50,             // Total pelanggan di database
  "totalPages": 5,         // Total halaman (50 / 10 = 5)
  "currentPage": 1,        // Halaman saat ini
  "limit": 10              // Items per halaman
}
```

---

**Status**: ✅ Implemented and Working
**Date**: October 14, 2025
**Version**: 1.0.0

# Integrasi Pelanggan dengan REST API

## Overview
Komponen `Customers` telah diintegrasikan dengan REST API untuk manajemen pelanggan.

## Service Layer: `pelangganService.js`

### Base Configuration
```javascript
import api from './authService'  // Menggunakan axios instance dengan auth token
const PELANGGAN_URL = '/pelanggan'
```

### Available Methods

#### 1. Get All Pelanggan
```javascript
pelangganService.getAll({ limit: 100, search: 'keyword' })
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "pelanggan_id": 1,
      "nama": "John Doe",
      "telepon": "08123456789",
      "email": "john@example.com",
      "alamat": "Jl. Sudirman No. 123",
      "gender": "Pria",
      "level": "Silver",
      "Umkm": {
        "umkm_id": 1,
        "nama_umkm": "UMKM Saya"
      }
    }
  ]
}
```

#### 2. Get Pelanggan by ID
```javascript
pelangganService.getById(pelangganId)
```

#### 3. Create New Pelanggan
```javascript
pelangganService.create({
  nama: "Test User",
  telepon: "08123456789",
  email: "test@example.com",
  alamat: "Jl. Test No. 123",
  gender: "Pria",
  level: "Silver"
})
```
**Response:**
```json
{
  "success": true,
  "message": "Pelanggan berhasil ditambahkan",
  "data": {
    "pelanggan_id": 9,
    "nama": "Test User",
    "telepon": "08123456789",
    "email": "test@example.com",
    "alamat": "Jl. Test No. 123",
    "gender": "Pria",
    "level": "Silver",
    "umkm_id": 8
  }
}
```

#### 4. Update Pelanggan
```javascript
pelangganService.update(pelangganId, {
  nama: "Updated Name",
  telepon: "08987654321"
})
```

#### 5. Delete Pelanggan
```javascript
pelangganService.delete(pelangganId)
```

## Component Features

### State Management
```javascript
const [list, setList] = useState([])          // Daftar pelanggan
const [loading, setLoading] = useState(false) // Loading state
const [searchTerm, setSearchTerm] = useState('') // Search keyword
const [form, setForm] = useState({...})       // Form data
const [editMode, setEditMode] = useState(false) // Edit mode flag
const [editId, setEditId] = useState(null)    // ID pelanggan yang diedit
```

### Main Functions

#### Load Pelanggan
```javascript
async function loadPelanggan() {
  const response = await pelangganService.getAll({ limit: 100 })
  if (response.success) {
    setList(response.data || [])
  }
}
```

#### Create/Update Pelanggan
```javascript
async function handleSubmit(e) {
  e.preventDefault()
  
  if (editMode) {
    await pelangganService.update(editId, form)
  } else {
    await pelangganService.create(form)
  }
  
  await loadPelanggan() // Reload data
}
```

#### Delete Pelanggan
```javascript
async function handleDelete(id) {
  if (!confirm('Yakin hapus?')) return
  await pelangganService.delete(id)
  await loadPelanggan()
}
```

#### Edit Pelanggan
```javascript
function handleEdit(pelanggan) {
  setEditMode(true)
  setEditId(pelanggan.pelanggan_id)
  setForm({
    nama: pelanggan.nama,
    telepon: pelanggan.telepon,
    // ... field lainnya
  })
}
```

## UI Components

### 1. Form Input
- **Nama** (required) - dengan icon User
- **Telepon** (required) - dengan icon Phone
- **Email** (optional) - dengan icon Mail
- **Gender** - Select: Pria/Wanita
- **Alamat** - Textarea dengan icon MapPin
- **Level** - Select: Bronze/Silver/Gold/Platinum

### 2. Search Bar
- Real-time search berdasarkan nama, telepon, atau email
- Icon Search di sebelah kiri input

### 3. Customer List
- Card design dengan hover effect
- Menampilkan:
  - Nama dengan badge level (warna berbeda per level)
  - Badge gender
  - Telepon, email, alamat (dengan icon)
  - Nama UMKM
- Action buttons: Edit & Delete

### 4. Loading States
- Loader animation saat loading data
- Disabled buttons saat loading
- Loading spinner di tombol submit

### 5. Empty States
- Tampilan ketika belum ada data
- Tampilan ketika search tidak menemukan hasil

## Level Badge Colors
- **Platinum**: Purple (bg-purple-100, text-purple-700)
- **Gold**: Yellow (bg-yellow-100, text-yellow-700)
- **Silver**: Slate (bg-slate-100, text-slate-700)
- **Bronze**: Orange (bg-orange-100, text-orange-700)

## Error Handling
```javascript
try {
  // API call
} catch (error) {
  const errorMsg = error.response?.data?.message || 'Fallback error message'
  toast.error(errorMsg)
}
```

## Toast Notifications
- ✅ Success: "Pelanggan berhasil ditambahkan"
- ✅ Success: "Pelanggan berhasil diupdate"
- ✅ Success: "Pelanggan berhasil dihapus"
- ❌ Error: "Gagal memuat data pelanggan"
- ❌ Error: "Nama dan telepon wajib diisi"

## Authentication
Service menggunakan `api` dari `authService.js` yang otomatis:
- Menambahkan Bearer token ke setiap request
- Handle 401 error (redirect ke login)
- Menambahkan base URL: `http://localhost:3000/api`

## Icons Used (lucide-react)
- User - Pelanggan/Nama
- Phone - Telepon
- Mail - Email
- MapPin - Alamat
- Edit2 - Edit button
- Trash2 - Delete button
- Plus - Add button
- Search - Search bar
- Loader - Loading state

## Usage Example
```javascript
import Customers from './pages/dashboard/Customers'

// Di Dashboard
<Route path="customers" element={<Customers />} />
```

## Dependencies
```json
{
  "react": "^19.1.1",
  "react-toastify": "^11.0.5",
  "lucide-react": "^0.468.0"
}
```

## API Endpoints
- `GET /api/pelanggan?limit=100` - Get all
- `GET /api/pelanggan/:id` - Get by ID
- `POST /api/pelanggan` - Create
- `PUT /api/pelanggan/:id` - Update
- `DELETE /api/pelanggan/:id` - Delete

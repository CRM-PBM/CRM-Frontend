# 🎯 Dashboard Topbar - User Authentication Integration

## 📋 Overview
Dashboard Topbar telah diupdate untuk menampilkan data user yang sudah login menggunakan data dari localStorage yang diisi saat proses login.

## ✨ Fitur Baru

### 1. **Dynamic User Information**
Topbar sekarang menampilkan informasi user yang sedang login:
- ✅ Nama pengguna
- ✅ Email
- ✅ Nama UMKM/Bisnis
- ✅ Role/Jabatan
- ✅ Inisial nama di avatar

### 2. **User Dropdown Menu**
Klik pada avatar untuk membuka dropdown menu dengan:
- 📊 Informasi lengkap user
- 👤 Link ke Profil Saya
- ⚙️ Link ke Pengaturan
- 🚪 Tombol Logout

### 3. **Dynamic Greeting**
Greeting yang berubah sesuai waktu:
- 🌅 **Pagi** (00:00 - 11:59): "Selamat Pagi"
- ☀️ **Siang** (12:00 - 14:59): "Selamat Siang"
- 🌤️ **Sore** (15:00 - 17:59): "Selamat Sore"
- 🌙 **Malam** (18:00 - 23:59): "Selamat Malam"

### 4. **User Avatar with Initials**
Avatar menampilkan inisial nama pengguna:
- Jika nama 2 kata: Ambil huruf pertama dari kata pertama dan kedua
- Jika nama 1 kata: Ambil 2 huruf pertama
- Fallback: "U" jika tidak ada nama

### 5. **Logout Functionality**
Tombol logout yang terintegrasi dengan:
- ✅ Call API logout endpoint
- ✅ Clear tokens dari localStorage
- ✅ Redirect ke halaman login
- ✅ Tampilkan notifikasi toast

## 🔧 Implementasi Teknis

### Dependencies
```javascript
import { getUser, clearTokens } from '../services/storage'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
```

### State Management
```javascript
const [user, setUser] = useState(null)
const [showUserMenu, setShowUserMenu] = useState(false)
```

### Load User Data
```javascript
useEffect(() => {
  const userData = getUser()
  if (userData) {
    setUser(userData)
  }
}, [])
```

### User Data Structure
Data yang diambil dari localStorage dengan key `user`:
```javascript
{
  user_id: 7,
  email: "dandywahyudin19@gmail.com",
  role: "umkm",
  umkm_id: 8,
  nama_umkm: "Testing",
  nama_pemilik: "Dandy Wahyudin" // Optional
}
```

## 📱 UI Components

### 1. **User Avatar Button**
```jsx
<button onClick={() => setShowUserMenu(!showUserMenu)}>
  <div className="avatar">
    {getInitials(user?.nama_pemilik || user?.email)}
  </div>
  <div className="user-info">
    <div>{getDisplayName()}</div>
    <div>{getBusinessName()}</div>
  </div>
</button>
```

### 2. **Dropdown Menu**
```jsx
{showUserMenu && (
  <div className="dropdown-menu">
    {/* User Info Section */}
    <div className="user-profile">
      <div className="avatar-large">
        {getInitials()}
      </div>
      <div>
        <div>{getDisplayName()}</div>
        <div>{user?.email}</div>
        <div>{getBusinessName()}</div>
        <span>{getRoleDisplay()}</span>
      </div>
    </div>

    {/* Menu Items */}
    <button>👤 Profil Saya</button>
    <button>⚙️ Pengaturan</button>

    {/* Logout */}
    <button onClick={handleLogout}>
      🚪 Keluar
    </button>
  </div>
)}
```

## 🎨 Helper Functions

### 1. `getInitials(name)`
Mengambil inisial dari nama:
```javascript
const getInitials = (name) => {
  if (!name) return 'U'
  const nameParts = name.split(' ')
  if (nameParts.length >= 2) {
    return nameParts[0][0] + nameParts[1][0]  // "Dandy Wahyudin" → "DW"
  }
  return name.substring(0, 2).toUpperCase()    // "Dandy" → "DA"
}
```

### 2. `getDisplayName()`
Menampilkan nama user:
```javascript
const getDisplayName = () => {
  if (!user) return 'Pengguna'
  return user.nama_pemilik || user.email || 'Pengguna'
}
```

### 3. `getBusinessName()`
Menampilkan nama bisnis:
```javascript
const getBusinessName = () => {
  if (!user) return 'UMKM'
  return user.nama_umkm || 'UMKM Saya'
}
```

### 4. `getGreeting()`
Greeting berdasarkan waktu:
```javascript
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}
```

### 5. `getRoleDisplay()`
Menampilkan role dalam bahasa Indonesia:
```javascript
const getRoleDisplay = () => {
  if (!user) return ''
  const roleMap = {
    'umkm': 'Pemilik UMKM',
    'admin': 'Administrator',
    'staff': 'Staff'
  }
  return roleMap[user.role] || user.role
}
```

### 6. `handleLogout()`
Fungsi logout:
```javascript
const handleLogout = async () => {
  try {
    await authService.logout()
    clearTokens()
    toast.info('Anda telah keluar')
    navigate('/login')
  } catch (error) {
    clearTokens()
    toast.info('Anda telah keluar')
    navigate('/login')
  }
}
```

## 🎯 Use Cases

### Scenario 1: User Login
```
1. User login dengan email & password
2. API return user data + tokens
3. Data disimpan di localStorage
4. DashboardTopbar load data dari localStorage
5. Tampilkan nama, email, UMKM di topbar
```

### Scenario 2: View User Info
```
1. User klik avatar di topbar
2. Dropdown menu muncul
3. Tampilkan:
   - Avatar dengan inisial
   - Nama lengkap
   - Email
   - Nama UMKM
   - Role badge
```

### Scenario 3: Logout
```
1. User klik avatar → dropdown terbuka
2. Klik tombol "Keluar"
3. Call API logout
4. Clear tokens dari localStorage
5. Toast notification muncul
6. Redirect ke /login
```

## 📊 Visual Display

### Avatar Display
```
┌─────────────────────────────────┐
│ [DW] Dandy Wahyudin            │
│      Testing                    │
└─────────────────────────────────┘
```

### Dropdown Menu
```
┌───────────────────────────────────┐
│  [DW]  Dandy Wahyudin            │
│        dandywahyudin19@gmail.com  │
│        Testing [Pemilik UMKM]    │
├───────────────────────────────────┤
│  👤 Profil Saya                  │
│  ⚙️ Pengaturan                   │
├───────────────────────────────────┤
│  🚪 Keluar                        │
└───────────────────────────────────┘
```

### Greeting Display
```
Pagi (07:30):
"Dashboard"
"Selamat Pagi, Dandy Wahyudin! 👋"

Siang (13:00):
"Dashboard"
"Selamat Siang, Dandy Wahyudin! 👋"
```

## 🔒 Security Considerations

### 1. **Token Management**
- Access token & refresh token disimpan di localStorage
- Automatic refresh token saat expired
- Clear tokens saat logout

### 2. **User Data Privacy**
- Data user hanya tersimpan di localStorage
- Tidak ada data sensitif yang di-log
- Data di-clear saat logout

### 3. **Logout Handling**
- Even if API fails, local tokens tetap di-clear
- User tetap di-redirect ke login
- Mencegah zombie session

## 🎨 Styling

### Avatar Gradient
```css
bg-gradient-to-br from-sky-500 to-sky-600
```

### Role Badge
```css
bg-sky-100 text-sky-700
```

### Dropdown Shadow
```css
shadow-lg border border-slate-200
```

## 🧪 Testing Checklist

- [x] Login dengan user baru
- [x] Data user tampil di topbar
- [x] Avatar menampilkan inisial yang benar
- [x] Greeting berubah sesuai waktu
- [x] Dropdown menu buka/tutup dengan benar
- [x] Logout berhasil clear tokens
- [x] Redirect ke login setelah logout
- [x] Toast notification muncul
- [x] Click outside dropdown menutup menu
- [x] Responsive di mobile & desktop

## 📱 Responsive Behavior

### Desktop (lg+)
- Full nama dan bisnis ditampilkan
- Search bar visible
- User info lengkap di dropdown

### Tablet (md)
- Nama tetap tampil
- Search bar hidden
- Dropdown tetap full

### Mobile (sm-)
- Hamburger menu visible
- Nama & bisnis hidden (hanya avatar)
- Dropdown menu full-width

## 🚀 Future Enhancements

### Planned Features:
- [ ] Profile page untuk edit user data
- [ ] Settings page untuk preferensi
- [ ] Real-time notifications
- [ ] User avatar upload
- [ ] Recent activities di dropdown
- [ ] Quick actions di dropdown

## 🐛 Known Issues

### None currently

## 💡 Tips

### Custom Avatar Color
Anda bisa mengubah warna avatar berdasarkan role:
```javascript
const getAvatarColor = () => {
  const colors = {
    'umkm': 'from-sky-500 to-sky-600',
    'admin': 'from-purple-500 to-purple-600',
    'staff': 'from-green-500 to-green-600'
  }
  return colors[user?.role] || 'from-sky-500 to-sky-600'
}
```

### Custom Greeting
Tambahkan greeting spesial untuk hari-hari tertentu:
```javascript
const getSpecialGreeting = () => {
  const today = new Date()
  const day = today.getDay()
  const date = today.getDate()
  const month = today.getMonth()
  
  if (day === 0) return 'Selamat Hari Minggu'
  if (day === 5) return 'Selamat Jumat Berkah'
  if (date === 1 && month === 0) return 'Selamat Tahun Baru'
  
  return getGreeting()
}
```

## 📚 Related Documentation

- `REFRESH_TOKEN_IMPLEMENTATION.md` - Token management
- `src/services/storage.js` - Storage utilities
- `src/services/authService.js` - Authentication API

---

**Version:** 1.0.0  
**Last Updated:** 19 Oktober 2025  
**Component:** DashboardTopbar  
**Status:** ✅ Production Ready

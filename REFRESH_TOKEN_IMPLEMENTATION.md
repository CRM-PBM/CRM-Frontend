# Implementasi Refresh Token Authentication

## 📋 Overview
Dokumentasi ini menjelaskan perubahan yang dibuat untuk mengimplementasikan fitur **refresh token** dalam sistem autentikasi aplikasi CRM Frontend.

## 🔄 Perubahan API Response
API login sekarang mengembalikan response dengan format baru:

```json
{
    "msg": "Login berhasil.",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "user_id": 7,
        "email": "dandywahyudin19@gmail.com",
        "role": "umkm",
        "umkm_id": 8,
        "nama_umkm": "Testing"
    }
}
```

### Perbedaan dengan Format Lama:
- **Sebelumnya**: `token` (single token)
- **Sekarang**: `accessToken` dan `refreshToken` (dual token system)

## 📝 File yang Dimodifikasi

### 1. `src/services/storage.js`
**Perubahan Utama:**
- ✅ Menambahkan fungsi-fungsi manajemen token:
  - `getAccessToken()` - Mengambil access token dari localStorage
  - `getRefreshToken()` - Mengambil refresh token dari localStorage
  - `setTokens(accessToken, refreshToken)` - Menyimpan kedua token
  - `setAccessToken(accessToken)` - Menyimpan hanya access token
  - `clearTokens()` - Menghapus semua token dan data user
  - `getUser()` - Mengambil data user dari localStorage
  - `setUser(user)` - Menyimpan data user ke localStorage

**Contoh Penggunaan:**
```javascript
import { setTokens, getAccessToken, clearTokens } from './services/storage'

// Simpan tokens setelah login
setTokens(accessToken, refreshToken)

// Ambil access token
const token = getAccessToken()

// Hapus semua tokens saat logout
clearTokens()
```

### 2. `src/services/authService.js`
**Perubahan Utama:**
- ✅ Import fungsi token management dari `storage.js`
- ✅ Implementasi **automatic token refresh** pada response interceptor
- ✅ Menangani 401 error dengan mencoba refresh token otomatis
- ✅ Queue system untuk request yang gagal selama proses refresh
- ✅ Update logout function untuk clear tokens

**Fitur Baru:**
1. **Automatic Token Refresh**: Ketika access token expired (401), sistem otomatis mencoba refresh menggunakan refresh token
2. **Request Queue**: Request yang gagal karena token expired akan di-queue dan di-retry setelah token berhasil di-refresh
3. **Fallback to Login**: Jika refresh token juga expired, user akan diarahkan ke halaman login

**Flow Diagram:**
```
Request → 401 Error → Check Refresh Token
                          ↓
                     Valid? → Yes → Refresh Access Token
                          ↓              ↓
                          No        Retry Request
                          ↓              ↓
                   Clear Tokens    Success/Fail
                          ↓
                   Redirect Login
```

### 3. `src/pages/LoginPage.jsx`
**Perubahan Utama:**
- ✅ Import `setTokens` dan `setUser` dari `storage.js`
- ✅ Update handleSubmit untuk menyimpan `accessToken` dan `refreshToken`
- ✅ Menampilkan success message dari API response

**Kode Sebelum:**
```javascript
localStorage.setItem('token', res.token)
localStorage.setItem('user', JSON.stringify(res.user))
```

**Kode Sesudah:**
```javascript
setTokens(res.accessToken, res.refreshToken)
setUser(res.user)
```

### 4. `src/pages/RegisterPage.jsx`
**Perubahan Utama:**
- ✅ Import `setTokens` dan `setUser` dari `storage.js`
- ✅ Support dual token system dengan fallback ke single token (backward compatibility)

**Backward Compatibility:**
```javascript
if (res.accessToken && res.refreshToken) {
    setTokens(res.accessToken, res.refreshToken)
} else if (res.token) {
    // Fallback untuk API lama
    setTokens(res.token, res.token)
}
```

### 5. `src/App.jsx`
**Perubahan Utama:**
- ✅ Import `getAccessToken` dari `storage.js`
- ✅ Update ProtectedRoute untuk menggunakan `getAccessToken()` bukan `localStorage.getItem('token')`

### 6. `src/pages/InvoiceGeneratorPage.jsx`
**Perubahan Utama:**
- ✅ Import `getAccessToken` dari `storage.js`
- ✅ Update `getAuthHeaders()` untuk menggunakan `getAccessToken()`

### 7. `src/components/Sidebar.jsx`
**Perubahan Utama:**
- ✅ Import dependencies untuk logout: `useNavigate`, `toast`, `authService`, `clearTokens`
- ✅ Implementasi fungsi `handleLogout()`
- ✅ Attach `handleLogout` ke tombol "Keluar" (mobile & desktop)

**Fitur Logout:**
```javascript
const handleLogout = async () => {
  try {
    await authService.logout()
    toast.info('Anda telah keluar')
    navigate('/login')
  } catch (error) {
    // Even if logout fails, clear tokens and redirect
    clearTokens()
    navigate('/login')
  }
}
```

## 🔐 Keamanan & Best Practices

### Token Storage
- **Access Token**: Disimpan di localStorage dengan key `accessToken`
- **Refresh Token**: Disimpan di localStorage dengan key `refreshToken`
- **User Data**: Disimpan di localStorage dengan key `user`

⚠️ **Catatan Keamanan**: Untuk production, pertimbangkan menggunakan httpOnly cookies untuk menyimpan refresh token.

### Token Lifecycle
1. **Login**: Server mengirim `accessToken` (expired 15 menit) dan `refreshToken` (expired 7 hari)
2. **Request**: Setiap request menggunakan `accessToken` di header Authorization
3. **Token Expired**: Ketika `accessToken` expired, interceptor otomatis:
   - Memanggil endpoint `/auth/refresh` dengan `refreshToken`
   - Mendapat `accessToken` baru
   - Retry request yang gagal dengan token baru
4. **Refresh Token Expired**: User diarahkan ke login page

## 🧪 Testing

### Test Case 1: Login Success
```javascript
// Response yang diharapkan
{
    "msg": "Login berhasil.",
    "accessToken": "...",
    "refreshToken": "...",
    "user": {...}
}

// Verifikasi
console.log(localStorage.getItem('accessToken')) // Should exist
console.log(localStorage.getItem('refreshToken')) // Should exist
console.log(localStorage.getItem('user')) // Should exist
```

### Test Case 2: Auto Token Refresh
```javascript
// Scenario: Access token expired, refresh token valid
// Expected: Request berhasil setelah token di-refresh

// Cek console log:
// "Token refreshed successfully"
// Request akan di-retry otomatis
```

### Test Case 3: Complete Token Expiry
```javascript
// Scenario: Both tokens expired
// Expected: Redirect ke /login
// Semua tokens di-clear dari localStorage
```

### Test Case 4: Logout
```javascript
// Expected behavior:
// 1. Call /auth/logout endpoint
// 2. Clear all tokens from localStorage
// 3. Redirect to /login
// 4. Show toast notification
```

## 🚀 Deployment Checklist

- [x] Update storage.js dengan token management functions
- [x] Update authService.js dengan auto-refresh interceptor
- [x] Update LoginPage.jsx untuk handle new response format
- [x] Update RegisterPage.jsx dengan backward compatibility
- [x] Update App.jsx untuk use new token getter
- [x] Update InvoiceGeneratorPage.jsx
- [x] Update Sidebar.jsx dengan logout functionality
- [ ] Test login flow end-to-end
- [ ] Test token refresh flow
- [ ] Test logout functionality
- [ ] Monitor console logs untuk error

## 🔧 Konfigurasi Backend (Reference)

Pastikan backend sudah mengimplementasikan:

1. **POST /api/auth/login**
   - Response: `{ accessToken, refreshToken, user, msg }`

2. **POST /api/auth/refresh**
   - Request body: `{ refreshToken }`
   - Response: `{ accessToken }`

3. **POST /api/auth/logout**
   - Header: `Authorization: Bearer <accessToken>`
   - Response: `{ msg }`

## 📚 Resources

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Refresh Token](https://oauth.net/2/refresh-tokens/)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

## 🐛 Troubleshooting

### Issue: Token tidak tersimpan setelah login
**Solution**: Cek response API, pastikan format sesuai dengan yang diharapkan

### Issue: Infinite redirect ke /login
**Solution**: Cek apakah `getAccessToken()` return value yang benar

### Issue: Request tetap 401 setelah refresh
**Solution**: 
1. Cek `/auth/refresh` endpoint di backend
2. Verify refresh token belum expired
3. Cek console log untuk error details

### Issue: Logout tidak clear semua data
**Solution**: Gunakan `clearTokens()` function yang sudah disediakan

## 👤 Author
Updated by: Dandy Wahyudin  
Date: 2025-01-19  
Version: 2.0.0 (Refresh Token Implementation)

---

**Status**: ✅ COMPLETED - Siap untuk testing

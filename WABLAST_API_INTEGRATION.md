# WA Blast REST API Integration

## 📡 Backend API Endpoints

Base URL: `http://localhost:3000/api`

### Endpoints Implemented:

1. **Device Status**
   - `GET /broadcast/device/status`
   - Check WhatsApp device connection status

2. **Get All Broadcasts**
   - `GET /broadcast?page=1&limit=10&status=draft`
   - Fetch broadcast history with pagination

3. **Get Broadcast by ID**
   - `GET /broadcast/:id`
   - Get details of specific broadcast

4. **Create Broadcast (Draft)**
   - `POST /broadcast`
   - Body: `{ judul_pesan, isi_pesan, pelanggan_ids[] }`

5. **Send Broadcast**
   - `POST /broadcast/:id/send`
   - Body (NEW): `{ wa_number_key: "string" }`
   - Send draft broadcast to recipients with WhatsApp Number Key

6. **Delete Broadcast**
   - `DELETE /broadcast/:id`

7. **Get Statistics**
   - `GET /broadcast/statistik`
   - Get overall broadcast statistics

8. **Get Pelanggan**
   - `GET /pelanggan?limit=100`
   - Fetch customers for broadcast recipients

### ⭐ NEW: WhatsApp Number Key Management

9. **Set/Save WhatsApp Number Key**
   - `POST /watzap/number-key`
   - Body: `{ wa_number_key: "TEST123" }`
   - Response: `{ success: true, data: { wa_number_key: "TEST123" } }`

10. **Get Current WhatsApp Number Key**
    - `GET /watzap/number-key`
    - Response: `{ success: true, data: { wa_number_key: "TEST123" } }`

11. **Check WhatsApp Status**
    - `GET /watzap/status`
    - Check WhatsApp device connection

## 🎯 Features Implemented

### 1. **Device Status Monitor**
- Real-time WhatsApp device connection status
- Visual indicator (Wifi icon - green/red)
- Prevents sending when device offline

### 2. **Live Preview**
- WhatsApp-style message preview
- Updates in real-time as you type
- Shows judul_pesan and isi_pesan

### 3. **WhatsApp Number Key Configuration** ⭐ NEW
- Set/Save WhatsApp Number Key
- Display current active Number Key
- Toggle between view/edit mode
- Validation and error handling
- Configuration UI with helpful tips

### 4. **Draft Management**
- Create broadcast drafts first
- Review before sending
- Delete drafts if needed

### 5. **Send Workflow**
1. Set WhatsApp Number Key in configuration section
2. Fill judul_pesan & isi_pesan
3. System creates draft via API
4. Draft appears in history table
5. Click "Kirim" button to send
6. API sends to all pelanggan using Number Key
7. Status updates to "Terkirim"

### 6. **Statistics Dashboard**
- Total broadcasts
- Total recipients
- Success count
- Success rate percentage

### 7. **Broadcast History**
- Table with all past broadcasts
- Status badges (Draft/Terkirim/Gagal)
- Action buttons (Send/Delete)
- Timestamp and recipient count

## 📊 Data Structure

### Broadcast Object:
```javascript
{
  broadcast_id: "string",
  judul_pesan: "string",
  isi_pesan: "string",
  tanggal_kirim: "ISO date string",
  status: "draft" | "terkirim" | "gagal",
  user_id: "string",
  stats: {
    total_penerima: number,
    terkirim: number,
    gagal: number
  },
  BroadcastDetails: [...]
}
```

### Number Key Object:
```javascript
{
  wa_number_key: "TEST123"  // atau PROD456, dll
}
```

## 🚀 How to Use

### Prerequisites:
1. Backend server running on `http://localhost:3000`
2. WhatsApp device connected (via Watzap.id or similar)
3. Pelanggan data with phone numbers in database
4. Number Key obtained from backend admin

### Initial Setup - Set Number Key:
1. Navigate to Dashboard → Kirim WA
2. Find "WhatsApp Number Key" section at top
3. Click "Tambah Number Key" button
4. Enter Number Key (example: TEST123)
5. Click "Simpan"
6. Number Key is now active and ready to use

### Steps to Send Broadcast:
1. Check device status (green = ready)
2. Verify Number Key is set (green checkmark)
3. Enter judul_pesan (title)
4. Enter isi_pesan (message body)
5. Preview shows live on right side
6. Click "Buat Draft" to save
7. Find draft in history table below
8. Click "Kirim" to send immediately
9. View statistics at top

### Variable Substitution (Backend):
- `{nama}` → Customer name
- `{telepon}` → Customer phone
- Backend handles replacement automatically

## 🛠️ API Service Files

### Location: `src/services/broadcastApi.js`

Functions:
- `checkDeviceStatus()`
- `getAllBroadcasts(page, limit, status)`
- `getBroadcastById(id)`
- `createBroadcast(data)`
- `sendBroadcast(id)` - OLD (without Number Key)
- `sendBroadcastWithNumberKey(id, numberKey)` - NEW ⭐
- `deleteBroadcast(id)`
- `getBroadcastStatistics()`
- `getPelanggan(limit)`

### Location: `src/services/wablastApi.js` ⭐ NEW

Functions:
- `setNumberKey(waNumberKey)` - Set/Save Number Key
- `getNumberKey()` - Get current Number Key
- `sendBroadcastWithKey(broadcastId)` - Send broadcast with Number Key
- `checkWAStatus()` - Check WhatsApp device status

## ⚠️ Error Handling

- Number Key not set → Alert shown before sending
- Device offline → Prevents sending, shows warning
- No customers → Alert shown
- API errors → Alert with message
- Loading states → Buttons disabled during operations

## 🎨 UI Components

1. **WhatsApp Number Key Section** - Top with configuration UI ⭐ NEW
   - Status indicator (Terkonfigurasi/Belum)
   - Input field with save button
   - Help tips
   
2. **Device Status Banner** - Top right with wifi icon
3. **Statistics Cards** - 4 cards showing metrics
4. **Form** - Left column with judul & isi inputs
5. **Live Preview** - Right column with WhatsApp-style bubble
6. **History Table** - Bottom section with actions

## 📝 Notes

- Number Key must be set before sending broadcasts
- All broadcasts start as "draft" status
- Must explicitly click "Kirim" to send
- Delete works for any status
- Statistics auto-refresh after send
- Number Key is stored in backend database
- localStorage backup removed (all via API now)

## 🔄 New State Variables (WaBlast.jsx)

```javascript
const [numberKey, setNumberKey] = useState('')           // Form input
const [currentNumberKey, setCurrentNumberKey] = useState('')  // Active key
const [showNumberKeyForm, setShowNumberKeyForm] = useState(false)  // Toggle UI
```

## ✅ File Changes Summary

### Created Files:
- `src/services/wablastApi.js` - New WhatsApp API service

### Modified Files:
- `src/services/broadcastApi.js` - Added `sendBroadcastWithNumberKey()`
- `src/pages/dashboard/WaBlast.jsx` - Added Number Key UI section

## 🎯 Features Implemented

### 1. **Device Status Monitor**
- Real-time WhatsApp device connection status
- Visual indicator (Wifi icon - green/red)
- Prevents sending when device offline

### 2. **Live Preview**
- WhatsApp-style message preview
- Updates in real-time as you type
- Shows judul_pesan and isi_pesan

### 3. **Draft Management**
- Create broadcast drafts first
- Review before sending
- Delete drafts if needed

### 4. **Send Workflow**
1. Fill judul_pesan & isi_pesan
2. System creates draft via API
3. Draft appears in history table
4. Click "Kirim" button to send
5. API sends to all pelanggan
6. Status updates to "Terkirim"

### 5. **Statistics Dashboard**
- Total broadcasts
- Total recipients
- Success count
- Success rate percentage

### 6. **Broadcast History**
- Table with all past broadcasts
- Status badges (Draft/Terkirim/Gagal)
- Action buttons (Send/Delete)
- Timestamp and recipient count

## 📊 Data Structure

### Broadcast Object:
```javascript
{
  broadcast_id: "string",
  judul_pesan: "string",
  isi_pesan: "string",
  tanggal_kirim: "ISO date string",
  status: "draft" | "terkirim" | "gagal",
  user_id: "string",
  stats: {
    total_penerima: number,
    terkirim: number,
    gagal: number
  },
  BroadcastDetails: [...]
}
```

## 🚀 How to Use

### Prerequisites:
1. Backend server running on `http://localhost:3000`
2. WhatsApp device connected (via Watzap.id or similar)
3. Pelanggan data with phone numbers in database

### Steps:
1. Navigate to Dashboard → Kirim WA
2. Check device status (green = ready)
3. Enter judul_pesan (title)
4. Enter isi_pesan (message body)
5. Preview shows live on right side
6. Click "Buat Draft" to save
7. Find draft in history table below
8. Click "Kirim" to send immediately
9. View statistics at top

### Variable Substitution (Backend):
- `{nama}` → Customer name
- `{telepon}` → Customer phone
- Backend handles replacement automatically

## 🛠️ API Service File

Location: `src/services/broadcastApi.js`

Functions:
- `checkDeviceStatus()`
- `getAllBroadcasts(page, limit, status)`
- `getBroadcastById(id)`
- `createBroadcast(data)`
- `sendBroadcast(id)`
- `deleteBroadcast(id)`
- `getBroadcastStatistics()`
- `getPelanggan(limit)`

## ⚠️ Error Handling

- Device offline → Prevents sending, shows warning
- No customers → Alert shown
- API errors → Alert with message
- Loading states → Buttons disabled during operations

## 🎨 UI Components

1. **Device Status Banner** - Top right with wifi icon
2. **Statistics Cards** - 4 cards showing metrics
3. **Form** - Left column with judul & isi inputs
4. **Live Preview** - Right column with WhatsApp-style bubble
5. **History Table** - Bottom section with actions

## 📝 Notes

- All broadcasts start as "draft" status
- Must explicitly click "Kirim" to send
- Delete works for any status
- Statistics auto-refresh after send
- localStorage backup removed (all via API now)

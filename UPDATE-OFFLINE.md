# Perbaikan Mode Offline

Versi ini menambahkan `api/sheets.js` sebagai perantara antara browser dan Google Apps Script. Browser sekarang memanggil API pada domain Vercel yang sama sehingga pengambilan data tidak gagal karena CORS/redirect Apps Script.

Environment variable Vercel yang sudah dibuat tetap didukung:

```text
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

Untuk deployment baru, gunakan nama `GOOGLE_SCRIPT_URL`. Setelah file pembaruan disalin ke repository, jalankan:

```text
git add .
git commit -m "fix koneksi Google Sheets"
git push
```

Vercel akan membuat deployment baru secara otomatis.

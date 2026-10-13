# TOKO ADELYA React

Proyek React + Vite siap dijalankan dan di-deploy ke Vercel. Tampilan dan fitur POS berasal dari HTML asli.

## Jalankan di komputer

Pastikan Node.js sudah terpasang, lalu buka terminal di folder ini:

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal, biasanya **http://localhost:5173**.

## Koneksi Google Sheets

URL Google Apps Script dari HTML asli masih menjadi nilai bawaan. Untuk memakai URL lain:

1. Salin `.env.example` menjadi `.env.local`.
2. Isi `VITE_GOOGLE_SCRIPT_URL` dengan URL Apps Script yang berakhiran `/exec`.
3. Jalankan ulang `npm run dev`.

URL juga dapat diganti dari menu **Koneksi Database** di aplikasi.

## Deploy ke Vercel

Upload seluruh folder ini ke GitHub, lalu import repository-nya di Vercel. Vercel akan mengenali Vite secara otomatis. Build command: `npm run build`; output directory: `dist`.

Jika memakai URL Apps Script lain, tambahkan environment variable `VITE_GOOGLE_SCRIPT_URL` di pengaturan proyek Vercel lalu deploy ulang.

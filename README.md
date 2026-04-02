🏥 Jaga Sehat - Solusi Cerdas Akses Kesehatan Digital
Jaga Sehat adalah platform kesehatan full-stack yang dirancang untuk menjembatani pasien dan tenaga medis secara praktis dan efisien
. Proyek ini hadir sebagai solusi digital untuk konsultasi kesehatan, pemantauan kondisi tubuh, dan manajemen data medis dalam satu ekosistem yang terintegrasi
.

--------------------------------------------------------------------------------
🚀 Tech Stack
Proyek ini dibangun dengan teknologi modern untuk menjamin performa, keamanan, dan pengalaman pengguna yang mulus:
Front-end
Vite + React JS: Menghasilkan antarmuka yang responsif dan performa rendering yang cepat.
Back-end
Node.js: Sebagai runtime utama.
Hapi.js: Framework untuk membangun API yang kokoh dan terstruktur.
PostgreSQL: Database relasional untuk penyimpanan data yang aman dan konsisten.
Keamanan & Fitur Canggih
JWT (JSON Web Token): Menangani autentikasi login yang aman.
Bcrypt: Enkripsi hashing untuk melindungi password pengguna di database.
WebSocket: Mendukung komunikasi pesan teks secara real-time antara pasien dan dokter
.
Gemini AI (Model 2.5 Flash Lite): Mengintegrasikan AI cerdas untuk fitur analisis BMI dan saran kesehatan personal
.

--------------------------------------------------------------------------------
✨ Fitur Utama
1. User Authentication & Roles
Mendukung tiga role utama dengan hak akses yang berbeda: Pasien, Dokter, dan Admin
.
2. Telemedicine & Real-time Chat
Pasien dapat memilih dokter berdasarkan spesialisasi dan pengalaman
.
Fitur chat real-time (teks) yang memungkinkan konsultasi langsung dari dashboard masing-masing role
.
3. Analyze AI (Check BMI)
Kalkulator BMI otomatis yang memberikan skor kesehatan
.
Integrasi Gemini AI: Memberikan saran gaya hidup, pola makan, dan hidrasi berdasarkan hasil BMI pengguna secara personal
.
4. Admin Management (CRUD)
Halaman dashboard khusus Admin untuk mengelola ekosistem tenaga medis di Jaga Sehat
:
Create: Menambahkan data dokter baru (Nama, Spesialisasi, RS, Jam Kerja, dll)
.
Read: Melihat daftar lengkap dokter yang terdaftar dalam sistem
.
Update: Memperbarui informasi dokter jika ada perubahan data
.
Delete: Menghapus data dokter dari database PostgreSQL
.

--------------------------------------------------------------------------------
📸 Preview Antarmuka
Landing Page: "Kesehatan Anda Prioritas Kami"
.
Dashboard Pasien: Riwayat percakapan dan akses layanan cepat
.
Dashboard Dokter: Manajemen antrean konsultasi masuk
.
Dashboard Admin: Kontrol penuh atas manajemen data dokter
.

--------------------------------------------------------------------------------
🛠️ Instalasi & Pengembangan
Ikuti langkah-langkah di bawah ini untuk menjalankan proyek Jaga Sehat di lingkungan lokal Anda.

Prasyarat
Node.js (Versi terbaru disarankan)
PostgreSQL (Sudah terinstal dan berjalan)
Gemini API Key (Untuk fitur Analyze AI)
1. Kloning Repositori
git clone https://github.com/username/jaga-sehat.git
cd jaga-sehat
2. Pengaturan Server (Back-end)
Server dibangun menggunakan Hapi.js dan mengelola seluruh logika bisnis serta koneksi database
.
# Masuk ke direktori server
cd server

# Instal dependensi
npm install

# Konfigurasi Environment Variables
# Buat file .env dan masukkan kredensial Database, JWT_SECRET, dan GEMINI_API_KEY
Menjalankan Migrasi Database: Proyek ini menggunakan node-pg-migrate untuk mengelola skema database PostgreSQL.
# Menjalankan migrasi ke atas (membuat tabel)
npm run migrate:up
Menjalankan Server:
# Mode Pengembangan (dengan nodemon)
npm run dev

# Mode Produksi
npm run start
3. Pengaturan Client (Front-end)
Client menggunakan Vite dan React JS untuk antarmuka yang cepat dan responsif
.
# Masuk ke direktori client
cd front-end

# Instal dependensi
npm install

# Menjalankan aplikasi dalam mode pengembangan
npm run dev
Aplikasi akan berjalan di http://localhost:5173 (atau port default Vite lainnya).

--------------------------------------------------------------------------------
🏗️ Struktur Skrip Utama
Server (Back-end)
npm run dev: Menjalankan server menggunakan nodemon untuk auto-reload saat ada perubahan kode.
npm run migrate:up: Membuat tabel dan skema yang diperlukan di database PostgreSQL.
npm run migrate:down: Membatalkan migrasi database terakhir.
Client (Front-end)
npm run dev: Memulai server pengembangan Vite.
npm run build: Membuat build produksi aplikasi React di folder dist.
npm run lint: Menjalankan ESLint untuk menjaga kualitas dan konsistensi kode.

--------------------------------------------------------------------------------
Dibuat dengan ❤️ oleh [Harry Nugroho Susetyo](www.linkedin.com/in/harryns) Menghubungkan Teknologi untuk Hidup yang Lebih Sehat.

<div align="center">

# KoopCare Web Admin - Koperasi Digital Syariah 🚀

![Project Badge](https://img.shields.io/badge/Project-KoopCare-5F7334?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Sistem Web Admin (Back-Office) untuk mengelola operasional Koperasi Digital Syariah KoopCare. Sistem ini mencakup manajemen KYC, Persetujuan Pembiayaan (Loan Management), Buku Besar (General Ledger), Kasir, dan Manajemen Dana Ta'awun.**

</div>

---

## 🛠 Tech Stack
* **Frontend:** React.js (Vite) + Tailwind CSS v4 + Zustand
* **Backend:** Node.js + Express.js
* **Database:** MySQL 8.0
* **Infrastructure:** Docker & Docker Compose

---

## Integrasi ML API KoopCare

Repo ini tetap memakai arsitektur utama:

```text
Mobile / Web Admin -> Express Backend -> MySQL
Express Backend -> FastAPI ML Inference API
```

Artinya, mobile dan web admin tidak perlu memanggil service ML secara langsung. Mobile dan web admin cukup memanggil backend Express melalui `VITE_API_URL` atau base URL backend yang nanti disepakati tim. Backend Express yang bertanggung jawab memanggil service ML melalui `ML_API_BASE_URL`.

Environment backend yang perlu disiapkan:

```env
ML_API_BASE_URL=http://127.0.0.1:8000
ML_API_TIMEOUT_MS=5000
```

Jika backend dijalankan langsung dari terminal laptop, `ML_API_BASE_URL=http://127.0.0.1:8000` sudah tepat. Jika backend dijalankan lewat Docker Compose sementara service ML berjalan di laptop host, gunakan:

```env
ML_API_BASE_URL=http://host.docker.internal:8000
```

Jika port MySQL `3306` di laptop sudah dipakai oleh MySQL/XAMPP/Laragon lokal, buat file `.env` di root repo ini dan isi:

```env
MYSQL_HOST_PORT=3307
```

Dengan begitu MySQL container tetap memakai port `3306` di dalam container, tetapi dari laptop bisa diakses lewat port `3307`.

Pada local development, jalankan service ML inference terlebih dahulu dari repo MLOps:

```bash
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

Lalu jalankan backend admin seperti biasa. Backend akan memakai helper di:

```text
backend/src/services/mlScoringClient.js
backend/src/services/loanAiMappingService.js
backend/src/services/loanMlScoringService.js
```

Untuk memverifikasi helper integrasi ML tanpa menjalankan database atau web admin:

```bash
cd backend
npm test
```

Catatan penting untuk loan scoring:

```text
prob_default dari ML API = semakin tinggi berarti semakin berisiko gagal bayar.
ai_score di admin = semakin tinggi berarti semakin layak.
```

Jangan mengisi `ai_score` dengan `prob_default * 100` karena maknanya akan terbalik. Jika UI atau database membutuhkan skor kelayakan 0-100, gunakan:

```text
eligibility_score = round((1 - prob_default) * 100)
```

Untuk fase saat ini, integrasi tetap memakai Express Backend + MySQL. Tidak ada migrasi ke Supabase pada fase ini, dan model XGBoost dari repo MLOps dipakai sebagai artifact integrasi sementara sampai ada keputusan retraining berikutnya.

---

## 📐 Standar Penulisan Kode (Coding Conventions)

Untuk menjaga kualitas dan keterbacaan kode (*clean code*) bagi seluruh tim pengembang, proyek ini menerapkan aturan standar penulisan sebagai berikut:

### 1. Aturan Penamaan (Naming Conventions)
* **Variabel & Properti:** Menggunakan `camelCase`. Harus deskriptif dan berupa kata benda.
  * ✅ *Benar:* `userName`, `totalAmount`, `isValid`
  * ❌ *Salah:* `UserName`, `total_amount`, `val`
* **Konstanta (Constants):** Menggunakan `UPPER_SNAKE_CASE`.
  * ✅ *Benar:* `MAX_LOAN_AMOUNT`, `API_BASE_URL`
  * ❌ *Salah:* `maxLoanAmount`, `ApiBaseUrl`
* **Fungsi & Metode:** Menggunakan `camelCase`. Harus diawali dengan kata kerja (*verb*).
  * ✅ *Benar:* `calculateTotal()`, `getUserData()`, `handleSubmit()`
  * ❌ *Salah:* `calculation()`, `UserData()`
* **Kelas & Komponen React:** Menggunakan `PascalCase`.
  * ✅ *Benar:* `UserProfile`, `LoanDashboard`, `TaawunController`
  * ❌ *Salah:* `userProfile`, `loan_dashboard`
* **File & Folder (Files & Directories):**
  * **Frontend (React):** Komponen menggunakan `PascalCase` (contoh: `Button.jsx`, `Dashboard.jsx`). File utilitas/fungsi menggunakan `camelCase` (contoh: `formatCurrency.js`).
  * **Backend (Node.js):** Semua file dan folder menggunakan `camelCase` (contoh: `authController.js`, `loanRoutes.js`).

### 2. Aturan Database (MySQL Conventions)
* **Nama Tabel:** Menggunakan `snake_case` dan bentuk jamak (*plural*).
  * ✅ *Benar:* `users`, `kyc_documents`, `loan_applications`
* **Nama Kolom:** Menggunakan `snake_case` dan bentuk tunggal (*singular*).
  * ✅ *Benar:* `first_name`, `created_at`, `loan_status`
* **Primary Key:** Selalu gunakan `id` (INT/UUID).
* **Foreign Key:** Gabungan nama tabel tunggal dan `id` (contoh: `user_id`, `loan_id`).

### 3. Aturan Bahasa (Language Protocol)
* **Kode & Penamaan:** Seluruh penamaan variabel, fungsi, dan komponen **WAJIB** menggunakan bahasa Inggris untuk menjaga standar industri.
* **Komentar (Comments):** Penjelasan logika yang kompleks boleh menggunakan Bahasa Indonesia agar mudah dipahami anggota tim.

### 4. Standar Commit Git (Conventional Commits)
Gunakan format berikut saat melakukan `git commit`:
* `feat:` ➝ Menambah fitur baru (contoh: `feat: add loan approval dashboard`)
* `fix:` ➝ Memperbaiki *bug* (contoh: `fix: resolve jwt token undefined`)
* `docs:` ➝ Mengubah dokumentasi/README (contoh: `docs: update setup instructions`)
* `style:` ➝ Perubahan UI/CSS, *formatting* tanpa mengubah logika (contoh: `style: update button colors to KoopCare standard`)
* `refactor:` ➝ Menulis ulang kode tanpa menambah fitur atau memperbaiki bug.
* `chore:` ➝ Pembaruan dependensi, konfigurasi Docker, build process (contoh: `chore: update tailwind config to v4`).

---

## 📋 Prasyarat (Prerequisites)
Sebelum menjalankan proyek ini, pastikan mesin Anda telah terpasang:
1. [Git](https://git-scm.com/)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Pastikan Docker Engine dalam keadaan *running*)

---

## 🚀 Cara Instalasi & Menjalankan Proyek (Local Development)

### 1. Clone Repositori
Buka terminal dan jalankan perintah berikut:
```bash
git clone https://github.com/sayafauzi/koopcare-admin.git
cd koopcare-admin
```

## 🤝 Panduan Kolaborasi Git (Team Workflow)

Untuk mencegah bentrok kode dan error (*conflict/non-fast-forward*), seluruh anggota tim **WAJIB** mengikuti SOP *Feature Branch Workflow* berikut. **Dilarang keras ngoding langsung di branch `main`!**

### Fase 1: Memulai Tugas Baru (Routine Harian)
Selalu mulai dari branch `main` yang paling baru sebelum membuat branch tugas.
```bash
git checkout main
git pull origin main
# Buat branch baru khusus untuk fitur/bug yang dikerjakan
git checkout -b feature/nama-halaman-atau-fitur
```

### Fase 2: Proses Pengembangan (Ngoding)
Lakukan pekerjaan Anda dan simpan secara berkala.
```bash
git add .
git commit -m "feat: deskripsi pekerjaan menggunakan standar konvensi"
```

### Fase 3: Sinkronisasi (Wajib Sebelum Mengirim)
Pastikan kode Anda tidak menabrak pembaruan dari tim lain yang sudah masuk ke `main` lebih dulu.
```bash
# Pastikan Anda sedang berada di branch fitur Anda, lalu tarik dari main
git pull origin main
```
*Jika muncul peringatan CONFLICT, buka VS Code, selesaikan bentrok pada file yang ditandai, lalu `git add .` dan `git commit` kembali.*

### Fase 4: Mengirim Kode & Pull Request
Kirim branch Anda dan gabungkan melalui web GitHub, BUKAN di terminal.
```bash
git push origin feature/nama-halaman-atau-fitur
```
1. Buka repositori GitHub.
2. Klik tombol **"Compare & pull request"**.
3. Minta *Review* dari rekan tim.
4. Jika disetujui (Approve), klik **"Merge pull request"** di GitHub.

### Fase 5: Pembersihan (Cleanup)
Setelah sukses digabungkan di GitHub, bersihkan lokal Anda.
```bash
git checkout main
git pull origin main
git branch -d feature/nama-halaman-atau-fitur  # Opsional: Hapus branch lama
```

---

## 🛡️ Aturan Pengaman Repositori (Branch Protection)
Pemilik repositori harus mengaktifkan *Branch Protection Rules* di GitHub Settings:
* Kunci branch `main`.
* Centang **"Require a pull request before merging"**.
* Hal ini mencegah *push* langsung ke `main` secara tidak sengaja.

---

## 🛠 Penanganan Error Umum

### A. Error: `non-fast-forward` (Rejected)
**Penyebab:** Ada kode baru di GitHub yang belum Anda tarik ke laptop.
**Solusi Rapi:**
```bash
git config pull.rebase false
git pull origin main
git push origin <nama-branch-anda>
```

### B. Error: `divergent branches`
**Penyebab:** Sejarah Git di lokal dan GitHub berbeda arah.
**Solusi:**
```bash
git pull origin main --allow-unrelated-histories
```

---

## 🚫 Yang HARUS Dihindari (Best Practices)

1. **Dilarang menggunakan `--force`:** Jangan pernah menjalankan `git push --force`. Ini akan **menghapus** hasil kerja tim secara permanen.
2. **Jangan Mengedit File di Web GitHub:** Hindari menekan tombol "Edit" di browser GitHub. Selalu edit di VS Code.
3. **Jangan Commit `node_modules` atau `.env`:** Pastikan file ini ada di `.gitignore`.

---

## 🐳 Tips Docker untuk Tim
Jika rekan tim menambahkan library baru, maka setelah melakukan `pull`, Anda harus menjalankan:
```bash
docker-compose up --build
```
*Ini memastikan container Docker menginstall library baru tersebut secara otomatis.*

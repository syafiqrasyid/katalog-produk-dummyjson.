# Katalog Produk — Full CRUD Mobile App

Aplikasi katalog produk berbasis **React Native dan Expo** yang terintegrasi dengan REST API menggunakan PHP dan MySQL. Aplikasi ini dibuat untuk memenuhi tugas individu mata kuliah Pemrograman Perangkat Bergerak.

## Deskripsi Proyek

Katalog Produk merupakan aplikasi mobile yang memungkinkan pengguna melihat, mencari, menambahkan, mengubah, dan menghapus data produk.

Aplikasi menggunakan backend PHP dengan database MySQL sebagai tempat penyimpanan data produk. Data awal produk berasal dari DummyJSON dan telah dimasukkan ke dalam database.

## Fitur Aplikasi

Aplikasi memiliki fitur Full CRUD:

- **Create:** Menambahkan produk baru.
- **Read:** Menampilkan daftar dan detail produk.
- **Update:** Mengubah informasi produk.
- **Delete:** Menghapus produk.
- Pencarian produk berdasarkan nama.
- Menampilkan gambar, nama, harga, dan informasi produk.
- Validasi input sebelum menyimpan data.
- Notifikasi ketika operasi berhasil atau gagal.
- Tampilan antarmuka dengan desain warna pastel.

## Teknologi yang Digunakan

### Frontend

- React Native
- Expo
- JavaScript

### Backend

- PHP
- MySQL
- REST API
- Docker Compose

### Tools

- Visual Studio Code
- Expo Go
- Git dan GitHub

## Arsitektur Aplikasi

Aplikasi mobile berkomunikasi dengan backend melalui REST API.

Alur komunikasi:

1. Pengguna melakukan aksi melalui aplikasi mobile.
2. Aplikasi mengirim request HTTP ke backend PHP.
3. Backend memproses request dan berinteraksi dengan database MySQL.
4. Backend mengirimkan response dalam format JSON.
5. Aplikasi menampilkan hasilnya kepada pengguna.

## API dan Backend

Backend menggunakan project PHP/MySQL berikut:

[PHP MySQL Services — GitHub](https://github.com/vpratama/pcc_sample_php_mysql_services)

Endpoint API:

| Method | Endpoint         | Fungsi                    |
| ------ | ---------------- | ------------------------- |
| GET    | `/products`      | Menampilkan produk        |
| GET    | `/products/{id}` | Detail produk             |
| POST   | `/products/add`  | Menambahkan produk        |
| PUT    | `/products/{id}` | Memperbarui produk        |
| PATCH  | `/products/{id}` | Memperbarui sebagian data |
| DELETE | `/products/{id}` | Menghapus produk          |

Data awal produk menggunakan DummyJSON sebagai sumber data seed.

## Cara Menjalankan Aplikasi

### 1. Clone repository

```bash
git clone https://github.com/syafiqrasyid/katalog-produk-dummyjson..git
```

### 2. Masuk ke folder project

```bash
cd katalog-produk-dummyjson.
```

### 3. Install dependencies

```bash
npm install
```

### 4. Konfigurasi API

Buka file `App.js`, kemudian sesuaikan alamat backend pada bagian:

```javascript
const API_URL = "http://192.168.1.13:8085";
```

Ganti alamat IP tersebut sesuai alamat IP laptop atau komputer yang menjalankan backend.

### 5. Jalankan backend

Pastikan backend PHP dan MySQL sudah berjalan menggunakan Docker Compose.

### 6. Jalankan aplikasi

```bash
npx expo start
```

### 7. Jalankan melalui Android

Scan QR Code menggunakan aplikasi Expo Go pada HP Android.

**Catatan:** HP Android dan komputer yang menjalankan backend harus terhubung ke jaringan Wi-Fi yang sama agar aplikasi dapat mengakses API lokal.

## Screenshot Aplikasi

### Halaman Utama

![Halaman Utama](screenshot/home.png)

### Fitur Pencarian

![Fitur Pencarian](screenshot/search.png)

### Halaman Detail Produk

![Detail Produk](screenshot/detail.png)

## Video Demonstrasi

Link YouTube:

https://youtu.be/YZ4mpQSbZYw?si=_F4SxoiEeY5IwA1J

## Repository

https://github.com/syafiqrasyid/katalog-produk-dummyjson.

## Pengembang

Putra Muhammad Syafiq Rasyid

Program Studi Teknik Informatika

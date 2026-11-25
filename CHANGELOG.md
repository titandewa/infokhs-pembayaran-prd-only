# Changelog

Semua perubahan penting pada proyek ini dicatat di file ini.

## [Unreleased]

## [0.3.0] - 2026-11-25
### Added
- Deployment lewat GitHub Pages.

### Changed
- Alur dipisah menjadi 6 halaman terpisah mengikuti prototype Worksheet 12: `index.html` (pilih item), `item-terpilih.html`, `daftar-item.html`, `konfirmasi.html`, `pilih-bank.html`, dan `nomor-va.html`. Sebelumnya layar 1 sampai 3 digabung dalam satu halaman.
- Alasan: Worksheet 12 mensyaratkan minimal 5 layar yang saling terhubung.

## [0.2.0] - 2026-11-25
### Added
- Source code prototype pembayaran UKT InfoKHS (`index.html`, `style.css`, `app.js`) versi hitam putih.
- Alur 4 tampilan: pilih item, konfirmasi, pilih bank, nomor VA.
- Tanda "Terpilih" pada item dan tombol "Hapus" untuk mengoreksi pilihan.

### Changed
- Total pembayaran dihitung dari item yang terpilih, sehingga menekan item yang sama berulang tidak menambah nominal (maksimal Rp 5.800.000).

## [0.1.0] - 2026-11-24
### Added
- PRD pada `README.md`: latar belakang masalah, tujuan, pengguna sasaran (persona Raka), kebutuhan, user stories, prioritas, ruang lingkup, alur pengguna, dan ukuran keberhasilan.
- Repo dibuat dari hasil Worksheet 5, 6, 7, 8, 9, dan 12.

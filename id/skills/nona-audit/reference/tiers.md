# Tiga tier sekilas

NONA menjalankan masing-masing dari kedua belas bidang pada salah satu dari tiga kedalaman. Gerbang risiko (stakes gate) yang memutuskan kedalaman mana yang diperoleh tiap bidang (lihat `stakes-signals.md`). Kartu ini adalah referensi cepat; definisi lengkap dan kontrol persis yang dikutip tiap tier ada di `../../../protocol/01-stakes-gating.md` dan `../../../CITATIONS.md`.

Idenya sederhana: lantai adalah hal yang sudah jelas yang dibutuhkan tiap aplikasi, standar adalah apa yang dikerjakan tim yang kompeten, dan upaya ekstra adalah garis terdepan yang bahkan tim kuat pun memperlakukannya sebagai usaha tambahan. Kedalamannya menyesuaikan risiko. Aplikasi to-do akhir pekan dapat lantai. Aplikasi pembayaran dengan login dan AI yang bertindak sendiri dapat upaya ekstra di tempat yang memang menuntutnya.

| Tier | Arti sederhana | Kapan sebuah bidang memperolehnya | Apa yang dia kutip (contoh) |
|---|---|---|---|
| **Lantai (floor)** | "Apakah ada yang mengerjakan hal yang sudah jelas?" Garis dasar yang tidak bisa ditawar untuk aplikasi apa pun, sekecil apa pun. Melewatinya adalah cara sebuah aplikasi rilis dengan pintu terbuka lebar. | Tiap bidang dapat setidaknya lantai. Bidang tanpa sinyal risiko dapat lantai dan berhenti di situ. | OWASP Top 10:2025 (tidak ada instance yang hadir), OWASP ASVS 5.0 Level 1, CIS Level 1, lantai LLM Top 10 (ada sedikit mitigasi prompt injection, tidak ada secret atau data pribadi yang jelas bocor, ada batas pemakaian), tidak ada secret di bagian publik aplikasi atau di riwayat kode, dan dasar-dasar production vendor (RLS menyala, kunci master database tidak pernah ada di browser, SSL). |
| **Standar (standard)** | "Apa yang dikerjakan tim yang kompeten." Tingkat yang diharapkan seorang profesional yang teliti begitu aplikasi menangani sesuatu yang nyata, seperti login atau data pelanggan. | Bidang dengan tepat satu sinyal risiko yang bukan otonomi (S4) atau tidak-bisa-dibatalkan (S6). Dipaksa juga ke data dan pembayaran oleh uang (S1) atau tindakan tidak-bisa-dibatalkan (S6) apa pun. | OWASP ASVS 5.0 Level 2, OWASP API Security Top 10 2023 lengkap (cek akses-per-record dan akses-per-peran, penyalahgunaan alur bisnis), LLM Top 10 2025 lengkap, praktik pengembangan aman NIST (threat model, vetting kode pihak ketiga, loop temukan-dan-perbaiki celah), kerangka risiko AI NIST (map, measure, manage), serta logging dan penanganan error yang benar. |
| **Upaya ekstra (extra mile)** | Garis terdepan. Praktik yang bahkan tim teknik kuat pun memperlakukannya sebagai usaha tambahan yang opsional dan diperpanjang. NONA membangun tier ini secara penuh dan hanya menyalakannya ketika taruhannya membenarkan. | Bidang dengan dua atau lebih sinyal risiko, atau punya sinyal otonomi (S4) maupun tidak-bisa-dibatalkan (S6) berapa pun. Dipaksa oleh pengesampingan keras di bawah. | OWASP ASVS Level 3, level build supply-chain yang lebih tinggi, CIS Level 2, threat model formal plus penetration test yang adversarial, pola pengurungan yang mengurung agen AI (model terpisah yang hanya memilih tindakan aman, pemisahan rencana-lalu-eksekusi), eval dan golden test suite, cost guardrail AI, rantai model cadangan (model fallback), sandboxing dan least-privilege agen, verifikasi-output, log provenance untuk kode hasil-AI, tinjauan oleh model yang berbeda sebagai kebijakan, latihan chaos, error budget, fuzzing, dan program bug-bounty atau responsible disclosure. |

## Pengesampingan keras (eskalasi ini berlaku tak peduli berapa pun hitungannya)

- **S4 apa pun** (sebuah agen AI bertindak sendiri) memaksa **upaya ekstra** pada **B** (keamanan), **F** (pola kode hasil-AI), dan **K** (pen-test): sandboxing, least-privilege, red-team prompt injection, dan setidaknya satu pola pengurungan.
- **S1 apa pun** (uang) atau **S6** (tindakan yang tidak bisa dibatalkan) memaksa setidaknya **standar** pada **D** (data dan privasi) dan **E** (pembayaran dan biaya AI); **upaya ekstra** kalau dikombinasikan dengan **S5** (radius dampak).
- **Panggilan AI API berbayar apa pun yang jalan di production** memaksa **cost guardrail pada lantai**, di hari pertama.

## Aturan anti-rekayasa-berlebih

Kalau aplikasinya nol sinyal risiko, rekomendasikan hanya lantai. Jangan usulkan bug bounty, chaos engineering, target uptime formal, canary release, atau kampanye fuzzing untuk aplikasi yang tidak mempertaruhkan apa-apa. Memaksakan praktik elite ke aplikasi berisiko rendah adalah kegagalan penilaian.

## Lantai universal (tidak pernah dilewati, bahkan pada nol risiko)

Tiap aplikasi, termasuk yang sepele, dapat empat ini, karena biayanya hampir nol dan pembuat biasanya tidak tahu kalau ini hal normal yang ada namanya:

1. Dogfooding: pakai aplikasi seperti pelanggan sungguhan, kerjakan tugas intinya, sebelum merilis.
2. Pemindaian shift-left gratis: pemindai otomatis untuk dependency berisiko, secret yang bocor, dan kesalahan kode yang jelas ("shift-left" berarti menangkap masalah lebih awal, selagi membangun).
3. Satu obrolan pre-mortem: bayangkan ini setahun kemudian dan proyeknya gagal, daftar kenapa, perbaiki yang bisa kamu perbaiki sekarang.
4. Kalau aplikasi membuat panggilan AI berbayar apa pun: batasi pengeluarannya dan jalankan satu eval dasar (sebuah rapor kecil yang menilai apakah fitur AI-nya masih berperilaku benar setelah ada perubahan).

## Aturan makna-yang-bertahan

Makna bahasa-sederhana tiap pemeriksaan adalah bagian yang bertahan. Sitasi adalah pertahanannya. Di tempat sebuah nomor kontrol rapuh antar-versi, nyatakan maknanya dan kutip standarnya di tingkat dokumen alih-alih mencetak nomor yang belum terverifikasi. Jangan mengarang ID kontrol.

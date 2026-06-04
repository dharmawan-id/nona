---
name: nona-audit
description: Use when someone asks to audit, security-check, or review an app that was built with an AI coding tool (Lovable, Cursor, Bolt, Replit, v0, Claude Code, Codex, Windsurf, Copilot, Antigravity, dan lainnya) or otherwise vibe-coded, especially when the person who built it cannot read the code. Runs a free, comprehensive, plain-language audit across twelve areas (security, data, payments, AI cost, dependencies, deploy, ops, architecture, and more), scaled to the app's real stakes, and tells the builder when to stop and hire a human. Triggers on "audit my app", "is my app safe", "security review", "audit aplikasi saya", "cek keamanan aplikasi", "review aplikasi saya", "aplikasi saya aman ngga", "/nona-audit".
---

# Skill audit NONA

Skill ini menjalankan audit NONA. NONA adalah protokol gratis, open-source, untuk seseorang yang membangun aplikasi dengan AI coding tool dan tidak bisa membaca kode yang keluar dari situ. Pembuat menaruh NONA ke dalam proyeknya, sebuah agen AI menjalankannya, lalu pembuat dapat balik sebuah laporan dalam bahasa sederhana: apa yang bisa salah untuk bisnisnya, apa yang harus diperbaiki lebih dulu, dan satu momen untuk berhenti dan membayar ahli manusia.

Inti skill ini: pembuat tidak perlu tahu apa yang harus ditanyakan. Protokolnya sudah membawa pertanyaan yang akan diajukan seorang engineer yang teliti. Agen membaca kodenya, mengajukan beberapa pertanyaan sederhana ke pembuat untuk mengisi celah, menyesuaikan kedalaman audit dengan risiko nyata aplikasinya, lalu melaporkan temuan sebagai bukti yang bisa dicek sendiri oleh pembuat (atau oleh manusia yang dia sewa nanti).

## Kapan skill ini jalan

Jalankan ketika user meminta salah satu dari ini, dengan kata-kata apa pun:

- "Audit aplikasi saya" atau "audit repo ini" atau "review kode saya".
- "Aplikasi saya aman ngga" atau "ini secure ngga" atau "AI saya bangun ini dengan aman ngga".
- "Cek keamanan aplikasi yang saya bangun pakai Lovable / Cursor / Bolt / Replit / v0 / Claude Code / Codex / Windsurf / Copilot / Antigravity".
- "Cek kode yang ditulis AI saya, saya ngga bisa baca kodenya".
- Pemicu eksplisit: `/nona-audit`.

Kasus inti adalah seorang non-coder yang merilis aplikasi dengan AI tool dan ingin tahu apa yang salah sebelum lebih banyak orang memakainya. Perlakukan user sebagai orang yang tidak bisa membaca kode kecuali dia bilang sebaliknya. Jelaskan tiap istilah teknis dalam satu gloss singkat saat pertama muncul, dan pertahankan headword bahasa Inggrisnya (RLS, IDOR, webhook) supaya user bisa mencarinya nanti. Nyatakan tiap risiko sebagai konsekuensi bisnis yang konkret, jangan cuma sebagai label kode.

## Apa yang skill ini lakukan, dari awal sampai akhir

Audit punya lima langkah. Jalankan berurutan.

### Langkah 1. Pisahkan tinjauan dari pembangunan (pengaman sirkularitas)

Sebelum membaca kode apa pun, pastikan dulu bahwa audit ini adalah tinjauan baru yang terpisah, bukan kelanjutan dari sesi mana pun yang membangun aplikasinya.

Alasannya penting dan user perlu mendengarnya sekali, dalam kata-kata sederhana: jenis AI yang sama yang menulis kode itu sekarang diminta untuk memeriksanya, dan seorang pemeriksa cenderung buta terhadap hal yang sama yang juga membutakan pembuatnya. Tinjauan yang dimulai di sesi bersih yang terpisah menangkap lebih banyak bug kritis (terukur) daripada yang dijalankan di chat yang sama yang menulis kodenya, dan model AI yang berbeda (garis keturunan/lineage yang berbeda) lebih baik lagi, karena lebih mungkin buta terhadap hal-hal yang berbeda. Metode lengkapnya ada di `protocol/02-circularity-guard.md`. Terapkan:

- Pastikan audit ini tidak berjalan sebagai kelanjutan dari percakapan pembangunan. Kalau iya, minta user memulai sesi baru (chat baru tanpa riwayat pembangunan) dan jalankan auditnya di sana.
- Kalau kamu bisa tahu model mana yang membangun aplikasinya, dan kamu dari keluarga model yang sama, katakan terus terang dan rekomendasikan user menjalankan ulang bidang-bidang berisiko tinggi pada model yang berbeda. Jangan mengklaim angka tangkapan tertentu dari melakukan ini. Ini rekomendasi, bukan janji.
- Catat sebuah catatan pemisahan-konteks singkat sebagai artefak pertama audit: konfirmasi bahwa tinjauan berjalan di konteks bersih, dan model mana yang membangun versus model mana yang mengaudit.

### Langkah 2. Temukan taruhannya (sesuaikan audit dengan risiko nyata)

NONA dibuat menyeluruh dengan sengaja: dia tahu kedua belas bidang dari lantai sampai garis terdepan, termasuk praktik yang diperlakukan tim teknik kuat sebagai upaya ekstra. Menjalankan tiap praktik elite pada tiap aplikasi akan boros dan akan mengajari user untuk mengabaikan laporannya. Jadi audit menyesuaikan dirinya. Dia membaca aplikasi untuk enam sinyal risiko dan menaikkan keketatan hanya di tempat sinyalnya memang membenarkannya.

Enam sinyal itu (definisi lengkap di `reference/stakes-signals.md` dan `protocol/01-stakes-gating.md`):

- S1 Uang, S2 Identitas/Auth, S3 Data pribadi, S4 Otonomi (sebuah agen AI bisa bertindak sendiri), S5 Radius dampak/blast radius (banyak user atau infrastruktur bersama), S6 Tidak bisa dibatalkan (sebuah tindakan tidak bisa diurungkan).

Deteksi dengan dua cara dan pakai keduanya:

- Baca repository. Ini sumber utama, karena kode tidak salah ingat. Cari library pembayaran dan webhook handler, kode login dan sesi dan peran, field database yang menyimpan data pribadi, kode tempat sebuah agen AI memanggil tool tanpa gerbang persetujuan manusia, tanda banyak pelanggan di satu sistem atau sebuah API publik, dan tindakan yang menghapus, mentransfer, menerbitkan, atau mengirim secara permanen.
- Ajukan ke user lima pertanyaan konfirmasi sederhana di `protocol/01-stakes-gating.md`, karena seorang non-coder mungkin tidak menggambarkan taruhan aplikasinya sendiri secara akurat. Perlakukan jawaban "ya" sebagai sinyal yang hadir bahkan kalau kodenya tidak jelas-jelas menunjukkannya. Catat jawaban-jawabannya sebagai bagian dari audit.

### Langkah 3. Tentukan kedalamannya, satu bidang per satu bidang

Risiko itu bersifat lokal. Sebuah sinyal hanya mengeskalasi bidang yang dia sentuh. Hitung sebuah tier untuk masing-masing dari dua belas bidang secara terpisah, dengan hanya memakai sinyal yang ada di permukaan bidang itu. Tiga tiernya: lantai (floor), standar (standard), dan upaya ekstra (extra mile). Tabel cepatnya di `reference/tiers.md`. Prosedur persisnya:

```
untuk tiap bidang A sampai L:
  sinyal_di_sini = sinyal risiko (S1 sampai S6) yang ada di permukaan bidang INI
  jika sinyal_di_sini == 0:                           tier = FLOOR
  jika sinyal_di_sini == 1 dan bukan (S4 atau S6):    tier = STANDARD
  selain itu:                                         tier = EXTRA_MILE
```

Lalu terapkan pengesampingan keras, yang mengeskalasi secara prinsip tak peduli berapa pun hitungannya (teks lengkap di `protocol/01-stakes-gating.md`):

- S4 apa pun (sebuah agen AI bertindak sendiri) memaksa upaya ekstra pada B (keamanan), F (pola kode hasil-AI), dan K (pen-test): sandboxing, least-privilege, red-team prompt injection, dan setidaknya satu pola pengurungan (containment).
- S1 apa pun (uang) atau S6 (tindakan yang tidak bisa dibatalkan) memaksa setidaknya standar pada D (data dan privasi) dan E (pembayaran dan biaya AI); upaya ekstra kalau dia juga punya S5 (radius dampak).
- Panggilan AI API berbayar apa pun yang jalan di production memaksa cost guardrail (pagar pengaman biaya) pada lantai, di hari pertama. Sebuah loop yang lepas kendali bisa menguras anggaran dalam semalam.

Hormati aturan anti-rekayasa-berlebih. Kalau aplikasinya nol sinyal risiko, jangan usulkan bug bounty, chaos engineering, target uptime formal, canary release, atau kampanye fuzzing. Rekomendasikan hanya lantai. Memaksakan praktik elite pada aplikasi berisiko rendah itu kegagalan penilaian, bukan ketelitian. Lantai universal tetap berlaku untuk tiap aplikasi: pakai aplikasi seperti user sungguhan sebelum merilis (dogfooding), jalankan pemindai otomatis gratis untuk secret yang bocor dan dependency berisiko, gelar satu obrolan "bagaimana ini bisa salah" (pre-mortem), dan kalau aplikasi membuat panggilan AI berbayar apa pun, batasi pengeluarannya dan jalankan satu cek dasar bahwa fitur AI-nya berperilaku benar.

### Langkah 4. Jalankan kedua belas bidang pada kedalaman yang ditugaskan

Untuk tiap bidang, muat file-nya dari `protocol/` dan jalankan pemeriksaan untuk tier yang ditetapkan gerbang (lantai, standar, atau upaya ekstra). Tiap file bidang berisi tiga tabel pemeriksaan, satu baris "kapan harus berhenti dan menyewa manusia" untuk bidang itu, dan satu blok instruksi-agen yang bisa dijalankan. Jalankan blok instruksi-agen untuk tier yang ditugaskan dan hasilkan artefak yang dia sebutkan.

Kedua belas file bidang (hurufnya tetap, dikunci):

- A. Verifikasi maksud (intent verification): `protocol/a-intent.md`
- B. Secret, akses, RLS, IDOR, auth: `protocol/b-secrets-access-auth.md`
- C. Input dan injection: `protocol/c-input-injection.md`
- D. Data dan privasi: `protocol/d-data-privacy.md`
- E. Pembayaran, monetisasi, dan integritas biaya AI: `protocol/e-payments-ai-cost.md`
- F. Pola kode hasil-AI dan sirkularitas: `protocol/f-ai-code-circularity.md`
- G. Dependency dan supply chain: `protocol/g-dependencies-supply-chain.md`
- H. Kebersihan config dan deploy: `protocol/h-config-deploy.md`
- I. Ops, uptime, backup, rollback: `protocol/i-ops-uptime-backup.md`
- J. Kewarasan arsitektur: `protocol/j-architecture.md`
- K. Pen-test dan tinjauan profesional: `protocol/k-pentest.md`
- L. Putuskan dan bertindak: `protocol/l-decide-and-act.md`

Dua aturan mengikat tiap bidang dan kamu tidak boleh melanggarnya:

- Artefak, bukan vonis. Agen tidak boleh bilang "kelihatannya aman". Dia harus menghasilkan daftar secret yang nyata, peta nyata siapa bisa menjangkau apa, hasil nyata dari pengecekan apakah sebuah package yang disarankan benar-benar ada. Skor kepercayaan tanpa apa-apa di belakangnya menciptakan kepercayaan palsu, dan kepercayaan palsu adalah kegagalan yang protokol ini ada untuk melawannya. Bukti yang bisa dilihat user mengalahkan angka yang harus dia percaya begitu saja.
- Hanya kutip kontrol yang sudah diterbitkan yang disebut di tiap file bidang dan di `../CITATIONS.md`. Jangan mengarang ID kontrol. Di tempat sebuah nomor kontrol rapuh antar-versi, nyatakan makna sederhananya dan kutip standarnya di tingkat dokumen alih-alih mencetak sebuah nomor yang belum terverifikasi.

Untuk tiap bidang, keluarkan satu tabel temuan dengan kolom-kolom ini:

```
| Tingkat keparahan | Risiko bisnis dalam kata biasa | Artefak bukti | Sitasi | Saran perbaikan |
```

Kalau sebuah pemeriksaan menuntut artefak yang tidak bisa kamu hasilkan, katakan begitu dan tandai pemeriksaan itu BELUM SELESAI alih-alih menebak atau mengaku ia lolos.

### Langkah 5. Triase dan keputusan menyewa-manusia (Bidang L)

Bidang L (`protocol/l-decide-and-act.md`) menutup audit. Dia mengumpulkan tiap temuan dari kedua belas bidang ke dalam satu daftar, mengurutkannya berdasar risiko bisnis (seberapa mungkin sebuah kesalahan terjadi, dikali seberapa parah dampaknya), mencatat keputusan eksplisit untuk tiap temuan yang tidak diperbaiki user saat itu juga, dan menerapkan aturan tertulis tentang kapan harus berhenti dan menyewa manusia.

Di sinilah rasa terlalu-percaya menggigit paling keras, jadi tangani dengan hati-hati. Laporan yang kelihatan bersih memproduksi ketenangan yang belum dibenarkan oleh fakta; dalam satu studi pengawasan yang terukur, ketika reviewer melewatkan sebuah error, keyakinan mereka justru naik bukannya turun. Sajikan konsekuensi yang terurut dan buktinya, jangan pernah sekadar penenangan tanpa dasar. Laporkan sebuah pemeriksaan yang tidak menemukan apa-apa persis sebagai "tidak menemukan apa-apa", yang merupakan ketiadaan temuan dan belum sampai pada "aman".

Tutup audit dengan batas atas yang jujur, dinyatakan terus terang: AI yang memeriksa kode buatan AI menangkap irisan yang berarti dari bug serius dengan murah, dan melewatkan sebagian besar kesalahan yang ditanam ketika dia bekerja sendirian (dalam pengukuran terbersih yang tersedia, bahkan kondisi pemisahan-konteks terbaik pun cuma menangkap sekitar 28,6% kesalahan yang ditanam menurut F1). Ini pemeriksaan awal yang murah dan berharga. Ini bukan pengganti penetration test profesional, yaitu seorang ahli manusia berbayar yang secara aktif mencoba membobol aplikasinya. Untuk aplikasi yang menangani uang, menyimpan data pribadi banyak orang, mengambil tindakan yang tidak bisa dibatalkan, atau menjalankan agen AI yang bertindak sendiri, arahkan user ke tinjauan manusia independen dan katakan itu dalam kata-kata sederhana. Bukti di balik angka-angka ini, beserta catatan kehati-hatian soal pengukurannya, ada di `docs/why-nona-exists.md`.

## Apa yang skill ini muat, dan kapan

Muat sesuai kebutuhan, jangan sekaligus, supaya konteks kerja tetap bersih:

- Selalu, di awal: `protocol/00-overview.md` (idenya dan cara membaca file bidang), `protocol/01-stakes-gating.md` (enam sinyal, prosedur per-bidang, pengesampingan, lima pertanyaan), dan `protocol/02-circularity-guard.md` (cara menjalankan tinjauan sebagai pikiran yang terpisah dan baru).
- Dua kartu cepat di folder `reference/` skill ini, untuk pencarian kilat tanpa membaca ulang file protokol yang panjang:
  - `reference/tiers.md`: lantai / standar / upaya ekstra sekilas, apa arti tiap tingkat dan apa yang dia kutip.
  - `reference/stakes-signals.md`: S1 sampai S6 sekilas, dengan aturan gerbang dan pengesampingan kerasnya.
- Per bidang, saat kamu sampai di Langkah 4: file bidang itu dari `protocol/` (daftar di atas). Muat masing-masing saat kamu menjalankannya, jangan kedua belas sekaligus di muka.
- Peta sitasi, `../CITATIONS.md`, saat kamu butuh versi atau tanggal persis dari sebuah kontrol yang kamu kutip.

## Pemicu /nona-audit

`/nona-audit` menjalankan skill ini dari awal sampai akhir pada repository yang sedang aktif: pisahkan tinjauan, temukan taruhannya, tentukan kedalaman per-bidang, jalankan kedua belas bidang pada tier yang ditugaskan, dan tutup dengan triase Bidang L dan keputusan menyewa-manusia. Spesifikasi slash-command-nya ada di `commands/nona-audit.md`. User juga bisa mempersempit cakupannya, misalnya "jalankan NONA pada bidang pembayaran saja" atau "cukup pemeriksaan lantai", dan skill menjalankan subset yang diminta terhadap gerbang risiko yang sama.

## Catatan tentang memercayai NONA itu sendiri

NONA adalah file instruksi yang dibaca agen, dan itu persis kelas file yang diincar penyerang. NONA dibangun supaya aman dijalankan: dia hanya pernah menginstruksikan agen untuk membaca kode milik pembuat sendiri dan melaporkan apa yang dia temukan. Dia tidak pernah menyuruh agen mengambil lalu menjalankan konten dari luar, mengirim data ke mana pun, meminta akses lebih dari yang dibutuhkan untuk sekadar membaca kode, atau mengubah sistem. Dia dikirim sebagai markdown polos supaya siapa pun bisa membaca tiap instruksinya sebelum menjalankannya. Sebelum memercayai salinan mana pun, user sebaiknya membacanya, mengunci versi tertentu, memverifikasi hash file terhadap yang dipublikasikan, memperlakukan fork pihak ketiga atau skill kemasan-ulang mana pun sebagai tidak tepercaya sampai ditinjau, dan tidak pernah menyambungkan auditnya untuk bertindak atas konten luar yang tidak tepercaya. Panduan lengkapnya ada di `../SECURITY.md`.

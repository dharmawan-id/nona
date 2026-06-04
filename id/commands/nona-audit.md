# /nona-audit

Perintah slash yang memulai audit NONA. Kamu yang mengetiknya; AI agent kamu yang menjalankan seluruh protokolnya, lalu mengembalikan laporan dalam bahasa yang mudah dipahami.

NONA adalah protokol audit gratis untuk orang yang membangun aplikasi pakai AI coding tool (Lovable, Cursor, Bolt, Replit, v0, Claude Code) tapi tidak bisa membaca kodenya sendiri. Halaman ini adalah spesifikasi untuk trigger-nya: apa yang kamu ketik, apa yang agent kerjakan sesudah kamu ketik, dan apa yang kamu terima balik. Pengetahuan auditnya sendiri tersimpan di file-file `protocol/`; perintah ini cuma melepas agent untuk mengerjakannya dengan urutan yang benar.

## Yang kamu ketik

Di agent yang mendukung perintah slash (misalnya Claude Code), ketik:

```
/nona-audit
```

Itu seluruh trigger-nya. Kamu tidak perlu tahu pengecekan mana yang relevan untuk aplikasimu, atau pertanyaan apa yang biasa diajukan seorang security engineer. Justru itu inti NONA: kamu memang tidak harus tahu. Pertanyaan-pertanyaannya sudah ada di dalam protokol, dan perintah ini menyuruh agent kamu menjawabnya satu per satu pada kodemu, menggantikan posisimu.

Ada beberapa cara opsional untuk mempersempit atau memperlebar jalannya audit, buat builder yang mau (semuanya opsional; kalau tidak dipakai sama sekali, agent mengaudit seluruh repo):

```
/nona-audit B            # audit satu area saja, lewat hurufnya (di sini Domain B: secrets, akses, auth)
/nona-audit B,E,G        # audit beberapa area, dipisah koma
/nona-audit confirm      # jawab dulu lima pertanyaan soal taruhan, baru audit
```

Huruf-huruf itu adalah dua belas area yang dicakup NONA, A sampai L. Daftarnya ada di bagian bawah halaman ini dan dijelaskan lengkap di `../protocol/00-overview.md`.

## Yang agent kerjakan sesudah kamu ketik

Perintah ini menjalankan protokol dengan urutan yang sudah dikunci. Langkah-langkah di bawah adalah apa yang agent kamu lakukan, supaya kamu lihat sendiri tidak ada yang ditebak-tebak.

### Langkah 0. Jalankan dari sesi yang bersih dan terpisah

Sebelum apa pun, agent sebaiknya menjalankan audit ini di konteks baru yang tidak punya ingatan soal kenapa kodenya ditulis seperti itu. Review yang dimulai dari percakapan saat membangun aplikasi cenderung meloloskan kesalahan yang sama dengan yang dibuat waktu membangun, karena pemeriksa dan penulisnya adalah pikiran yang sama, melihat kode yang sama, dengan cara yang sama. Konteks yang dipisahkan terukur menangkap lebih banyak bug kritis, dan model dari keluarga yang berbeda lebih baik lagi. Alasan lengkapnya ada di `../protocol/02-circularity-guard.md`. Praktiknya: mulai audit di percakapan baru, bukan lanjutan dari sesi membangun, dan kalau bisa pakai model yang berbeda dari yang menulis aplikasimu.

Kalau kamu mengetik `/nona-audit` di dalam sesi yang sama dengan yang membangun aplikasi, agent sebaiknya bilang terus terang dan menyarankan kamu menjalankannya ulang dari konteks yang bersih (idealnya dengan model berbeda) sebelum kamu memercayai hasilnya.

### Langkah 1. Cari tahu apa yang dipertaruhkan

Agent membaca repository kamu untuk mencari enam sinyal taruhan, yaitu sifat-sifat konkret yang menentukan seberapa keras tiap area diaudit:

- S1 Uang. Pembayaran, tagihan, pencairan dana, atau kredit yang bernilai uang sungguhan.
- S2 Identity/Auth. Login, sesi, reset password, atau peran (role). ("Auth" itu singkatan dari authentication dan authorization: membuktikan seseorang itu siapa, lalu menentukan apa yang boleh dia lakukan.)
- S3 Data pribadi. Aplikasimu menyimpan data pribadi orang sungguhan (email, no HP, nama, lokasi, data kesehatan, pesan pribadi).
- S4 Otonomi. Ada AI agent di aplikasimu yang bisa melakukan aksi sendiri (kirim, jalankan, panggil, belanja) tanpa manusia menyetujui tiap aksinya.
- S5 Blast radius. Satu kegagalan kena banyak orang sekaligus: banyak user, beberapa pelanggan berbeda di sistem yang sama, atau API publik. ("Blast radius" itu seberapa luas dampak ledakan kalau ada yang rusak.)
- S6 Irreversibility. Aksi yang tidak bisa dibatalkan setelah terjadi (hapus, transfer, publikasi, kirim). ("Irreversibility" itu sifat tidak bisa balik.)

Membaca kode adalah sumber utama, karena kode tidak salah ingat. Untuk menutup celah yang mungkin tidak digambarkan akurat oleh seorang non-coder, agent juga mengajukan lima pertanyaan polos ke kamu dan mencatat jawabanmu sebagai bagian dari audit: apakah aplikasimu menyentuh uang; apakah orang login; apakah kamu menyimpan sesuatu tentang orang sungguhan; apakah AI di aplikasimu bisa bertindak sendiri (dan adakah aksi yang mustahil dibatalkan); kalau ada yang rusak, berapa banyak orang yang kena. Pertanyaan persisnya dan prosedur lengkapnya ada di `../protocol/01-stakes-gating.md`. (Mengetik `confirm` membuat agent menanyakan ini di awal; kalau tidak, ia menanyakannya sambil jalan.)

### Langkah 2. Tentukan kedalaman tiap area, satu per satu

Taruhan itu lokal. Agent menghitung tier untuk masing-masing dari dua belas area secara sendiri-sendiri, hanya melihat sinyal yang menyentuh permukaan area itu:

- Tidak ada sinyal taruhan di sebuah area: floor ("apakah hal yang sudah jelas mestinya dikerjakan itu dikerjakan").
- Persis satu sinyal, dan bukan otonomi (S4) atau irreversibility (S6): standard ("apa yang akan dilakukan tim yang kompeten").
- Dua sinyal atau lebih, atau ada sinyal otonomi atau irreversibility apa pun: extra-mile (perbatasan; tingkat ketelitian yang bahkan tim kuat anggap sebagai usaha tambahan).

Ada beberapa override keras yang berada di atas hitungan itu, dan agent menerapkannya apa pun yang terjadi: agent otonom apa pun (S4) memaksa extra-mile di B (security), F (pola kode buatan AI), dan K (pen-test); uang apa pun (S1) atau aksi yang tak bisa dibatalkan (S6) memaksa setidaknya standard di D (data dan privasi) dan E (pembayaran dan biaya AI); dan panggilan API AI berbayar apa pun yang jalan di production memaksa batas pengeluaran di tingkat floor, sejak hari pertama, karena loop yang lepas kendali bisa menguras anggaran dalam semalam.

Aturan yang sama berlaku ke arah sebaliknya, dan agent terikat olehnya. Kalau aplikasimu tidak punya satu pun dari enam sinyal taruhan, agent tidak boleh menawarkan bug bounty, latihan chaos, target uptime formal, atau kampanye fuzzing. Ia hanya merekomendasikan floor. Memaksakan praktik kelas elite ke aplikasi bertaruhan rendah adalah kegagalan menimbang, bukan ketekunan. Sebuah floor universal yang kecil tetap berlaku untuk semua aplikasi: pakai aplikasimu sendiri seperti user sungguhan sebelum rilis, jalankan scanner otomatis gratis untuk secret yang bocor dan dependency berisiko, ngobrolkan sekali "ini bisa salah di mana", dan batasi pengeluaran tiap panggilan AI berbayar.

### Langkah 3. Jalankan tiap area dan hasilkan bukti, bukan vonis

Untuk tiap area yang masuk lingkup, agent mengerjakan file area itu (`../protocol/<huruf>-<slug>.md`) pada tier yang ditetapkan gate, dan ia menghasilkan artefak nyata yang disebut file itu, bukan sekadar acungan jempol. Daftar nyata semua secret berikut lokasi masing-masing. Peta nyata siapa bisa mencapai data yang mana dan di mana itu ditegakkan di server. Hasil nyata dari memeriksa bahwa tiap package yang di-import benar-benar ada dan memang yang dimaksud. Skor confidence tanpa apa pun di belakangnya menghasilkan kepercayaan palsu, dan kepercayaan palsu itulah kegagalan yang NONA hadapi. Bukti yang bisa kamu tunjuk mengalahkan angka yang harus kamu percayai begitu saja.

Tiap temuan diterjemahkan jadi konsekuensi bisnis yang konkret dalam bahasa sehari-hari. Bukan "ada IDOR", melainkan "orang asing bisa membuka invoice pelanggan lain mana pun cukup dengan mengubah satu angka di address bar". (IDOR, Insecure Direct Object Reference, yaitu celah di mana mengubah satu angka di URL membuka data milik orang lain.)

### Langkah 4. Putuskan dan bertindak (Domain L)

Terakhir, agent menjalankan Domain L atas seluruh tumpukan temuan dari semua area. Ia mengumpulkannya jadi satu daftar, memeringkatnya berdasarkan risiko bisnis (seberapa mungkin sebuah kesalahan terjadi, dikalikan seberapa parah dampaknya), mencatat keputusan untuk tiap temuan yang tidak langsung diperbaiki, dan menerapkan aturan tegas untuk satu momen yang paling penting buat non-coder: kapan berhenti memperbaiki sendiri dan membayar manusia untuk memeriksa. Metode lengkapnya ada di `../protocol/l-decide-and-act.md`.

## Yang kamu terima balik

Output dari agent punya dua bagian.

Sebuah tabel temuan, dengan kolom-kolom ini dan tidak ada satu baris pun yang lebih lemah dari bukti:

```
| Severity | Risiko bisnis dalam bahasa polos | Artefak bukti | Citation | Saran perbaikan |
```

Tiap baris membawa artefak nyata yang membuktikan temuan, konsekuensi bisnis yang polos, kontrol terpublikasi yang dirujuknya, dan perbaikan yang konkret. "Kelihatannya aman" bukan sebuah temuan. Pengecekan yang tidak bisa diselesaikan agent ditandai INCOMPLETE, bukan dianggap lolos.

Sebuah ringkasan keputusan, dari Domain L, yang mengubah tabel itu jadi rencana:

- daftar berperingkat, risiko bisnis tertinggi di atas, tiap item teratas dalam satu kalimat polos;
- disposisi untuk tiap temuan (perbaiki sekarang, perbaiki nanti dengan tanggal yang disebut, atau terima dengan sadar, masing-masing dengan satu baris alasan);
- pernyataan residual risk yang menyebut apa yang sudah diperiksa dan ternyata bersih (ditulis sebagai "tidak menemukan apa-apa", yaitu ketiadaan temuan, bukan bukti keamanan), dan apa yang sama sekali tidak bisa diperiksa dengan cara ini;
- vonis hire-a-human: lanjut, atau dapatkan review manusia independen, dinyatakan dalam bahasa polos beserta alasannya.

## Batas yang jujur (agent menyatakan ini di laporan)

NONA mengurangi risikomu. Ia tidak menjamin keamananmu. AI yang memeriksa kode tulisan AI menangkap sebagian berarti dari bug serius dengan murah, dan dalam tes terukur yang paling bersih ia melewatkan sebagian besar bug yang sengaja ditanam ketika bekerja sendirian (kira-kira tujuh dari sepuluh lolos bahkan di kondisi terbaik). Itu keuntungan nyata pada batas yang nyata. Ia bukan pengganti penetration test profesional oleh manusia. Aplikasi bertaruhan tinggi (uang, banyak user, aksi yang tak bisa dibatalkan, AI agent yang bertindak sendiri) tetap sebaiknya membayar review manusia independen, dan Domain L memberitahu kamu hari ketika kamu sudah masuk ke wilayah itu. Bukti di balik klaim-klaim ini, lengkap dengan catatan kehati-hatiannya, ada di `../docs/why-nona-exists.md`.

## Sebelum kamu menjalankannya: percayai filenya dulu

NONA sendiri adalah file instruksi yang dibaca agent kamu, persis jenis file yang diincar penyerang. Maka perlakukan ia sebagaimana NONA memperlakukan kodemu. NONA hanya pernah menyuruh agent membaca kodemu sendiri lalu melapor; ia tidak pernah menyuruh agent mengambil dan menjalankan apa pun dari internet. Sebelum kamu mengandalkan sebuah salinan, kunci sebuah versi, cocokkan file itu dengan hash yang dipublikasikan, dan anggap fork atau kemasan ulang dari pihak ketiga mana pun sebagai tidak tepercaya sampai kamu membacanya sendiri. Ia sengaja berbentuk markdown polos supaya kamu, atau siapa pun yang kamu percaya, bisa membacanya lebih dulu. Panduan lengkapnya ada di `../SECURITY.md`.

## Hubungan perintah ini dengan format lain

Perintah slash ini, entrypoint lintas-agent (`../AGENTS.md`), dan Claude Skill (`../skills/nona-audit/SKILL.md`) adalah tiga pintu menuju protokol yang sama. Ketiganya memakai dua belas area yang sama (A sampai L), tiga tier yang sama (floor, standard, extra-mile), dan enam sinyal taruhan yang sama (S1 sampai S6). Ketiganya tidak pernah berbeda, karena semuanya diturunkan dari file-file `protocol/`, yaitu satu-satunya sumber tempat isi audit ditulis. Kalau sebuah pengecekan berubah, ia berubah di `protocol/` lalu format-format itu dipancarkan ulang darinya; disiplin yang menjaga mereka tetap seiring dijelaskan di `../adapters/README.md`.

## Dua belas area, untuk rujukan

Kamu bisa memberikan huruf mana pun dari ini untuk mengaudit satu area saja.

- A. Verifikasi maksud: apakah kode hanya melakukan yang kamu minta, dengan aman.
- B. Secrets, akses, RLS, IDOR, auth: inti keamanan.
- C. Input dan injection: termasuk prompt injection pada fitur AI milik aplikasimu sendiri.
- D. Data dan privasi: bagaimana data pribadi disimpan, dijaga agar tidak bocor, dan dihapus.
- E. Pembayaran, monetisasi, dan integritas biaya AI: menagih dengan benar, memblokir trik tagihan, menghentikan pengeluaran AI yang lepas kendali.
- F. Pola kode buatan AI dan sirkularitas: menyiasati hilangnya margin keamanan ketika jenis AI yang sama menulis sekaligus memeriksa kode.
- G. Dependencies dan supply chain: kode luar yang kamu tarik masuk, dan package yang sebenarnya tidak ada atau ditanam supaya terlihat seperti yang disarankan AI-mu. ("Dependency" itu paket pihak ketiga yang kamu install; "supply chain" itu rantai pemasok kode dari pihak luar.)
- H. Kebersihan config dan deploy: kesalahan pengaturan dan saat peluncuran, password default, secret yang ikut terkirim ke browser, header pengaman yang hilang.
- I. Ops, uptime, backup, rollback: menyadari ada yang rusak, gagal dengan aman, lalu pulih.
- J. Kewarasan arsitektur: batas yang sehat antara yang tepercaya dan yang tidak tepercaya, kerusakan yang tetap terbendung.
- K. Pen-test dan review profesional: apa yang diuji simulasi serangan sungguhan, dan langit-langit jujur dari AI yang memeriksa AI. ("Pen-test", penetration test, yaitu mencoba membobol aplikasimu sendiri sebelum penyerang yang melakukannya.)
- L. Putuskan dan bertindak: memeringkat temuan berdasarkan risiko bisnis, dan aturan jelas kapan harus menyewa manusia.

Penjelasan lengkap tiap area ada di `../protocol/00-overview.md`.

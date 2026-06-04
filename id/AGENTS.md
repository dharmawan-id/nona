# AGENTS.md: NONA

Ini titik masuk yang tinggal pasang. Kalau kamu sebuah AI agent dan file ini ada di proyek yang sedang kamu kerjakan, orang yang membangun aplikasi ini ingin kamu mengauditnya untuk dia. Dia tidak bisa membaca kodenya. Tugasmu: temukan apa yang bisa membahayakan bisnisnya, buktikan tiap temuan dengan bukti, beri tahu dia apa yang harus diperbaiki duluan, dan beri tahu satu momen di mana dia sebaiknya berhenti lalu membayar seorang ahli manusia.

File ini adalah tulang punggung yang bisa dijalankan. Ia membawa seluruh protokol dalam bentuk ringkas supaya kamu bisa menjalankan audit dari sini saja. Tiap bagian menaut ke file yang lebih panjang di bawah `protocol/` untuk penalaran lengkap, tabel pemeriksaan utuh, dan sitasinya. Baca file tertaut untuk sebuah domain sebelum kamu masuk dalam-dalam ke domain itu. Standar di balik tiap pemeriksaan dipetakan di `CITATIONS.md`. Arti dalam bahasa sederhana dari tiap istilah teknis ada di `docs/glossary.md`.

Satu catatan untuk orang yang membangun aplikasi, sebelum agen mulai: NONA gratis dan open-source, ia markdown polos yang bisa kamu baca sendiri, dan ia hanya pernah menyuruh agen membaca kodemu sendiri lalu melapor balik. Ia tidak pernah menyuruh agen mengambil lalu menjalankan apa pun dari luar, tidak pernah meminta kuncimu, dan tidak pernah mengirim kodemu ke mana pun. Kalau kamu mem-fork-nya atau memasangnya sebagai skill, baca `SECURITY.md` dulu dan pastikan ini versi yang asli sebelum kamu memercayainya.

---

## Apa yang NONA lakukan

Seseorang membangun aplikasi dengan alat coding AI dan tidak bisa membaca hasilnya. Dia tidak tahu pertanyaan apa yang akan diajukan seorang engineer yang teliti, jadi dia tidak bisa menanyakannya sendiri ke agen-nya, dan jempol dari alat yang sama yang menulis kodenya itu tidak membuktikan apa-apa. NONA adalah daftar periksa yang dibawa engineer teliti itu, ditulis hitam di atas putih, supaya audit tidak pernah terhambat oleh apa yang kebetulan diketahui si pembangun. Si pembangun tidak perlu tahu apa yang harus ditanyakan. NONA sudah menanyakannya, dan menyerahkan pertanyaan-pertanyaannya kepadamu.

NONA mencakup dua belas bidang, diberi huruf A sampai L, dan di dalam tiap bidang ia tahu tiga kedalaman ketelitian: floor (dasar), standard (standar wajar), dan extra-mile (upaya lebih). Cakupannya menyeluruh dengan sengaja, sampai ke praktik yang bahkan tim engineering kuat anggap sebagai usaha tambahan. Ia tetap cerdas alih-alih boros dengan membaca seberapa besar yang sungguh dipertaruhkan di repository spesifik ini lalu menaikkan ketelitian hanya di tempat yang risikonya memang pantas. Aplikasi pembayaran-dan-login dengan agen otonom pantas dapat pemeriksaan garis terdepan. Aplikasi daftar-tugas akhir pekan pantas dapat floor saja.

Dua aturan berjalan di sepanjang semua yang kamu lakukan. Pertama, hasilkan artefak, bukan vonis. Kamu tidak boleh cuma bilang "kelihatannya aman". Kamu menghasilkan daftar nyata secret berikut di mana letak masing-masing, peta nyata siapa bisa menjangkau apa, hasil nyata dari pengecekan apakah sebuah package memang ada. Skor kepercayaan tanpa apa-apa di belakangnya menciptakan kepercayaan palsu, dan kepercayaan palsu justru kegagalan yang NONA ada untuk melawannya. Kedua, jujur soal batas atasnya. AI yang memeriksa kode buatan AI menangkap sepotong berarti dari bug serius dengan murah dan melewatkan sebagian besarnya saat bekerja sendiri. Itu keuntungan nyata pada batas yang nyata, dan kamu menyatakan batasnya terus terang alih-alih menyerahkan ke si pembangun sebuah laporan bersih berpenampilan resmi yang lalu berhenti mereka pertanyakan.

---

## Cara menjalankan audit

Enam langkah, berurutan. Jangan lewati langkah persiapan; justru itulah yang membuat audit AI layak dipercaya sama sekali.

### Langkah 0. Jalankan sebagai orang asing, di konteks yang bersih

Mulai di sesi baru yang tidak punya ingatan soal bagaimana kode ini ditulis: tidak ada riwayat chat build, tidak ada rasional desain. Temui kode itu seperti orang luar menemuinya, sebagai sesuatu yang sudah jadi untuk diperiksa, tanpa cerita apa pun yang menjelaskan dan memaafkan kekurangannya. Ini tuas paling murah dan sudah terukur: review yang dijalankan di konteks terpisah mengalahkan review di sesi yang sama, dan keuntungannya paling besar pada error kritis (sekitar sebelas poin persentase lebih banyak deteksi error kritis; Cross-Context Review). Review dua kali di sesi yang sama hampir tidak membeli apa-apa. Keuntungannya datang dari melihat dari konteks yang terpisah, jadi lebih banyak putaran di chat yang sama hanya membeli sedikit untukmu.

Lebih kuat lagi adalah model yang berbeda. Kalau agen berbasis Claude membangun aplikasi ini, jalankan audit dengan keluarga model yang berbeda jika memungkinkan, begitu pula sebaliknya kalau keluarga lain yang membangunnya. Model dari keluarga yang sama berbagi training, sehingga berbagi titik buta, seperti dua engineer dari tempat yang sama membuat kesalahan yang sama. Perlakukan ini sebagai rekomendasi. Buktinya mendukung arahnya; ia tidak mematok angka tangkapan, dan kamu sebaiknya curiga pada siapa pun yang mengklaim angka itu. Kalau kamu cuma punya model yang sama, tetap jalankan di konteks bersih, yang secara terpisah terukur membantu.

Nyatakan, di output audit, model mana yang menulis aplikasi (sebaik yang diketahui) dan model mana yang menjalankan audit ini. Kalau keduanya keluarga yang sama, tandai review sebagai lebih lemah dan sarankan menjalankan ulang domain bertaruhan tinggi di model yang berbeda. Metode lengkapnya ada di `protocol/02-circularity-guard.md`.

### Langkah 1. Deteksi sinyal taruhan

Pindai repository untuk enam sinyal taruhan. Sebuah sinyal taruhan adalah sifat konkret dan bisa dicek yang berarti sebuah kesalahan di sini akan benar-benar menyakitkan. Masing-masing adalah fakta yang bisa diamati tentang kode, jadi dua agen yang membaca repo yang sama seharusnya menemukan sinyal yang sama.

- **S1 Uang.** Pembayaran, penagihan, pencairan dana (payout), atau kredit yang punya nilai tunai. Bukti: library penyedia pembayaran, kode checkout, handler webhook, logika kredit atau saldo.
- **S2 Identitas/Auth.** Login, sesi, reset kata sandi, atau peran dan izin. ("Auth" itu authentication dan authorization: membuktikan siapa seseorang, dan menentukan apa yang boleh dia lakukan.) Bukti: kode login dan sesi, pengecekan peran.
- **S3 Data pribadi.** Aplikasi menyimpan PII, yaitu personally identifiable information (data yang bisa mengidentifikasi seseorang): email, nomor HP, nama, detail kesehatan, lokasi, pesan pribadi. Bukti: tabel dan field database yang memegang data pribadi.
- **S4 Otonomi.** Sebuah agen AI di aplikasi bisa mengambil tindakan sendiri (mengirim email, menjalankan kode, memanggil tool, membelanjakan uang) tanpa manusia menyetujui tiap tindakan. Bukti: kode tempat sebuah AI memanggil tool atau bertindak tanpa gerbang manusia.
- **S5 Radius dampak (blast radius).** Satu kegagalan menyakiti banyak orang sekaligus: banyak user, beberapa pelanggan terpisah di satu sistem (multi-tenant), API publik, infrastruktur bersama. Bukti: pola multi-tenant, API publik, infra bersama.
- **S6 Tidak bisa dibatalkan (irreversibility).** Sebuah tindakan tidak bisa diurungkan: hapus, transfer, terbitkan, kirim. Bukti: tindakan hapus permanen, transfer, terbitkan, atau kirim.

Membaca kode adalah sumber utama, karena kode tidak salah ingat. Tapi orang non-coder mungkin tidak menggambarkan taruhan aplikasinya sendiri dengan akurat, jadi ajukan juga lima pertanyaan polos ini dan catat jawabannya. Perlakukan "ya" sebagai sinyal yang ada bahkan kalau kode tidak jelas menunjukkannya.

1. Apakah aplikasimu menyentuh uang dengan cara apa pun (pembayaran, langganan, pencairan dana, kredit yang bernilai uang sungguhan)? (S1)
2. Apakah orang login (akun, kata sandi, sign-in, reset kata sandi, atau peran seperti user biasa lawan admin)? (S2)
3. Apakah kamu menyimpan apa pun tentang orang sungguhan (nama, email, nomor HP, alamat, lokasi, kesehatan, pesan pribadi)? (S3)
4. Apakah AI di aplikasimu bisa melakukan hal sendiri (mengirim, menjalankan kode, memanggil layanan, mengubah data, membelanjakan) tanpa kamu menyetujui tindakan itu lebih dulu? Dan terpisah dari itu, apakah ada tindakan yang tidak bisa diurungkan setelah dilakukan (menghapus akun, transfer, menerbitkan, mengirim)? (S4 dan S6)
5. Kalau sesuatu rusak, berapa banyak orang yang terkena sekaligus: cuma kamu, segelintir, atau banyak orang asing dan beberapa pelanggan di sistem yang sama? (S5)

Mesin lengkapnya, dengan panduan deteksi persis dan aturan anti-rekayasa-berlebihan, ada di `protocol/01-stakes-gating.md`.

### Langkah 2. Pilih tier per domain (taruhan bersifat lokal)

Hitung tier untuk masing-masing dari dua belas domain secara terpisah, dengan hanya melihat sinyal taruhan yang menyentuh permukaan domain itu. Taruhan bersifat lokal. Uang di permukaan pembayaran menaikkan ketelitian pada domain pembayaran sementara perkakas uptime, yang tidak membawa uang, tetap di tier lebih rendahnya sendiri. Aturan dasarnya, dibaca sebagai resep:

```
untuk tiap domain A sampai L:
  sinyal_di_sini = sinyal taruhan (S1 sampai S6) yang ada di permukaan domain INI
  jika sinyal_di_sini == 0:                           tier = FLOOR
  jika sinyal_di_sini == 1 dan bukan (S4 atau S6):    tier = STANDARD
  selain itu:                                         tier = EXTRA_MILE
```

Dengan kata-kata: tidak ada sinyal pada sebuah domain dapat floor; tepat satu sinyal yang bukan otonomi atau ketidakbisaan-dibatalkan dapat standard; dua sinyal atau lebih, atau otonomi maupun ketidakbisaan-dibatalkan berapa pun, dapat extra-mile. Otonomi dan ketidakbisaan-dibatalkan dipisahkan secara khusus karena masing-masing, dengan sendirinya, bisa mengubah bug kecil jadi malapetaka.

Tiga kedalaman itu:

- **Floor.** "Apakah ada yang mengerjakan hal yang sudah jelas?" Garis dasar yang tidak bisa ditawar untuk aplikasi apa pun. Melewatinya adalah cara aplikasi dirilis dengan pintu terbuka lebar.
- **Standard.** "Apa yang dikerjakan tim yang kompeten." Untuk aplikasi yang punya sesuatu nyata untuk dilindungi, seperti login atau data pelanggan.
- **Extra-mile.** Garis terdepan. Praktik yang bahkan tim kuat perlakukan sebagai usaha tambahan: penetration testing adversarial, pagar pengaman biaya AI, pola containment yang mengurung agen AI, threat modeling formal. Tier yang dibangun utuh, didapat hanya saat taruhannya membenarkan.

**Pengesampingan keras (terapkan ini sebelum melapor, ia duduk di atas hitungan):**

- **S4 apa pun (sebuah agen AI bertindak sendiri) memaksa EXTRA-MILE pada B (keamanan), F (kode hasil-AI), dan K (pen-test).** Lalu sandboxing, least-privilege, red-team prompt injection, dan setidaknya satu pola containment menjadi wajib, bukan opsional.
- **S1 apa pun (uang) atau S6 apa pun (tidak bisa dibatalkan) memaksa setidaknya STANDARD pada D (data dan privasi) dan E (pembayaran dan biaya AI).** Kalau aplikasi yang sama juga punya S5 (radius dampak), kedua domain itu naik ke EXTRA-MILE.
- **Panggilan API AI berbayar apa pun di produksi memaksa pagar pengaman biaya (batas pengeluaran keras dan peringatan lunak) di FLOOR, sejak hari pertama,** karena loop yang lepas kendali tanpa batas bisa menguras anggaran dalam semalam.

**Aturan anti-rekayasa-berlebihan (mengikat):** kalau nol sinyal taruhan yang ada, JANGAN usulkan bug bounty, chaos engineering, target uptime formal (SLO), infrastruktur canary, atau kampanye fuzzing. Rekomendasikan hanya floor. Menerapkan praktik kelas atas secara berlebihan ke aplikasi taruhan rendah adalah kegagalan menimbang, bukan ketekunan.

**Floor universal, tidak pernah dilewati bahkan pada taruhan nol:** dogfood aplikasimu (pakai seperti user sungguhan sebelum dirilis); jalankan scanner shift-left gratis (dependency, secret, dan analisis statis dasar) yang menangkap kebocoran jelas dan package berisiko; lakukan satu obrolan pre-mortem (bayangkan ini setahun kemudian dan proyeknya gagal, daftar alasannya, perbaiki yang bisa sekarang); dan kalau ada panggilan AI berbayar, batasi pengeluaran dan jalankan satu eval dasar (rapor kecil untuk fitur AI).

### Langkah 3. Jalankan blok instruksi-agen tiap domain

Untuk tiap domain, di tier yang kamu pilih, jalankan audit domain itu. Tiap bagian per-domain di bawah membawa checklist ringkas dan menaut ke file lengkap di bawah `protocol/` yang memuat tabel pemeriksaan utuh dan blok instruksi-agen yang bisa dijalankan. Jalankan blok itu. Di tempat sirkularitas berperan (paling berperan di A, B, C, F, J, K, dan pada verifikasi-perbaikan di L, karena itulah pemeriksaan yang diloloskan begitu saja oleh self-review konteks-sama), jalankan domain itu di konteks bersih dan terpisah dari Langkah 0. Verifikasi package terhadap registry yang sebenarnya, bukan terhadap ingatanmu tentang apa yang kamu impor, karena nama yang kamu yakini bisa saja tetap nama yang dikarang sebuah model.

### Langkah 4. Keluarkan temuan sebagai artefak, bukan vonis

Tiap domain menghasilkan artefak bernama di bloknya, lalu sebuah tabel temuan dengan kolom persis ini:

```
| Tingkat keparahan | Risiko bisnis dalam kata-kata biasa | Artefak bukti | Sitasi | Saran perbaikan |
```

Aturan untuk tabel, ditegakkan di tiap baris:

- Terjemahkan tiap temuan menjadi konsekuensi bisnis konkret yang dipahami si pembangun. Bukan "ada IDOR" tapi "orang asing bisa membuka invoice pelanggan lain mana pun dengan mengganti sebuah angka di address bar." Bukan "verifikasi tanda tangan hilang" tapi "orang asing bisa mendapat paket berbayar gratis dengan mengirim pesan pembayaran palsu."
- Tidak ada vonis telanjang. "Kelihatan aman", "lolos", "tidak ada masalah" tanpa artefak terperiksa di belakangnya, ditandai sendiri sebagai pemeriksaan yang belum lengkap. Lampirkan buktinya: file dan baris, query-nya, route-nya, nama package-nya, nilai setelan sebenarnya.
- Sitasi hanya kontrol yang disebut di domain yang kamu jalankan dan yang dipetakan di `CITATIONS.md`. Jangan mengarang ID kontrol. Di tempat sebuah ID kontrol rapuh terhadap versi, nyatakan maknanya yang biasa dan sitasi di tingkat dokumen. Khususnya, jangan mencetak nomor kontrol OWASP ASVS di luar V1 1.2.5; sitasi ASVS di tingkat dokumen selain itu. Sitasi CIS benchmark di tingkat benchmark bernama untuk versi mayor yang berjalan, bukan per nomor item.
- Kalau kamu tidak bisa menghasilkan artefak yang dituntut sebuah pemeriksaan, katakan begitu dan tandai pemeriksaan itu INCOMPLETE. Backup yang tak teruji yang dilaporkan "aman" adalah persis kegagalan yang protokol ini ada untuk memaparkannya.

### Langkah 5. Nyatakan risiko sisa dan keputusan sewa-manusia

Jangan menyatakan aplikasi aman. Nyatakan apa yang kamu periksa, apa yang tidak bisa kamu periksa dengan cara ini, dan apa yang masih belum pasti. Laporkan pemeriksaan yang tidak menemukan apa-apa sebagai persis itu, "tidak menemukan apa-apa", yang merupakan ketiadaan temuan dan belum sampai pada "aman". Diam tidak pernah berarti sukses.

Lalu arahkan. Jalankan triase dan keputusan eksplisit sewa-manusia di Domain L (`protocol/l-decide-and-act.md`), yang melihat seluruh tumpukan temuan sekaligus, memeringkatnya berdasarkan apa yang dibebankan sebuah kesalahan ke bisnis (kemungkinan kali dampak), dan menerapkan gerbang eskalasi. Batas atas yang jujur tinggal di pernyataan ini: audit AI yang dijalankan dengan baik, di konteks bersih dan idealnya di model yang berbeda, menangkap sepotong berarti dari bug serius dan melewatkan sebagian besar error yang ditanam saat bekerja sendiri. Dalam pengukuran terbersih yang tersedia, bahkan pada kondisi terbaik, yaitu konteks segar yang terpisah, hanya sekitar 28,6 persen error yang ditanam tertangkap menurut F1 (skor gabungan dari bug yang ditemukan dibanding alarm palsu yang dibunyikan; Cross-Context Review). Kira-kira tujuh dari sepuluh selamat. Itu lewat-pertama yang berguna dan titik mulai yang sungguh lebih tinggi untuk seorang manusia berbayar. Ia bukan jaminan keamanan, dan menambah model kedua tidak mengubahnya menjadi penetration test profesional. Untuk aplikasi yang menangani uang, memegang banyak data orang, bisa mengambil tindakan yang tidak bisa dibatalkan, atau menjalankan agen otonom, beri tahu si pembangun secara tertulis untuk mendapatkan review manusia independen. Tugas NONA adalah memberi tahu mereka kapan mereka sudah melewati garis itu, bukan berpura-pura mereka belum.

---

## Dua belas domain (checklist ringkas)

Tiap blok di bawah adalah versi pendeknya. Baca file `protocol/` yang tertaut untuk tabel pemeriksaan utuh, penalaran "apa yang tidak bisa kamu lihat di sini", sitasi persisnya, dan blok instruksi-agen yang bisa dijalankan. Huruf, nama tier, dan sinyal taruhannya sama di mana-mana.

### A. Verifikasi maksud: apakah kode hanya melakukan yang kamu minta, dengan aman

File lengkap: `protocol/a-intent.md`. Floor universal dari seluruh audit. "Ia jalan" adalah klaim soal layar; "ia aman" adalah klaim soal apa lagi yang bisa kode lakukan ketika ada yang menekan-nekannya.

- Tier: FLOOR selalu, bahkan pada taruhan nol. S1 atau S2 pada sebuah fitur menambah STANDARD; S4 atau S6 menambah EXTRA-MILE.
- Artefak floor: tabel maksud-vs-perilaku per fitur (maksud yang dinyatakan di sebelah perilaku teramati, perbedaan ditandai); daftar efek samping (tiap penulisan, panggilan, pengiriman, penghapusan, masing-masing ditandai diharapkan atau tak terduga); daftar jalur-tidak-mulus (kasus input buruk, kosong, bermusuhan yang ditangani kode dan celah yang tidak); satu paragraf definisi "benar dan aman" per fitur, ditulis sebelum menilai kode.
- Standard (fitur uang/identitas): telusur jalur per fitur dengan cabang yang melenceng dari maksud ditandai; bukti penegakan-server (aturan ditegakkan server, bukan cuma disembunyikan di layar); daftar kontrol-hilang.
- Extra-mile (otonomi/tak terbalikkan): golden suite (kasus input dan perilaku boleh-diterima yang ditegaskan, dengan putaran lulus/gagal); artefak verifikasi-output (pengecekan yang menyala sebelum tindakan tak terbalikkan dikomit); threat model tertulis.

### B. Secret, akses, RLS, IDOR, auth: inti keamanan

File lengkap: `protocol/b-secrets-access-auth.md`. Siapa bisa melihat apa, siapa bisa melakukan apa, dan di mana kunci-kunci disimpan. (RLS, row-level security, adalah aturan database yang membatasi baris mana yang boleh dijangkau seorang user. IDOR, insecure direct object reference, adalah orang asing membuka catatan orang lain dengan mengganti sebuah angka di alamat web.)

- Tier: login apa pun (S2) membuat ini STANDARD minimal. S2 dengan S3 atau S5 membuatnya EXTRA-MILE. **Pengesampingan keras: S4 apa pun memaksa EXTRA-MILE, dan pemeriksaan least-privilege/sandboxing plus red-team prompt injection menjadi wajib.** Tanpa login, tanpa peran, tanpa PII, tanpa agen, ia menciut ke FLOOR.
- Artefak floor: inventaris secret (tiap secret, lokasinya, "hanya server-side" atau "TEREKSPOS" di bundle browser, di balik awalan `NEXT_PUBLIC_`, atau di riwayat git, yang terekspos ditandai untuk dirotasi); tabel cakupan RLS (tiap tabel di skema yang terekspos, RLS menyala atau mati, default-deny terkonfirmasi); hasil cek-kepemilikan per tipe record milik user (cek IDOR yang hidup); peta rute-terlindungi (server, bukan browser, menolak permintaan tanpa login).
- Standard: peta authorization (tiap tindakan dan tipe data yang dilindungi, aturannya, lokasi server yang menegakkannya, celah ditandai); daftar aksi-istimewa (aksi admin dijaga cek peran sisi server, bukan tombol tersembunyi); tinjauan kewarasan-kebijakan (tidak ada kebijakan RLS yang memercayai nilai yang bisa user ubah tentang dirinya); laporan sesi-dan-kredensial (kedaluwarsa, pencabutan, pengikatan-pemilik alur reset, rate limit login).
- Extra-mile: log percobaan-akses (sungguh coba pintunya sebagai user yang salah lalu catat respons server); peta hak akses (tiap komponen pakai least privilege; kunci induk dipanggil hanya di tugas server tepercaya; agen otonom di-sandbox); log percobaan-injeksi (instruksi tersembunyi dicobakan ke agen, dengan kontrol yang memblokir atau gagal memblokir masing-masing).

### C. Input dan injection: termasuk prompt injection pada AI-mu sendiri

File lengkap: `protocol/c-input-injection.md`. Injection terjadi ketika teks dari dunia luar diperlakukan sebagai perintah alih-alih data. Mencakup SQL injection, cross-site scripting, command injection, dan prompt injection (teks jahat yang disuapkan ke fitur AI aplikasimu menimpa instruksinya).

- Tier: FLOOR selalu. S3 di balik input yang bisa di-inject menambah STANDARD. Fitur AI yang membaca teks luar tak terpercaya (halaman web, email, unggahan, record yang ditulis user lain) mendapat penanganan prompt injection STANDARD terlepas dari sinyal lain; kalau AI itu juga bisa bertindak sendiri (S4), ia mendapat EXTRA-MILE dengan red-team dan pola containment. Permukaan AI yang hanya membaca input tetap yang kamu tulis turun ke FLOOR.
- Artefak floor: peta input-ke-sink (tiap input eksternal dan ke mana ia mendarat); daftar query database (tiap query yang menyentuh input ditandai parameterized atau string-built); daftar output-encoding (tiap tempat input ditampilkan di halaman ditandai encoded atau raw); daftar perintah/jalur; daftar log injection; catatan fitur AI (bagaimana teks user dijaga terpisah dari instruksimu, dan ke mana output model menuju).
- Standard: peta validasi (validasi sisi server pada jalur input data pribadi); tabel destination-encoding (nilai di-encode untuk tujuan persis yang ia capai, bukan sekadar "divalidasi"); inventaris input tak terpercaya per fitur AI; peta penanganan output AI (output model adalah input tak terpercaya; perlakukan sebagai itu).
- Extra-mile: log red-team (percobaan prompt injection dan hasilnya); catatan desain containment (action-selector, plan-then-execute, dual-LLM, atau context-minimization, dengan apa yang masing-masing blokir); ringkasan fuzzing untuk parser input tak terpercaya yang rumit di bawah taruhan nyata.

### D. Data dan privasi: penanganan PII, kebocoran, penghapusan

File lengkap: `protocol/d-data-privacy.md`. Informasi pribadi yang dipegang aplikasi dan cara ia bisa bocor: log, halaman error, respons jaringan yang terlalu lebar, dan balasan AI yang mengulang kembali sesuatu yang pribadi.

- Tier: FLOOR pada aplikasi apa pun yang menyentuh PII. S3 ada menambah STANDARD; uang (S1) atau ketidakbisaan-dibatalkan (S6) pada data menambah STANDARD; S5 digabung dengan S1 atau S6 menambah EXTRA-MILE. Aplikasi yang benar-benar tidak menyimpan apa pun yang pribadi mengonfirmasi ketiadaan itu lalu berhenti.
- Artefak floor: hasil perlindungan transport (semua PII lewat HTTPS/TLS); daftar paparan repository (PII asli atau kredensial di working tree atau riwayat git, ditandai untuk dihapus dan dirotasi); hasil tanpa-secret-di-log (field sensitif absen dari log dan respons error); hasil paparan output-model (selidik apakah balasan AI bisa membocorkan data orang lain atau sebuah secret); artefak jalur penghapusan (langkah sungguhan yang membuang data satu orang yang disebut namanya, dengan konfirmasi ia hilang, bukan sekadar disembunyikan).
- Standard: peta perlindungan at-rest (data tersimpan terenkripsi; password ter-hash, bukan polos); inventaris aliran data (tiap kategori PII, penyimpanan yang memegangnya, tiap layanan eksternal yang menerimanya dan field yang masing-masing terima); hasil minimisasi data (field dikumpulkan vs dibutuhkan, plus titik retensi); hasil penanganan-data-AI (apa yang ditahan atau dilatih tiap penyedia AI).
- Extra-mile: artefak pemisahan data (identitas langsung dijaga terpisah atau disamarkan); artefak deteksi kebocoran (detektor yang mengawasi respons, log, dan output AI untuk pola email, pembayaran, atau ID); catatan risiko-data generative-AI per permukaan AI.
- **Lapisan UU PDP Indonesia (produk komersial yang melayani pengguna Indonesia):** dasar pemrosesan/persetujuan (Pasal 20), minimisasi data (Pasal 16), jalur akses-koreksi-penghapusan/penarikan persetujuan (Pasal 7-9), notifikasi kebocoran 3x24 jam ke pemilik data dan otoritas (Pasal 46-47), pengungkapan dan persetujuan transfer lintas-batas untuk hosting luar negeri (Pasal 56), dan DPO tidak diperlukan untuk pemrosesan kecil biasa (Pasal 53 jo. Putusan MK 151/PUU-XXII/2024). Minimal-cukup, masing-masing terikat ke pasalnya; jangan naikkan ke paperwork ala GDPR.

### E. Pembayaran, monetisasi, dan integritas biaya AI

File lengkap: `protocol/e-payments-ai-cost.md`. Menagih dengan benar, menghalangi tipuan tagihan, dan menghentikan pengeluaran AI yang lepas kendali (denial-of-wallet, di mana yang jadi sasaran adalah tagihannya, bukan server-nya). (Webhook adalah pesan otomatis dari server ke server yang mengonfirmasi sebuah peristiwa seperti pembayaran; webhook yang dipalsukan bisa memalsukan pesanan yang dianggap dibayar.)

- Tier: uang (S1) atau ketidakbisaan-dibatalkan (S6) membuat ini STANDARD minimal; S1 atau S6 dengan S5 membuatnya EXTRA-MILE. **Aturan hari-pertama: panggilan AI berbayar apa pun di produksi memaksa dua pemeriksaan floor batas-biaya bahkan tanpa pembayaran.**
- Artefak floor: daftar rute webhook dengan baris pengecekan tanda tangan yang persis, atau rute bernama "TIDAK ADA PENGECEKAN SIGNATURE"; kode sisi server yang menunjukkan harga, paket, dan status-terbayar dibaca ulang dari database-mu sendiri atau dari penyedia, tidak pernah dari request browser; mekanisme idempotency (webhook yang diputar ulang adalah no-op yang aman); hasil pemindaian secret pada bundle klien dan riwayat git untuk kunci penyedia; batas pengeluaran total yang keras dengan nilainya; rate limit per user atau per sesi pada jalur AI-berbayar.
- Standard: tabel penyalahgunaan alur bisnis (checkout, upgrade, refund, payout, pemberian kredit, kupon, masing-masing dengan perlindungannya atau "TIDAK TERLINDUNGI"); cek kepemilikan pada tiap record penagihan; pencatatan event penagihan; penanganan fail-closed atas error pembayaran dan penyedia; batas biaya AI berlapis (per sesi, per user per hari) plus ambang peringatan lunak.
- Extra-mile: log red-team alur bisnis (coba penyalahgunaannya lalu catat apa yang diizinkan aplikasi); rantai model fallback yang menjaga batasnya; tinjauan model-berbeda plus gerbang persetujuan manusia sebelum aksi uang yang tak bisa dibatalkan; eval kecil dan monitor pemakaian-dan-biaya saat berjalan untuk fitur AI berbayar.
- **Lapisan gateway Indonesia:** verifikasi tanda tangan callback per gateway, Midtrans (hitung ulang SHA512 dari `order_id + status_code + gross_amount + ServerKey` lalu bandingkan ke `signature_key`), Xendit (verifikasi header `X-CALLBACK-TOKEN` terhadap token akun), iPaymu (HMAC-SHA256 sesuai skemanya); plus validasi ulang jumlah/order/status terhadap database sendiri, idempotency pada callback berulang, jangan pernah percaya screenshot bukti pembayaran, dan utamakan QRIS dinamis. Merchant yang memakai gateway berlisensi tidak butuh lisensi Bank Indonesia atau OJK.

### F. Pola kode buatan AI dan sirkularitas: domain khasnya

File lengkap: `protocol/f-ai-code-circularity.md`. Jenis AI yang sama menulis sekaligus mengaudit kode ini, jadi margin keamanan biasa berupa sepasang mata segar sudah hilang kecuali kamu membangunnya kembali dengan sengaja. Domain ini adalah pengaman sirkularitas yang diterapkan, plus pola buatan-AI yang paling mungkin menggigit. Metode lintas-domainnya ada di `protocol/02-circularity-guard.md`.

- Tier: FLOOR selalu (masalah sirkularitas hadir sejak detik AI menulis kodenya). S1, S3, atau S6 menambah STANDARD. **Pengesampingan keras: S4 apa pun memaksa EXTRA-MILE, dan review model-berbeda, harness verifikasi-output, dan log provenance menjadi wajib.** Tool akhir pekan yang sungguh bertaruhan rendah jalan FLOOR saja.
- Artefak floor: pernyataan pemisahan-konteks (audit berjalan di sesi baru tanpa riwayat build; catat rasional build apa pun yang sempat dilihat reviewer, yang memperlemah hasilnya); baris provenance-model (model mana yang menulis aplikasi, mana yang mengaudit, dengan peringatan keluarga-sama kalau cocok); temuan berbukti-bukan-vonis (tiap "sudah diperiksa" membawa artefak yang diperiksa; "kelihatan beres" telanjang ditandai); pernyataan risiko-sisa dengan satu baris eksplisit "ini bukan jaminan keamanan".
- Standard: peta review kode-AI (blok berarti mana yang ditulis AI dan pemeriksaan independen apa yang menutupi tiap blok bertaruhan tinggi); review business-logic (aturan uang, izin, dan alur kerja sebagaimana diniatkan vs apa yang ditegakkan kode; ini kelas kegagalan AI yang dominan); review penanganan-output; catatan provenance.
- Extra-mile: catatan review model-berbeda (keluarga berbeda meninjau kode bertaruhan tinggi, temuan didaftar terpisah); golden suite; harness verifikasi-output dengan self-consistency sebelum langkah tak terbalikkan; log provenance yang terpelihara.

### G. Dependency dan supply chain: package halusinasi dan typosquat

File lengkap: `protocol/g-dependencies-supply-chain.md`. Kode pinjaman yang ditarik aplikasi. Tool AI mengarang package: sekitar satu dari lima contoh kode AI merujuk package yang tidak ada, dan nama karangannya berulang, jadi penyerang mendaftarkan satu lalu menunggu. Nama sederhananya slopsquatting. Plug-in AI, skill, dan deskripsi tool yang dipasang untuk membangun atau menjalankan aplikasi juga kode pinjaman, dengan jangkauan penuh.

- Tier: FLOOR selalu (risiko slopsquatting tidak peduli seberapa kecil aplikasinya). S5 menambah STANDARD. S5 dengan S1 atau S6 menambah EXTRA-MILE pada pemeriksaan integritas-build. **S4 (agen yang memuat dan bertindak atas plug-in, skill, atau tool) menambah EXTRA-MILE pada pemeriksaan komponen-AI.** Aplikasi kecil satu-user tanpa uang, tanpa PII, tanpa agen jalan FLOOR saja.
- Artefak floor: hasil keberadaan-package (tiap package yang diimpor dan dideklarasikan ditandai "asli di registry resmi" atau "tidak ditemukan / diduga tiruan", yang mencurigakan ditandai per nama; cek slopsquatting); artefak lockfile (lockfile yang di-commit mencakup seluruh pohon dan build memakainya); hasil kerentanan-dependency (seluruh pohon dipindai, tiap lubang kritis atau tinggi yang diketahui didaftar dengan versi perbaikannya); artefak build-provenance (catatan bagaimana hasil rilis dibangun).
- Standard: inventaris komponen (daftar rinci semua yang dirilis, sering disebut SBOM, label komposisi perangkat lunakmu); hasil penyaringan-dependency (dirawat, dipakai luas, sungguh dibutuhkan, yang ditelantarkan atau tak terpakai ditandai); artefak signed-provenance (build berjalan di platform terkelola yang menandatangani keluarannya); hasil AI-component provenance.
- Extra-mile: artefak hardened-build (build terisolasi dan tahan-utak-atik plus verifikasi riwayat source); artefak pinning-and-monitoring (dependency dipaku ke content hash terverifikasi plus pemindaian ulang berkelanjutan); artefak AI-component vetting (tiap plug-in, skill, dan tool yang dimuat agen, apa yang ia lakukan, jangkauannya, versi tinjauannya yang dipaku).

### H. Higiene config dan deploy: salah-konfigurasi, kredensial default, secret di bundle, header

File lengkap: `protocol/h-config-deploy.md`. Pengaturan di sekitar aplikasi: apa yang dikirim ke browser, apa yang tertinggal di default, dan pintu depan mana yang dibiarkan terbuka oleh host dan database. (Security header adalah instruksi singkat yang dilampirkan server ke tiap respons untuk menyalakan proteksi sisi-browser yang kalau tidak akan dilewati browser.)

- Tier: FLOOR untuk aplikasi yang ter-deploy apa pun, termasuk proyek akhir pekan tanpa login. PII tersimpan (S3) menambah STANDARD. Secret uang (S1) atau PII (S3) digabung dengan S5 menambah EXTRA-MILE.
- Artefak floor: inventaris secret (tiap secret terkonfigurasi, "hanya server-side" atau "TEREKSPOS" di bundle, di balik `NEXT_PUBLIC_`, atau di riwayat git; awalan `NEXT_PUBLIC_` mengirim nilai ke browser, jadi secret apa pun dengannya sudah dipublikasikan); pemeriksaan pengaturan production (debug mati, error verbose mati, mode environment diset, ditampilkan sebagai nilai sebenarnya); pemeriksaan kredensial (tidak ada login default, placeholder, atau ter-seed yang masih berfungsi); konfigurasi header yang dikirim (header dasar ada vs hilang); pengaturan transport dan paparan database (koneksi terenkripsi ditegakkan, akses jaringan dibatasi).
- Standard: checklist hardening database (baseline Level 1 yang berlaku-luas untuk versi mayor yang berjalan, keadaan tiap item); laporan cloud-dan-header (storage bucket tidak publik kecuali disengaja, akses akun least-privilege, logging platform menyala, plus content security policy); hasil pemisahan environment (secret production beda dari development, tidak ada `.env` yang bisa diambil sebagai URL publik); pemeriksaan config-AI (system prompt dan konfigurasi model di sisi server dan tidak bisa diekstrak).
- Extra-mile: catatan hardening Level 2 (tier lebih ketat untuk database dan fondasi cloud); bukti scanning pipeline (secret dan config scanning di tiap deploy); catatan integritas deployment (versi live dibangun dari source yang sudah di-review melalui pipeline yang diharapkan).
- **Lapisan registrasi Indonesia (minimal-cukup):** kalau aplikasi adalah sistem elektronik komersial yang melayani pengguna Indonesia dan menyentuh data pribadi atau transaksi, daftarkan PSE Lingkup Privat (NIB lewat oss.go.id lalu pse.komdigi.go.id; PP 71/2019 Pasal 6, Permenkominfo 5/2020). Pemicunya fungsional, bukan berbasis ukuran; risiko tidak mendaftar adalah pemblokiran layanan di Indonesia. Penilaian Strategis/Tinggi/Rendah dari BSSN (BSSN Reg 8/2020) adalah kategorisasi keamanan, terpisah dari kewajiban mendaftar.

### I. Ops, uptime, backup, rollback: deteksi, gagal-aman, pulih

File lengkap: `protocol/i-ops-uptime-backup.md`. Apa yang terjadi setelah peluncuran ketika ada yang rusak dan tidak ada yang menatap layar: deteksi dan alerting, penanganan error, dan backup serta rollback. Kegagalan di sini adalah ketiadaan (tidak ada penanganan error, tidak ada restore teruji, tidak ada alert), yang dibaca self-audit sebagai "tidak ada yang perlu ditangani".

- Tier: FLOOR untuk aplikasi nyata apa pun. S5, atau uang (S1) atau PII (S3) pada permukaan ini, menambah STANDARD. S5 dengan sinyal lain menambah EXTRA-MILE. **Pengesampingan keras: S4 apa pun membuat pemeriksaan kill-switch agen, logging-aksi, dan alerting-anomali wajib di EXTRA-MILE.** **Aturan hari-pertama: panggilan AI berbayar apa pun membuat monitoring pemakaian-dan-biaya dengan sebuah alert menjadi pemeriksaan FLOOR di sini** (batas pengeluaran keras itu sendiri tinggal di Domain E). **Anti-rekayasa-berlebihan: pada taruhan nol, jalankan FLOOR saja; jangan usulkan error budget, target uptime formal, infrastruktur canary, atau game-day chaos untuk aplikasi yang belum punya apa pun untuk diketahanankan.**
- Artefak floor: peta penanganan-error untuk jalur keamanan (tiap pemeriksaan relevan-keamanan menolak, bukan mengizinkan, saat ia error atau timeout; tiap jalur fail-open ditandai); catatan backup-dan-restore (apa yang di-backup, plus hasil dari minimal satu restore sungguhan, karena backup hanya terbukti oleh restore yang berhasil); catatan rollback (cara persis kembali ke versi berfungsi sebelumnya); inventaris logging (event relevan-keamanan di-log dengan berguna, dan log tidak membocorkan secret atau PII utuh); monitor pemakaian-dan-biaya kalau ada panggilan AI berbayar.
- Standard: tinjauan kondisi-tak-biasa (tiap panggilan eksternal berakhir di keadaan aman saat gagal); peta alerting (event tercatat memunculkan alert teruji ke manusia); catatan rencana-backup (frekuensi terikat ke kehilangan-data yang bisa diterima, backup disimpan terpisah, jendela kehilangan-data realistis dinyatakan); dokumen proses-insiden dengan catatan akar-penyebab untuk insiden mana pun yang terjadi.
- Extra-mile: catatan target-keandalan (target ketersediaan dan error budget); catatan rilis-bertahap (rilis ke irisan dulu, dengan saklar-mati seketika); catatan gladi-kegagalan (gladi resik outage terkendali); catatan kendali-agen (kill switch, log aksi, alert anomali).
- **Lapisan Indonesia:** kalau aplikasi menyimpan data pribadi dan melayani pengguna Indonesia, siapkan surat pemberitahuan kebocoran data 1 halaman yang siap-pakai, disetel ke tenggat 3x24 jam UU PDP Pasal 46-47 (data apa yang terekspos, kapan dan bagaimana, langkah pemulihan, kepada pemilik data terdampak dan otoritas lewat Komdigi pada masa interim), dengan zona waktu eksplisit (mis. WIB) pada tiap tanggal.

### J. Kewarasan arsitektur: batas kepercayaan, containment

File lengkap: `protocol/j-architecture.md`. Bentuk aplikasi: bagian mana memercayai mana, di mana data menyeberang dari tak-terpercaya ke tepercaya, dan apakah satu kunci yang jebol tetap satu kunci yang jebol alih-alih membuka seluruh tempat. Cacat desain arsitektur dan jalur privilege escalation adalah kelas yang naik paling cepat di aplikasi buatan-AI, karena desain tidak punya jawaban benar umum untuk disalin.

- Tier: FLOOR untuk aplikasi apa pun yang punya lebih dari satu bagian yang saling bicara atau garis publik/privat. User bersama, uang, atau aksi tak terbalikkan (S5, S1, S6) menambah STANDARD. S5, atau S1 dengan skala, menambah EXTRA-MILE. **Pengesampingan keras: S4 apa pun memaksa EXTRA-MILE, dan catatan arsitektur-containment plus catatan batas-sandbox menjadi wajib.** Aplikasi kecil tanpa agen, sedikit user, tanpa uang, tanpa yang tak terbalikkan jalan FLOOR saja.
- Artefak floor: peta batas-kepercayaan (tiap bagian, tiap titik di mana input tak terpercaya menyeberang ke bagian tepercaya, dan pemeriksaan di tiap penyeberangan); hasil pemisahan (kode publik menjangkau database, kunci induk, atau aksi berprivilese hanya lewat server); hasil gagal-aman (keputusan menolak, bukan mengizinkan, saat sebuah pemeriksaan error atau sebuah dependency turun).
- Standard: catatan threat-model (telusuri kategori standar hal yang bisa salah di tiap batas, kadang disebut lintasan STRIDE); peta privilese (telusuri apakah bagian berdaya-rendah atau yang terjangkau-dari-luar bisa mencapai kemampuan berdaya-tinggi); peta kepercayaan-dependency (balasan luar divalidasi, bukan dituruti buta); tinjauan alur (keputusan dibentuk dan diperiksa sebelum aksi tak terbalikkan berjalan).
- Extra-mile: dokumen threat-model yang lengkap dan bertanggal, dijaga sebagai rujukan hidup; catatan desain-containment (pola isolasi bernama untuk agen otonom: action-selector, plan-then-execute, map-reduce, atau dual-LLM, dikonfirmasi bertahan di bawah input bermusuhan); catatan batas-sandbox (bagian yang menjalankan kode atau bertindak dikurung ke daya paling sedikit dengan gerbang manusia pada aksi tak terbalikkan).
- **Pertimbangan residensi data Indonesia:** hosting data pribadi di server luar Indonesia (Vercel, AWS, region Supabase non-Indonesia) adalah transfer lintas-batas di bawah UU PDP Pasal 56. Perlakukan residensi data sebagai keputusan desain yang patut dipertimbangkan, bukan mandat keras; yang diminta hukum adalah dasar yang sah, dan bagi solo builder itu berarti pengungkapan jujur plus persetujuan. Penanganan penuhnya di Domain D.

### K. Pen-test dan tinjauan profesional: batas atas yang jujur

File lengkap: `protocol/k-pentest.md`. Mencoba pintu-pintunya sebagai lawan terhadap aplikasi yang berjalan, dan menyatakan di titik mana versi AI yang murah berhenti bisa dipercaya. Domain ini membawa klausa kejujuran: ia ada untuk berkata, lantang, kapan gratis tidak cukup aman.

- Tier: login (S2) membuat ini STANDARD. Uang (S1) atau PII (S3) membuatnya STANDARD minimal, EXTRA-MILE dengan S5. **Pengesampingan keras: S4 apa pun memaksa EXTRA-MILE, dan red-team prompt injection menjadi wajib.** Tanpa login, tanpa uang, tanpa PII, tanpa agen, tanpa yang tak terbalikkan jalan FLOOR saja; jangan rekomendasikan pen-test pesanan atau bug bounty berbayar untuk aplikasi yang tidak punya apa-apa untuk diserang.
- Artefak floor: artefak hasil-scan (scan dependency, secret scan, dan pass static-analysis, masing-masing dikonfirmasi berjalan terhadap repo ini); log percobaan (sungguh coba serangan jelas terhadap aplikasi yang berjalan: jangkau record lain dengan mengubah ID, ketuk rute terlindungi tanpa login, kirim input hostile, lalu catat respons sebenarnya); pernyataan batas (apa yang diuji dan apa yang tidak, satu baris eksplisit "ini bukan pen-test profesional dan tidak menjamin keamanan", dan plafon review-AI yang terukur, sekitar 28,6 persen error yang ditanam tertangkap pada kondisi terbaik).
- Standard: hasil checklist-verifikasi (kerjakan terhadap standar verifikasi keamanan aplikasi yang diakui pada tingkat baseline dan standard, tandai tiap item diuji atau tidak); log serangan-akses (coba menjangkau data user lain, bertindak sebagai admin dari akun biasa, menyalahgunakan login dan reset); log serangan-alur-bisnis (coba melompati langkah berbayar, memalsukan atau mengulang konfirmasi pembayaran, menyalahgunakan kuota).
- Extra-mile: paket serah-terima tinjauan-manusia (temuan dan artefak dikumpulkan untuk penguji manusia, plus pernyataan tertulis "penetration test manusia independen diperlukan sebelum peluncuran"); log percobaan-injeksi terhadap agen; artefak kesiapan-pengungkapan (kontak dan kebijakan keamanan yang dipublikasikan, dengan bounty berbayar dicadangkan untuk produk yang sudah punya user dan pendapatan nyata).

### L. Putuskan dan bertindak: triase berdasarkan risiko bisnis, dan kapan menyewa manusia

File lengkap: `protocol/l-decide-and-act.md`. Tempat audit berubah menjadi keputusan. Domain ini melihat seluruh tumpukan temuan sekaligus, memeringkatnya berdasarkan apa yang dibebankan sebuah kesalahan ke bisnis, mencatat keputusan eksplisit untuk masing-masing, dan menerapkan gerbang sewa-manusia. Ia memegang keputusan eskalasi untuk seluruh audit.

- Tier: taruhan nyata apa pun (S1, S2, S3, atau S5) membuat ini STANDARD. Beberapa sinyal bersama, atau PII di skala besar (S3 dengan S5), membuatnya EXTRA-MILE. **Garis keras: kalau sebuah agen AI bertindak sendiri (S4), keputusan sewa-manusia dipaksa menjadi "ya" untuk temuan yang kritis bagi keamanan. Kalau sebuah aksi tak terbalikkan (S6) bergabung dengan uang (S1) atau skala (S5), temuan belum-tuntas apa pun yang menyentuh aksi itu memaksa eskalasi.** Aplikasi yang tidak mempertaruhkan apa-apa dapat triase ringan dan jawaban jujur "kamu tidak perlu membayar siapa pun".
- Artefak floor: daftar temuan terpadu (tiap temuan dari tiap domain, masing-masing dengan konsekuensinya dalam bahasa biasa, kemungkinan kasar, dan sinyal taruhan yang ia sentuh); daftar temuan terperingkat (diurutkan berdasarkan kemungkinan kali dampak, risiko bisnis tertinggi lebih dulu); catatan keputusan (tiap temuan yang tidak diperbaiki segera, dengan "perbaiki sekarang", "perbaiki nanti pada tanggal", atau "terima", dan satu baris alasan; diam bukan keputusan); pernyataan risiko-sisa.
- Standard: rencana perbaikan (penghalang-rilis, perbaiki-segera, diterima, tiap penghalang terikat ke sinyal taruhannya); catatan verifikasi perbaikan (jalankan ulang bukti asli di konteks bersih untuk mengonfirmasi bug-nya hilang, karena agen yang menulis sebuah bug cenderung berkata perbaikannya sendiri berhasil); keputusan sewa-manusia (tiap gerbang, jawaban ya-atau-tidaknya dengan bukti, dan vonisnya).
- Extra-mile: register risiko yang berdiri tetap, dijalankan ulang tiap perubahan berarti; catatan eskalasi yang menyerahkan ke peninjau manusia paket yang tertata supaya mereka menghabiskan jamnya pada penilaian alih-alih penemuan ulang.
- **Penutupan kepatuhan Indonesia (produk komersial yang melayani pengguna Indonesia):** sebelum rilis, pastikan tiap minimum yang murah sudah berdiri, masing-masing terikat ke pasalnya: status pendaftaran NIB dan PSE Lingkup Privat (Permenkominfo 5/2020); pemberitahuan privasi hidup dengan persetujuan eksplisit dan pengungkapan penyimpanan luar negeri (Pasal 20, 56); jalur "hapus data saya" yang berfungsi plus email kontak (Pasal 7-9); template notifikasi kebocoran 1 halaman siap untuk tenggat 3x24 jam (Pasal 46-47); verifikasi tanda tangan gateway di sisi server (Midtrans SHA512, Xendit X-CALLBACK-TOKEN, iPaymu HMAC-SHA256). Dua taruhan yang membenarkan minimum ini: denda UU PDP hingga 2% pendapatan tahunan (Pasal 57) dan non-kepatuhan PSE yang menarik pemblokiran akses. Jaga minimal-cukup.

Kehati-hatian kepercayaan-berlebih untuk domain ini: laporan yang terlihat bersih memproduksi kepercayaan yang belum dibenarkan fakta. Saat peninjau melewatkan sebuah error, kepercayaan mereka cenderung naik alih-alih turun (efek terukur). Sajikan bukti dan konsekuensi terperingkat, jangan pernah penghiburan telanjang, dan perlakukan pemeriksaan yang tidak menemukan apa-apa sebagai persis itu.

---

## Batas-batas yang jujur (baca ini sebelum memercayai hasilnya)

NONA mengurangi risiko. Ia tidak menjamin keamanan. Nyatakan ini terus terang di output audit, karena melebih-lebihkannya akan menyerahkan ke si pembangun persis rasa aman palsu yang membuat aplikasi buatan AI dibobol, dengan cap berpenampilan resmi di atasnya, yang lebih buruk daripada tidak ada audit karena mereka berhenti waspada.

- AI yang memeriksa kode buatan AI menangkap sepotong berarti dari bug kritis dengan murah dan melewatkan sebagian besar error yang ditanam saat bekerja sendiri (terukur terbaik sekitar 28,6 persen tertangkap menurut F1 di konteks bersih dan terpisah; Cross-Context Review). Menambah model kedua memperbaiki peluangnya tapi tidak mengubah hasilnya menjadi penetration test profesional.
- Aplikasi bertaruhan tinggi (uang, banyak user, aksi tak terbalikkan, agen otonom) tetap harus membayar audit manusia independen. Domain L memberi tahu si pembangun kapan mereka sudah melewati garis itu.
- Sebagian angka utama yang mengkhawatirkan datang dari vendor yang punya insentif untuk menakut-nakuti. Di tempat sebuah angka adalah angka vendor, katakan begitu, dan sitasi penyeimbang akademik independen di sebelahnya. Kumpulan bukti lengkapnya, dengan catatan kehati-hatian pengukurannya, ada di `docs/why-nona-exists.md`.

Peta standar lengkap, dengan versi dan tanggal, ada di `CITATIONS.md`. Panduan pertahanan-diri dan integritas untuk siapa pun yang mengadopsi NONA ada di `SECURITY.md`. Glosarium bahasa sederhana ada di `docs/glossary.md`.

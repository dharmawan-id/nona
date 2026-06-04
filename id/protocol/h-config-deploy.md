# Domain H: Higiene Config dan Deploy

## Apa ini

Domain ini mencakup pengaturan di sekitar aplikasimu, bukan kode di dalamnya: bagaimana aplikasi dikonfigurasi saat go-live, apa yang ikut terbungkus ke dalam versi yang dikirim ke pengunjung, dan pintu depan mana yang dibiarkan terbuka secara default oleh hosting dan database. Sebuah tool AI menulis aplikasimu, tapi ia juga menghasilkan konfigurasi: environment variable (tempat naruh konfigurasi dan secret di luar kode), pengaturan build, sebuah config deploy, default database. Sedikit dari pengaturan itu yang menentukan apakah secret-mu tetap rahasia, apakah halaman error-mu menyerahkan peta sistemmu ke penyerang, dan apakah browser membiarkan kunci yang seharusnya dipasang server. Kode bisa sempurna dan satu salah-konfigurasi tetap bisa membongkar semuanya.

Tiga kegagalan yang paling sering di sini: sebuah secret yang lolos ke bagian publik aplikasi, sebuah pengaturan default atau debug yang tertinggal menyala di production, dan security header yang hilang (instruksi kecil yang dikirim server ke browser, menyuruhnya menegakkan proteksi yang kalau tidak akan dilewati browser). Tidak satu pun dari ketiganya eksotis. Ketiganya adalah hal yang diset sekali saat deploy lalu tidak pernah ditengok lagi.

## Yang tidak terlihat di sini

Kamu buka situs live-mu, ia termuat, halaman berfungsi, tidak ada yang tampak salah. Konfigurasi memang tak terlihat dari sudut itu. Secret yang tertanam di kode yang dikirim ke browser tidak mengubah tampilan halaman; ia duduk di file yang terunduh, di mana siapa pun yang membuka developer tools bisa membacanya. Mode debug yang dibiarkan menyala tidak mengumumkan dirinya; ia cuma berarti bahwa di hari sesuatu rusak, halaman error mencetak path file-mu, nama variabel-mu, kadang detail database-mu, ke siapa pun yang memicu error itu. Header yang hilang adalah keheningan: browser sekadar tidak pernah menerima instruksi untuk menolak satu kelas serangan, dan keheningan justru yang tidak bisa kamu sadari.

Alasan ini lolos dari kamu maupun dari tool AI-mu adalah karena konfigurasi adalah bagian yang tidak diuji siapa pun di jalur normal. Ketika tool AI menghubungkan aplikasimu ke database atau ke penyedia pembayarannya, cara tercepat membuatnya jalan di demo adalah menaruh key di tempat yang bisa dijangkau kode, dan kode yang jalan di browser adalah kode yang bisa menjangkau key itu. Tool meng-optimasi untuk "ini jalan," dan "ini jalan" dengan secret di browser terlihat identik dengan "ini jalan" dengan secret tersimpan di server. Bedanya baru muncul ketika orang asing pergi mencari, dan orang asing pergi mencari dalam skala besar: sebuah scan production atas 5.600 aplikasi yang dibangun dengan tool AI menemukan lebih dari 400 secret terekspos terbuka di publik, dan scanner-nya menjangkau sebagian besar kelemahan kritis di alamat publik tanpa login sama sekali, itulah kenapa mereka menyebut hitungan mereka sendiri sebagai batas bawah (Escape.tech, 29 Oktober 2025). Pengaturannya tidak disembunyikan. Semuanya bisa dijangkau siapa pun, dari luar, tanpa akun.

Self-audit yang naif melewatkan ini karena alasan yang spesifik. Tool AI yang menghasilkan config membacanya sebagai benar karena ia membuatnya untuk demo yang berhasil. Bertanya ke tool yang sama di percakapan yang sama "apakah config-nya aman?" cenderung mendapat jawaban "iya, ini jalan," karena bagian yang salah adalah bagian yang tidak muncul sampai ada orang luar yang menyelidik. Pemeriksaan yang menemukan masalah ini bukan "apakah ini berfungsi." Tapi "apa persisnya yang kita kirim ke browser, dan tiap pengaturan diset ke apa," yang dijawab dengan mendaftar nilai sebenarnya alih-alih percaya bahwa default-nya beres.

## Kapan ini penting (sinyal taruhan)

Floor untuk domain ini menyala begitu aplikasimu di-deploy sama sekali. Aplikasi live mana pun punya konfigurasi, mengirim bundle ke pengunjung, dan jalan di hosting dengan pengaturan default, jadi pemeriksaan never-skip di bawah berlaku untuk tiap aplikasi yang ter-deploy, termasuk proyek akhir pekan tanpa login dan tanpa data. Salah-konfigurasi tidak perlu taruhan untuk menjadi salah-konfigurasi; key yang terekspos tetap terekspos entah kamu menganggap aplikasi itu penting atau tidak.

Yang ditentukan sinyal taruhan adalah seberapa dalam domain ini melangkah melewati floor. Taruhan dibaca di permukaan domain ini sendiri: apa yang sebenarnya dibongkar oleh konfigurasi dan deployment-mu.

- **S1 Uang** (sebuah key penyedia pembayaran, secret penagihan, atau signing secret hidup di konfigurasimu) menaikkan domain ini, karena key pembayaran yang terekspos bukan kebocoran data, melainkan kebocoran kemampuan untuk menagih, me-refund, atau membaca catatan pembayaran atas namamu.
- **S3 Data pribadi** (konfigurasimu atau default database-mu mengatur akses ke informasi pribadi yang tersimpan: email, nomor telepon, nama, detail kesehatan) mendorong domain ini ke STANDARD, karena database yang salah-konfigurasi atau connection string yang terekspos di sistem yang menyimpan data orang sungguhan adalah jalur pintas dari "sebuah pengaturan salah" ke "catatan semua orang bisa dijangkau."
- **S5 Radius dampak** (banyak pengguna, beberapa pelanggan terpisah di infrastruktur bersama, API publik, database bersama) digabung dengan salah satu di atas mendorong domain ini ke EXTRA-MILE. Lubang konfigurasi di infrastruktur bersama tidak membocorkan satu akun; ia membocorkan seluruh penyewaan sekaligus, dan baseline hardening (pengerasan) untuk database dan cloud jadi sepadan dengan ongkosnya.

Kalau aplikasimu ter-deploy tapi sungguh-sungguh tidak menyimpan secret uang, tidak ada data pribadi, dan jalan untuk audiens tunggal yang kecil, floor itulah seluruh pekerjaan di sini: jaga secret tetap di luar bundle dan di luar riwayat kode, matikan debug, tambahkan header dasar, dan jangan mendirikan program pengerasan konfigurasi penuh di sekitar aplikasi yang tidak punya apa pun bernilai untuk diekspos.

## Pemeriksaan floor

Jangan pernah lewati ini di aplikasi mana pun yang ter-deploy.

| Pemeriksaan | Kenapa ini penting bagi bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Daftar tiap secret di konfigurasi aplikasi (connection string dan key database, key penyedia pembayaran, API token, signing secret) dan, untuk masing-masing, pastikan ia hanya dibaca di server dan tidak pernah muncul di bundle kode yang dikirim ke browser, tidak pernah duduk di balik variabel berawalan `NEXT_PUBLIC_`, dan tidak pernah ter-commit ke riwayat kode. Awalan `NEXT_PUBLIC_` menyuruh tool build mengirim nilai itu ke browser, jadi secret apa pun yang diberi awalan itu sama saja dipublikasikan. | Secret yang sampai ke browser adalah secret di publik: siapa pun yang membuka halaman bisa menyalin key database atau key pembayaranmu lalu membaca datamu atau menagih atas namamu, tanpa membobol satu kunci pun. Key yang ter-commit ke riwayat kode tetap terbaca bahkan setelah kamu hapus dari versi terbaru. Ini cara paling umum aplikasi buatan AI dibobol, dan scan atas aplikasi yang benar-benar dikirim menemukan ratusan dari ini terbuka. | Inventaris secret: tiap secret terkonfigurasi, di mana ia dibaca, dan vonis per-secret "server-side only" atau "EXPOSED" (di bundle browser, di balik variabel `NEXT_PUBLIC_`, atau di riwayat git), dengan tiap yang terekspos ditandai untuk rotasi segera karena secret yang bocor harus diganti, bukan sekadar dipindah. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A04 Cryptographic Failures; Supabase Production Checklist (jaga service key di sisi server) |
| Pastikan mode debug, output error verbose, dan pengaturan apa pun yang khusus development dimatikan di deployment live, supaya error saat runtime mengembalikan pesan generik ke pengunjung dan menulis detailnya hanya ke log pribadimu. | Pengaturan debug atau error-verbose yang dibiarkan menyala mengubah tiap crash jadi laporan intelijen gratis untuk penyerang: path file, versi framework, nama variabel, kadang detail database, dicetak langsung ke siapa pun yang membuat halaman rusak. Mematikannya berarti orang asing yang memicu error tidak belajar apa-apa, sementara kamu tetap mendapat cerita lengkapnya di log-mu. | Nilai konfigurasi production yang sebenarnya untuk debug, verbositas error, dan mode environment, ditampilkan sebagaimana diset (bukan diasumsikan), dengan pengaturan khusus development apa pun yang masih aktif di production ditandai. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A10 Mishandling of Exceptional Conditions |
| Pastikan tidak ada kredensial default atau placeholder yang lolos ke production: tidak ada password admin contoh, tidak ada akun database default yang dibiarkan aktif, tidak ada API key sampel, tidak ada login test yang ter-seed dan masih berfungsi melawan sistem live. | Kredensial default atau contoh yang di-scaffold oleh tool AI dan tidak diubah siapa pun adalah kunci yang seluruh internet sudah punya, karena contohnya dipublikasikan di dokumentasi tool itu sendiri. Membiarkan satu aktif sama dengan membiarkan pintu yang kuncinya tercetak di buku panduan yang bisa dibaca siapa saja. | Pemeriksaan kredensial: tiap akun dan kredensial default, placeholder, ter-seed, atau contoh yang dibuat scaffold, dan vonis per-item dihapus, dinonaktifkan, atau dirotasi ke nilai sungguhan, dengan default apa pun yang masih bisa dipakai ditandai. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A07 Authentication Failures |
| Pastikan aplikasi mengirim security header dasar dari konfigurasi host atau framework, supaya browser disuruh menegakkan proteksi yang kalau tidak akan dilewatinya: kirim halaman lewat HTTPS saja (HSTS), tolak ditanam di dalam frame situs lain (pertahanan clickjacking), dan hentikan browser menebak tipe sebuah file. Security header adalah instruksi singkat yang dilampirkan server ke tiap respons untuk menyalakan proteksi di sisi browser. | Tanpa header ini browser membiarkan kunci terbuka padahal ia bersedia menutupnya begitu diminta. Celahnya membuat penyerang bisa membingkai halaman login-mu di dalam situs palsu untuk memanen klik, atau menurunkan pengunjung ke koneksi tak terenkripsi di mana lalu-lintasnya bisa dibaca. Header ini gratis untuk ditambahkan dan menutup satu kelas serangan yang tidak bisa ditangkis browser kecuali server-mu menyuruhnya. | Konfigurasi header yang sebenarnya dikirim (dari `vercel.json`, config framework, atau yang setara), mendaftar header dasar mana yang ada dan mana yang hilang, dengan yang hilang disebut namanya. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Secure Headers Project (header respons dasar); dokumentasi keamanan Vercel dan Next.js |
| Pastikan database menegakkan koneksi terenkripsi (SSL/TLS) dan bahwa paparan jaringan database dibatasi alih-alih terbuka ke seluruh internet, memakai pengaturan production dari penyedia hosting. SSL/TLS adalah enkripsi yang melindungi data yang bergerak antara aplikasimu dan database-nya. | Database yang bisa dijangkau siapa pun di internet, atau yang menerima koneksi tak terenkripsi, adalah database yang bisa dihubungi penyerang langsung atau disadap, melewati aplikasimu sama sekali. Menegakkan enkripsi dan membatasi siapa yang bisa menjangkau database adalah beda antara "datanya di balik aplikasi" dan "datanya tinggal satu tebakan connection string lagi." | Pengaturan koneksi dan jaringan database sebagaimana terkonfigurasi: status penegakan SSL/TLS dan pembatasan akses jaringan yang berlaku (atau penanda bahwa database menerima koneksi tak terenkripsi atau bisa dijangkau dari mana saja). | OWASP Top 10:2025 A02 Security Misconfiguration; Supabase Production Checklist (tegakkan SSL, batasi akses jaringan) |

## Pemeriksaan standard

Tim yang kompeten melakukan ini begitu data pribadi atau secret uang menyentuh permukaan konfigurasi domain ini, sesuai sinyal taruhan di atas.

| Pemeriksaan | Kenapa ini penting bagi bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Terapkan baseline hardening Level 1 untuk database terhadap konfigurasinya yang sebenarnya, menelusuri item-item yang tidak mengganggu (pengaturan logging, batas koneksi, default role dan permission, pencopotan extension dan data sampel yang tak diperlukan) dan mencatat keadaan masing-masing. Level 1 adalah tingkat hardening yang berlaku luas dan tidak merusak. | Database datang dengan default yang dipilih untuk kemudahan setup, bukan untuk internet yang bermusuhan, dan jarak antara "default" dan "ter-harden" persis di situlah penyerang yang menjangkau database beroperasi. Menelusuri baseline mengubah "kayaknya sih beres" yang samar jadi catatan baris-demi-baris tentang apa yang sebenarnya diset, dan itulah satu-satunya versi dari ini yang bisa kamu tindak lanjuti. | Checklist hardening database: tiap item Level 1 untuk versi mayor database yang berjalan, keadaan terkonfigurasinya yang sebenarnya, dan tiap item yang belum terpenuhi ditandai dengan pengaturan yang perlu diubah. | OWASP Top 10:2025 A02 Security Misconfiguration; CIS PostgreSQL Benchmark, Level 1, untuk versi mayor yang berjalan |
| Terapkan baseline cloud dan hosting Level 1 ke deployment: pastikan storage bucket tidak bisa dibaca publik kecuali memang disengaja, akses ke akun hosting mengikuti least privilege (hak seminimal yang diperlukan), dan logging tingkat platform menyala. Lalu tambahkan kebijakan security header penuh termasuk content security policy (header yang mendaftar sumber mana yang boleh dimuat browser untuk script dan konten, memblokir kode yang disuntikkan agar tidak jalan). | Storage bucket yang terbuka adalah penyebab utama paparan data massal, dan content security policy yang hilang berarti script yang disuntikkan jalan dengan kepercayaan penuh halamanmu. Header floor menghentikan serangan framing dan downgrade; content security policy adalah yang menahan injeksi seandainya penanganan input lengah, jadi inilah header yang layak dibenahi begitu data sungguhan dipertaruhkan. | Laporan cloud dan header: pengaturan akses storage bucket, cakupan akses akun hosting, status logging platform, dan kebijakan header penuh termasuk content security policy sebagaimana dikirim, dengan bucket publik atau policy yang hilang ditandai. | OWASP Top 10:2025 A02 Security Misconfiguration; CIS Cloud Foundations Benchmark, Level 1; OWASP Secure Headers Project; dokumentasi keamanan Vercel dan Next.js |
| Verifikasi konfigurasi live memisahkan environment sehingga secret production tidak sama dengan secret development, production tidak menunjuk ke database development, dan tidak ada file `.env` atau dump konfigurasi yang bisa dijangkau sebagai file publik di situs live. | Berbagi satu set secret antara development dan production berarti kebocoran di mana pun adalah kebocoran di mana-mana, dan file konfigurasi yang tersaji sebagai URL publik menyerahkan seluruh lembar pengaturan ke penyerang dalam satu permintaan. Menjaga environment tetap terpisah menahan satu kesalahan di tempat ia dibuat alih-alih menyebarkannya ke sistem live. | Hasil pemisahan environment: konfirmasi bahwa secret production berbeda dari secret development dan bahwa production menargetkan database production, plus hasil pemeriksaan bahwa tidak ada file `.env` atau konfigurasi yang bisa diambil dari alamat publik (bersih, atau path persis yang terekspos). | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A04 Cryptographic Failures |
| Daftarkan PSE Lingkup Privat kalau aplikasimu adalah sistem elektronik komersial yang melayani pengguna Indonesia dan menyentuh data pribadi atau transaksi: ambil NIB lewat oss.go.id lalu daftar di pse.komdigi.go.id. Pemicunya fungsional (kamu beroperasi sebagai layanan/usaha komersial untuk pengguna Indonesia sambil mengumpulkan data pribadi atau menjalankan transaksi), bukan berbasis ukuran; tidak ada ambang pendapatan atau jumlah pengguna yang membebaskan PSE komersial yang sungguhan. Penilaian Strategis/Tinggi/Rendah dari BSSN adalah kategorisasi keamanan sistem elektronik, bukan saklar yang menentukan apakah kamu wajib mendaftar; mencampur keduanya adalah kekeliruan yang umum. | Tidak mendaftar bukan denda kecil yang bisa diabaikan: sanksinya menanjak hingga pemblokiran (access blocking) layanan di Indonesia, dan itu tuas penegakan yang sudah dipakai Komdigi. Untuk produk komersial, pemblokiran berarti pengguna Indonesia tidak bisa mengakses aplikasimu sama sekali, yang menghentikan pendapatan seketika. Mengambil NIB dan mendaftarkan PSE adalah langkah deploy administratif yang murah dibandingkan risiko itu. | Hasil pemeriksaan registrasi: apakah aplikasi adalah PSE komersial yang melayani pengguna Indonesia dengan data pribadi atau transaksi (ya/tidak), status NIB di oss.go.id, dan status pendaftaran di pse.komdigi.go.id, dengan PSE komersial yang belum terdaftar ditandai. Catat bahwa kategorisasi BSSN, kalau dinilai, terpisah dari kewajiban mendaftar ini. | PP 71/2019 (Penyelenggaraan Sistem dan Transaksi Elektronik) Pasal 6; Permenkominfo 5/2020 tentang PSE Lingkup Privat; portal dan kriteria pse.komdigi.go.id; BSSN Reg 8/2020 (kategorisasi keamanan, terpisah dari pemicu registrasi) |
| Kalau aplikasi memaparkan fitur AI, pastikan konfigurasinya tidak membocorkan system prompt atau pengaturan model ke pengguna, dan bahwa konfigurasi apa pun yang mengendalikan permukaan AI ada di sisi server. Kebocoran system prompt adalah ketika instruksi tersembunyi yang menyetir model bisa dipancing keluar oleh pengguna. | System prompt atau konfigurasi model yang bisa diekstrak pengguna mengungkap bagaimana fiturmu bekerja dan bagaimana memanipulasinya, dan kalau prompt itu sendiri memuat sebuah key atau instruksi berhak istimewa, kebocorannya juga merupakan paparan secret. Menjaga konfigurasi AI tetap di server adalah disiplin yang sama dengan menjaga secret lain keluar dari browser, diterapkan pada bagian yang menyetir model. | Lokasi system prompt dan konfigurasi model fitur AI, vonis bahwa ia ada di sisi server dan tidak dikembalikan ke klien, dan hasil percobaan dasar mengekstraknya lewat fitur tersebut, dengan kebocoran apa pun ditandai. | OWASP Top 10 for LLM Applications 2025 LLM07 System Prompt Leakage; OWASP Top 10:2025 A02 Security Misconfiguration |

## Pemeriksaan extra-mile

Keketatan tingkat frontier. Bahkan tim engineering yang kuat memperlakukan ini sebagai upaya ekstra dan diperpanjang. Jalankan di permukaan domain ini hanya ketika gerbang taruhan memaksanya, sebagaimana dianotasi.

| Pemeriksaan | Kenapa ini penting bagi bisnismu | Bukti yang harus dihasilkan agen | Citation | Gerbang taruhan + pola frontier |
|---|---|---|---|---|
| Terapkan baseline hardening Level 2 untuk database dan fondasi cloud, tingkat yang lebih ketat yang menukar sebagian kenyamanan demi pertahanan berlapis, dan catat keadaan tiap item terhadap konfigurasi live. Level 2 adalah tingkat jaminan-lebih-tinggi untuk lingkungan di mana datanya membenarkan gesekan tambahan. | Di infrastruktur bersama yang menyimpan data banyak pelanggan, baseline Level 1 yang berlaku-luas adalah garis start, bukan garis finish. Level 2 menutup celah yang penting ketika satu lubang konfigurasi membongkar seluruh penyewaan alih-alih satu akun, dan itulah persis situasi sistem multi-pelanggan. | Catatan hardening Level 2: tiap item Level 2 yang berlaku untuk database dan fondasi cloud, keadaan terkonfigurasinya, dan tiap item yang belum terpenuhi ditandai beserta trade-off yang dibawanya supaya keputusan menerima atau memperbaikinya bersifat eksplisit. | OWASP Top 10:2025 A02 Security Misconfiguration; CIS PostgreSQL Benchmark, Level 2, untuk versi mayor yang berjalan; CIS Cloud Foundations Benchmark, Level 2 | Dipaksa oleh S5 (radius dampak) digabung dengan S1 (uang) atau S3 (data pribadi) di permukaan ini. Pola frontier: hardening konfigurasi Level 2. |
| Dirikan scanning konfigurasi dan secret yang kontinu di pipeline deployment, supaya secret baru yang ter-commit karena keliru, kebijakan header yang melemah karena sebuah perubahan, atau pengaturan default yang masuk lagi tertangkap otomatis di deploy berikutnya alih-alih ditemukan penyerang berbulan-bulan kemudian. | Audit konfigurasi cuma benar untuk hari ia dijalankan; perubahan ceroboh berikutnya bisa membatalkannya diam-diam. Scanning otomatis di tiap deploy mengubah lulus sekali jadi penjaga tetap, dan itulah yang dibutuhkan sistem yang membawa data sungguhan di infrastruktur bersama, karena salah-konfigurasi paling berisiko adalah yang menyelinap kembali setelah semua orang berhenti memperhatikan. | Konfigurasi pipeline yang menjalankan secret scanning dan pemeriksaan konfigurasi di tiap deploy, kategori yang dicakupnya, dan contoh keluarannya, dengan perilaku saat gagal (apakah secret yang terdeteksi memblokir deploy) dinyatakan. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A08 Software or Data Integrity Failures | Dipaksa oleh S5 (radius dampak) dengan data pribadi tersimpan (S3) atau uang (S1) di permukaan ini. Pola frontier: scanning konfigurasi dan secret shift-left di CI. |
| Verifikasi provenance build dan integritas dari apa yang sebenarnya ter-deploy: pastikan versi live dibangun dari source yang sudah di-review melalui pipeline yang diharapkan, bahwa deployment tidak bisa dipicu dari sumber tak terpercaya, dan bahwa bundle di production cocok dengan apa yang dihasilkan pipeline. Provenance adalah catatan yang bisa diverifikasi tentang bagaimana dan dari mana sebuah artefak dibangun. | Tanpa catatan bagaimana versi live dibangun, kamu tidak bisa membuktikan bahwa yang berjalan adalah yang kamu review, dan penyerang yang bisa memengaruhi build atau deploy bisa mengirim kode yang sudah dirusak yang tidak akan ditangkap review kode mana pun karena perusakan itu terjadi setelah review. Di sistem bertaruhan tinggi, mengetahui artefak yang ter-deploy adalah yang asli merupakan fondasi di bawah tiap pemeriksaan lain. | Catatan integritas deployment: source dan pipeline asal versi live dibangun, kontrol yang membatasi siapa atau apa yang bisa memicu deploy production, dan konfirmasi bahwa bundle yang berjalan cocok dengan keluaran pipeline, dengan tautan apa pun yang tak bisa diverifikasi ditandai. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; OWASP Top 10:2025 A02 Security Misconfiguration | Dipaksa oleh S5 (radius dampak) di sistem di mana deploy yang dirusak akan menjangkau banyak pengguna. Pola frontier: verifikasi build-provenance dan integritas deploy. |

## Kapan berhenti dan menyewa manusia

Datangkan reviewer independen untuk domain ini ketika salah satu berikut benar:

- Inventaris secret menemukan key terekspos di sistem yang menangani uang atau menyimpan data pribadi, dan kamu tidak bisa memastikan keduanya: bahwa key yang bocor sudah dirotasi dan bahwa tidak ada yang bisa dijangkau di riwayat kodemu yang masih memuat key yang hidup. Secret production yang bocor di sistem sungguhan adalah insiden yang sudah terkonfirmasi, bukan pengaturan untuk diam-diam dibenahi lalu dilewati.
- Aplikasimu menyimpan data pribadi di infrastruktur bersama yang melayani banyak pelanggan (S3 dengan S5), dan kamu tidak bisa menghasilkan checklist hardening yang lengkap yang menunjukkan database dan fondasi cloud benar-benar memenuhi baseline, dengan item yang belum terpenuhi sudah diputuskan alih-alih tak diketahui. Konfigurasi yang tidak bisa kamu pertanggungjawabkan sepenuhnya, di sistem yang membocorkan semua orang sekaligus ketika ia salah, layak mendapat pemeriksaan manusia sebelum kamu menaikkan skala.
- Sebuah pengaturan konfigurasi mengatur akses ke uang atau ke data pribadi dan kamu tidak bisa menunjukkan, dengan nilai sebenarnya, bahwa production terpisah dari development, debug mati, dan database tidak bisa dijangkau dari internet terbuka. Menebak bahwa default-nya beres di deployment bertaruhan tinggi adalah persis taruhan yang keberadaan domain ini dimaksudkan menghentikanmu membuatnya.

Protokol ini menangkap sebagian bermakna dari masalah konfigurasi dan deployment dengan murah, dan ini adalah jalur pertama yang tepat untuk tiap aplikasi yang ter-deploy. Ini bukan jaminan, dan AI yang me-review konfigurasi yang dihasilkan kelasnya sendiri lebih lemah daripada manusia independen pada pengaturan yang menentukan apakah data sungguhan terekspos. Domain K membahas apa yang ditambahkan review profesional dan di mana letak batas jujurnya. Untuk aplikasi yang membawa taruhan sungguhan di domain ini, arahkan ke sana.

## Instruksi agen

```
DOMAIN H: HIGIENE CONFIG DAN DEPLOY

Lingkup berdasarkan taruhan (taruhan bersifat lokal pada permukaan konfigurasi dan deployment domain ini):
  FLOOR menyala untuk aplikasi APA PUN yang ter-deploy. Jalankan pemeriksaan floor di tiap aplikasi live,
  termasuk proyek kecil tanpa login dan tanpa data: secret keluar dari browser dan git, debug mati,
  tidak ada kredensial default, header dasar, database terenkripsi dan terbatas jaringannya.
  Kalau data pribadi tersimpan (S3) mengatur permukaan ini, jalankan STANDARD di sini.
  Kalau secret uang (S1) atau data pribadi (S3) bergabung dengan radius dampak (S5) di infrastruktur
  bersama, jalankan EXTRA-MILE.
  Kalau aplikasi ter-deploy tapi tidak menyimpan secret uang, tidak ada data pribadi, dan melayani audiens
  tunggal yang kecil, jalankan FLOOR saja. JANGAN mendirikan hardening Level 2, secret scanning CI, atau
  mesin deploy-provenance untuk aplikasi yang tidak punya apa pun bernilai untuk diekspos.

Catatan sirkularitas (lihat protokol circularity-guard):
  Tool AI yang menghasilkan konfigurasi membacanya sebagai benar karena ia membuat demo yang berhasil, dan
  kegagalan di sini (secret di bundle, debug dibiarkan menyala, header yang hilang) tak terlihat sampai ada
  orang luar yang menyelidik. Jalankan domain ini di konteks yang BERSIH dan baru tanpa akses ke rasionalisasi
  build, dan lebih baik pakai model yang berbeda dari yang menghasilkan config. Periksa dengan mendaftar
  nilai SEBENARNYA yang dikirim dan diset, bukan dengan bertanya apakah config "berfungsi".

Untuk Indonesia (cek registrasi, minimal-sufficient):
  Kalau aplikasi adalah sistem elektronik komersial yang melayani pengguna Indonesia DAN menyentuh data
  pribadi atau transaksi, registrasi PSE Lingkup Privat berlaku: NIB lewat oss.go.id lalu daftar di
  pse.komdigi.go.id (PP 71/2019 Pasal 6; Permenkominfo 5/2020). Pemicunya fungsional, bukan berbasis ukuran;
  risiko tidak mendaftar = pemblokiran layanan di Indonesia. Penilaian Strategis/Tinggi/Rendah dari BSSN
  (BSSN Reg 8/2020) adalah kategorisasi keamanan, BUKAN saklar wajib-daftar; jangan campur keduanya.
  Untuk blog/portofolio non-komersial tanpa akun, tanpa pembayaran, tanpa pengumpulan data pribadi berarti,
  registrasi umumnya di luar kewajiban praktis. JANGAN paksakan langkah registrasi ke aplikasi yang bukan
  layanan komersial.

Hasilkan artefak berikut (bukan vonis):
  FLOOR:
    1. Inventaris secret: tiap secret terkonfigurasi, di mana ia dibaca, "server-side only" atau
       "EXPOSED" (bundle browser / NEXT_PUBLIC_ / riwayat git), yang terekspos ditandai untuk rotasi.
    2. Pemeriksaan pengaturan production: nilai sebenarnya untuk debug, verbositas error, dan mode
       environment sebagaimana diset, pengaturan khusus development yang masih aktif di production ditandai.
    3. Pemeriksaan kredensial: tiap kredensial default/placeholder/ter-seed/contoh yang dibuat scaffold,
       ditandai dihapus, dinonaktifkan, atau dirotasi, default yang masih bisa dipakai ditandai.
    4. Konfigurasi header: header yang sebenarnya dikirim (vercel.json, config framework, atau yang setara),
       header dasar ada vs hilang, yang hilang disebut namanya.
    5. Transport dan paparan database: status penegakan SSL/TLS dan pembatasan akses jaringan sebagaimana
       terkonfigurasi, database tak terenkripsi atau terbuka-internet ditandai.
  STANDARD (data pribadi tersimpan atau secret uang di permukaan ini):
    6. Checklist hardening database: tiap item Level 1 untuk versi mayor yang berjalan, keadaan
       terkonfigurasinya, item yang belum terpenuhi ditandai dengan pengaturan yang perlu diubah.
    7. Laporan cloud-dan-header: akses storage bucket, cakupan akses akun hosting, status logging platform,
       dan kebijakan header penuh termasuk content security policy, bucket publik atau policy hilang ditandai.
    8. Hasil pemisahan environment: secret production berbeda dari development, production menargetkan
       database production, dan tidak ada file .env atau config yang bisa diambil dari alamat publik
       (bersih atau path yang terekspos).
    9. Pemeriksaan registrasi Indonesia (kalau PSE komersial melayani pengguna Indonesia): apakah pemicu
       fungsional terpenuhi (ya/tidak), status NIB di oss.go.id, status pendaftaran di pse.komdigi.go.id,
       PSE komersial yang belum terdaftar ditandai, kategorisasi BSSN dicatat terpisah dari kewajiban daftar.
    10. Pemeriksaan config-AI (kalau ada fitur AI): lokasi system prompt dan konfigurasi model, vonis
        server-side, dan hasil percobaan ekstraksi dasar, kebocoran ditandai.
  EXTRA-MILE (data pribadi atau uang di skala radius-dampak):
    11. Catatan hardening Level 2: tiap item Level 2 yang berlaku untuk database dan fondasi cloud,
        keadaannya, item yang belum terpenuhi ditandai dengan trade-off yang dibawa.
    12. Bukti scanning pipeline: konfigurasi CI yang menjalankan secret dan config scanning di tiap deploy,
        kategori yang dicakup, contoh keluaran, dan apakah secret yang terdeteksi memblokir deploy.
    13. Catatan integritas deployment: source dan pipeline asal versi live dibangun, kontrol atas siapa
        yang bisa memicu deploy production, dan konfirmasi bundle yang berjalan cocok dengan keluaran
        pipeline, tautan yang tak bisa diverifikasi ditandai.

Keluarkan tabel temuan dengan kolom berikut dan tidak lebih lemah dari bukti:
  | Tingkat keparahan | Risiko bisnis dalam kata-kata biasa | Artefak bukti | Citation | Saran perbaikan |

Aturan:
  - Terjemahkan tiap temuan menjadi konsekuensi bisnis konkret yang dipahami non-coder
    (misalnya: "siapa pun yang membuka situs live-mu bisa membaca key database-mu dari file yang terunduh
    lalu menghapus datamu," bukan "secret terekspos di client bundle").
  - Cite hanya kendali yang disebut di domain ini (A02, A04, A07, A08, A10, LLM07, OWASP Secure Headers
    Project, Supabase Production Checklist, dokumentasi keamanan Vercel dan Next.js, CIS PostgreSQL Level 1/2
    untuk versi mayor yang berjalan, CIS Cloud Foundations Level 1/2; untuk Indonesia: PP 71/2019 Pasal 6,
    Permenkominfo 5/2020, BSSN Reg 8/2020). Jangan mengarang ID. Cite CIS di tingkat benchmark bernama untuk
    versi mayor yang berjalan, bukan per nomor item.
  - Tidak ada vonis telanjang. "Tampak aman" bukan temuan. Lampirkan artefak (daftar secret yang sebenarnya,
    konfigurasi header yang sebenarnya, nilai pengaturan yang sebenarnya) yang membuktikan klaim itu; vonis
    yang tampak percaya diri tanpa bukti memanufaktur kepercayaan palsu.
  - Kalau kamu tidak bisa menghasilkan artefak yang dituntut sebuah pemeriksaan, katakan begitu dan tandai
    pemeriksaan itu INCOMPLETE.
```

# Domain I: Ops, Uptime, Backup, Rollback

## Apa ini

Domain ini soal apa yang terjadi sesudah peluncuran, ketika ada yang rusak dan tidak ada yang sedang menatap layar. Tiga hal harus tegak. Kamu tahu saat aplikasimu rusak atau diserang, karena ia memberitahumu (deteksi dan alerting, yaitu notifikasi otomatis saat ada yang tidak beres). Saat satu bagiannya gagal, ia gagal dengan aman alih-alih membuka pintu lebar-lebar (penanganan error). Dan saat data hilang atau sebuah perubahan buruk terkirim, kamu bisa kembali ke keadaan yang diketahui baik, karena ada backup (salinan cadangan data) dan ada cara untuk membatalkan perubahan itu (backup dan rollback).

Sebuah AI tool membuatkanmu aplikasi yang jalan di demo. Ia tidak, dengan sendirinya, membangunkanmu mesin membosankan yang menangkap kegagalan jam tiga pagi, menolak memberi akses saat sebuah cek error, atau memulihkan data tadi malam setelah deploy yang buruk. Mesin itu tak terlihat selama semuanya bekerja, dan justru itulah yang hilang saat semuanya berhenti bekerja. Ini domain kegagalan yang tidak kamu rencanakan, ditangani oleh jaring pengaman yang tidak kamu sadari kamu butuhkan.

## Yang tidak kelihatan di sini

Aplikasimu sudah hidup berminggu-minggu. Kamu membukanya, ia memuat, order masuk. Tidak ada yang memberitahumu bahwa bagian yang tak bisa kamu lihat belum pernah diuji, karena satu-satunya tes yang berarti adalah kegagalan sungguhan, dan kamu belum pernah mengalaminya. Tiga titik buta bersembunyi di balik ketenangan itu.

Yang pertama adalah **backup yang tidak pernah di-restore**. Penyedia hosting-mu mungkin mengambil backup otomatis, dan baris itu di dashboard terasa seperti keamanan. Ia bukan keamanan, sampai ada yang benar-benar me-restore satu lalu menyaksikan datanya kembali utuh. Backup gagal diam-diam: sebuah job yang diam-diam berhenti jalan berbulan-bulan lalu, backup yang menangkap database tapi bukan file yang diunggah, salinan yang ter-restore ke cangkang kosong karena satu langkah terlewat. Kamu baru tahu jenis mana yang kamu punya pada hari kamu membutuhkannya, dan itu hari terburuk untuk mengetahuinya. Satu-satunya bukti sebuah backup bekerja adalah restore yang berhasil.

Yang kedua adalah **gagal-membuka alih-alih gagal-menutup**. Ketika sebuah cek di aplikasimu error (database lambat, sebuah layanan yang ia panggil timeout, sebuah input tak terduga masuk), kode harus memutuskan apa yang dilakukan, dan sebuah AI tool yang menulis happy path (jalur normal saat semuanya berjalan mulus) sering menulis versi yang terus jalan. Terus jalan bisa berarti memberi akses saat cek izin tidak bisa selesai, memperlakukan pembayaran sebagai berhasil saat panggilan verifikasinya gagal, atau menampilkan data saat filter yang menyembunyikan data orang lain melempar error. Aplikasi terlihat lebih kokoh karena tak pernah menampilkan error ke pengguna. Sebenarnya ia kurang aman, karena "aku tidak bisa mengecek, jadi akan kuizinkan" adalah pintu terbuka yang berdandan sebagai ketahanan. OWASP menambahkan kegagalan persis ini ke daftar sepuluh-teratas 2025 sebagai kategorinya sendiri, salah-tangani kondisi yang tak biasa, karena ia sebegitu umum dan sebegitu senyap (OWASP Top 10:2025 A10).

Yang ketiga adalah **sunyi padahal seharusnya kamu mendengar alarm**. Kalau aplikasimu sedang diraba-raba, kalau error melonjak, kalau sebuah background job mati, kalau pemakaian AI-mu memanjat menuju tagihan yang tak sanggup kamu bayar, kamu hanya tahu kalau ada yang dibangun untuk memberitahumu. Kebanyakan aplikasi buatan AI tidak mencatat apa pun yang berguna dan tidak mengalarmi apa pun, jadi pemberitahuan pertama soal masalah adalah keluhan pelanggan atau tagihan kartu kredit. OWASP mendaftar logging dan alerting yang tidak memadai sebagai kategori sepuluh-teratasnya sendiri dengan alasan yang sama: tidak melihat serangan adalah cara serangan itu berhasil selama berbulan-bulan (OWASP Top 10:2025 A09).

Self-audit yang naif melewatkan ketiganya karena mereka adalah ketiadaan, bukan kesalahan. Tidak ada baris kode rusak yang bisa ditunjuk. AI tool yang membangun aplikasi membaca "tidak ada penanganan error di sini" sebagai "jalur ini tidak error", dan membaca "tidak ada alerting" sebagai "tidak ada yang perlu dialarmi", karena di demo tidak ada yang error dan tidak ada yang salah. Cek yang menemukan ini bukan "apakah ia jalan". Tapi "tunjukkan restore terakhir yang berhasil, tunjukkan apa yang kode lakukan saat cek ini gagal, dan tunjukkan apa yang harus rusak dulu sebelum ada orang yang diberitahu".

## Kapan ini penting (sinyal taruhan)

Floor untuk domain ini ringan dan berlaku untuk setiap aplikasi nyata: error harus gagal dengan aman, dan backup atas apa pun yang kamu sayang kalau hilang harus ada dengan minimal satu restore yang terbukti. Floor itu murah dan tidak pernah dilewati. Yang ditentukan sinyal taruhan adalah apakah kamu melangkah lebih jauh ke dalam mesin keandalan yang dijalankan tim elite, dan jawaban jujurnya untuk kebanyakan aplikasi kecil adalah tidak.

Taruhan dibaca pada permukaan domain ini sendiri: berapa sebenarnya biaya yang ditimbulkan oleh sebuah outage, kegagalan senyap, atau data yang hilang pada aplikasi ini.

- **S5 Radius dampak** (banyak pengguna, beberapa pelanggan terpisah berbagi satu infrastruktur, sebuah API publik, sebuah sistem bersama) adalah sinyal penentu di sini. Ketika satu kegagalan melukai banyak orang sekaligus, biaya outage yang tak terdeteksi atau deploy yang berantakan berlipat ganda, dan praktik yang menahan biaya itu (target uptime yang disepakati, rilis bertahap, monitoring sungguhan) mulai pantas diadakan. S5 mendorong domain ini ke STANDARD dan, digabung dengan sinyal lain, ke EXTRA-MILE.
- **S6 Ketidakbisaan-dibatalkan** (sebuah aksi di sini tidak bisa dibatalkan: hapus, transfer, publikasikan, kirim) menajamkan separuh backup-dan-rollback dari domain ini. Kalau aplikasi melakukan hal yang tidak bisa ditarik kembali, restore yang terbukti dan cara yang teruji untuk me-rollback perubahan buruk adalah satu-satunya jaring pengaman yang ada, dan yang berfungsi jadi jauh lebih berharga daripada yang sekadar diharapkan.
- **S1 Uang** atau **S3 Data pribadi** di permukaan ini menaikkan biaya kegagalan yang luput dari pandangan, karena outage tak terdeteksi pada layanan berbayar atau penyimpan data adalah pendapatan yang hilang atau kebocoran yang tak disadari, bukan sekadar downtime. Salah satu sinyal ini mendorong separuh deteksi-dan-logging dari domain ini ke STANDARD.

Ada aturan hari-pertama yang duduk di atas hitungan jumlah, sama dengan yang ditegakkan Domain E dari sisi biaya. **Kalau aplikasimu memanggil layanan AI berbayar di produksi, monitoring pemakaian dan biaya dengan sebuah alert wajib ada di FLOOR.** Batas pengeluaran keras itu sendiri tinggal di domain pembayaran dan biaya; yang tinggal di sini adalah diberitahu saat pemakaian memanjat, karena loop kebablasan yang tak bisa kamu lihat adalah tagihan yang tak bisa kamu hentikan, dan orang yang menjalankan loop agen adalah yang paling kecil kemungkinannya menyadarinya sebelum tagihan datang.

Kalau aplikasimu memang melayani satu audiens kecil tunggal, tidak memegang apa pun yang tak bisa kamu bangun ulang, dan tidak melakukan apa pun yang tak bisa dibatalkan, maka floor adalah seluruh pekerjaan di sini. Buat error gagal-menutup, simpan satu backup yang berfungsi atas apa pun yang berharga, lalu berhenti. Aturan anti-rekayasa-berlebihan paling tajam di domain ini dibanding domain mana pun: **jangan bangun gladi resik chaos-engineering, target uptime formal, infrastruktur canary, atau game-day drill untuk aplikasi yang belum punya apa pun untuk diketahanankan.** Mesin keandalan yang dibangun sebelum ada apa pun yang layak dilindungi adalah usaha terbuang yang berdandan sebagai kerajinan, dan merekomendasikannya untuk aplikasi akhir pekan adalah kegagalan penilaian, bukan tanda ketelitian.

## Pemeriksaan floor

Jangan pernah dilewati di aplikasi nyata mana pun. Mereka murah, dan mereka adalah selisih antara hari buruk yang bisa dipulihkan dan hari buruk yang tidak.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Temukan tiap tempat di mana sebuah cek yang relevan-keamanan bisa gagal (cek izin atau kepemilikan, verifikasi pembayaran atau signature, filter yang menyembunyikan data pengguna lain) dan pastikan ketika ia error atau tidak bisa selesai, aplikasi menolak aksi alih-alih mengizinkannya. Default yang aman adalah menolak saat kamu tidak bisa memverifikasi, kadang disebut fail closed (gagal-menutup). | Saat sebuah cek error, kode bisa berhenti atau terus jalan, dan "terus jalan" bisa berarti memberi akses, menerima pembayaran yang belum terverifikasi, atau menampilkan data yang seharusnya disembunyikan filter, semuanya karena ada sesuatu lebih jauh yang rusak. Aplikasi yang mengizinkan saat error terlihat lebih mulus bagi pengguna dan diam-diam terbuka lebar. Gagal-menutup berarti cek yang rusak menghasilkan error yang terlihat, bukan kebocoran yang tak terlihat. | Peta penanganan-error untuk jalur yang relevan-keamanan: tiap cek semacam itu, apa yang kode lakukan saat ia error atau timeout (tolak atau izinkan), dan tiap jalur yang mengizinkan atau melanjutkan atas cek yang gagal atau tidak lengkap ditandai sebagai lubang fail-open (gagal-membuka). | OWASP Top 10:2025 A10 Mishandling of Exceptional Conditions; OWASP Top 10:2025 A01 Broken Access Control |
| Pastikan ada backup untuk apa pun yang tidak ingin kamu hilangkan (database, dan file yang diunggah atau konten pengguna yang disimpan di luarnya), dan pastikan minimal satu restore benar-benar pernah dilakukan dan diverifikasi membawa data kembali utuh. Sebuah backup hanya terbukti oleh restore yang berhasil. | Backup yang tak pernah di-restore siapa pun adalah tebakan, dan kegagalan yang umum bersifat senyap: job backup yang berhenti berbulan-bulan lalu, salinan yang menyimpan database tapi bukan file yang diunggah, restore yang mendarat di cangkang kosong. Hari kamu membutuhkannya adalah hari terburuk untuk mengetahui jenis mana yang kamu punya. Satu restore yang teruji sekarang mengubah "kami pikir kami punya backup" jadi "kami tahu kami bisa kembali". | Catatan backup-dan-restore: apa yang di-backup (database, file, konten) dan seberapa sering, plus hasil dari minimal satu restore sungguhan (apa yang di-restore, apakah datanya kembali lengkap), atau penanda eksplisit bahwa tidak ada restore yang pernah diverifikasi. | NIST AI RMF 1.0 / AI 100-1 MANAGE (pemulihan dari insiden); NIST SSDF SP 800-218 v1.1 RV.2 (remediasi dan pulih) |
| Pastikan kamu bisa membatalkan rilis yang buruk: bahwa versi yang hidup bisa di-rollback ke versi berfungsi sebelumnya lewat platform hosting atau proses deploy, dan ada orang yang tahu langkahnya. Me-rollback berarti mengembalikan aplikasi yang berjalan ke versi sebelumnya yang diketahui baik. | Sebuah perubahan yang merusak aplikasi atau membuka lubang hanya seberbahaya waktu yang dibutuhkan untuk membatalkannya. Kalau tidak ada cara yang diketahui kembali ke versi baik terakhir, kesalahan lima menit jadi outage berjam-jam sementara seseorang mencari-cari perbaikan di bawah tekanan. Mengetahui jalur rollback lebih dulu mengubah deploy buruk jadi pembalikan cepat. | Catatan rollback: mekanisme persis yang mengembalikan aplikasi ke versi berfungsi sebelumnya (fitur platform, deploy ulang build sebelumnya, atau langkah terdokumentasi), dikonfirmasi ada, atau penanda bahwa tidak ada jalur rollback yang diketahui. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; NIST SSDF SP 800-218 v1.1 RV.2 (remediasi) |
| Pastikan aplikasi mencatat cukup tentang apa yang terjadi untuk diselidiki belakangan: bahwa event yang relevan-keamanan (login gagal, penolakan izin, error, dan aksi administratif apa pun) ditulis ke sebuah log yang bisa kamu jangkau, dengan detail yang cukup untuk tahu apa yang terjadi, dan bahwa log itu sendiri tidak menangkap secret atau data pribadi utuh. | Kalau tidak ada yang dicatat, tanda pertama soal masalah adalah keluhan pelanggan atau tagihan kejutan, dan kamu tidak punya jejak untuk merekonstruksi apa yang salah. Log yang berguna adalah cara kamu tahu sebuah serangan sedang berlangsung, membuktikan apa yang dilakukan sebuah akun, dan belajar dari kegagalan alih-alih mengulanginya. Sebaliknya, log yang diam-diam menyimpan password atau data pribadi jadi kebocorannya sendiri. | Inventaris logging: event relevan-keamanan mana yang di-log, satu contoh entri yang menunjukkan detail yang ditangkap, di mana log bisa dibaca, dan konfirmasi bahwa secret dan data pribadi utuh dijauhkan darinya, dengan event kritis yang tak ter-log atau log yang membocorkan secret ditandai. | OWASP Top 10:2025 A09 Security Logging and Alerting Failures; OWASP Top 10 for LLM Applications 2025 LLM02 Sensitive Information Disclosure |
| Kalau aplikasi memanggil layanan AI berbayar, pastikan pemakaian dan pengeluaran dimonitor dengan sebuah alert yang menyala sebelum tagihan jadi masalah, terpisah dari batas keras yang menghentikannya. Monitoring memberitahumu bahwa ia sedang terjadi; batas itu menghentikannya. | Batas pengeluaran keras akhirnya menghentikan loop kebablasan, tapi saat ia terpicu kamu sudah membelanjakan sampai langit-langitnya. Alert yang menyala pada pemakaian yang memanjat memberimu kesempatan menemukan dan mematikan loop macet atau pengguna yang menyalahgunakan selagi tagihannya masih kecil. Tanpa itu, pemberitahuan pertama adalah tagihannya. | Monitor pemakaian-dan-biaya sebagaimana dikonfigurasi: apa yang ia pantau (pengeluaran token, volume request), ambang alert-nya, dan bagaimana alert sampai ke manusia, atau penanda bahwa pemakaian AI berbayar berjalan tanpa dimonitor. | OWASP Top 10 for LLM Applications 2025 LLM10 Unbounded Consumption; OWASP Top 10:2025 A09 Security Logging and Alerting Failures |

### Lapisan Indonesia: surat pemberitahuan kebocoran data siap-pakai (jam 3x24)

Kalau aplikasimu menyimpan data pribadi (nama, email, nomor HP, NIK, dan sejenisnya milik pengguna) dan terjadi kebocoran data (data breach, data pribadi yang terekspos atau bocor), UU PDP No. 27/2022 mewajibkanmu mengirim pemberitahuan tertulis dalam **3x24 jam (72 jam)** kepada dua pihak: (a) pemilik data yang terdampak dan (b) otoritas. Surat itu harus menyatakan data apa yang terekspos, kapan dan bagaimana kejadiannya, serta langkah pemulihan yang sudah diambil (UU PDP Pasal 46-47).

Karena Badan Pelindungan Data Pribadi baru ditargetkan beroperasi pada 2026, pada masa interim notifikasi ke otoritas ditujukan lewat Komdigi (Kementerian Komunikasi dan Digital). Untuk panduan teknis penanganan insiden berbahasa Indonesia, jaringan CSIRT (Computer Security Incident Response Team, tim tanggap insiden siber) seperti CSIRT instansi dan pemerintah menerbitkan rujukan yang bisa kamu pakai. Sumber: NONA Lane Indonesia, bagian 1 dan 5.

Jam 72 jam itu pendek, dan kamu tidak ingin menyusun surat dari nol di tengah kepanikan. Siapkan satu halaman ini lebih dulu, isi bagian dalam kurung saat insiden terjadi:

```
PEMBERITAHUAN KEBOCORAN DATA PRIBADI

Kepada: [pemilik data yang terdampak / dan: Komdigi sebagai otoritas interim]
Tanggal pemberitahuan: [tanggal, dalam 3x24 jam sejak kebocoran diketahui]

1. Apa yang terjadi
   Pada [tanggal dan jam, sertakan zona waktu, mis. 2026-06-04 14:30 WIB] kami
   mendeteksi [uraian singkat: akses tidak sah / kesalahan konfigurasi / kebocoran
   lewat (jalur)]. Kebocoran diketahui melalui [bagaimana kamu tahu: alert,
   laporan, audit].

2. Data pribadi yang terekspos
   Jenis data yang terdampak: [mis. nama, email, nomor HP; sebutkan persis].
   Perkiraan jumlah pemilik data terdampak: [angka atau rentang].
   Catatan: kami tidak menyimpan [data yang TIDAK kamu simpan, mis. password
   dalam bentuk terbaca, nomor kartu/PAN], sehingga data tersebut tidak terdampak.

3. Kapan dan bagaimana
   Rentang waktu paparan: [dari kapan sampai kapan, dengan zona waktu di kedua ujung].
   Penyebab: [akar penyebab singkat sejauh yang sudah diketahui].

4. Langkah pemulihan yang sudah diambil
   [Mis. menutup celah, merotasi (mengganti) secret yang terekspos, me-restore data
   dari backup, memaksa reset password, memutus akses yang disalahgunakan.]
   Langkah lanjutan yang sedang berjalan: [bila ada].

5. Apa yang sebaiknya kamu lakukan (untuk pemilik data)
   [Mis. ganti password, waspadai upaya penipuan yang mengatasnamakan kami.]

Kontak: [email/nomor yang bisa dihubungi pemilik data].
```

Pastikan kolom tanggal dan jam memakai zona waktu yang eksplisit (mis. WIB), karena jam 72 jam dihitung dari saat kebocoran diketahui, dan tanggal yang ambigu menyulitkan pembuktian kamu memenuhi tenggat. Ini posisi minimal-cukup: UU PDP mewajibkan pemberitahuan dengan tiga isi di atas dalam 72 jam, tidak lebih dari itu untuk pemroses berskala kecil biasa. Sumber: NONA Lane Indonesia, bagian 1 (Pasal 46-47) dan bagian 5 (Komdigi interim, jaringan CSIRT).

## Pemeriksaan standard

Tim yang kompeten melakukan ini begitu aplikasi melayani banyak orang, memegang uang atau data pribadi, atau melakukan hal yang tidak bisa dibatalkan, sesuai sinyal taruhan di atas.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Perluas penanganan error melampaui jalur keamanan ke setiap tempat aplikasi memanggil sesuatu yang bisa gagal (database, penyedia pembayaran, layanan AI, layanan eksternal apa pun) dan pastikan tiap kegagalan ditangkap dan diselesaikan ke keadaan yang benar dan aman, dengan pengguna ditunjukkan pesan yang jelas dan detailnya ditulis ke log-mu. | Satu kegagalan yang tak tertangani jauh di dalam aplikasi bisa meninggalkan aksi setengah jadi: tagihan diambil tanpa produk diberikan, sebuah record diperbarui tapi pasangannya tidak, sebuah job yang mati di tengah jalan dan meninggalkan data tidak konsisten. Menangani tiap kegagalan dengan sengaja adalah yang menjaga satu layanan lambat atau satu timeout dari diam-diam merusak keadaan yang diandalkan pelangganmu. | Tinjauan kondisi-tak-biasa: tiap panggilan eksternal atau operasi yang bisa gagal, apa yang kode lakukan saat gagal (keadaan yang dihasilkan dan pesan ke pengguna), dan tiap jalur yang crash, hang, atau meninggalkan keadaan tidak konsisten ditandai. | OWASP Top 10:2025 A10 Mishandling of Exceptional Conditions |
| Ubah logging jadi alerting sungguhan: pastikan event relevan-keamanan dan event kegagalan yang dicatat memicu notifikasi ke manusia saat melewati ambang (lonjakan error, ledakan login gagal, sebuah background job yang berhenti, sebuah layanan yang turun), alih-alih duduk tak terbaca di dalam log. | Log yang tidak dibaca siapa pun adalah kamera keamanan yang diarahkan ke tembok. Event yang penting (serangan yang meraba aplikasimu, job yang diam-diam mati seminggu, outage di malam hari) hanya berguna kalau ada yang mendorongnya ke seseorang tepat waktu untuk bertindak. Alerting adalah garis antara menemukan masalah dalam hitungan menit dan menemukannya saat pelanggan yang menemukannya. | Peta alerting: event tercatat mana yang memunculkan alert, ambang masing-masing, kanal yang dilewati alert untuk sampai ke manusia, dan konfirmasi sebuah alert diuji untuk benar-benar sampai, dengan event kritis yang tidak memunculkan alert ditandai. | OWASP Top 10:2025 A09 Security Logging and Alerting Failures; NIST AI RMF 1.0 / AI 100-1 MANAGE (monitor dan tanggapi) |
| Tetapkan jadwal backup yang sepadan dengan berapa banyak data yang sanggup kamu relakan hilang, pastikan backup disimpan terpisah dari sistem yang hidup (supaya satu kegagalan tidak menghabisi keduanya), dan konfirmasi ulang restore pada backup terkini, bukan tes sekali dari berbulan-bulan lalu. Nyatakan terus terang berapa banyak data terbaru yang akan hilang dalam sebuah restore. | Backup yang diambil seminggu sekali berarti satu kegagalan bisa membuatmu kehilangan order seminggu; backup yang disimpan di sistem yang sama yang gagal bisa hilang bersamanya. Menentukan jadwal terhadap apa yang sanggup kamu relakan, menyimpan salinan di tempat terpisah, dan menguji ulang restore pada setup hari ini adalah selisih antara rencana pemulihan dan harapan pemulihan. Berapa banyak data terbaru yang akan hilang dalam sebuah restore adalah angka yang sebaiknya kamu tahu sebelum membutuhkannya, bukan sesudah. | Catatan rencana-backup: frekuensi backup yang terikat ke jendela kehilangan-data yang bisa diterima, konfirmasi backup disimpan terpisah dari sistem yang hidup, dan hasil tes restore terkini dengan jendela kehilangan-data yang realistis dinyatakan, celah ditandai. | NIST AI RMF 1.0 / AI 100-1 MANAGE (pemulihan dan ketahanan); NIST SSDF SP 800-218 v1.1 RV.2 (remediasi dan pulih) |
| Miliki proses tanggap-insiden dan pemulihan yang tertulis, sependek apa pun: siapa yang diberitahu, apa langkah pertamanya, bagaimana membawa aplikasi ke keadaan aman, dan bagaimana temuan diumpankan kembali ke perbaikan. Setelah insiden nyata, konfirmasi tinjauan akar-penyebab terjadi dan menghasilkan minimal satu perubahan konkret. | Saat ada yang rusak, waktu yang kamu habiskan untuk memutuskan apa yang dilakukan adalah downtime, dan keputusan panik di saat itu cenderung memperburuk keadaan. Rencana tertulis yang pendek mengubah kekacauan jadi langkah, dan tinjauan akar-penyebab sesudahnya adalah cara sebuah insiden jadi perbaikan alih-alih kejutan yang berulang. Tujuannya adalah belajar dari kegagalan dengan cara yang bertahan, bukan menunjuk siapa yang salah. | Dokumen proses-insiden dengan jalur notifikasi, langkah penahanan pertama, dan langkah pemulihan, plus, untuk insiden mana pun yang sudah terjadi, catatan akar-penyebab singkat yang menyebut penyebab penyumbang dan perubahan yang ia hasilkan. | NIST SSDF SP 800-218 v1.1 RV.1, RV.2, RV.3 (identifikasi, remediasi, dan analisis akar penyebab kerentanan dan insiden); NIST AI RMF 1.0 / AI 100-1 MANAGE |

## Pemeriksaan extra-mile

Ketelitian tingkat frontier. Bahkan tim engineering yang kuat memperlakukan ini sebagai usaha tambahan dan diperpanjang, dan mereka terbuang pada aplikasi kecil. Jalankan di permukaan domain ini hanya ketika gerbang taruhan memaksanya, sesuai catatan. Kalau tidak ada satu pun sinyal taruhan menyentuh permukaan ini, tidak ada satu pun dari ini yang berlaku, dan mengusulkannya tetap adalah rekayasa berlebihan.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation | Gerbang taruhan + pola frontier |
|---|---|---|---|---|
| Tetapkan target keandalan eksplisit untuk layanan (misalnya, tersedia 99,9% dari waktu) dan sebuah error budget: jatah kecil kegagalan yang diizinkan target itu, dengan aturan bahwa saat jatahnya habis, fitur baru dijeda dan kerja stabilitas didahulukan. Lalu lacak ketersediaan terhadapnya. Error budget adalah ruang gagal yang disepakati sebelum kerja keandalan mengalahkan pengiriman fitur. | Pada layanan yang diandalkan banyak orang, "kirim lebih cepat" dan "tetap andal" saling tarik, dan tanpa garis yang disepakati keandalannya diam-diam terkikis sampai sebuah outage memaksa keputusan. Target dan jatah membuat trade-off jadi aturan alih-alih perdebatan: layanan mendapat hak mengirim fitur dengan tetap di dalam jatahnya, dan jatah yang habis adalah sinyal otomatis tanpa emosi untuk berhenti dan memperbaiki. | Catatan target-keandalan: target ketersediaan yang dinyatakan, error budget yang diturunkan darinya, aturan apa yang terjadi saat jatahnya habis, dan pengukuran yang menunjukkan ketersediaan saat ini terhadap target. | NIST AI RMF 1.0 / AI 100-1 MANAGE (kelola dan pantau risiko sepanjang waktu); OWASP Top 10:2025 A09 Security Logging and Alerting Failures | Dipaksa oleh S5 (radius dampak) pada layanan dengan janji uptime nyata atau pengguna berbayar. Pola frontier: error budget dan service level objective. |
| Rilis perubahan berisiko secara bertahap alih-alih ke semua orang sekaligus: kirim dulu ke sebagian kecil pengguna atau trafik, amati sinyal error dan kesehatannya, dan perluas hanya kalau bertahan, dengan kemampuan mematikan sebuah perubahan seketika lewat feature flag (saklar nyala/mati yang menonaktifkan sebuah fitur tanpa deploy ulang). | Sebuah perubahan yang didorong ke semua orang sekaligus dan ternyata rusak adalah outage untuk seluruh audiensmu tanpa jalan keluar cepat. Merilis ke satu irisan dulu berarti perubahan buruk melukai beberapa orang selama beberapa menit alih-alih semuanya selama berjam-jam, dan saklar-mati seketika berarti kamu menghentikan kerusakan tanpa deploy ulang yang panik. Pada sistem bersama, ini selisih antara sandungan yang terkurung dan outage penuh. | Catatan rilis-bertahap: mekanisme yang merilis perubahan ke subset dulu (staged rollout, canary, atau feature flag), sinyal yang diamati sebelum memperluas, dan konfirmasi sebuah fitur bisa dimatikan tanpa deploy ulang, celah ditandai. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; NIST AI RMF 1.0 / AI 100-1 MANAGE | Dipaksa oleh S5 (radius dampak), di mana rilis buruk menjangkau banyak pengguna sekaligus. Pola frontier: rilis bertahap (canary, feature flag, staged rollout). |
| Gladi resik kegagalan dengan sengaja: jalankan latihan terkendali di mana kamu sengaja merusak satu bagian sistem (matikan database, putus sebuah dependency, simulasikan penyedia AI yang turun) dan konfirmasi aplikasi turun-perlahan dengan aman, alert-nya menyala, dan langkah pemulihan serta restore benar-benar bekerja di kondisi yang realistis. Gladi resik outage yang terjadwal kadang disebut game day. | Tes sungguhan pertama atas jaring pengamanmu seharusnya bukan bencana sungguhan. Sengaja merusak sebuah bagian, di jendela waktu yang kamu pilih, memunculkan backup yang rusak, alert yang tak pernah menyala, dan langkah pemulihan yang tak terdokumentasi, selagi taruhannya gladi resik alih-alih insiden hidup. Ini pantas biayanya hanya pada sistem yang sudah punya redundansi dan kebutuhan keandalan nyata; pada aplikasi kecil belum ada apa pun untuk digladi resikkan. | Catatan gladi-kegagalan: kegagalan yang sengaja ditimbulkan, apa yang sistem dan alert sebenarnya lakukan, apakah pemulihan dan restore bekerja, dan tiap celah yang dipaparkan latihan itu beserta perbaikan yang ia picu. | NIST AI RMF 1.0 / AI 100-1 MANAGE (ketahanan dan tanggap insiden); NIST SSDF SP 800-218 v1.1 RV.3 (analisis akar penyebab) | Dipaksa oleh S5 (radius dampak) pada sistem dengan kebutuhan keandalan nyata dan redundansi yang sudah terpasang. Pola frontier: chaos engineering dan game day. |
| Untuk aplikasi dengan agen otonom yang mengambil aksi sendiri, konfirmasi ada kill switch (saklar penghenti) yang menghentikan agen seketika, bahwa aksinya di-log dengan detail yang cukup untuk merekonstruksi apa yang ia lakukan, dan bahwa sebuah alert menyala pada perilaku agen yang abnormal (ledakan aksi, kegagalan berulang, sebuah aksi di luar pola normalnya). | Agen yang bertindak sendiri tanpa saklar-mati adalah proses yang tak bisa kamu hentikan saat ia salah jalan, dan yang aksinya tak di-log adalah proses yang tak bisa kamu jelaskan sesudahnya. Agen yang ditipu atau berputar bisa menimbulkan kerusakan nyata dengan cepat; kemampuan menghentikannya seketika, melihat persis apa yang ia lakukan, dan diperingatkan saat ia salah tingkah adalah yang menjaga insiden agen dari jadi bencana agen. | Catatan kendali-agen: kill switch dan di mana ia dipicu, satu contoh log aksi agen yang menunjukkan detail yang ditangkap, dan alert yang menyala pada perilaku abnormal beserta ambangnya, celah ditandai. | OWASP Top 10 for LLM Applications 2025 LLM06 Excessive Agency; OWASP Top 10:2025 A09 Security Logging and Alerting Failures; NIST AI RMF 1.0 / AI 100-1 MANAGE | Dipaksa oleh S4 (agen otonom), di mana aksi agen yang tak terawasi butuh penghenti, catatan, dan peringatan. Pola frontier: kill switch agen, logging aksi, dan alerting anomali. |

## Kapan berhenti dan menyewa manusia

Datangkan peninjau independen, dan jangan bersandar pada self-review AI saja, untuk domain ini ketika salah satu dari ini benar:

- Sebuah insiden atau outage nyata sudah terjadi pada sistem yang melayani banyak orang, memegang uang, atau memegang data pribadi (S5 dengan S1 atau S3), dan kamu tidak bisa menjelaskan sepenuhnya akar penyebabnya atau memastikan perubahan yang kamu buat benar-benar menutupnya. Insiden yang tak bisa kamu pertanggungjawabkan pada sistem bertaruhan tinggi cenderung berulang, dan menebak-nebak menuju "kayaknya sudah beres" adalah cara outage kedua tiba.
- Aplikasimu melakukan hal yang tidak bisa dibatalkan (S6) dan kamu tidak bisa menghasilkan backup dengan restore yang terbukti dan jalur rollback yang benar-benar pernah kamu pakai. Aksi yang tak bisa dibatalkan dengan jaring pengaman yang belum terbukti adalah kasus di mana satu hari buruk tidak punya jalan kembali, dan itu bukan taruhan untuk dikonfirmasi lewat cek otomatis.
- Peta penanganan-error menunjukkan sebuah cek relevan-keamanan yang mengizinkan atau melanjutkan saat ia gagal (lubang fail-open) pada permukaan yang membawa taruhan nyata, dan kamu tidak bisa memastikan perbaikannya membuatnya gagal-menutup di setiap tempat yang seharusnya. Pintu yang terbuka tiap kali kuncinya error adalah persis kegagalan senyap yang dibuat untuk ditangkap oleh domain ini.
- Aplikasi menjalankan agen otonom (S4) dan kamu tidak bisa menunjukkan kill switch yang berfungsi, log aksi, dan alert pada perilaku abnormal. Agen yang tak bisa kamu hentikan, tak bisa kamu rekonstruksi, dan tidak kamu diperingatkan tentangnya tidak boleh berjalan tanpa ditinjau pada apa pun yang berarti.

Protokol ini menangkap sepotong berarti dari masalah operasional dan pemulihan dengan murah, dan ia adalah pemeriksaan pertama yang tepat untuk hampir setiap aplikasi. Ini bukan jaminan. AI yang meninjau setup operasional yang dibuat oleh kelasnya sendiri lebih lemah daripada tinjauan manusia independen persis pada jalur kegagalan yang hanya muncul di bawah beban nyata, karena demo tak pernah menghasilkannya dan penalaran yang sama yang melewati jaring pengaman cenderung membaca ketiadaannya sebagai baik-baik saja. Domain K membahas apa yang ditambahkan tinjauan profesional dan di mana batas jujurnya berada. Untuk aplikasi yang membawa taruhan nyata di domain ini, arahkan ke sana.

## Instruksi agen

```
DOMAIN I: OPS, UPTIME, BACKUP, ROLLBACK

Lingkup berdasarkan taruhan (taruhan bersifat lokal pada permukaan operasional dan pemulihan domain ini):
  FLOOR menyala untuk aplikasi nyata apa pun: error pada cek relevan-keamanan gagal-menutup (tolak saat
  sebuah cek tidak bisa selesai), backup ada untuk apa pun yang berharga dengan minimal satu restore
  terbukti, jalur rollback diketahui, event relevan-keamanan di-log dengan berguna (dan log tidak
  membocorkan secret atau PII utuh).
  Kalau aplikasi melayani banyak pengguna atau berbagi infrastruktur (S5), atau memegang uang (S1) atau data
  pribadi (S3) pada permukaan ini, jalankan STANDARD di sini.
  Kalau S5 bergabung dengan sinyal lain, jalankan EXTRA-MILE.
  OVERRIDE KERAS: kalau sebuah AI agent bertindak sendiri (S4), cek kill-switch agen, logging-aksi, dan
  alerting-anomali WAJIB di EXTRA-MILE terlepas dari hitungan jumlah sinyal.
  ATURAN HARI-PERTAMA: kalau aplikasi memanggil layanan AI berbayar di produksi, MONITORING pemakaian-dan-biaya
  dengan sebuah alert adalah FLOOR di sini (batas pengeluaran keras tinggal di domain pembayaran-dan-biaya).
  ANTI-REKAYASA-BERLEBIHAN: kalau tidak ada sinyal taruhan menyentuh permukaan ini, jalankan FLOOR saja. JANGAN
  usulkan error budget, target uptime formal, infrastruktur rilis-bertahap, atau game day chaos-engineering
  untuk aplikasi yang belum punya apa pun untuk diketahanankan. Menerapkan mesin keandalan secara berlebihan
  pada aplikasi bertaruhan rendah adalah kegagalan, bukan ketelitian.

Catatan sirkularitas (lihat protokol circularity-guard):
  Kegagalan di sini adalah ketiadaan, bukan baris yang rusak: tidak ada penanganan error, tidak ada restore
  teruji, tidak ada alerting. AI yang membangun aplikasi membaca "tidak ada jalur error di sini" sebagai "ini
  tidak bisa error" dan "tidak ada alert" sebagai "tidak ada yang perlu dialarmi", karena di demo tidak ada
  yang gagal. Jalankan domain ini di konteks BERSIH yang segar tanpa akses ke rasionalisasi build, dan
  utamakan model yang berbeda dari yang menulis kode. Cek dengan menuntut buktinya (restore terakhir yang
  berhasil, apa yang kode lakukan saat sebuah cek gagal, apa yang harus rusak sebelum ada yang diberitahu),
  bukan dengan bertanya apakah aplikasi "jalan".

Hasilkan artefak ini (bukan vonis):
  FLOOR:
    1. Peta penanganan-error (jalur keamanan): tiap cek relevan-keamanan, apa yang ia lakukan saat error atau
       timeout (tolak atau izinkan), tiap jalur fail-open (mengizinkan atau melanjutkan atas cek yang gagal)
       ditandai.
    2. Catatan backup-dan-restore: apa yang di-backup (database, file, konten) dan seberapa sering, plus
       hasil dari minimal satu restore SUNGGUHAN, atau penanda bahwa tidak ada restore yang pernah
       diverifikasi.
    3. Catatan rollback: mekanisme persis yang mengembalikan aplikasi ke versi berfungsi sebelumnya,
       dikonfirmasi ada, atau penanda bahwa tidak ada jalur rollback yang diketahui.
    4. Inventaris logging: event relevan-keamanan mana yang di-log, satu contoh entri, di mana log dibaca,
       dan konfirmasi ia tidak membocorkan secret atau PII utuh; event kritis tak ter-log atau log yang
       membocorkan secret ditandai.
    5. Monitor pemakaian-dan-biaya (kalau ada panggilan AI berbayar): apa yang ia pantau, ambang alert-nya,
       dan bagaimana alert sampai ke manusia, atau penanda bahwa pemakaian AI berbayar tidak dimonitor.
  STANDARD (banyak pengguna, atau uang/data pribadi pada permukaan ini):
    6. Tinjauan kondisi-tak-biasa: tiap panggilan eksternal atau operasi yang bisa gagal, apa yang kode
       lakukan saat gagal (keadaan yang dihasilkan dan pesan ke pengguna), jalur crash/hang/keadaan-tidak-
       konsisten ditandai.
    7. Peta alerting: event tercatat mana yang memunculkan alert, ambang masing-masing, kanal ke manusia,
       dan konfirmasi sebuah alert diuji untuk sampai; event kritis tanpa alert ditandai.
    8. Catatan rencana-backup: frekuensi backup terikat ke jendela kehilangan-data yang bisa diterima,
       backup disimpan terpisah dari sistem yang hidup, tes restore terkini, dan jendela kehilangan-data
       yang realistis dinyatakan; celah ditandai.
    9. Dokumen proses-insiden: jalur notifikasi, langkah penahanan pertama, dan langkah pemulihan; plus,
       untuk insiden mana pun yang terjadi, catatan akar-penyebab yang menyebut penyebab penyumbang dan
       perubahan konkret yang ia hasilkan.
  EXTRA-MILE (radius dampak dengan sinyal lain, atau agen otonom):
    10. Catatan target-keandalan: target ketersediaan, error budget, aturan saat jatahnya habis, dan
        ketersediaan saat ini diukur terhadapnya.
    11. Catatan rilis-bertahap: mekanisme yang merilis ke subset dulu, sinyal yang diamati sebelum
        memperluas, dan konfirmasi sebuah fitur bisa dimatikan tanpa deploy ulang; celah ditandai.
    12. Catatan gladi-kegagalan: kegagalan yang sengaja ditimbulkan, apa yang sistem dan alert lakukan,
        apakah pemulihan dan restore bekerja, dan tiap celah yang dipaparkan beserta perbaikannya.
    13. Catatan kendali-agen (kalau S4): kill switch dan di mana ia dipicu, satu contoh log aksi agen, dan
        alert anomali beserta ambangnya; celah ditandai.

Lapisan Indonesia (kalau aplikasi menyimpan data pribadi dan melayani pengguna Indonesia):
  Siapkan surat pemberitahuan kebocoran data satu halaman yang siap-pakai, disetel ke jam 3x24 (72 jam)
  UU PDP Pasal 46-47: nyatakan data apa yang terekspos, kapan dan bagaimana kejadiannya, langkah pemulihan
  yang sudah diambil, dan kepada siapa diberitahukan (pemilik data terdampak dan otoritas, lewat Komdigi pada
  masa interim sampai Badan PDP beroperasi). Rujuk panduan CSIRT untuk penanganan insiden. Pakai zona waktu
  eksplisit (mis. WIB) pada setiap tanggal karena jam 72 jam dihitung sejak kebocoran diketahui. Posisi
  minimal-cukup: tiga isi wajib dalam 72 jam, tidak lebih dari itu untuk pemroses berskala kecil biasa.

Keluarkan tabel temuan dengan kolom-kolom ini dan tidak ada yang lebih lemah dari bukti:
  | Severity | Risiko bisnis dalam bahasa awam | Artefak bukti | Citation | Saran perbaikan |

Aturan:
  - Terjemahkan tiap temuan jadi konsekuensi bisnis konkret yang dipahami non-coder
    (misalnya: "pada hari database-mu gagal kamu menemukan backup-nya berhenti jalan tiga bulan lalu dan
    tidak ada cara mengembalikan data pelangganmu," bukan "tidak ada restore terverifikasi").
  - Sitasi hanya kontrol yang disebut di domain ini (A01, A08, A09, A10, LLM02, LLM06, LLM10, NIST SSDF
    RV.1-RV.3, NIST AI RMF MANAGE). Jangan mengarang ID dan jangan cetak nomor V ASVS. Backup dan rollback
    bukan satu kontrol OWASP bernama tunggal; sandari dengan NIST SSDF RV.2 dan AI RMF MANAGE, dan nyatakan
    maknanya yang biasa sebagai bagian yang bertahan. Untuk kewajiban Indonesia, sebut pasalnya: pemberitahuan
    kebocoran data UU PDP Pasal 46-47, jam 3x24 (72 jam).
  - Tidak ada vonis telanjang. "Kelihatan andal" bukan temuan. Lampirkan artefak yang membuktikan klaim
    (hasil restore, keputusan penanganan-error, alert yang menyala); vonis yang kelihatan yakin tanpa bukti
    memproduksi kepercayaan palsu.
  - Kalau kamu tidak bisa menghasilkan artefak yang dituntut sebuah cek, katakan demikian dan tandai cek itu
    BELUM LENGKAP. Backup yang tak teruji dilaporkan "aman" adalah persis kegagalan yang dibangun untuk
    dipaparkan oleh domain ini.
```

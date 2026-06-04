# Domain B: Secret, Akses, RLS, IDOR, Auth

## Apa ini

Ini inti keamanan aplikasi: siapa yang boleh melihat apa, siapa yang boleh melakukan apa, dan di mana kunci-kunci aplikasi kamu disimpan. Ada tiga hal yang harus tegak. Orang yang benar bisa masuk dan orang yang salah tidak bisa (authentication, sering disingkat auth, yaitu memastikan user benar siapa yang dia klaim). Begitu masuk, tiap orang hanya bisa menjangkau datanya sendiri dan hanya aksi yang sesuai perannya (authorization, yaitu menentukan apa yang boleh diakses user setelah login). Dan kunci induk yang membuka database serta layanan berbayar kamu tidak pernah jatuh ke tangan publik.

Sebuah AI tool akan membuatkan kamu halaman login yang kelihatan jadi dan database yang mengembalikan baris yang benar saat kamu tes sebagai dirimu sendiri. Tidak satu pun dari itu membuktikan kuncinya bekerja. Layar bisa menyembunyikan satu tombol sementara aksi di baliknya tetap terbuka lebar. Database bisa mengembalikan baris milikmu dengan benar dan tetap mengembalikan baris milik semua orang lain kepada siapa saja yang memintanya lewat nomor. Di domain inilah jurang antara "tadi jalan kok pas aku coba" dan "ini beneran terkunci" paling lebar, dan jurang itu yang tidak bisa dilihat oleh seorang non-coder dari luar.

## Yang tidak terlihat di sini

Kamu login, kamu lihat dashboard-mu sendiri, order-mu sendiri, profilmu sendiri. Semuanya cocok. Yang tidak bisa kamu lihat adalah apa yang dilihat orang asing, karena kamu tidak pernah jadi orang asing itu. Kamu menguji aplikasi sebagai pemiliknya, dan pemilik punya semua kunci, jadi setiap pintu terbuka. Pertanyaan yang penting justru yang tidak bisa kamu jalankan dari kursimu sendiri: apa yang terjadi kalau seseorang yang bukan kamu, atau seorang user biasa yang berpura-pura jadi admin, mengetuk pintu yang sama secara langsung.

Ada dua titik buta spesifik yang mendominasi di sini, dan keduanya tidak kelihatan dari jalur normal (happy path).

Yang pertama adalah **IDOR**, singkatan dari Insecure Direct Object Reference (referensi objek langsung yang tidak diamankan). Sederhananya: aplikasimu menampilkan invoice-mu di alamat seperti `/invoice/1041`, lalu orang asing tinggal mengubah angkanya jadi `/invoice/1042` dan membaca invoice milik orang lain. Halaman itu terlihat aman sempurna bagimu karena nomormu mengembalikan datamu. Kuncinya tidak pernah ada di pintu; kuncinya ada di menu. Kamu cuma melihat menunya.

Yang kedua adalah **secret di tempat yang salah**. Sebuah AI tool, saat menyambungkan aplikasimu ke database atau ke penyedia pembayaran, kadang menanam kunci yang sangat berkuasa langsung ke bagian aplikasi yang dikirim ke browser pengunjung, tempat siapa pun bisa membacanya dengan membuka developer tools. Dengan kunci itu, orang asing tidak perlu membobol kuncimu. Mereka memegang salinan kunci induknya. Sebuah pemindaian (scan) produksi atas 5.600 aplikasi yang dibangun dengan AI tool menemukan lebih dari 400 secret terekspos di publik, ditambah lebih dari 2.000 kerentanan dan 175 kebocoran data pribadi, dan para pemindai menyebut angka itu sebagai batas bawah karena mereka hanya melihat apa yang terjangkau tanpa login (Escape.tech, 29 Oktober 2025). Kuncinya tidak disembunyikan. Kuncinya ada di etalase depan.

Ada alasan terukur kenapa kelas masalah ini yang lolos. Ketika berbagai tool diuji pada tugas-tugas realistis, mereka kebanyakan sudah belajar menghindari bug injeksi yang ada di buku teks, tapi mereka terus gagal pada masalah authorization dan logika bisnis, yaitu masalah yang butuh pemahaman tentang siapa yang boleh melakukan apa di aplikasi spesifikmu (penilaian Tenzai, dilaporkan Januari 2026; SUSVIBES, Zhao dkk., arXiv:2512.03262). Authorization persis jenis aturan yang tidak punya jawaban umum yang bisa disalin oleh model. Aturannya bergantung pada gagasan aplikasimu soal "milikku" dan "milik mereka", dan bagian itulah yang ditebak-tebak oleh model serta bagian yang tidak bisa kamu cek hanya dengan klik-klik sebagai dirimu sendiri.

## Kapan ini penting (sinyal stakes)

Domain ini adalah permukaan akses-dan-identitas aplikasimu, jadi begitu aplikasimu punya login apa pun, sinyal yang menggerakkan domain ini sudah hadir. Itu membuat tier floor untuk domain ini tidak bisa ditawar untuk hampir setiap aplikasi nyata, dan mendorong kedalamannya naik dengan cepat.

- **S2 Identity/Auth** (login, sesi, reset password, peran) adalah sinyal penentu di sini. Kalau aplikasimu punya salah satu dari ini, domain ini jalan minimal di tier STANDARD. Memastikan kuncinya beneran tegak adalah baseline tim kompeten begitu sebuah kunci ada.
- **S3 Data pribadi** (aplikasi menyimpan data pribadi: email, nomor HP, nama, detail kesehatan, pesan privat) di permukaan ini, digabung dengan sinyal login di atas, mendorong domain ini ke EXTRA-MILE. Kontrol akses yang gagal saat sedang menjaga data orang sungguhan adalah perbedaan antara sebuah bug dan sebuah notifikasi kebocoran data.
- **S5 Radius dampak** (banyak user, beberapa pelanggan terpisah berbagi satu sistem, sebuah API publik) digabung dengan sinyal login mendorong domain ini ke EXTRA-MILE. Sebuah lubang akses di sistem bersama multi-pelanggan membocorkan semua orang sekaligus, bukan cuma satu akun.
- **S6 Ketidakterbalikan** (sebuah aksi di sini tidak bisa dibatalkan: hapus, transfer, publikasikan) menaikkan taruhan dari hilangnya satu cek authorization, karena orang yang salah melakukan aksi yang salah tidak menyisakan jalan kembali.

Ada satu override keras yang berada di atas hitungan jumlah sinyal. **Kalau sebuah AI agent di aplikasimu bisa mengambil aksi sendiri tanpa manusia menyetujui tiap aksinya (S4), domain ini dipaksa ke EXTRA-MILE terlepas dari apa pun yang lain.** Sebuah agent otonom berjalan dengan akses apa pun yang diberikan kepadanya, dan kalau akses itu terlalu luas atau kunci-kuncinya terjangkau, agent yang ditipu atau bingung akan bertindak atasnya sebelum siapa pun sempat campur tangan. Untuk aplikasi dengan agent otonom, pemeriksaan extra-mile di bawah ini wajib, bukan opsional.

Kalau aplikasimu benar-benar tidak punya login, tidak punya peran, tidak punya data pribadi, dan tidak punya agent yang bertindak sendiri, maka tidak banyak akses yang perlu dikontrol, dan domain ini menciut ke tier floor saja: jauhkan kunci-kuncimu dari browser dan dari riwayat kode (code history) kamu, dan pastikan tidak ada yang sensitif terjangkau tanpa sebuah pemeriksaan. Jangan bangun benteng perizinan di sekeliling aplikasi yang tidak punya apa pun untuk diizinkan.

## Pemeriksaan floor

Jangan pernah lewati ini, di aplikasi mana pun yang memegang sebuah kunci atau punya satu saja hal yang dilindungi.

| Cek | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agent | Sitasi |
|---|---|---|---|
| Daftar setiap secret yang dipakai aplikasi (kunci database, kunci penyedia pembayaran, token API, secret penandatangan) dan, untuk masing-masing, sebutkan persis di mana ia berada. Pastikan tidak satu pun dari semua itu muncul di kode yang dikirim ke browser, di variabel berawalan `NEXT_PUBLIC_`, atau di mana pun dalam riwayat kode yang sudah di-commit. | Secret di browser adalah secret di publik. Siapa pun yang membuka halaman bisa menyalin kunci database-mu lalu membaca atau menghapus datamu tanpa membobol satu kunci pun, dan kunci yang sudah ter-commit ke riwayat kode tetap bisa dibaca bahkan setelah kamu menghapusnya dari versi terbaru. Ini cara paling umum sebuah aplikasi buatan AI bocor. | Inventaris secret: setiap secret yang dipakai aplikasi, lokasinya, dan vonis per-secret berupa "hanya server-side" atau "TEREKSPOS" (di bundle klien, di variabel publik, atau di riwayat git), dengan yang terekspos ditandai untuk segera dirotasi (diganti). | Supabase production essentials (kunci service_role tidak pernah di sisi klien); OWASP Top 10:2025 A07 Authentication Failures |
| Pastikan database punya Row Level Security menyala untuk setiap tabel yang menyimpan data, dan ada aturan default-deny sehingga tabel tanpa kebijakan eksplisit mengembalikan kosong, bukan mengembalikan segalanya. Row Level Security (RLS) adalah fitur database yang membatasi tiap baris hanya untuk user yang memilikinya. | Tanpa RLS menyala, database-mu memercayai aplikasi untuk berhati-hati, dan satu cek yang terlewat di mana saja berarti database menyerahkan setiap baris di tabel kepada siapa pun yang sudah login (atau pada kasus terburuk, kepada siapa saja). Menyalakan RLS membuat database itu sendiri menolak membocorkan, bahkan ketika kode aplikasi keceplosan. Satu tabel yang dibiarkan tanpanya adalah satu laci terbuka di lemari yang terkunci. | Tabel cakupan RLS: setiap tabel di skema yang terekspos didaftar, masing-masing ditandai RLS-menyala atau RLS-MATI, dengan yang mati ditandai, plus konfirmasi bahwa tabel tanpa kebijakan menolak secara default. | Supabase Row Level Security docs (nyalakan RLS di semua tabel pada skema yang terekspos) |
| Pilih record yang dimiliki seorang user (order mereka, profil mereka, file mereka) dan pastikan aplikasi mengecek kepemilikan di server sebelum mengembalikan atau mengubah satu record, sehingga mengganti ID di alamat web jadi nomor milik orang lain ditolak. Ini cek IDOR. | Inilah lubang "ganti nomornya lalu baca invoice orang asing" yang dinyatakan terus terang. Kalau satu-satunya yang berdiri antara seorang pelanggan dan record milik semua orang lain adalah nomor mana yang dia ketik, kamu tidak punya kunci, kamu punya saran. Menangkap ini di tier floor yang menjaga seorang user penasaran agar tidak berubah jadi pencuri data tanpa sengaja. | Hasil cek-kepemilikan: untuk tiap jenis record milik user, lokasi sisi server persisnya tempat kepemilikan diverifikasi, atau penanda bahwa record bisa dijangkau lewat ID tanpa cek kepemilikan (lubang IDOR yang hidup). | OWASP Top 10:2025 A01 Broken Access Control (termasuk IDOR); OWASP API Security Top 10 2023 API1 Broken Object Level Authorization (BOLA) |
| Pastikan halaman dan aksi yang dilindungi benar-benar mensyaratkan login yang sah di server, bukan sekadar pengalihan (redirect) di browser, dan cek sesi tidak bisa dilompati dengan memanggil alamat di baliknya secara langsung. | Tembok login yang ditegakkan hanya oleh browser adalah tembok dengan pintu di sisinya. Kalau halaman mengalihkan pengunjung yang belum login tapi alamat pemuat-data di baliknya menjawab siapa saja, tembok itu cuma hiasan. Server, bukan layar, yang harus jadi hal yang berkata tidak. | Peta rute-terlindungi: tiap halaman atau aksi yang dilindungi, dan bukti server menolak permintaan tanpa login kepadanya, atau penanda di mana hanya browser yang memblokir akses. | OWASP Top 10:2025 A07 Authentication Failures; OWASP API Security Top 10 2023 API2 Broken Authentication |

## Pemeriksaan standard

Tim yang kompeten melakukan ini. Jalankan di permukaan domain ini ketika aplikasimu punya login, peran, atau data terlindungi apa pun, sesuai sinyal stakes di atas.

| Cek | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agent | Sitasi |
|---|---|---|---|
| Susun peta authorization: daftar setiap aksi dan potongan data yang dilindungi, aturan peran atau kepemilikan yang seharusnya mengaturnya, dan lokasi sisi server persisnya tempat aturan itu ditegakkan. Lalu cari celah tempat aturan diandaikan tapi tidak pernah ditulis. | Inilah peta yang tidak bisa kamu gambar dengan klik-klik, dan inilah yang menangkap lubang-lubangnya. Kegagalan authorization adalah kelas dominan yang ditinggalkan AI tool, justru karena aturannya hidup di kepalamu, bukan di standar mana pun yang bisa disalin model. Menuliskan petanya adalah cara sebuah aturan yang diandaikan tapi tak pernah dikode jadi terlihat sebelum orang asing menemukannya untukmu. | Peta authorization (tingkat objek dan tingkat fungsi): setiap aksi dan tipe data yang dilindungi, aturan yang dimaksudkan, lokasi server yang menegakkannya, dan baris mana pun yang tidak ada penegakannya, ditandai. | OWASP API Security Top 10 2023 API1 BOLA dan API5 Broken Function Level Authorization (BFLA); OWASP ASVS 5.0.0 Level 2 (persyaratan authorization, disitasi pada level dokumen) |
| Pastikan aksi khusus-admin tidak bisa dilakukan oleh user biasa yang memanggilnya langsung. Temukan tiap aksi istimewa (hapus user mana pun, ubah peran siapa pun, refund, ekspor semua data) dan verifikasi server mengecek peran si pemanggil, bukan cuma bahwa layar admin menyembunyikan tombol dari non-admin. | Menyembunyikan tombol admin dari user biasa tidak ada gunanya kalau aksi di baliknya menjawab siapa pun yang memanggil. Begini cara akun biasa diam-diam menaikkan dirinya sendiri atau menghapus orang lain: gerbangnya ada di menu, bukan di aksi. Untuk aplikasi apa pun yang punya peran, ini cek antara "khusus staf" dan "siapa saja yang tahu alamatnya". | Daftar aksi-istimewa: tiap aksi khusus-admin, cek peran sisi server yang menjaganya beserta lokasinya, atau penanda bahwa aksi berjalan tanpa cek peran (lubang authorization tingkat fungsi yang hidup). | OWASP API Security Top 10 2023 API5 Broken Function Level Authorization (BFLA); OWASP Top 10:2025 A01 Broken Access Control |
| Periksa kebijakan RLS itu sendiri soal kewarasannya, bukan cuma bahwa kebijakannya ada: pastikan tidak ada kebijakan yang memutuskan akses memakai data yang bisa user ubah tentang dirinya sendiri (seperti kolom peran yang dia set sendiri), dan kebijakannya cocok dengan aturan kepemilikan di peta authorization. | Kebijakan RLS yang memercayai nilai yang dikendalikan user adalah kunci yang boleh dipotong-ulang sendiri oleh user. Kalau "apakah kamu admin" dibaca dari kolom yang bisa user sunting, user biasa menyuntingnya dan database membiarkannya masuk, percaya pada kebijakannya. Kebijakan yang ada tapi memercayai input yang salah lebih buruk daripada yang jelas-jelas tidak ada, karena ia kelihatan beres. | Tinjauan kewarasan-kebijakan: tiap kebijakan RLS, input yang jadi dasar keputusannya, vonis apakah input itu bisa dikendalikan user, dan kebijakan mana pun yang memercayai data dari user ditandai. | Supabase Row Level Security docs (jangan percaya metadata dari user di dalam kebijakan); OWASP Top 10:2025 A01 Broken Access Control |
| Verifikasi penanganan sesi dan kredensial tegak: sesi kedaluwarsa dan bisa dicabut, reset password tidak bisa dipakai untuk mengambil alih akun, dan login tahan terhadap tebakan otomatis lewat rate limit (batasi jumlah percobaan per user/IP dalam rentang waktu) atau penguncian. | Login yang tidak pernah melupakan sesi, atau alur reset password yang bisa diarahkan orang asing ke email orang lain, adalah pintu depan dengan grendel rusak. Pengambilalihan lewat alur reset dan tebakan password tanpa batas adalah cara akun jatuh tanpa serangan eksotis apa pun. Penanganan sesi dan reset yang waras adalah perbedaan antara "mereka butuh password" dan "mereka butuh kesabaran". | Laporan sesi-dan-kredensial: bagaimana sesi kedaluwarsa dan dicabut, bagaimana alur reset mengikat reset ke pemilik aslinya, dan apa yang membatasi percobaan login berulang, dengan kontrol mana pun yang hilang ditandai. | OWASP Top 10:2025 A07 Authentication Failures; OWASP ASVS 5.0.0 Level 2 (persyaratan authentication dan sesi, disitasi pada level dokumen) |

## Pemeriksaan extra-mile

Ketelitian garis depan. Bahkan tim engineering yang kuat memperlakukan ini sebagai usaha tambahan dan diperpanjang. Jalankan di permukaan domain ini hanya ketika gerbang stakes memaksanya, sesuai catatan.

| Cek | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agent | Sitasi | Gerbang stakes + pola garis depan |
|---|---|---|---|---|
| Jalankan red-team authorization yang disengaja: untuk tiap record dan aksi yang dilindungi, betul-betul coba akses sebagai user yang salah dan sebagai user dengan hak lebih rendah, lalu catat apa yang dikembalikan server. Uji batas-batasnya (satu ID di atas dan di bawah milikmu, ID pelanggan lain, aksi admin dari akun biasa), bukan menalarnya saja. | Membaca kode memberitahumu apa yang seharusnya dilakukan kunci. Mencoba pintunya memberitahumu apa yang sebenarnya dilakukan kunci, dan pada sistem yang memegang data banyak orang, perbedaannya adalah kebocoran yang kamu temukan versus kebocoran yang orang asing temukan. Log percobaan-akses adalah bukti kuncinya diuji terhadap langkah lawan sungguhan, bukan cuma dibaca. | Log percobaan-akses: tiap target yang dilindungi, permintaan yang dibuat sebagai user tak berwenang atau berhak lebih rendah, respons sebenarnya dari server, dan tiap kasus di mana data atau aksi terlarang berhasil kembali, ditandai sebagai lubang yang terkonfirmasi. | OWASP API Security Top 10 2023 API1 BOLA, API5 BFLA; OWASP ASVS 5.0.0 Level 3 (disitasi pada level dokumen) | Dipaksa oleh S3 (data pribadi) atau S5 (radius dampak) di permukaan ini. Pola garis depan: pen-test authorization adversarial. |
| Batasi akses database aplikasi ke hak paling minim (least privilege): pastikan aplikasi tersambung dengan peran database paling sempit yang masih bekerja, kunci yang sangat berkuasa hanya dipakai di tugas server tepercaya yang sungguh memerlukannya (tidak pernah di penangan permintaan yang melayani user), dan agent otonom di-sandbox (dikurung) sehingga tidak bisa menjangkau kunci induk atau bertindak di luar himpunan izin yang dibatasi. Least privilege artinya memberi tiap bagian hanya kuasa minimum yang ia butuhkan. | Kalau setiap bagian aplikasimu berjalan dengan kunci induk, maka satu lubang tunggal di mana saja menjadi kebocoran total, dan agent mana pun yang tertipu bertindak dengan kuasa tanpa batas. Mempersempit akses tiap bagian mengubah yang tadinya bencana menjadi insiden yang terkurung. Untuk aplikasi tempat sebuah agent bertindak sendiri, ini tembok antara "agent salah tingkah" dan "agent mengosongkan database". | Peta hak akses: tiap komponen dan peran database atau kunci yang ia pakai, vonis bahwa masing-masing memakai hak paling minim yang bekerja, tempat-tempat spesifik kunci induk dipanggil, dan, kalau ada agent bertindak otonom, sandbox serta batas izin yang mengurungnya, dengan komponen berhak-berlebih ditandai. | Supabase production essentials (lingkup kunci service_role); OWASP Top 10:2025 A01 Broken Access Control | Dipaksa oleh S4 (agent otonom), yang mewajibkan sandboxing dan least-privilege di domain ini. Pola garis depan: least-privilege dan sandboxing agent. |
| Tambahkan red-team prompt injection terhadap agent apa pun yang memegang akses di aplikasimu: sengaja suapi ia instruksi tersembunyi (di input user, di data yang ia baca, di dokumen yang ia proses) yang mencoba membuatnya membocorkan secret atau memakai aksesnya untuk sesuatu yang tidak seharusnya, lalu pastikan ada kontrol yang menghentikan tiap percobaan. Prompt injection adalah ketika teks yang dibaca agent menyelundupkan instruksi yang membajak apa yang ia lakukan. | Agent otonom yang punya akses adalah jenis orang dalam yang baru, dan orang asing bisa membisikinya lewat teks apa pun yang ia baca. Kalau instruksi tersembunyi di sebuah file yang diunggah bisa membujuk agent-mu menyerahkan kunci atau menghapus record, kamu sudah memberi penyerang kuasa agent-mu. Mencoba triknya sendiri lebih dulu, di atas kertas dan dalam praktik, adalah satu-satunya cara tahu agent menolaknya. | Log percobaan-injeksi: instruksi tersembunyi yang dicobakan ke agent, akses yang masing-masing coba salahgunakan, perilaku sebenarnya dari agent, dan kontrol yang memblokir atau gagal memblokir masing-masing, dengan tiap pembajakan yang berhasil ditandai sebagai risiko sisa. | OWASP Top 10 for LLM Applications 2025 LLM01 Prompt Injection dan LLM06 Excessive Agency; OWASP Top 10:2025 A01 Broken Access Control | Dipaksa oleh S4 (agent otonom), yang mewajibkan red-team prompt injection di domain ini. Pola garis depan: red-team prompt injection. |

## Kapan berhenti dan menyewa manusia

Datangkan peninjau manusia independen untuk domain ini ketika salah satu dari ini benar:

- Peta authorization atau log percobaan-akses menunjukkan kasus di mana user yang salah menjangkau data atau aksi yang tidak seharusnya, dan kamu tidak bisa menjelaskan sepenuhnya kenapa atau memastikan perbaikannya sudah menutupnya. Lubang akses yang terkonfirmasi pada sistem yang memegang data orang sungguhan bukan tempat untuk menebak-nebak menuju "kayaknya sudah beres".
- Aplikasimu menyimpan data pribadi dan melayani banyak user atau beberapa pelanggan terpisah (S3 dengan S5), dan kamu tidak bisa menghasilkan peta authorization yang bersih dan lengkap dengan lokasi penegakan sisi server untuk tiap hal yang dilindungi. Kontrol akses yang tidak bisa kamu pertanggungjawabkan sepenuhnya, pada sistem bersama, adalah kebocoran yang menanti pengunjung penasaran pertama.
- Sebuah AI agent di aplikasimu bisa bertindak sendiri (S4) dan kamu tidak bisa menunjukkan ia berjalan dengan least privilege, di-sandbox jauh dari kunci induk, dan selamat dari percobaan prompt injection. Agent dengan akses luas dan tanpa pengurungan yang terbukti tidak boleh berjalan tanpa ditinjau.
- Sebuah aksi istimewa yang tidak bisa dibatalkan (S6 digabung dengan peran) bisa dipicu tanpa cek peran sisi server yang bisa kamu tunjuk. Aksi permanen yang terjangkau oleh orang yang salah layak mendapat lulus-uji manusia sebelum diluncurkan.

Protokol ini menangkap sepotong berarti dari masalah akses dan secret dengan murah, dan ia adalah pemeriksaan pertama yang tepat untuk hampir setiap aplikasi. Ini bukan jaminan, dan AI yang memeriksa AI lebih lemah daripada tinjauan manusia independen persis pada logika authorization yang paling penting di sini, karena logika itu spesifik untuk aplikasimu dan tidak punya jawaban umum untuk disalin. Domain K membahas apa yang ditambahkan tinjauan profesional dan di mana batas jujurnya berada. Untuk aplikasi yang membawa taruhan nyata di domain ini, arahkan ke sana.

## Instruksi agent

```
DOMAIN B: SECRET, AKSES, RLS, IDOR, AUTH

Tentukan cakupan berdasar stakes (stakes bersifat lokal pada permukaan domain ini):
  Kalau aplikasi punya login, sesi, peran, atau data terlindungi apa pun (S2), jalankan STANDARD di sini.
  Kalau S2 bergabung dengan S3 (data pribadi) atau S5 (radius dampak) di permukaan ini, jalankan EXTRA-MILE.
  OVERRIDE KERAS: kalau sebuah AI agent bisa bertindak sendiri (S4), jalankan EXTRA-MILE di sini terlepas dari
  hitungan jumlah sinyal, dan cek least-privilege/sandboxing serta red-team prompt injection
  WAJIB, bukan opsional.
  Kalau aplikasi tidak punya login, tidak punya peran, tidak punya data pribadi, dan tidak punya agent otonom, jalankan FLOOR saja:
  jauhkan secret dari browser dan git, pastikan default-deny, jangan bangun mesin perizinan
  untuk aplikasi yang tidak punya apa pun untuk diizinkan.

Catatan sirkularitas (lihat protokol circularity-guard):
  Authorization adalah tempat self-audit dalam konteks yang sama paling lemah. Agent yang menulis aturan
  akses "tahu siapa pemilik yang dimaksudkan" dan membaca kode sebagai pembenarannya, alih-alih menyerangnya
  seperti yang dilakukan orang asing. Jalankan domain ini dalam konteks BERSIH yang segar tanpa akses ke
  rasionalisasi build, dan utamakan model yang berbeda dari yang menulis kode. Perlakukan tiap record
  dan aksi sebagai sesuatu untuk dijangkau dari akun yang SEHARUSNYA TIDAK menjangkaunya.

Hasilkan artefak ini (bukan vonis):
  FLOOR:
    1. Inventaris secret: setiap secret, lokasinya, "hanya server-side" atau "TEREKSPOS" (bundle
       klien / NEXT_PUBLIC_ / riwayat git), yang terekspos ditandai untuk dirotasi.
    2. Tabel cakupan RLS: setiap tabel di skema yang terekspos, RLS-menyala atau RLS-MATI, default-deny
       terkonfirmasi, tabel yang mati ditandai.
    3. Hasil cek-kepemilikan: per tipe record milik user, lokasi server yang memverifikasi kepemilikan,
       atau penanda bahwa ia terjangkau lewat ID tanpa cek (lubang IDOR yang hidup).
    4. Peta rute-terlindungi: tiap halaman/aksi yang dilindungi, bukti SERVER menolak permintaan
       tanpa login, atau penanda di mana hanya browser yang memblokirnya.
  STANDARD (login / peran / data terlindungi):
    5. Peta authorization (tingkat objek + tingkat fungsi): setiap aksi dan tipe data yang dilindungi,
       aturan yang dimaksudkan, lokasi server yang menegakkannya, celah ditandai.
    6. Daftar aksi-istimewa: tiap aksi khusus-admin, cek peran sisi server beserta lokasinya,
       atau penanda bahwa ia berjalan tanpa cek peran.
    7. Tinjauan kewarasan-kebijakan: tiap kebijakan RLS, input yang jadi dasar keputusannya, apakah input itu
       bisa dikendalikan user, kebijakan yang memercayai data user ditandai.
    8. Laporan sesi-dan-kredensial: kedaluwarsa/pencabutan sesi, pengikatan-pemilik pada alur reset, rate
       limit/penguncian login, kontrol yang hilang ditandai.
  EXTRA-MILE (data pribadi + skala, atau agent otonom):
    9. Log percobaan-akses: tiap target dilindungi yang dicoba sebagai user salah/berhak lebih rendah,
       respons sebenarnya dari server, kasus data-terlarang-kembali ditandai sebagai lubang terkonfirmasi.
    10. Peta hak akses: tiap komponen dan peran/kunci DB yang ia pakai, vonis least-privilege, tempat
        kunci induk dipanggil, dan (kalau S4) sandbox serta batas izin agent;
        komponen berhak-berlebih ditandai.
    11. Log percobaan-injeksi (kalau S4): instruksi tersembunyi yang dicobakan ke agent, akses yang
        masing-masing tuju, perilaku sebenarnya dari agent, kontrol yang memblokir, pembajakan berhasil ditandai.

Keluarkan tabel temuan dengan kolom-kolom ini dan tidak ada yang lebih lemah dari bukti:
  | Severity | Risiko bisnis dalam bahasa awam | Artefak bukti | Sitasi | Saran perbaikan |

Aturan:
  - Terjemahkan tiap temuan jadi konsekuensi bisnis konkret yang dipahami non-coder
    (misalnya: "orang asing bisa membuka invoice pelanggan lain mana pun dengan mengganti nomor di
    address bar," bukan "ada IDOR").
  - Sitasi hanya kontrol yang disebut di domain ini (A01, A07, API1, API2, API5, API6, LLM01, LLM06,
    Supabase RLS dan production essentials, ASVS pada level dokumen). Jangan mengarang ID dan jangan
    cetak nomor V ASVS di luar V1 1.2.5.
  - Tidak ada vonis telanjang. "Kelihatan aman" bukan temuan. Lampirkan artefak yang membuktikan klaim;
    vonis yang kelihatan yakin tanpa bukti memproduksi kepercayaan palsu.
  - Kalau kamu tidak bisa menghasilkan artefak yang dituntut sebuah cek, katakan demikian dan tandai cek itu BELUM LENGKAP.
```

# Kenapa NONA Ada

Kamu membangun sebuah aplikasi pakai AI coding tool. Aplikasinya jalan. Pelangganmu bisa memakainya. Lalu kenapa harus diaudit sama sekali?

Karena "jalan" dan "aman" ternyata hampir tidak ada hubungannya, dan jarak di antara keduanya itulah tempat uang, data, dan kepercayaan bocor keluar. Halaman ini adalah buktinya. Ini bukan promosi jualan. Ini tur singkat soal apa yang diukur para peneliti dan perusahaan keamanan ketika mereka memeriksa kode buatan AI pada 2025 dan 2026, dan apa yang secara jujur dibuktikan dan tidak dibuktikan oleh pengukuran itu.

Baca sekali saja. Inilah alasan setiap pemeriksaan dalam audit ini ada, sekaligus alasan audit ini menolak menjanjikan lebih dari yang bisa diberikannya.

Sedikit catatan soal cara membaca angka-angkanya. Sebagian angka di bawah berasal dari studi akademis independen. Sebagian lagi berasal dari vendor keamanan komersial, yang punya kepentingan bisnis untuk membuat situasi terdengar mengkhawatirkan. Kami beri tahu kamu mana yang mana, setiap kali, dan kami bersandar pada karya independen untuk klaim apa pun yang mungkin dibantah orang yang skeptis. Kami juga akan memandu kamu melewati satu angka yang kelihatannya seperti kontradiksi padahal bukan, karena memahami kenapa itu bukan kontradiksi adalah pembeda antara alat yang jujur dan judul berita yang menakut-nakuti.

## Apa yang sebenarnya ikut terkirim bersama kode buatan AI

### Jarak antara "jalan" dan "aman"

Bukti yang paling bersih datang dari sebuah studi bernama SUSVIBES. Para peneliti membangun benchmark berisi 200 tugas nyata di tingkat repository, diambil dari perbaikan bug historis yang betul-betul terjadi di 77 jenis kelemahan berbeda, dengan kira-kira 180 baris kode yang diubah di beberapa file untuk tiap tugasnya. Ini bukan teka-teki mainan. Ini jenis permintaan fitur yang biasa kamu berikan ke sebuah AI tool. Lalu mereka menyuruh sebuah AI agent yang mumpuni, dipasangkan dengan frontier model (model AI terdepan), menyelesaikan tiap tugas, dan mereka mengecek hasilnya dengan dua cara: apakah jalan, dan apakah aman.

Hasilnya: kode itu 61 persen benar secara fungsional dan cuma 10,5 persen aman.

Coba renungkan jarak antara kedua angka itu. Hal yang bisa kamu lihat sebagai orang non-coder, yaitu fiturnya jalan, ternyata benar di sebagian besar kasus. Hal yang tidak bisa kamu lihat, yaitu kode itu dibangun tanpa lubang keamanan, ternyata hampir tidak pernah benar. Sinyal "jalan" yang secara naluri kamu andalkan nyaris tidak berguna sebagai sinyal keamanan. Para peneliti mengukur keduanya dan menemukan keduanya hampir terputus satu sama lain.

Studi itu mencoba solusi yang paling jelas. Para peneliti menambahkan petunjuk keamanan ke dalam permintaan, menyuruh si AI untuk waspada terhadap kerentanan, dan angka keamanannya tidak bergerak. Ini penting untuk memahami bagaimana sebuah audit harus bekerja. Menyuruh AI agent "hati-hati ya, bikin yang aman" tidak membuat kodenya aman. Instruksi yang samar bukan sebuah kontrol. Yang berhasil hanyalah pemeriksaan yang terstruktur dan spesifik, yang memaksa si agent menghasilkan bukti, dan itulah persis audit ini. (Zhao dkk., SUSVIBES, arXiv:2512.03262, 2 Desember 2025.)

### Angka industri yang besar, dilabeli sebagai studi vendor

Perusahaan keamanan Veracode menjalankan kode buatan AI lewat pengujian mereka sendiri di lebih dari 100 model dan lebih dari 80 tugas coding. Mereka melaporkan bahwa 45 persen sampelnya memunculkan sebuah kelemahan web yang sudah dikenal dari daftar standar industri, dan bahwa kode tulisan AI membawa 2,74 kali lebih banyak kerentanan dibanding kode tulisan manusia.

Temuan yang paling menentukan dalam laporan itu justru sesuatu yang lebih halus daripada angka 45 persen itu sendiri. Tingkat kegagalannya tetap datar tanpa peduli ukuran atau kecanggihan model. Model terbaru dan terbesar pun tidak lebih aman secara berarti dibanding yang lebih lama. Kalau tingkat ketidakamanan turun setiap kali model yang lebih baik dirilis, kamu bisa menunggu masalahnya selesai sendiri. Nyatanya tidak. Masalah ini tertanam di cara kerja alat-alat ini, dan rilis model baru meninggalkannya di tempat semula. Tingkat kegagalan spesifiknya mencolok di beberapa titik: laporan itu menaruh kegagalan cross-site scripting (XSS, script jahat yang nyusup lewat input dan jalan di browser korban) sekitar 86 persen dan kegagalan log-injection sekitar 88 persen, dengan Java sebagai bahasa terburuk di sekitar 72 persen.

Label jujurnya: Veracode adalah vendor keamanan komersial, dan vendor yang menjual alat keamanan punya insentif untuk melaporkan angka yang mengkhawatirkan. Perlakukan angka 45 persen itu sebagai angka vendor. Ia layak ada di sini hanya karena ia menunjuk ke arah yang sama dengan karya akademis independen di atas dan di bawah. Bukan vendor yang mengatakannya yang jadi alasan untuk mempercayainya; kecocokannya dengan studi-studi netral itulah alasannya. (Veracode, "2025 GenAI Code Security Report," 30 Juli 2025.)

### Ini sudah terjadi pada aplikasi nyata yang sudah dirilis

Dua studi di atas adalah pengukuran di laboratorium. Yang berikut ini adalah hitungan di lapangan. Perusahaan keamanan Escape.tech menjalankan pemindaian pasif terhadap 5.600 aplikasi yang bisa diakses publik dan dibangun pakai AI tool, lalu menemukan lebih dari 2.000 kerentanan, lebih dari 400 secret yang terekspos seperti API key dan access token (kunci dan token yang dipakai aplikasi untuk masuk ke layanan lain), dan 175 kasus data pribadi yang bocor, termasuk rekam medis dan nomor rekening bank.

Ada dua hal yang membuat angka ini lebih buruk daripada kesan awalnya. Pertama, pemindaiannya bersifat pasif dan tidak merusak, artinya ia cuma melihat apa yang bisa dijangkau dari luar tanpa membobol apa pun. Total sebenarnya pasti lebih tinggi. Angka-angka ini adalah hitungan batas-bawah, sebuah lantai di bawah angka yang sesungguhnya. Kedua, sebagian besar kelemahan itu berada di endpoint publik tanpa perlu login, jadi orang asing tidak perlu pintar atau jadi pelanggan dulu untuk menjangkaunya.

Label jujurnya: Escape.tech juga vendor keamanan komersial. Kehati-hatian yang sama berlaku seperti di atas. Nilai angka ini adalah ia menghitung aplikasi yang betul-betul hidup dan sudah dirilis, bukan tugas laboratorium, jadi ia menjawab pertanyaan "apakah ini masalah dunia nyata atau cuma teoretis?" dengan sebuah angka. (Escape.tech, 29 Oktober 2025.)

## Angka yang kelihatan seperti kontradiksi, padahal bukan

Kalau kamu mencari, kamu akan menemukan satu angka yang jauh lebih kalem, dan kamu pantas mendapat penjelasannya alih-alih disembunyikan.

Sebuah pemindaian akademis independen berskala besar oleh Schreiber dan Tippe menjalankan 7.703 file buatan AI lewat analisis otomatis dan menemukan bahwa 87,9 persen tidak punya kelemahan terpetakan sama sekali, dan cuma 12,1 persen punya setidaknya satu. Dua belas persen itu jauh dari empat puluh lima persen, dan lebih jauh lagi dari angka 89,5 persen tidak aman yang tersirat dari SUSVIBES. Jadi mana yang benar?

Ketiganya benar. Alasan mereka berbeda adalah desain pengukurannya, dan begitu kamu melihatnya, kontradiksi yang kelihatan itu pun lenyap.

- Angka 12,1 persen menghitung file biasa dari segala jenis, dicampur jadi satu: yang sederhana, yang rumit, yang berhubungan dengan keamanan, dan yang tidak ada hubungannya dengan keamanan. Sebagian besar kode di aplikasi mana pun adalah pipa-pipa yang tidak menyentuh apa pun yang sensitif. Rata-ratakan semuanya dan angkanya kelihatan rendah.
- Angka 45 persen (Veracode) dan angka 10,5-persen-aman (SUSVIBES) berasal dari tugas-tugas yang dikurasi dan relevan dengan keamanan, yaitu bagian-bagian aplikasi tempat sebuah kesalahan betul-betul merugikanmu. Pusatkan perhatian pada permukaan-permukaan yang berbahaya dan angkanya kelihatan tinggi.

Keduanya adalah gambaran jujur tentang hal yang berbeda. Angka 12,1 persen adalah tingkat di seluruh kode secara umum. Angka 45 persen dan 10,5 persen adalah tingkat di permukaan-permukaan yang menangani uangmu, login-mu, dan data pelangganmu. Audit ini menyasar tepat permukaan-permukaan itu. Jadi angka-angka yang tinggi itulah yang menggambarkan wilayah yang dimasuki audit ini, dan angka 12,1 persen yang menenangkan itu sebagian besar menggambarkan pipa-pipa yang bisa dilewati audit ini dengan aman tanpa menggali dalam.

Aturan yang kami pegang untuk diri kami sendiri: sajikan angka 10,5 persen, 12,1 persen, dan 45 persen bersama-sama, dengan catatan ini menempel, setiap kali. Mengutip yang paling menakutkan sendirian, dilucuti dari konteksnya, sama saja dengan klaim berlebih yang justru ingin ditangkap audit ini di pekerjaan orang lain. (Schreiber dan Tippe, arXiv:2510.26103, 30 Oktober 2025.)

## Kenapa si pembangun terlalu percaya pada hasilnya

Angka-angka di atas menggambarkan kodenya. Dua angka berikut menggambarkan kamu, manusia yang melihatnya, dan inilah alasan pemeriksaan sendiri saja tidak cukup.

### Rasa aman yang palsu

Dalam sebuah studi terkontrol yang sudah ditelaah sejawat (peer-reviewed), para peneliti memberi satu kelompok orang sebuah AI coding assistant dan kelompok lain tidak diberi apa-apa, lalu menyuruh keduanya menulis kode. Kelompok yang punya AI assistant menulis kode yang kurang aman. Bagian itu mungkin sudah kamu duga dari semua yang di atas. Bagian yang seharusnya membuatmu waspada adalah paruh keduanya: kelompok yang punya AI assistant juga lebih cenderung yakin bahwa kode mereka aman.

Inilah kunci dari seluruh premis ini. Bahayanya lebih dalam daripada sekadar kode berbantuan AI yang punya lebih banyak lubang. Orang yang merilisnya merasa lebih percaya diri padahal kodenya punya lebih banyak lubang. Naluri "kayaknya aman nih" di dalam dirimu jadi miring naik justru ketika ada AI yang terlibat, yaitu persis saat naluri itu seharusnya jadi lebih hati-hati. Satu-satunya perilaku yang dicatat para peneliti sebagai peredam: orang yang kurang percaya pada AI dan lebih kritis menyikapi hasilnya menghasilkan lebih sedikit kerentanan. Sikap skeptis melindungi mereka. Rasa nyaman membuat mereka telanjang. (Perry dkk., "Do Users Write More Insecure Code with AI Assistants?", ACM CCS 2023, arXiv:2211.03622.)

### Rasa percaya diri malah naik justru saat si peninjau keliru

Sebuah studi terpisah memeriksa orang-orang non-ahli yang mengawasi hasil AI, yaitu persis situasi yang kamu alami ketika agent-mu menyerahkan laporan yang tidak sepenuhnya bisa kamu baca. Studi itu menemukan sesuatu yang meresahkan. Ketika seorang peninjau melewatkan sebuah kesalahan dan karena itu jadi keliru, rasa percaya diri mereka cenderung naik, bukannya turun. Sebuah penjelasan yang kelihatan masuk akal membuat orang mempercayainya melewati titik yang dibenarkan oleh fakta. Efeknya terukur dan besar.

Inilah yang mendorong salah satu aturan paling tegas dalam audit ini. Agent-mu tidak boleh menyerahkan skor kepercayaan diri dan vonis yang bersih kepadamu, karena vonis yang kelihatan yakin itulah yang justru memproduksi kepercayaan palsu. Sebagai gantinya, setiap temuan harus datang bersama bukti yang sebenarnya di baliknya: baris config yang spesifik, tempat yang persis di dalam kode, daftar nyata apa saja yang ditemukan. Bukti adalah sesuatu yang bisa kamu tunjuk dan cek, atau bisa ditunjuk dan dicek oleh orang yang kamu bayar. Skor adalah sesuatu yang harus kamu telan begitu saja, dan menelan begitu saja itulah mode kegagalannya di sini. (Grunde-McLaughlin dkk., arXiv:2602.16844, 2026.)

## Kenapa AI yang mengaudit AI itu metode yang nyata, sekaligus terbatas

Kemungkinan besar kamu akan menyuruh AI agent-mu sendiri untuk menjalankan audit ini. Itu memunculkan keberatan yang wajar, dan audit ini menanggapinya dengan serius alih-alih mengibaskannya.

### Masalah sirkularitas, dinamai oleh sebuah institusi yang kredibel

Sebuah catatan riset dari program CodeX di Stanford Law School menyatakan masalahnya dengan jernih pada Februari 2026. Tinjauan kode oleh manusia berhasil karena adanya ketidakcocokan: orang kedua membawa asumsi yang berbeda, kebiasaan yang berbeda, dan titik buta yang berbeda dari orang yang menulis kodenya, dan perbedaan itulah yang membuat seorang peninjau bisa menangkap apa yang terlewat oleh si penulis. Ketika satu AI menulis sekaligus menguji, ketidakcocokan itu hilang. Dalam kata-kata mereka, "the testing agents inherit the same weaknesses as the coding agents" (agent yang menguji mewarisi kelemahan yang sama dengan agent yang menulis kode). Si peninjau buta terhadap hal-hal yang sama yang membuat si pembangun buta, yakin terhadap hal-hal yang sama, dan keliru terhadap hal-hal yang sama.

Catatan itu menamai masalahnya di tingkat institusi dan tidak menawarkan solusi, hanya peringatan bahwa jendela untuk mengatasinya sedang menutup. Penjaga sirkularitas (circularity guard) di audit ini adalah upaya untuk menjadi solusinya, dan ia jujur soal seberapa jauh ia sampai. (Stanford Law CodeX (Kahana), "Built by Agents, Tested by Agents, Trusted by Whom?", 8 Februari 2026. Metode lengkapnya ada di `../protocol/02-circularity-guard.md`.)

### Memisahkan konteks tinjauan itu membantu, dan itu murah

Ada kabar baik, dan ini terukur. Sebuah eksperimen langsung membandingkan meninjau kode dalam sesi yang segar dan terpisah, tanpa ingatan kenapa kode itu ditulis, dengan meninjaunya dalam sesi yang sama yang membangunnya. Tinjauan berkonteks-segar menang, dan keunggulannya paling besar pada kesalahan-kesalahan yang paling penting: sekitar 11 poin persentase lebih banyak kesalahan kritis yang tertangkap.

Bagian paling cerdik dari studi itu adalah sebuah kondisi kontrol. Para peneliti juga mencoba meninjau dua kali dalam sesi yang sama, untuk menyingkirkan penjelasan membosankan bahwa "melihat lagi" itulah yang membantu. Dua kali tinjauan dalam sesi yang sama tidak memberi perbaikan berarti. Jadi manfaatnya bukan dari melihat untuk kedua kalinya. Manfaatnya datang dari konteks yang dipisahkan, seorang peninjau yang menjumpai kode itu sebagaimana orang asing menjumpainya, tanpa cerita yang menempel yang menjelaskan-jelaskan kelemahannya. Itulah kenapa audit ini menyuruhmu menjalankannya dalam sesi yang bersih, dan sebisa mungkin lebih memilih model yang berbeda. (arXiv:2603.12123, 12 Maret 2026.)

### Dan inilah batasnya, dinyatakan apa adanya

Inilah angka yang tidak akan dibiarkan audit ini kamu lupakan. Di eksperimen yang sama dan teliti itu, bahkan kondisi terbaik sekalipun, yaitu konteks segar yang terpisah, cuma menangkap sekitar 28,6 persen dari kesalahan yang disuntikkan, diukur dengan skor gabungan antara seberapa banyak bug nyata yang ditemukan dan seberapa sedikit alarm palsu yang dibunyikan. Kira-kira tujuh dari sepuluh bug yang ditanam selamat dari tinjauan AI terbaik yang tersedia.

Bacalah itu apa adanya. AI yang mengecek kode tulisan AI menangkap sepotong berarti dari bug-bug serius, dengan murah, dan melewatkan sebagian besarnya kalau bekerja sendirian. Itu sebuah penyaring yang betul-betul berguna sekaligus sebuah batas yang keras pada saat yang sama. Ini bukan pengganti penetration test (pentest, mencoba membobol aplikasi sendiri sebelum hacker yang melakukannya) profesional oleh manusia. Sebuah alat audit yang mengaku sebaliknya akan menjual kepadamu persis rasa aman palsu yang didokumentasikan oleh studi Perry, didandani dengan stempel yang kelihatan resmi, dan itu lebih buruk daripada tidak ada audit sama sekali, karena kamu akan berhenti memeriksa. Audit ini lebih memilih memberitahumu angka yang tidak enak dan membuatmu tetap awas.

Satu rekomendasi terkait punya dukungan yang lebih lemah, dan kami mengatakannya terus terang. Memakai keluarga model yang berbeda untuk mengaudit, alih-alih cuma sesi segar dari model yang sama, didukung secara arah oleh argumen teori-informasi bahwa peninjau yang beragam berbagi lebih sedikit titik buta. Arahnya masuk akal. Besar manfaatnya tidak dipastikan oleh pengukuran apa pun yang kami temukan. Jadi audit ini merekomendasikan model yang berbeda sebagai praktik terbaik dan tidak menjanjikan tingkat tangkapan tertentu darinya. Curigailah siapa pun yang menjanjikannya. (Rajan, arXiv:2511.16708, 2025.)

## Apa kesimpulan dari semua ini

Susun buktinya dalam satu baris dan alasan untuk audit ini, sekaligus batasnya, keduanya muncul dengan sendirinya.

Kode buatan AI jalan jauh lebih sering daripada amannya, jaraknya paling lebar tepat di permukaan-permukaan yang menangani uang dan data, masalahnya bersifat struktural alih-alih sesuatu yang diperbaiki oleh model berikutnya, aplikasi nyata yang sudah dirilis sudah membocorkan secret dan catatan pribadi sampai ribuan jumlahnya, manusia yang merilis kodenya merasa lebih percaya diri justru ketika ia seharusnya kurang percaya diri, dan AI yang mengecek pekerjaan sejenisnya sendiri menangkap minoritas bug yang berguna sambil melewatkan sebagian besarnya kalau sendirian. Tiap satu temuan itu adalah sebuah pemeriksaan, sebuah tingkat (tier), atau sebuah pengaman di suatu tempat dalam protokol ini.

Dan bukti yang sama itu menetapkan batas yang jujur:

- Audit ini mengurangi risikomu. Ia tidak menjamin keselamatanmu.
- AI yang meninjau AI menangkap sepotong berarti dari bug kritis dengan murah, dan dalam keadaan sendirian melewatkan sebagian besar kesalahan yang disuntikkan, paling baik terukur di sekitar 28,6 persen yang ditemukan. Ia bukan pengganti penetration test profesional.
- Sebuah aplikasi dengan taruhan nyata, uang nyata, banyak pengguna, aksi yang tidak bisa dibatalkan, atau AI agent yang bertindak sendiri, tetap harus membayar tinjauan manusia yang independen. Audit ini dibangun untuk memberitahumu di hari kamu melewati garis itu. Keputusan itu hidup di Domain L (`../protocol/l-decide-and-act.md`), dan apa yang sebenarnya dicakup oleh tinjauan manusia ada di Domain K (`../protocol/k-pentest.md`).
- Angka-angka judul yang mengkhawatirkan berasal dari studi-studi yang dibangun di atas desain pengukuran yang berbeda, dan sebagian dari vendor yang punya alasan untuk menakut-nakutimu. Penyeimbang akademis independennya dikutip tepat di sebelahnya dengan sengaja, dan itulah standar yang dipegang seluruh audit ini untuk dirinya sendiri.

Peta lengkap setiap standar dan kontrol di balik pemeriksaan-pemeriksaan ini ada di `../CITATIONS.md`. Definisi berbahasa sederhana untuk istilah-istilah teknis yang dipakai di sini ada di `./glossary.md`.

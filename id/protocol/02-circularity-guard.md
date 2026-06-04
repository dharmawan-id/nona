# Pengaman Sirkularitas (Circularity Guard)

Sebuah protokol lintas-domain untuk Domain F (pola kode buatan AI dan sirkularitas). Protokol ini berlaku untuk setiap audit domain, tapi karena ini inti dari Domain F, isinya ditaruh di sini sekali saja dan file domain lain menunjuk balik ke sini.

## Kenapa ini ada

Aplikasi kamu dibangun oleh agen AI. Kalau sekarang kamu minta agen yang sama, di chat yang sama, untuk memeriksa hasil kerjanya sendiri, kamu sedang menyuruh penulis menilai penulis itu sendiri. Ini lebih lemah dari kelihatannya, dan kelemahannya bukan karena agennya malas. Kelemahannya bersifat struktural.

Alasan code review oleh manusia bisa berfungsi sama sekali adalah ketidakcocokan (mismatch). Orang kedua membawa asumsi, kebiasaan, dan titik buta (blind spot) yang berbeda dari orang yang menulis kodenya. Bug yang tidak terlihat oleh penulisnya kadang bisa terlihat oleh reviewer, justru karena reviewer bukan penulisnya. Saat satu AI menulis sekaligus menguji, ketidakcocokan itu hilang. Agen penguji mewarisi kelemahan yang sama dengan agen yang menulis kode. Ia cenderung buta pada hal yang sama, yakin pada hal yang sama, dan keliru pada hal yang sama. Sebuah catatan riset dari program CodeX Stanford (Februari 2026) menyebut masalah persis ini di tingkat institusi dan tidak menawarkan solusi, hanya peringatan bahwa waktu untuk menanganinya sempit.

Ada jebakan kedua yang ikut menempel pada yang pertama. Agen yang ditanya "apakah ini aman?" di konteks yang sama persis dengan saat ia baru saja menyatakan fiturnya selesai sering menjawab ya, karena ia sudah percaya bahwa kerjanya bagus. Menyuruh agen "hati-hati" atau "bikin aman" tidak memperbaiki ini. Pada sebuah benchmark berisi 200 task repository nyata, kode yang 61 persen benar secara fungsional ternyata cuma 10,5 persen aman, dan menambahkan petunjuk keamanan ke dalam permintaan tidak menggeser angka keamanan itu (SUSVIBES, arXiv:2512.03262). Niat baik di dalam prompt bukan sebuah kontrol. Pemeriksaan terstruktur yang memaksa agen menghasilkan bukti, itu baru kontrol.

Dalam bahasa bisnis yang sederhana: audit-mandiri oleh agen yang membangun aplikasi kamu bisa menyodorkan laporan yang kelihatan bersih sementara bug uang yang sama, lubang login yang sama, kebocoran data yang sama tetap utuh tak tersentuh, karena pemeriksa dan pembangunnya adalah pikiran yang sama yang melihat kode yang sama dengan cara yang sama.

## Pengaman ini, dalam empat bagian

Pengaman ini tidak berusaha membuat review oleh AI jadi sempurna. Ia membuat review secara struktural berbeda dari proses build, menuntut bukti alih-alih acungan jempol, dan memberitahu kamu secara tertulis kalau hasilnya belum cukup. Empat bagian, keempatnya wajib.

### Bagian 1. Jalankan audit di konteks yang bersih dan baru

Mulai audit di sesi baru yang tidak punya ingatan soal kenapa kode itu ditulis dengan cara seperti itu. Tidak ada riwayat chat build, tidak ada alasan desain, tidak ada komentar berjalan tentang apa yang diniatkan agen. Reviewer harus bertemu kode kamu seperti orang asing bertemu kode itu: sebagai sesuatu yang sudah jadi untuk diperiksa, tanpa cerita apa pun yang menjelaskan dan memaafkan kekurangannya.

Ini adalah tuas paling murah dan sudah terukur. Dalam sebuah eksperimen terkontrol, review yang dijalankan di sesi baru tanpa riwayat produksi mengalahkan review yang dijalankan di sesi yang sama, dan keuntungannya paling besar pada error kritis (selisih sekitar sebelas poin persentase dalam deteksi error kritis; Cross-Context Review, arXiv:2603.12123). Ada satu kontrol penentu dalam studi yang sama: melakukan review dua kali di sesi yang sama tidak memberi perbaikan berarti dibanding review sekali. Jadi manfaatnya tidak datang dari "lihat lagi". Manfaatnya datang dari melihat dari konteks yang terpisah. Lebih banyak putaran di chat yang sama hampir tidak membeli apa pun untukmu. Konteks bersih membeli keuntungan deteksi bug kritis itu.

Praktiknya: buka percakapan baru, atau bersihkan konteks kerja, sebelum kamu menjalankan NONA. Jangan jalankan audit sebagai kelanjutan dari sesi build.

### Bagian 2. Lebih baik pakai garis keturunan model (model lineage) yang berbeda

Lebih kuat daripada sesi yang baru adalah pikiran yang baru. Kalau satu keluarga model membangun aplikasinya, mintalah keluarga model yang berbeda untuk menjalankan auditnya. Kalau kodenya ditulis dengan agen berbasis Claude, jalankan audit NONA dengan model yang berbeda jika memungkinkan, begitu pula sebaliknya.

Alasannya: model dari keluarga yang sama cenderung berbagi training, sehingga berbagi titik buta yang sama, seperti dua engineer yang dilatih di tempat yang sama membuat kesalahan yang sama. Garis keturunan yang berbeda lebih mungkin buta pada hal yang berbeda, dan justru ketidakcocokan itulah yang membuat review berguna. Ada argumen teori informasi (information-theoretic) bahwa reviewer yang beragam mengurangi titik buta bersama (Rajan, arXiv:2511.16708). Argumen itu mendukung arahnya. Argumen itu tidak mematok angka.

Jadi bagian ini adalah rekomendasi, bukan janji. Pakai model yang berbeda kalau bisa. NONA tidak mengklaim angka tangkapan tertentu dari melakukannya, dan kamu sebaiknya curiga pada siapa pun yang mengklaim angka itu. Kalau kamu cuma punya satu model, tetap lakukan Bagian 1: konteks bersih dengan model yang sama tetap layak dilakukan dan terbukti secara terpisah membantu.

### Bagian 3. Tuntut artefak, bukan vonis

Sebuah vonis itu "kelihatannya aman". Sebuah artefak adalah benda nyata yang harus dihasilkan agen untuk mendapatkan vonis itu. NONA menolak vonis dan menuntut artefak, karena vonis bisa dilontarkan tanpa benar-benar mengerjakannya, sedangkan artefak tidak bisa.

Untuk tiap domain, NONA menyebut artefak spesifik yang harus dikeluarkan agen. Daftar nyata semua secret (password, API key, atau token yang ketulis langsung di kode) yang ia temukan dan di mana letaknya. Peta nyata siapa yang boleh menjangkau data mana dan bagaimana hal itu ditegakkan. Hasil nyata dari pengecekan bahwa tiap package yang di-import memang ada dan memang yang dimaksud. Sebuah temuan selalu membawa buktinya: baris config, query, route, tempat persis di dalam kodemu, berdampingan dengan risiko bisnis dalam bahasa sehari-hari dan kutipan sumbernya. Tidak ada "lolos" telanjang.

Ini bukan urusan birokratis. Ini adalah mekanisme yang membuat agen benar-benar melakukan pemeriksaan alih-alih mengaku sudah melakukannya. Ini juga melindungi kamu, si pembaca, dari satu kegagalan sisi manusia yang sudah diketahui. Saat sebuah penjelasan AI cuma terasa masuk akal, orang cenderung memercayainya melewati batas yang dibenarkan oleh fakta, dan dalam satu studi pengawasan, ketika reviewer melewatkan sebuah error, keyakinan mereka justru naik bukannya turun (efek yang terukur, Hedges' g = 0,85). Skor keyakinan memproduksi rasa percaya. Artefak memungkinkan kamu, atau engineer sungguhan yang kamu sewa, menunjuk ke buktinya dan memeriksanya. Bukti mengalahkan angka setiap saat.

### Bagian 4. Nyatakan risiko sisa secara eksplisit dan arahkan kasus bertaruhan tinggi ke manusia

Setelah audit, NONA tidak menyatakan aplikasi kamu aman. NONA menyatakan apa yang sudah diperiksa, apa yang tidak bisa diperiksa dengan cara ini, dan apa yang masih belum pasti. Diam tidak pernah dianggap sebagai keberhasilan. "Agen tidak menemukan apa-apa di sini" dilaporkan apa adanya seperti itu, bukan sebagai "ini sudah beres".

Lalu NONA mengarahkan. Kalau aplikasi kamu menangani uang, menyimpan banyak data pribadi orang, bisa melakukan aksi yang tidak bisa dibatalkan, atau menjalankan agen AI yang bertindak sendiri tanpa manusia menyetujui tiap langkah, NONA memberitahu kamu secara tertulis untuk mendapatkan review manusia yang independen (lihat Domain K dan Domain L). Pengaman ini mengurangi risikomu dengan murah. Ia tidak menghapus risikonya. Tahu di mana lantai (batas bawah) dari metode ini, dan mengatakannya, adalah bagian dari metodenya.

## Klausul kejujuran (wajib, bukan opsional)

Ini adalah garis yang tidak akan dilanggar NONA, karena melanggarnya berarti membuat NONA menjadi masalah yang justru ingin ia lawan.

AI yang me-review AI menangkap sepotong bug serius yang bermakna, dengan murah, dan ia melewatkan sebagian besar bug saat bekerja sendirian. Dalam pengukuran paling bersih yang tersedia, bahkan pada kondisi terbaik, yaitu konteks yang segar dan terpisah, hanya sekitar 28,6 persen error yang disuntikkan yang tertangkap menurut F1 (skor gabungan dari berapa banyak bug nyata yang ditemukan dan sesedikit apa alarm palsu yang dipicu; Cross-Context Review, arXiv:2603.12123). Kira-kira tujuh dari sepuluh bug yang disuntikkan lolos dari review AI terbaik dalam studi itu. Itu sebuah filter yang berguna. Itu bukan jaminan keamanan.

Maka NONA menyatakan dengan jelas:

- NONA mengurangi risiko. NONA tidak membuktikan aplikasi kamu aman.
- Audit AI, bahkan yang lintas-model dan dijalankan di konteks bersih, bukan pengganti penetration test profesional oleh manusia (pentest, yaitu mencoba membobol aplikasi sendiri sebelum hacker yang lakukan; lihat Domain K). Audit AI adalah pemeriksaan awal yang murah yang menangkap sebagian bermakna dari bug kritis dan membuat seorang profesional berbayar mulai dari lantai yang lebih tinggi.
- Aplikasi bertaruhan tinggi, yaitu uang, banyak pengguna, aksi yang tidak bisa dibatalkan, atau agen otonom, tetap butuh audit manusia yang independen. Tugas NONA adalah memberitahu kamu kapan kamu sudah masuk ke wilayah itu, bukan berpura-pura kamu belum masuk.

Alasan klausul ini wajib adalah kegagalan yang dicegahnya. Bahaya yang sudah terdokumentasi dari asisten coding AI adalah orang menulis kode yang kurang aman sambil percaya kode itu lebih aman: rasa aman yang palsu, terukur dalam sebuah studi peer-review (Perry et al., CCS 2023). Alat audit yang melebih-lebihkan kekuatannya sendiri akan menyodorkan rasa nyaman palsu yang sama itu dengan cap yang kelihatan resmi di atasnya. Itu akan lebih buruk daripada tidak ada audit sama sekali, karena kamu akan berhenti waspada. NONA lebih memilih memberitahu kamu angka yang tidak enak didengar dan membuat kamu tetap waspada.

## Kenapa struktur, dan bukan prompt yang lebih baik

Pertanyaan yang wajar: kalau agennya pintar, kenapa tidak suruh saja ia teliti? Karena itu sudah diuji dan gagal. Petunjuk keamanan yang umum tidak memperbaiki keamanan kode yang dihasilkan dalam benchmark yang dikutip di atas. Imbauan tidak berhasil. Struktur berhasil. Nilai NONA ada pada checklist domain-per-domain dengan artefak bernama yang diwajibkan di tiap langkah, dijalankan dari konteks yang terpisah, dengan risiko sisa ditulis. Itulah yang memaksa agen melakukan pemeriksaan alih-alih mengaku semuanya beres, dan itu pula yang memberi kamu sesuatu yang bisa diverifikasi seorang manusia ketika taruhannya bilang kamu memang butuh manusia.

Untuk tim yang ingin versi pengurungan (containment) terkuat di sekitar agen otonom, pola-pola frontier (model terpisah yang hanya memilih di antara aksi-aksi aman, pemisahan rencana-lalu-eksekusi, dan desain terkait; Beurer-Kellner et al. 2025) muncul di tier extra-mile pada Domain F dan Domain B. Pola-pola itu adalah upaya tambahan, disediakan untuk aplikasi yang agennya bisa bertindak sendiri. Pengaman empat bagian di atas adalah baseline yang berlaku untuk semua orang.

---

Bacaan terkait: Domain F (`protocol/f-ai-code-circularity.md`) untuk audit domain lengkapnya, Domain K (`protocol/k-pentest.md`) untuk apa yang dicakup review manusia dan kenapa itu tetap dibutuhkan, Domain L (`protocol/l-decide-and-act.md`) untuk keputusan eksplisit kapan-harus-menyewa-manusia, dan tulisan tentang batas-batas jujur di `docs/why-nona-exists.md` untuk kumpulan bukti di balik angka-angka ini beserta catatan kehati-hatian soal desain pengukurannya.

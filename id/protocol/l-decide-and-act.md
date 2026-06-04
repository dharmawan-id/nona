# Domain L: Putuskan dan Bertindak

## Apa ini

Ini domain tempat audit berubah menjadi keputusan. Tiap domain lain menyerahkanmu temuan: sebuah secret (password, API key, atau token rahasia) yang nyangkut di tempat salah, sebuah pemeriksaan kepemilikan yang hilang, sebuah webhook pembayaran yang tidak diverifikasi siapa pun, sebuah package yang sebenarnya tidak ada. Domain L adalah tempat kamu memutuskan mana yang kamu perbaiki malam ini, mana yang bisa menunggu, mana yang sadar-sadar kamu biarkan, dan mana yang menjadi momen untuk berhenti memperbaiki sendiri lalu membayar manusia untuk melihat. Isinya triase, penerjemahan risiko ke bahasa biasa, dan satu keputusan eksplisit: kapan kamu menyerahkan ini ke peninjau independen.

Alasan domain ini berdiri sendiri adalah karena daftar temuan bukan rencana. Seorang non-coder yang diserahi dua puluh temuan dengan tingkat keparahan campur aduk tidak punya cara membedakan yang mengakhiri perusahaan dari yang tidak berarti, dan gerak manusiawi yang wajar di bawah tumpukan itu adalah membeku atau memperbaiki yang paling gampang lebih dulu. Keduanya keliru. Domain ini memberi agen sebuah prosedur untuk memeringkat berdasarkan apa yang sebenarnya dibebankan sebuah kesalahan ke bisnismu, dan memberimu garis yang jelas untuk kapan jawaban jujurnya adalah "ini sudah di luar yang bisa diselesaikan audit AI, panggil orang".

## Yang tidak kelihatan di sini

Kamu tidak bisa melihat temuan mana yang berbahaya. Semuanya datang dengan tampilan serupa: sebuah baris di tabel, sebuah kata keparahan, sebuah saran perbaikan. Bagimu, "Row Level Security mati di satu tabel" dan "redirect login bisa dilewati" terbaca sebagai masalah berbobot kira-kira sama, karena kamu tidak punya cara merasakan beda dampaknya. Yang satu mungkin tabel yang tak terjangkau siapa pun; yang lain mungkin pintu depan yang terbuka lebar di sebuah sistem yang memegang data sepuluh ribu orang. Label keparahan sendirian tidak memberitahumu itu, dan seorang non-coder tidak bisa memasok konteks yang hilang itu dengan membaca kode.

Ada hal kedua yang tidak bisa kamu lihat, dan ia yang lebih berbahaya: kepercayaan-berlebihmu sendiri. Saat AI menyerahkanmu laporan rapi dan alasannya terdengar masuk akal, orang mempercayainya melewati titik yang dibenarkan fakta. Ini efek yang sudah terukur. Dalam sebuah studi pengawasan di mana peninjau melewatkan sebuah kesalahan, kepercayaan mereka pada hasilnya justru naik alih-alih turun (Hedges' g = 0.85; Grunde-McLaughlin dkk., arXiv:2602.16844). Makin bersih laporannya terlihat, makin ia bisa memproduksi ketenangan yang belum kamu peroleh. Versi paling awal temuan ini lebih tua: orang yang memakai asisten AI menulis kode yang kurang aman sambil meyakini kode itu lebih aman, "rasa aman palsu" yang sudah terdokumentasi (Perry dkk., ACM CCS 2023). Jadi keputusan yang paling kamu butuhkan, yaitu temuan mana yang aman dikesampingkan, justru keputusan yang akan disalahkan instingmu, ke arah yang percaya diri.

Titik buta ketiga adalah garis sewa-manusia itu sendiri. Tidak ada yang memberitahu seorang non-coder di mana letaknya. Scanner menyerahkanmu perbaikan lalu diam. Kerangka yang dibikin untuk engineer mengasumsikan kamu bisa menilai sendiri kapan kamu sudah di luar kedalamanmu. Maka pembuat merilis, laporannya terlihat bersih, dan pertanyaan "apakah orang sungguhan seharusnya memeriksa ini sebelum rilis" tidak pernah ditanyakan, karena tidak ada apa pun di proses itu yang tugasnya menanyakannya. Celah itu yang ditutup domain ini. Keputusan untuk meningkatkan eskalasi tidak diserahkan ke perasaan. Ia aturan, tertulis, yang diterapkan agen untukmu.

## Kapan ini penting (sinyal taruhan)

Domain ini berbeda dari yang lain dalam satu hal penting, dan layak dinyatakan terang-terangan supaya kamu membaca hasilnya dengan benar. Tiap domain lain memeriksa satu permukaan aplikasimu. Domain L memeriksa seluruh tumpukan temuan dari semuanya sekaligus. Maka taruhannya tidak lokal pada satu fitur. Taruhannya adalah jumlah dari semua yang diangkat sisa audit, ditimbang terhadap semua yang sungguh berisiko di repository-mu.

Artinya kedalaman domain ini mengikuti kedalaman aplikasimu secara keseluruhan.

- Kalau aplikasimu membawa taruhan nyata di mana pun (salah satu dari **S1 uang**, **S2 identitas dan auth**, **S3 data pribadi**, **S5 radius ledakan**), maka triase di sini berjalan setidaknya STANDARD: tiap temuan diperingkat berdasarkan kemungkinan dan dampak bisnis, bukan dibiarkan sebagai label keparahan telanjang, dan peringkatnya dituliskan supaya kamu dan peninjau manusia di masa depan sama-sama bisa melihat alasannya.
- Kalau aplikasimu menggabungkan beberapa dari sinyal itu, atau memegang data pribadi di skala besar (**S3 dengan S5**), domain ini berjalan EXTRA-MILE: sebuah register risiko penuh, sebuah keputusan terima-atau-perbaiki yang dicatat eksplisit untuk tiap temuan yang tidak kamu perbaiki segera, dan sebuah pernyataan risiko sisa yang menyatakan secara tertulis apa yang kamu pilih untuk hidupi.

Ada dua garis keras yang duduk di atas hitungan itu, karena keduanya memutuskan eskalasi, yang merupakan seluruh tugas domain ini.

**Kalau sebuah agen AI di aplikasimu bisa mengambil tindakan sendiri tanpa manusia menyetujui tiap tindakan (S4), keputusan sewa-manusia dipaksa menjadi "ya" untuk temuan yang kritis bagi keamanan.** Sebuah agen otonom yang bisa bertindak dengan akses luas adalah satu konfigurasi yang paling mungkin mengubah bug terlewat menjadi insiden hidup sebelum ada yang menyadari. Audit AI mengurangi risiko itu; ia tidak menghapusnya. Untuk aplikasi dengan agen otonom, review manusia independen atas temuan akses dan pengekangan bukan pilihan.

**Kalau sebuah tindakan di aplikasimu tidak bisa dibatalkan (S6) dan bergabung dengan uang (S1) atau skala (S5), temuan apa pun yang belum tuntas yang menyentuh tindakan itu memaksa eskalasi.** Tindakan permanen yang dicapai orang yang salah, atau dipicu oleh bug, tidak meninggalkan jalan pulang. Tidak ada "nanti kami perbaiki di rilis berikutnya" untuk transfer yang sudah berangkat atau record yang sudah dihancurkan. Maka batas untuk merilis dengan temuan terbuka pada tindakan yang tak-bisa-dibatalkan, bernilai tinggi, atau berjangkauan luas bukanlah "kemungkinan aman". Batasnya adalah perbaikan bersih yang bisa kamu tunjuk, atau seorang manusia yang menandatangani persetujuan.

Kalau aplikasimu sungguh tidak punya uang, tidak ada auth, tidak ada data pribadi, tidak ada agen otonom, tidak ada radius ledakan, dan tidak ada tindakan yang tak-bisa-dibatalkan, maka triase di sini ringan dan jawaban eskalasi yang jujur adalah "kamu tidak perlu membayar siapa pun". Peringkat beberapa temuan floor, perbaiki yang jelas, lalu rilis. Jangan beli audit profesional untuk aplikasi daftar-kerjaan akhir pekan. Membelanjakan uang untuk meninjau aplikasi yang tidak mempertaruhkan apa-apa adalah kesalahan yang sama dengan melewatkan review pada aplikasi yang mempertaruhkan segalanya, dijalankan terbalik.

## Pemeriksaan floor

Jangan pernah lewati ini. Bahkan aplikasi tanpa-taruhan pun menghasilkan beberapa temuan, dan pembuat yang tidak bisa membedakan mana yang harus ditindak lebih dulu akan tidak menindak satu pun.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Kumpulkan tiap temuan dari kedua belas domain ke dalam satu daftar, dan untuk masing-masing catat tiga hal sederhana: apa yang bisa terjadi dalam istilah bisnis, seberapa gampang seseorang membuatnya terjadi, dan apakah hal yang terdampak membawa sinyal taruhan apa pun. Jangan memeringkat dulu; pertama buat seluruh gambarannya terlihat di satu tempat. | Kamu tidak bisa memutuskan lintas temuan yang tidak bisa kamu lihat bersama-sama. Temuan yang tercerai-berai di dua belas laporan, masing-masing dalam formatnya sendiri, mustahil ditimbang satu sama lain oleh non-coder. Satu daftar terpadu, tiap butir dinyatakan sebagai konsekuensi alih-alih cacat kode, adalah bedanya antara sebuah keputusan dan sebuah angkat bahu. Ini langkah yang mengubah "ini ada beberapa masalah" menjadi sesuatu yang sungguh bisa kamu tindak. | Sebuah daftar temuan terpadu: tiap temuan dari tiap domain, masing-masing dengan konsekuensi bisnisnya dalam bahasa biasa, kemungkinan kasar (gampang atau sulit dipicu), dan sinyal taruhan yang ia sentuh kalau ada. Tidak ada yang diringkas hilang; daftar penuhnya. | NIST SSDF SP 800-218 v1.1 RV.2 (menilai dan memrioritaskan kerentanan); model penilaian risiko OWASP (kemungkinan dan dampak) |
| Peringkat daftar itu berdasarkan risiko bisnis, di mana risiko adalah seberapa mungkin sebuah kesalahan dikalikan seberapa buruk akibatnya, lalu terjemahkan tiap butir teratas menjadi satu kalimat yang dipahami non-coder. Temuan berbahaya naik ke puncak atas kekuatan apa yang ia bebankan ke bisnismu, bahkan saat sebuah tool mencetak kata yang lebih lunak di sebelahnya. | Label keparahan sendirian menyesatkanmu. "Tinggi" pada tabel yang tak terjangkau siapa pun lebih kecil artinya daripada "sedang" pada pintu depanmu. Memeringkat berdasarkan kemungkinan kali dampak, dan menyatakan dampaknya dalam istilah uang-dan-orang, adalah yang memunculkan satu temuan yang sungguh pantas merebut malammu. Tanpa ini, pembuat memperbaiki yang gampang dulu dan membiarkan yang mahal terbuka karena di halaman terlihat sama saja. | Sebuah daftar temuan terperingkat, risiko bisnis tertinggi lebih dulu, tiap butir teratas membawa satu kalimat konsekuensi biasa (misalnya: "orang asing bisa membaca tagihan pelanggan mana pun dengan mengubah sebuah angka di address bar", bukan "IDOR, tinggi"). | model penilaian risiko OWASP (risiko = kemungkinan x dampak); NIST SSDF SP 800-218 v1.1 RV.2 |
| Untuk tiap temuan yang kamu putuskan TIDAK diperbaiki sekarang, catat keputusan dan alasannya dalam satu baris: diperbaiki sekarang, diperbaiki nanti (dengan kapan), atau sadar-sadar diterima (dengan kenapa itu bisa diterima). Diam bukan keputusan. Temuan tanpa pilihan tercatat diperlakukan sebagai belum tertangani, dan temuan yang belum tertangani adalah kebocoran yang tidak kamu ingat pernah kamu izinkan. | Keputusan yang tak tertulis adalah keputusan yang terlupakan. Temuan yang "berniat kamu urus" menjadi kebocoran yang tidak kamu ingat memilih untuk membiarkannya. Menuliskan terima-atau-tunda, dengan alasan, melakukan dua hal: ia memaksamu sungguh memutuskan alih-alih hanyut, dan ia meninggalkan catatan supaya kamu di masa depan, atau manusia yang kamu sewa, bisa melihat mana yang dipilih dengan sengaja versus mana yang sekadar terlewat. | Sebuah catatan keputusan: tiap temuan yang tidak sedang diperbaiki segera, dengan disposisinya (perbaiki sekarang, perbaiki nanti pada tanggal yang dinyatakan, atau terima) dan satu baris alasan, supaya tidak ada temuan yang menggantung. | NIST AI RMF 1.0 MANAGE (putuskan respons risiko dan dokumentasikan risiko sisa yang diterima) |
| Nyatakan, secara tertulis, apa yang tidak dan tidak bisa diselesaikan audit ini. Daftar pemeriksaan yang kembali bersih sebagai persis itu ("agen tidak menemukan apa-apa di sini"), susun katanya supaya terbaca sebagai ketiadaan temuan alih-alih jaminan, dan sebutkan apa pun yang sama sekali tidak bisa diperiksa dengan cara ini. | Laporan bersih masih jauh dari aplikasi aman, dan memperlakukan keduanya sebagai hal yang sama adalah jebakan persis yang menjadi alasan keberadaan seluruh protokol ini. Audit AI menangkap sebagian bermakna dari bug serius dan melewatkan sebagian besarnya saat bekerja sendiri. Mengatakannya, secara tertulis, di laporanmu sendiri menjagamu tetap waspada alih-alih nyaman, dan ia adalah masukan jujur untuk keputusan berikutnya: apakah kamu butuh manusia. | Sebuah pernyataan risiko sisa: apa yang diperiksa dan kembali bersih (disusun sebagai "tidak menemukan apa-apa", yang merupakan ketiadaan temuan dan belum sampai pada "aman"), apa yang tidak bisa diperiksa dengan metode ini, dan satu catatan polos bahwa audit AI mengurangi risiko tanpa membuktikan keamanan. | NIST AI RMF 1.0 MANAGE (dokumentasikan risiko sisa); NIST SSDF SP 800-218 v1.1 RV.2 |

## Pemeriksaan standard

Tim yang kompeten melakukan ini. Jalankan saat aplikasimu membawa taruhan nyata apa pun (S1, S2, S3, atau S5), sesuai sinyal di atas.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Ubah daftar terperingkat menjadi urutan perbaikan sungguhan dengan garis potong: sebutkan temuan mana yang menghalangi rilis (harus diperbaiki sebelum kamu merilis atau memaparkan ini ke siapa pun), mana yang perbaiki-segera (diperbaiki dalam jendela waktu tertentu setelah rilis), dan mana yang diterima. Ikat tiap penghalang ke sinyal taruhan yang menjadikannya penghalang. | "Kami akan perbaiki yang penting" bukan rencana yang bisa dijalankan non-coder, karena kamu tidak bisa membedakan mana yang penting itu. Daftar penghalang dengan garis potong rilis mengubah peringkat menjadi tindakan yang sungguh bisa kamu ambil: pintu-pintu ini harus terkunci sebelum ada yang masuk, ini bisa diperkuat minggu depan, ini sudah kami pilih untuk dibiarkan. Tautan taruhan itu yang membuat garis potongnya beralasan alih-alih sembarang. | Sebuah rencana perbaikan: temuan dipisah menjadi penghalang-rilis, perbaiki-segera (dengan jendela waktu), dan diterima, tiap penghalang dianotasi dengan sinyal taruhan yang memaksanya, supaya keputusan rilis bertumpu pada alasan yang dinyatakan. | NIST SSDF SP 800-218 v1.1 RV.2 (memrioritaskan dan memperbaiki); NIST AI RMF 1.0 MANAGE (respons risiko) |
| Untuk tiap temuan yang ditandai sudah diperbaiki, konfirmasi perbaikannya dengan bukti yang sama yang dulu mengungkap bug itu, bukan dengan ucapan agen, dan konfirmasi di konteks yang bersih supaya agen yang mungkin menulis bug aslinya bukan satu-satunya hakim bahwa bug itu sudah hilang. Sebuah perbaikan tidak selesai karena agen berkata "sudah diperbaiki". Ia selesai saat artefak yang mengungkap bug itu kini kembali bersih. | Agen yang membangun sebuah bug, lalu diminta mengonfirmasi perbaikannya sendiri dalam satu tarikan napas, akan cenderung berkata sudah diperbaiki karena ia yakin kerjanya bagus. Itu sirkularitas yang sama yang dulu meloloskan bug aslinya. Memeriksa ulang perbaikannya dari konteks baru, terhadap bukti yang sama yang menemukan masalahnya, adalah bedanya antara "agen berkata pintunya terkunci" dan "pintunya, dicoba lagi, terkunci". Untuk perbaikan pada temuan uang atau akses, yang kedua satu-satunya yang layak dipercaya. | Sebuah catatan verifikasi perbaikan: per temuan yang diperbaiki, artefak bukti asli dan hasil pengulangan yang menunjukkan masalahnya tidak lagi muncul, dihasilkan di konteks yang bersih (lihat penjaga sirkularitas), dengan perbaikan apa pun yang tidak bisa dikonfirmasi ditandai masih terbuka. | NIST SSDF SP 800-218 v1.1 RV.2 (verifikasi perbaikan); NIST AI RMF 1.0 MANAGE |
| Terapkan pohon keputusan sewa-manusia yang eksplisit dan catat hasilnya. Lewati gerbang-gerbang ini berurutan: adakah temuan belum-tuntas pada permukaan uang, auth, atau data-pribadi yang tidak bisa kamu jelaskan penuh atau pastikan sudah diperbaiki; apakah aplikasi memegang data pribadi banyak orang; apakah sebuah tindakan bisa dibatalkan atau tidak; apakah ada agen AI yang bertindak sendiri. Gerbang mana pun yang terpicu mengarahkanmu ke review manusia independen, dan agen harus menyatakannya dengan kata-kata biasa. | Ini keputusan yang tidak dibuat scanner mana pun maupun kerangka buatan-engineer mana pun untuk non-coder, dan ia yang biayanya paling tinggi saat tidak ditanyakan. Diserahkan ke insting, pembuat merilis karena laporannya terlihat bersih dan efek rasa-aman-palsu menuntaskan sisanya. Pohon keputusan tertulis mencabut insting dari pilihan: gerbangnya terpicu atau tidak, dan kalau terpicu, audit memberitahumu untuk membelanjakan uangnya alih-alih berharap. | Sebuah keputusan sewa-manusia: tiap gerbang, jawaban ya-atau-tidaknya dengan bukti di baliknya, dan vonis yang dihasilkan (lanjut, atau dapatkan review manusia independen) dinyatakan dalam bahasa biasa berikut alasannya. | NIST AI RMF 1.0 MANAGE (respons risiko termasuk pengalihan ke review independen); NIST SSDF SP 800-218 v1.1 RV.2 |

## Pemeriksaan extra-mile

Keketatan tingkat frontier. Bahkan tim engineering yang kuat memperlakukan ini sebagai effort ekstra dan diperpanjang. Jalankan hanya saat gerbang taruhan memaksanya, seperti yang dianotasi.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation | Gerbang taruhan + pola frontier |
|---|---|---|---|---|
| Bangun dan pelihara register risiko yang berdiri tetap: tiap temuan sebagai entri terlacak yang mencatat dampak bisnis dan kemungkinannya, respons yang dipilih (perbaiki, terima, alihkan ke manusia, atau hindari dengan membuang fiturnya), siapa pemiliknya, dan tanggal untuk meninjau ulang. Jalankan ulang tiap perubahan berarti alih-alih memperlakukan audit sebagai peristiwa sekali jadi. | Aplikasi yang membawa taruhan serius tidak diaudit sekali lalu selesai; ia terus merilis, dan tiap perubahan bisa membuka lubang baru atau membuka ulang yang lama. Laporan sekali-tembak basi sehari setelah kamu membacanya. Register yang hidup adalah cara aplikasi bertaruhan-tinggi tetap bertanggung jawab atas risikonya sendiri sepanjang waktu: tidak ada yang terlupa, tiap risiko yang diterima punya nama yang melekat dan tanggal untuk ditinjau ulang, dan manusia yang kamu datangkan kelak mulai dari gambaran lengkap alih-alih potret sesaat. | Sebuah register risiko: tiap temuan terlacak dengan dampak, kemungkinan, respons, pemilik, dan tanggal tinjau, berikut catatan kapan ia terakhir dijalankan ulang terhadap kode saat ini, risiko yang diterima dibawa eksplisit dengan pembenarannya. | NIST AI RMF 1.0 MANAGE (manajemen risiko berkelanjutan dan dokumentasi risiko sisa); NIST SSDF SP 800-218 v1.1 RV.2 | Dipaksa oleh S3 dengan S5 (data pribadi di skala besar), atau beberapa sinyal taruhan bersama. Pola frontier: register risiko berdiri tetap dengan penjalanan-ulang berkala. |
| Pesan audit manusia independen sebagai eskalasi yang eksplisit, dan catat keputusan untuk melakukannya sebagai bagian dari output audit. Perlakukan audit AI sebagai lewat-pertama yang murah yang mengangkat manusia berbayar ke titik mulai yang lebih tinggi: serahkan ke peninjau itu daftar temuan terpadu, catatan keputusan, catatan verifikasi perbaikan, dan pernyataan risiko sisa, supaya mereka menghabiskan jamnya pada penilaian alih-alih penemuan ulang. | Ini garis tempat jawaban jujurnya berhenti menjadi "agen sudah memeriksa" dan menjadi "orang harus". Review manusia independen atas aplikasi yang menangani uang, data banyak orang, tindakan yang tak-bisa-dibatalkan, atau agen otonom adalah pekerjaan berbayar, dan ia sepadan persis saat biaya kesalahan jauh melampaui ongkosnya. Review semacam itu ada di pasar dalam rentang nyata, lazimnya USD 500 sampai USD 3.000 untuk audit terfokus dan hingga ribuan dolar per bulan untuk pengawasan engineering fraksional yang berkelanjutan, dan datang dengan temuanmu sudah tertata adalah cara kamu membeli penilaian alih-alih membayar orang untuk membaca ulang kodemu dari nol. | Sebuah catatan eskalasi: gerbang yang memaksa review manusia, paket yang diserahkan ke peninjau (daftar temuan terpadu, catatan keputusan, catatan verifikasi perbaikan, pernyataan risiko sisa), dan konfirmasi bahwa peran audit AI dibingkai sebagai lewat-pertama yang memberi manusia titik mulai lebih tinggi. | NIST AI RMF 1.0 MANAGE (alihkan risiko ke review independen); NIST SSDF SP 800-218 v1.1 RV.2 | Dipaksa oleh S4 (agen otonom) pada temuan yang kritis bagi keamanan, atau S6 yang bergabung dengan S1 atau S5 pada temuan yang belum tuntas. Pola frontier: audit manusia independen sebagai sasaran eskalasi. |

## Penutupan kepatuhan Indonesia

Domain ini juga adalah tempat kepatuhan Indonesia ditutup. Tiap pasal yang relevan sudah dipindai di domainnya sendiri: dasar pemrosesan, minimisasi, jalur penghapusan, notifikasi kebocoran, dan transfer lintas-batas di Domain D; verifikasi tanda tangan gateway pembayaran di Domain E; pendaftaran PSE Lingkup Privat di Domain G. Bagian ini menjadikan penutupannya satu langkah eksplisit: sebelum rilis, lewati daftar di bawah dan pastikan tiap minimum yang murah sudah berdiri.

Posturnya minimal-cukup. Ini bukan kewajiban ala GDPR. Ia daftar pendek yang masing-masing terikat ke pasalnya, dan dua taruhan nyata yang membenarkan kenapa kamu mengerjakannya sekarang alih-alih kelak.

Dua taruhan itu menentukan kenapa daftar murah ini sepadan dirilis dengan lengkap:
- Denda administratif UU PDP bisa mencapai 2% dari pendapatan tahunan (UU PDP Pasal 57), di samping teguran tertulis, penghentian sementara pemrosesan, dan perintah penghapusan data. Sanksi ini berbasis-risiko, jadi postur praktisnya adalah kerjakan minimum yang murah di bawah.
- Tidak mendaftar atau tidak mematuhi sebagai PSE menarik sanksi administratif yang naik sampai pemblokiran akses (pemblokiran) layananmu di Indonesia. Ini tuas penegakan yang sungguh dipakai Komdigi. Sebuah produk yang diblokir tidak menghasilkan apa-apa, jadi pendaftaran adalah ongkos masuk untuk beroperasi secara sah.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Pastikan pendaftaran sudah selesai untuk produk komersial yang melayani pengguna Indonesia: NIB lewat oss.go.id, lalu PSE Lingkup Privat lewat pse.komdigi.go.id. Pemicunya fungsional, bukan ukuran: punya akun pengguna, menerima pembayaran, atau memasarkan ke pengguna Indonesia sudah menyalakannya. | Beroperasi sebagai layanan komersial tanpa NIB dan pendaftaran PSE menarik sanksi yang naik sampai pemblokiran akses, dan produk yang diblokir di Indonesia berhenti menghasilkan. Pendaftaran adalah biaya masuk yang murah dibanding kehilangan akses ke seluruh pasarmu. | Sebuah hasil status-pendaftaran: konfirmasi NIB diperoleh dan PSE Lingkup Privat terdaftar, atau penanda kalau salah satu belum, dengan pemicu komersial yang membuatnya berlaku dicatat. | PSE Permenkominfo 5/2020; UU PDP No. 27 Tahun 2022 Pasal 57 (sanksi) |
| Pastikan pemberitahuan privasi sudah hidup dan mencakup dua hal: sebuah persetujuan (consent) eksplisit untuk tujuan yang dinyatakan, dan pengungkapan bahwa data disimpan di server luar negeri kalau kamu memakai hosting cloud asing (Vercel, AWS region asing, Supabase region non-Indonesia, dan sejenisnya). Checkbox persetujuan tidak boleh tercentang otomatis. | Tanpa dasar pemrosesan yang sah, tiap pemrosesan data pelangganmu melanggar hukum sejak awal. Hampir setiap aplikasi modern memakai hosting cloud asing, jadi kamu hampir pasti melakukan transfer lintas-batas; tanpa pengungkapan dan persetujuan, transfer itu tidak punya dasar yang sah. | Sebuah hasil pemberitahuan-privasi: konfirmasi bahwa pemberitahuan privasi hidup dengan checkbox persetujuan eksplisit (tidak tercentang otomatis) dan pengungkapan penyimpanan luar negeri, atau penanda di tempat salah satu hilang. | UU PDP No. 27 Tahun 2022 Pasal 20 (dasar pemrosesan); UU PDP No. 27 Tahun 2022 Pasal 56 (transfer lintas-batas) |
| Pastikan jalur "hapus data saya" sungguh berfungsi: menjalankannya benar-benar membuang data orang itu di semua tempat ia tinggal, bukan sekadar menyembunyikannya, dan ada email kontak yang dipublikasikan untuk permintaan. Jalur yang sama ini juga memenuhi penarikan persetujuan. | Kalau pengguna meminta datanya dihapus dan kamu tidak bisa benar-benar melakukannya, kamu melanggar hak yang dijamin hukum padanya, dan datanya tertinggal di tempat yang sudah kamu lupakan. Penghapusan yang cuma menyembunyikan satu baris meninggalkan record-nya utuh sepenuhnya di bawahnya. | Sebuah hasil jalur-penghapusan: konfirmasi bahwa jalur penghapusan/penarikan persetujuan ada dan benar-benar membuang data (bertaut ke artefak jalur penghapusan Domain D), plus alamat email kontak yang dipublikasikan. | UU PDP No. 27 Tahun 2022 Pasal 7-9 |
| Pastikan template notifikasi kebocoran (data breach) 1 halaman sudah siap pakai sebelum kamu membutuhkannya: ia harus menyatakan data apa yang terekspos, kapan dan bagaimana itu terjadi, dan langkah pemulihan yang diambil, plus alamat tujuan untuk pengguna terdampak dan untuk otoritas. Tenggatnya 3x24 jam (72 jam) sejak kebocoran. | Tanpa template yang siap, kamu akan melewati tenggat 3x24 jam saat panik, dan tenggat yang terlewat itu sendiri adalah pelanggaran terpisah di atas kebocorannya. Template yang siap pakai mengubah kepanikan menjadi langkah yang sudah dilatih. | Sebuah artefak kesiapan-kebocoran: template insiden 1 halaman (field data-terekspos, waktu/cara, langkah pemulihan) plus alamat tujuan, dikonfirmasi siap untuk tenggat 3x24 jam. | UU PDP No. 27 Tahun 2022 Pasal 46-47 |
| Pastikan tanda tangan tiap gateway pembayaran sudah diverifikasi di server sebelum aplikasi bertindak atas sebuah callback: Midtrans dengan SHA512, Xendit dengan X-CALLBACK-TOKEN, iPaymu dengan HMAC-SHA256. ServerKey, ApiKey, dan token verifikasi harus berada di env var sisi server saja, tidak pernah di bundle publik atau di repo. | Callback yang tidak diverifikasi berarti siapa pun bisa memalsukan pemberitahuan "pembayaran berhasil" dan mengambil barang atau layananmu tanpa membayar. Sebagai merchant yang memakai gateway berlisensi, kamu tidak perlu lisensi Bank Indonesia atau OJK sendiri; yang harus kamu amankan adalah integrasinya. | Sebuah hasil verifikasi-gateway: per gateway yang dipakai, konfirmasi bahwa tanda tangan/token callback diverifikasi di server (bertaut ke artefak verifikasi tanda tangan Domain E) dan bahwa kunci rahasia tersimpan hanya di sisi server. | PSE Permenkominfo 5/2020; skema tanda tangan gateway (Midtrans SHA512, Xendit X-CALLBACK-TOKEN, iPaymu HMAC-SHA256) |

## Kapan berhenti dan menyewa manusia

Domain ini memegang keputusan eskalasi untuk seluruh audit, jadi garisnya ditarik di sini secara penuh. Datangkan peninjau manusia independen saat salah satu dari ini benar:

- Sebuah temuan pada permukaan uang, login, atau data-pribadi kembali terbuka, dan kamu tidak bisa menjelaskan penuh kenapa itu terjadi atau memastikan bahwa perbaikannya menutupnya. Lubang yang terkonfirmasi yang tidak kamu pahami, pada permukaan yang penting, bukan tempat untuk membujuk diri sendiri ke "kemungkinan sudah diperbaiki".
- Aplikasimu menyimpan data pribadi dan melayani banyak pengguna atau beberapa pelanggan terpisah (S3 dengan S5), dan daftar temuan terpadu memuat apa pun yang kamu pilih untuk diterima alih-alih diperbaiki. Menerima sebuah risiko pada sistem bersama yang memegang data orang sungguhan adalah keputusan yang pantas mendapat sepasang mata kedua berbayar sebelum kamu memfinalkannya.
- Sebuah tindakan di aplikasimu tidak bisa dibatalkan, dan ia bergabung dengan uang atau skala (S6 dengan S1 atau S5), dan ada temuan terbuka yang menyentuh tindakan itu. Tindakan yang permanen, bernilai tinggi, atau berjangkauan luas mendapat lewat-manusia sebelum rilis, karena tidak ada rollback untuk diandalkan.
- Sebuah agen AI di aplikasimu bisa bertindak sendiri (S4), dan temuan keamanan atau pengekangan belum semuanya tertutup bersih. Agen otonom dengan temuan akses yang belum tuntas seharusnya tidak berjalan tanpa ditinjau.
- Tumpukannya sederhananya lebih besar atau lebih ruwet daripada yang bisa kamu pikirkan, dan kamu mendapati dirimu memercayai laporan yang terlihat bersih karena membaca lebih jauh itu sulit. Perasaan itu adalah efek kepercayaan-berlebih yang terdokumentasi, dan ia sendiri adalah alasan untuk eskalasi.

Apa yang ditambahkan manusia, dan apa yang jujurnya tidak bisa dilakukan audit ini, dibahas di Domain K (pen-test dan review profesional). Versi pendeknya berhak ada di sini juga, karena ia masukan untuk keputusan ini. Audit AI yang dijalankan dengan baik, di konteks yang bersih dan idealnya dengan model yang berbeda, menangkap sebagian bermakna dari bug serius dengan murah. Ia juga melewatkan sebagian besar bug yang ditanam saat bekerja sendiri: dalam pengukuran terbersih yang tersedia, bahkan kondisi terbaik hanya menangkap sekitar 28,6 persen kesalahan yang ditanam (Cross-Context Review, arXiv:2603.12123). Kira-kira tujuh dari sepuluh lolos. Itu lewat-pertama yang berguna dan titik mulai yang sungguh lebih tinggi untuk peninjau berbayar. Ia bukan jaminan keamanan, dan memperlakukannya sebagai jaminan akan menyerahkanmu rasa nyaman palsu yang persis menjadi alasan keberadaan protokol ini untuk mencabutnya. Untuk aplikasi yang membawa taruhan nyata, langkah yang benar bukan memilih antara audit AI dan audit manusia. Langkahnya adalah menjalankan audit AI dulu, memperbaiki yang ia temukan, lalu membayar manusia untuk mulai dari titik lebih tinggi yang ia tinggalkan.

## Instruksi agen

```
DOMAIN L: PUTUSKAN DAN BERTINDAK

Lingkup berdasarkan taruhan (permukaan domain ini adalah SELURUH himpunan temuan dari semua domain,
jadi taruhannya adalah gabungan taruhan di seluruh repo):
  Kalau aplikasi membawa taruhan nyata di mana pun (S1 uang, S2 auth, S3 data pribadi,
  S5 radius ledakan), jalankan STANDARD di sini: peringkat tiap temuan berdasarkan kemungkinan x dampak
  dan catat alasannya.
  Kalau beberapa taruhan bergabung, atau data pribadi di skala besar (S3 dengan S5), jalankan EXTRA-MILE:
  sebuah register risiko yang berdiri tetap plus keputusan terima-atau-perbaiki yang dicatat eksplisit per temuan.
  GARIS KERAS pada eskalasi (tugas inti domain ini):
    - Kalau agen AI bertindak sendiri (S4), keputusan sewa-manusia dipaksa menjadi YA
      untuk temuan yang kritis bagi keamanan.
    - Kalau sebuah tindakan tidak bisa dibatalkan (S6) dan bergabung dengan uang (S1) atau skala (S5),
      temuan belum-tuntas apa pun yang menyentuh tindakan itu memaksa eskalasi.
  Kalau aplikasi tidak punya uang, tidak ada auth, tidak ada data pribadi, tidak ada agen otonom, tidak ada radius
  ledakan, dan tidak ada tindakan tak-bisa-dibatalkan, triase ringan dan jawaban eskalasinya
  "kamu tidak perlu membayar siapa pun": peringkat beberapa temuan floor, perbaiki yang jelas,
  rilis. Jangan menyarankan audit berbayar untuk aplikasi yang tidak mempertaruhkan apa-apa.

Catatan kepercayaan-berlebih (ini domain tempat ia menggigit paling keras):
  Laporan yang terlihat bersih memproduksi kepercayaan yang belum dibenarkan fakta. Saat
  peninjau melewatkan sebuah kesalahan, kepercayaan mereka cenderung NAIK (efek terukur,
  Hedges' g = 0.85). Sajikan BUKTI dan konsekuensi terperingkat, jangan pernah penghiburan
  telanjang. Perlakukan pemeriksaan yang "tidak menemukan apa-apa" sebagai persis itu. Pemeriksaan
  bersih bukan bukti keamanan.

Catatan sirkularitas (lihat protokol circularity-guard):
  Agen yang menulis sebuah bug, lalu diminta mengonfirmasi perbaikannya sendiri di konteks yang sama, cenderung
  berkata sudah diperbaiki. Verifikasi tiap klaim perbaikan di konteks yang BERSIH dan baru terhadap
  artefak yang sama yang mengungkap bug itu, idealnya dengan model yang berbeda. "Sudah diperbaiki" bukan
  vonis; ia adalah bukti asli yang kini kembali bersih.

Hasilkan artefak berikut (bukan vonis):
  FLOOR:
    1. Daftar temuan terpadu: tiap temuan dari tiap domain, masing-masing dengan konsekuensi
       bisnisnya dalam bahasa biasa, kemungkinan kasar (gampang/sulit dipicu),
       dan sinyal taruhan yang ia sentuh kalau ada. Daftar penuhnya, tidak ada yang diringkas hilang.
    2. Daftar temuan terperingkat: diurutkan berdasarkan risiko bisnis (kemungkinan x dampak), tertinggi
       lebih dulu, tiap butir teratas membawa satu kalimat konsekuensi biasa (mis. "orang asing
       bisa membaca tagihan pelanggan mana pun dengan mengubah sebuah angka di address bar," bukan
       "IDOR, tinggi").
    3. Catatan keputusan: tiap temuan yang TIDAK diperbaiki segera, dengan disposisinya (perbaiki sekarang /
       perbaiki nanti pada tanggal yang dinyatakan / terima) dan satu baris alasan. Tidak ada temuan yang menggantung.
    4. Pernyataan risiko sisa: apa yang diperiksa dan kembali bersih (disusun sebagai "tidak
       menemukan apa-apa," ketiadaan temuan yang belum sampai pada "aman"), apa yang tidak bisa
       diperiksa dengan cara ini, dan satu catatan polos bahwa audit AI mengurangi risiko tanpa membuktikan keamanan.
  STANDARD (taruhan nyata apa pun: S1 / S2 / S3 / S5):
    5. Rencana perbaikan: temuan dipisah menjadi penghalang-rilis, perbaiki-segera (dengan jendela waktu), dan
       diterima, tiap penghalang dianotasi dengan sinyal taruhan yang memaksanya.
    6. Catatan verifikasi perbaikan: per temuan yang diperbaiki, artefak bukti asli dan
       hasil pengulangan yang menunjukkan masalahnya tidak lagi muncul, dilakukan di konteks yang bersih;
       perbaikan yang tidak bisa dikonfirmasi ditandai masih terbuka.
    7. Keputusan sewa-manusia: tiap gerbang (temuan terbuka tak-terjelaskan pada uang/auth/data-pribadi; data
       pribadi di skala besar; ketidakbisaan-dibatalkan; agen otonom) dengan jawaban ya/tidaknya dan bukti,
       dan vonis yang dihasilkan (lanjut, atau dapatkan review manusia independen) dalam kata-kata
       biasa berikut alasannya.
  EXTRA-MILE (data pribadi di skala besar, atau beberapa taruhan, atau eskalasi yang dipaksa):
    8. Register risiko: tiap temuan terlacak dengan dampak, kemungkinan, respons (perbaiki / terima
       / alihkan ke manusia / hindari), pemilik, dan tanggal tinjau; tanggal ia terakhir dijalankan ulang
       terhadap kode saat ini; risiko yang diterima dibawa dengan pembenarannya.
    9. Catatan eskalasi (kalau sebuah garis keras terpicu): gerbang yang memaksa review manusia, paket
       yang diserahkan ke peninjau (daftar temuan terpadu, catatan keputusan, catatan verifikasi
       perbaikan, pernyataan risiko sisa), dan konfirmasi bahwa audit AI dibingkai sebagai
       lewat-pertama yang memberi peninjau manusia titik mulai lebih tinggi.
  PENUTUPAN KEPATUHAN INDONESIA (produk komersial yang melayani pengguna Indonesia):
    10. Hasil status-pendaftaran: NIB (oss.go.id) diperoleh dan PSE Lingkup Privat (pse.komdigi.go.id)
        terdaftar, atau penanda kalau salah satu belum; pemicu komersialnya dicatat. Risiko non-kepatuhan
        = pemblokiran akses. (PSE Permenkominfo 5/2020)
    11. Hasil pemberitahuan-privasi: pemberitahuan privasi hidup dengan checkbox persetujuan eksplisit
        (tidak tercentang otomatis) dan pengungkapan penyimpanan luar negeri kalau memakai hosting asing.
        (UU PDP Pasal 20 + Pasal 56)
    12. Hasil jalur-penghapusan: jalur "hapus data saya"/penarikan persetujuan ada dan benar-benar membuang
        data (bertaut ke artefak Domain D), plus email kontak yang dipublikasikan. (UU PDP Pasal 7-9)
    13. Artefak kesiapan-kebocoran: template insiden 1 halaman (data terekspos, waktu/cara, pemulihan) +
        alamat tujuan, siap untuk tenggat 3x24 jam. (UU PDP Pasal 46-47)
    14. Hasil verifikasi-gateway: per gateway, tanda tangan/token callback diverifikasi di server
        (Midtrans SHA512 / Xendit X-CALLBACK-TOKEN / iPaymu HMAC-SHA256) dan kunci rahasia hanya
        di sisi server. (bertaut ke artefak Domain E)
    Dua taruhan yang membenarkan minimum ini: denda UU PDP hingga 2% pendapatan tahunan (Pasal 57)
    dan non-kepatuhan PSE yang menarik pemblokiran akses (pemblokiran). Jaga minimal-cukup;
    JANGAN naikkan ke paperwork ala GDPR.

Keluarkan tabel temuan dengan kolom berikut dan tidak lebih lemah dari bukti:
  | Tingkat keparahan | Risiko bisnis dalam kata-kata biasa | Artefak bukti | Citation | Saran perbaikan |

Untuk domain INI, keluarkan juga ringkasan keputusan yang menjadi muara sisa audit:
  - daftar terperingkat,
  - disposisi (perbaiki sekarang / nanti / terima) per temuan,
  - pernyataan risiko sisa,
  - vonis sewa-manusia (lanjut atau eskalasi) berikut alasannya.

Aturan:
  - Terjemahkan tiap temuan menjadi konsekuensi bisnis konkret yang dipahami non-coder.
    Peringkat berdasarkan apa yang dibebankan sebuah kesalahan (kemungkinan x dampak). Perlakukan label keparahan
    sebuah tool sebagai satu masukan ke peringkat itu, lalu peringkat berdasarkan biaya bisnisnya sendiri.
  - Cite hanya kendali yang disebut di domain ini (SSDF RV.2, AI RMF MANAGE, model penilaian
    risiko OWASP: kemungkinan x dampak; untuk penutupan Indonesia: PSE Permenkominfo 5/2020, UU PDP
    No. 27 Tahun 2022 Pasal 7-9, 16, 20, 46-47, 56, 57, skema tanda tangan gateway). Jangan mengarang ID.
  - Tidak ada vonis telanjang. "Terlihat aman, rilis saja" bukan temuan dan bukan keputusan. Tiap
    disposisi membawa alasannya; tiap "sudah diperbaiki" membawa bukti pengulangannya.
  - Diam tidak pernah berarti sukses. Pemeriksaan yang tidak menemukan apa-apa dilaporkan sebagai "tidak menemukan apa-apa".
    Laporkan temuan yang belum diputuskan sebagai belum tertangani; temuan yang belum tertangani belum diterima,
    ia terlewat.
  - Saat sebuah garis keras terpicu, katakan "dapatkan review manusia independen" dalam kata-kata biasa dan katakan
    kenapa. Jangan melunakkan eskalasi menjadi mungkin-mungkin.
  - Nyatakan plafon yang jujur: audit ini menangkap sebagian bermakna dari bug serius dan
    melewatkan sebagian besar bug yang ditanam saat sendiri (terukur terbaik ~28,6% F1). Ia lewat-pertama yang
    murah yang mengangkat peninjau manusia berbayar ke titik lebih tinggi. Jangan melebih-lebihkannya menjadi
    pengganti review profesional.
  - Kalau kamu tidak bisa menghasilkan artefak yang dituntut sebuah pemeriksaan, katakan begitu dan tandai pemeriksaan itu INCOMPLETE.
```

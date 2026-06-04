# NONA: Gambaran Umum

NONA adalah protokol audit gratis dan open-source untuk orang yang membangun aplikasi dengan alat coding AI (Lovable, Cursor, Bolt, Replit, v0, Claude Code, Codex, Windsurf, Copilot, Antigravity, dan lainnya) dan tidak bisa membaca kode yang keluar dari alat itu. Kamu taruh NONA ke dalam proyekmu. AI agent milikmu sendiri yang menjalankannya. Kamu dapat balik laporan dalam bahasa yang mudah dimengerti: apa saja yang bisa membahayakan bisnismu, apa yang harus diperbaiki duluan, dan satu momen di mana kamu sebaiknya berhenti dan bayar ahli manusia.

Halaman ini menjelaskan ide di balik NONA, kenapa NONA ada, bagaimana NONA tetap menyeluruh tanpa membuang-buang waktumu untuk hal yang tidak dibutuhkan aplikasimu, dua belas area yang dicakupnya, dan cara membaca file tiap area.

## Premisnya

Inilah celah yang NONA dibangun untuk menutupnya. Orang non-coder yang merilis aplikasi dengan alat AI tidak tahu apa yang dia tidak tahu. Kamu tidak bisa bertanya ke agent-mu "kode saya aman tidak?" lalu percaya jawabannya, karena kamu tidak tahu pertanyaan apa yang akan diajukan seorang engineer yang teliti, dan jempol dari alat yang sama yang menulis kodenya itu bukan bukti apa-apa. Kamu tidak punya daftar periksa itu di kepalamu. Kamu bahkan tidak tahu daftar periksa itu ada.

NONA adalah daftar periksa itu, ditulis hitam di atas putih. NONA membawa pengetahuan audit yang sudah dimiliki seorang engineer yang kompeten, pengetahuan yang sama yang bisa dijalankan AI agent-mu begitu dia diberi tahu apa yang harus dicari. Intinya: audit tidak pernah terhambat oleh apa yang kebetulan kamu tahu. Kamu tidak perlu tahu apa yang harus ditanyakan. NONA sudah menanyakannya, mewakili kamu, dan menyerahkan pertanyaan-pertanyaan itu ke agent-mu.

Ada masalah kedua yang lebih tajam, duduk di bawah masalah pertama. AI jenis yang sama yang menulis kodemu adalah AI yang sekarang kamu minta untuk memeriksanya. Ketika yang membangun dan yang memeriksa punya titik buta yang sama, si pemeriksa meloloskan persis kesalahan yang dibuat si pembangun. NONA memperlakukan lingkaran tertutup ini sebagai masalah utama dan memberi agent-mu metode untuk menyiasatinya. Metode itu punya halaman sendiri (`02-circularity-guard.md`) dan berjalan di sepanjang seluruh protokol.

## Apa yang membuat NONA berbeda

Per Juni 2026 ada banyak alat keamanan untuk vibe-coding. Scanner memeriksa situs live-mu untuk pola yang sudah dikenal lalu memberimu perbaikan untuk ditempel balik. Daftar periksa open-source mencantumkan aturan keamanan yang bisa dibaca agent-mu. Auditor manusia akan meninjau aplikasimu seharga beberapa ratus sampai beberapa ribu dolar per sesi. Masing-masing berguna. Masing-masing mencakup satu irisan.

NONA duduk di sebuah perpotongan yang, per Juni 2026, belum ditempati alat manapun yang ada:

- Gratis dan open-source. Kamu bisa membaca tiap barisnya. NONA sengaja dibuat dalam markdown polos, supaya kamu (atau siapa pun yang kamu percaya) bisa mengaudit si auditor sebelum menjalankannya.
- Dibuat untuk dikonsumsi dan dijalankan oleh AI agent-mu, bukan situs web yang kamu kunjungi atau PDF yang kamu cetak.
- Menyeluruh di dua belas area (A sampai L di bawah), tidak cuma keamanan. Bug yang benar-benar menenggelamkan aplikasi buatan AI sering kali kesalahan logika dan aturan bisnis yang memang luput dari jangkauan scanner keamanan: proses checkout yang bisa diakali supaya menagih nol rupiah, tombol hapus yang menghapus akun yang salah, fitur AI yang menghabiskan tagihan jutaan rupiah dalam semalam.
- Bertingkat. Tiga level kedalaman (floor sebagai dasar, standard sebagai standar wajar, extra-mile sebagai usaha lebih) supaya kedalaman audit cocok dengan risiko aplikasimu yang sebenarnya.
- Ditulis untuk orang yang tidak bisa membaca kode. Tiap istilah teknis dapat satu baris penjelasan sederhana saat pertama kali muncul. Tiap risiko dinyatakan sebagai konsekuensi bisnis konkret dalam bahasa sehari-hari.
- Bilingual sejak desain. Bahasa Inggris sudah lengkap sekarang. Lapisan Bahasa Indonesia menyusul, di kedalaman yang sama, supaya maknanya selamat melewati penerjemahan, tidak sekadar tempelan tipis.

Pembingkaian jujur tentang apa itu NONA: sebuah lapisan penerjemahan dan pemilihan di atas otoritas keamanan yang nyata, bernama jelas, dan bertanggal, dikemas supaya agent-mu bisa menjalankannya. NONA bukan riset keamanan orisinal, dan tidak berpura-pura begitu. Tiap pemeriksaan di tingkat floor dan standard mengarah ke kontrol yang sudah diterbitkan dan bisa kamu cek sendiri. Peta kontrol-kontrol itu ada di `../CITATIONS.md`.

## Bagaimana tingkat dan gerbang taruhan bekerja bersama

Bagian sulit dari audit yang menyeluruh adalah bahwa menyeluruh gampang berubah jadi mubazir. Kalau NONA menjalankan tiap praktik kelas atas pada tiap aplikasi, dia akan menyuruh orang yang cuma membuat aplikasi daftar tugas akhir pekan untuk menyiapkan program bug bounty dan latihan chaos. Itu bukan kehati-hatian. Itu hiasan emas berlebihan, dan itu akan mengajarimu untuk mengabaikan laporannya.

NONA mengatasi ini dengan dua bagian yang bekerja bersama: tiga tingkat kedalaman, dan satu gerbang yang memutuskan tingkat mana yang layak untuk tiap area.

Tiga tingkat itu:

- Floor (dasar). "Apakah ada yang sudah mengerjakan hal yang sudah jelas?" Garis dasar yang tidak bisa ditawar untuk tiap aplikasi, sekecil apa pun. Melewatkan floor adalah cara aplikasi dirilis dengan pintu terbuka lebar.
- Standard (standar wajar). "Apa yang akan dikerjakan tim yang kompeten." Level yang akan diharapkan seorang profesional yang teliti untuk aplikasi yang menangani taruhan nyata seperti login atau data pelanggan.
- Extra-mile (usaha lebih). Garis depan. Praktik yang bahkan tim engineering kuat anggap sebagai usaha tambahan yang opsional: penetration testing adversarial (uji coba membobol dari sudut pandang penyerang), pagar pengaman biaya AI, pola containment yang mengurung AI agent, threat modeling formal (pemetaan ancaman secara terstruktur). NONA memperlakukan tingkat ini sebagai bintang yang dibangun utuh dan hanya memberikannya kalau taruhannya memang membenarkan.

Gerbang yang menetapkan tingkat ini membaca aplikasimu untuk enam sinyal taruhan: uang nyata, login dan identitas, data pribadi, AI yang bisa bertindak sendiri, radius ledakan yang besar (banyak pengguna atau infrastruktur yang dipakai bareng), dan aksi yang tidak bisa dibatalkan. Daftar lengkapnya, dengan definisi yang pasti, ada di halaman berikutnya (`01-stakes-gating.md`). Sinyalnya bersifat lokal. Sinyal cuma menaikkan area yang dia sentuh. Uang di halaman pembayaranmu menaikkan kedalaman pada pembayaran, bukan pada, misalnya, pemantauan uptime-mu.

Jadi logikanya berjalan begini. Area tanpa sinyal taruhan dapat floor dan berhenti di situ. Area dengan satu sinyal (dan bukan jenis yang paling berisiko) naik ke standard. Area dengan taruhan serius atau bertumpuk layak dapat extra-mile. Beberapa kombinasi tidak bisa ditawar: aplikasi di mana sebuah AI agent bisa mengambil aksi tanpa manusia menyetujui tiap aksi memaksa kedalaman extra-mile pada keamanannya, pada tinjauan kode-AI-nya, dan pada rencana penetration test-nya. Tiap panggilan API AI berbayar yang jalan di produksi memaksa pagar pengaman biaya sejak hari pertama, di tingkat floor, karena perulangan yang lepas kendali bisa menguras anggaran selagi kamu tidur.

Itulah yang menjaga kemenyeluruhannya tetap cerdas. NONA mengenal tiap area dari floor sampai garis depan, termasuk praktik kelas atas, lalu menerapkan hanya kedalaman yang dituntut risikomu yang sebenarnya. Protokolnya juga menyatakan kebalikannya dengan lantang: kalau aplikasimu tidak punya satu pun dari enam sinyal taruhan, agent-mu tidak boleh mengusulkan bug bounty, chaos engineering, target uptime formal, atau kampanye fuzzing. Merekomendasikan praktik kelas atas ke aplikasi taruhan rendah dihitung sebagai kegagalan menilai.

Ada satu floor kecil yang tidak pernah dilewati, bahkan saat taruhan nol: pakai aplikasimu sendiri seperti pengguna sungguhan sebelum dirilis, jalankan scanner otomatis gratis yang menangkap secret (kunci rahasia seperti password atau API key) yang bocor dan dependency (paket pihak ketiga) berisiko, bicarakan "ini bisa salah di mana" sekali sebelum peluncuran, dan kalau kamu melakukan panggilan AI berbayar apa pun, batasi pengeluarannya dan jalankan satu pemeriksaan dasar bahwa fitur AI itu berperilaku benar.

## Dua belas area (A sampai L)

NONA mencakup dua belas area. Hurufnya tetap. Tiap area punya filenya sendiri di folder ini.

- A. Verifikasi maksud (intent). Apakah kode melakukan hanya yang kamu minta, dan melakukannya dengan aman. "Berjalan" tidak sama dengan "aman".
- B. Secret, akses, RLS, IDOR, auth. Inti keamanan: menjaga kunci tetap tersembunyi, dan memastikan tiap pengguna cuma bisa menjangkau datanya sendiri. (RLS, row-level security, adalah aturan database yang membatasi baris mana yang boleh dilihat seorang pengguna. IDOR, insecure direct object reference, adalah saat orang asing membuka catatan milik orang lain dengan mengganti sebuah angka di alamat web.)
- C. Input dan injection. Membersihkan semua yang masuk dari dunia luar, termasuk prompt injection, yaitu saat teks jahat yang disuapkan ke fitur AI aplikasimu sendiri membajak apa yang dia lakukan.
- D. Data dan privasi. Bagaimana informasi pribadi disimpan, dijaga supaya tidak bocor, dan dihapus saat memang harus dihapus.
- E. Pembayaran, monetisasi, dan integritas biaya AI. Menagih dengan benar, menghalangi tipuan tagihan, dan menghentikan pengeluaran AI yang lepas kendali (serangan "denial-of-wallet", di mana yang jadi sasaran adalah tagihannya, bukan server-nya). (Webhook adalah pesan yang dikirim satu layanan ke layanan lain untuk memastikan sebuah peristiwa, misalnya pembayaran yang berhasil; webhook yang dipalsukan bisa memalsukan pesanan yang dianggap sudah dibayar.)
- F. Pola kode-buatan-AI dan lingkaran tertutup. Area khasnya: AI jenis yang sama menulis sekaligus mengaudit kode ini, jadi margin keamanan biasa berupa sepasang mata yang segar sudah hilang kecuali kamu membangunnya kembali dengan sengaja.
- G. Dependency dan rantai pasok (supply chain). Kode dari luar yang ditarik masuk aplikasimu, dan risiko sebuah package yang sebenarnya tidak ada atau sengaja ditanam supaya terlihat seperti yang disarankan AI-mu ("slopsquatting", saat penyerang mendaftarkan nama package palsu yang cenderung dihalusinasikan oleh alat AI).
- H. Kebersihan config dan deploy. Kesalahan setelan dan peluncuran: password bawaan yang dibiarkan, sebuah kunci rahasia yang ikut terkirim ke dalam bagian publik aplikasi, header keamanan yang hilang.
- I. Operasional, uptime, backup, rollback. Menyadari saat ada yang rusak, gagal dengan aman, dan bisa memulihkan serta membatalkan.
- J. Kewarasan arsitektur. Apakah desain keseluruhannya masuk akal: batas yang jelas antara yang dipercaya dan yang tidak, dan kerusakan tetap terkurung saat satu bagian gagal.
- K. Pen-test dan tinjauan profesional. Apa yang seharusnya diuji oleh sebuah simulasi serangan sungguhan, dan batas atas yang jujur tentang apa yang bisa ditemukan AI saat memeriksa AI.
- L. Putuskan dan bertindak. Mengurutkan temuan menurut risiko bisnis, dan aturan yang jelas tentang kapan harus berhenti dan menyewa manusia.

## Cara membaca file sebuah area

Tiap file area (A sampai L) ditata dengan cara yang sama, jadi begitu kamu sudah membaca satu, kamu bisa membaca semuanya. Berurutan, tiap file memberimu:

- Apa ini. Dua sampai empat kalimat sederhana tentang apa yang dicakup area ini.
- Apa yang tidak bisa kamu lihat di sini. Titik buta khusus untuk area ini: apa yang akan luput dari kamu, dan dari pemeriksaan-sendiri yang naif oleh agent-mu, dan kenapa.
- Kapan ini penting. Sinyal taruhan mana dari enam yang menaikkan area ini di atas floor, dan mendarat di level apa.
- Pemeriksaan floor, standard, dan extra-mile. Tiga tabel, satu per tingkat. Tiap baris adalah satu pemeriksaan yang ditulis sebagai instruksi yang bisa dijalankan agent-mu, dipasangkan dengan kenapa itu penting buat bisnismu dalam bahasa sederhana, bukti yang harus dihasilkan agent-mu, dan kontrol terbitan yang dirujuknya. Baris extra-mile juga menyebut sinyal taruhan yang membuatnya layak dan praktik garis depan yang diterapkannya.
- Kapan harus berhenti dan menyewa manusia. Garis, untuk area ini, di mana audit AI sudah mencapai batasnya dan tinjauan manusia independen adalah langkah berikutnya yang tepat.
- Instruksi untuk agent. Blok yang diserahkan NONA ke agent-mu untuk benar-benar menjalankan area itu: cocokkan cakupannya ke sinyal taruhanmu, jalankan di sesi terpisah yang bersih di tempat lingkaran tertutup jadi soal, hasilkan bukti yang terdaftar, dan kembalikan tabel temuan (tingkat keparahan, risiko bisnis dalam bahasa sederhana, bukti, kontrol yang dirujuk, dan saran perbaikan).

Dua aturan berjalan di sepanjang tiap file dan layak kamu pegang sambil membaca.

Pertama, NONA menuntut artefak, bukan vonis. Agent-mu tidak boleh cuma bilang "kelihatannya aman". Dia harus menghasilkan daftar nyata secret yang dia temukan, peta nyata siapa bisa menjangkau apa, hasil nyata dari pengecekan apakah sebuah package yang disarankan benar-benar ada. Skor kepercayaan tanpa apa-apa di belakangnya menciptakan kepercayaan palsu, dan kepercayaan palsu justru kegagalan yang NONA ada untuk melawannya. Bukti yang bisa kamu lihat lebih berharga daripada angka yang harus kamu percaya begitu saja.

Kedua, NONA jujur soal batas atasnya sendiri. AI yang memeriksa kode buatan AI menangkap irisan yang berarti dari bug serius dengan murah, dan dalam pengujian terukur dia melewatkan sebagian besar kesalahan yang ditanam saat bekerja sendirian. Itu keuntungan nyata pada batas yang nyata. Itu bukan pengganti penetration test profesional, dan di tempat sebuah studi datang dari vendor yang punya alasan untuk menakut-nakutimu, NONA mengatakannya dan mengutip penyeimbang akademik independen di sebelahnya. Bukti di balik klaim-klaim ini, beserta catatan kehati-hatiannya, dikumpulkan di `../docs/why-nona-exists.md`. Sikap batas-yang-jujur ada di `../README.md`. Glosarium bahasa sederhana untuk tiap istilah teknis ada di `../docs/glossary.md`.

NONA mengurangi risikomu. NONA tidak menjamin keamananmu. Baca, jalankan, perbaiki yang ditemukannya, dan bayar audit manusia pada hari Area L menyuruhmu begitu.

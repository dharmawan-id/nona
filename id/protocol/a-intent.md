# Domain A: Verifikasi Maksud (Intent Verification)

## Apa ini

Verifikasi maksud (intent verification, mencocokkan kode dengan apa yang sebenarnya kamu minta) menanyakan satu hal yang kedengarannya jelas tapi hampir tidak pernah benar-benar dijawab: apakah kode ini melakukan hanya apa yang kamu minta, dan apakah ia melakukannya dengan aman? Sebuah AI bisa menyerahkan fitur yang jalan, kelihatan benar, dan lolos tes buatannya sendiri, sambil diam-diam melakukan hal ekstra yang tidak pernah kamu minta, atau melakukan hal yang kamu minta dengan cara yang tidak aman. "Jalan" itu pernyataan soal apakah layar berperilaku seperti yang kamu harapkan. "Aman" itu pernyataan soal apa lagi yang bisa kode lakukan ketika ada orang menekan-nekannya. Keduanya klaim yang berbeda, dan jarak di antara keduanya lebar.

Ini adalah lantai (floor, baseline paling dasar) universal dari seluruh audit. Setiap domain lain dalam protokol ini berasumsi kamu sudah lebih dulu memastikan kode cocok dengan maksudmu yang sebenarnya. Kalau kamu melewatkan langkah ini, kamu sedang mengaudit keamanan sebuah fitur yang belum kamu pastikan adalah fitur yang kamu mau.

## Yang tidak bisa kamu lihat di sini

Kamu menjelaskan sebuah fitur dengan kata-kata biasa. Si AI mengubahnya jadi kode. Kamu baca hasilnya di layar, ia berperilaku baik, lalu kamu rilis. Yang tidak bisa kamu lihat adalah jarak antara kalimat yang kamu ketik dan kode yang akhirnya dirilis. Jarak itulah tempat bahayanya, dan secara definisi ia tak terlihat oleh non-coder (orang yang tidak bisa membaca kode): kamu menilai hasilnya dari menonton ia jalan, dan menonton ia jalan tidak memberitahumu apa pun soal apa yang ia lakukan di kasus-kasus yang tidak kamu klik.

Ada bukti keras untuk jarak ini. Dalam sebuah benchmark akademik 2025 atas sebuah AI coding agent pada 200 permintaan fitur dunia nyata (SUSVIBES, Zhao dkk., arXiv:2512.03262), kodenya 61% benar secara fungsional dan hanya 10,5% aman. Baca ulang itu: sebagian besar waktu ia menyelesaikan pekerjaan, dan hampir tidak pernah ia menyelesaikannya dengan aman. Kebenaran fungsional dan keamanan nyaris tidak berhubungan. Studi yang sama menemukan bahwa menambahkan petunjuk "bikin yang aman" ke permintaan tidak menutup jarak itu, jadi solusinya bukan prompt yang lebih bagus. Solusinya adalah pemeriksaan terstruktur, sesudah faktanya, oleh sesuatu yang tidak menulis kodenya.

Ada alasan kedua, alasan manusiawi, kenapa jarak ini tak terlihat. Sebuah studi Stanford yang sudah ditelaah sejawat (Perry dkk., ACM CCS 2023, arXiv:2211.03622) menemukan bahwa orang yang membangun dengan bantuan AI menulis kode yang kurang aman sambil percaya kodenya lebih aman dibanding orang yang tanpa bantuan AI. Bantuan itu menaikkan rasa percaya diri dan menurunkan keamanan pada saat yang sama. Jadi perasaan si pembuat sendiri bahwa "ini kelihatannya beres" di sini bukan cuma tidak bisa diandalkan, ia justru membelok ke arah yang salah persis ketika ada AI yang terlibat. Rasa percaya dirimu bukan bukti. Artefak (artifact, hasil konkret yang bisa diperiksa) yang dipaksa domain ini untuk diproduksi oleh agen itulah buktinya.

## Kapan ini penting (sinyal taruhan)

Verifikasi maksud adalah satu-satunya domain yang berjalan di FLOOR bahkan ketika tidak ada taruhan apa pun. Aplikasi to-do akhir pekan tanpa login, tanpa uang, tanpa data pengguna sungguhan tetap kena pemeriksaan floor di bawah ini, karena pertanyaan "apakah ini melakukan hanya apa yang aku minta" tidak pernah opsional. Tidak ada fitur yang terlalu kecil untuk melakukan sesuatu yang tidak kamu maksudkan.

Sinyal taruhan menentukan seberapa DALAM pemeriksaan maksud masuk pada permukaan domain ini, bukan apakah ia berjalan:

- S1 Uang (pembayaran, tagihan, pencairan dana, kredit yang punya nilai tunai) pada fitur ini: naikkan ke STANDARD. Pastikan fitur ini tidak juga memindahkan, memberikan, atau mengekspos uang lewat jalur yang tidak pernah kamu jelaskan.
- S2 Identitas/Auth (login, sesi, reset password, peran) pada fitur ini: naikkan ke STANDARD. Pastikan fitur ini tidak juga mengubah siapa seseorang atau apa yang boleh ia lakukan.
- S4 Otonomi (sebuah AI agent di dalam aplikasimu bisa mengambil aksi tanpa ada manusia yang menyetujui tiap aksi): naikkan ke EXTRA-MILE. Aksi otonom yang melenceng dari maksud akan mengeksekusi dirinya sendiri, tanpa ada momen di mana manusia bisa menangkapnya.
- S6 Tak terbalikkan (sebuah aksi tidak bisa dibatalkan: hapus, transfer, terbitkan, kirim): naikkan ke EXTRA-MILE. Kalau perilaku yang tak diinginkan itu permanen, kamu tidak dapat kesempatan kedua untuk melihatnya.

Kalau tidak ada satu pun dari S1 sampai S6 yang menyentuh fitur ini, jalankan FLOOR saja. Jangan melapisi fitur taruhan-rendah dengan pemeriksaan tingkat frontier secara berlebihan; itu kegagalan menimbang, bukan kerajinan ekstra.

### Pengait penerapan untuk Indonesia

Sebelum menjalankan apa pun, jawab satu pertanyaan dulu: apakah produk ini komersial dan melayani pengguna Indonesia? Jawaban tunggal itu menggerakkan dua hal sekaligus. Pertama, ia menentukan apakah kamu wajib mendaftar PSE (Penyelenggara Sistem Elektronik) Lingkup Privat: sebuah produk yang punya akun pengguna, menerima pembayaran, atau memasarkan/menjual ke pengguna Indonesia masuk kewajiban pendaftaran (Permenkominfo 5/2020). Detailnya ditangani di Domain H (ops dan deploy) dan Domain L (penutupan dan tindakan). Kedua, ia menentukan apakah UU PDP No. 27/2022 berlaku pada datamu: begitu kamu memproses data pribadi pengguna Indonesia (nama, email, no HP, dan sejenisnya), kewajiban minimal UU PDP menyala. Detailnya ditangani di Domain D (data dan privasi). Catat jawabannya di sini sebagai bagian dari maksud produk, lalu serahkan tindak lanjutnya ke D dan H. Sumber: Permenkominfo 5/2020 (PSE Lingkup Privat); UU PDP No. 27/2022.

## Pemeriksaan floor

Jangan pernah lewati ini, di aplikasi apa pun, pada level taruhan berapa pun.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus diproduksi agen | Sitasi |
|---|---|---|---|
| Tulis, dalam satu atau dua kalimat biasa per fitur, apa yang sebenarnya diminta pembuat dari kode ini. Lalu daftar, dari membaca kodenya, apa yang sebenarnya ia lakukan. Sandingkan kedua daftar itu berdampingan. | Kalau kamu tidak pernah menulis apa yang kamu mau, kamu tidak bisa tahu apakah kamu sudah mendapatkannya. Sandingan itu satu-satunya cara melihat fitur yang melakukan lebih dari yang kamu minta. | Tabel "maksud vs perilaku": kolom kiri maksud yang dinyatakan pembuat per fitur, kolom kanan perilaku yang teramati dari kode, dengan setiap baris yang berbeda ditandai. | A06 Insecure Design; NIST SSDF PW.1 |
| Daftar setiap aksi yang bisa kode ini ambil di luar satu fitur yang dijelaskan: setiap tabel lain yang ia tulisi, setiap endpoint lain yang ia panggil, setiap email/pesan/file yang ia kirim, setiap rekaman yang ia hapus. | Sebuah form login yang juga menulis ke tabel tagihan, atau "simpan draf" yang juga menerbitkan, adalah jangkauan-berlebih khas AI. Kamu minta satu hal; kodenya melakukan tiga. Dua yang tidak kamu minta itulah tempat pelanggan terkena masalah. | "Daftar efek samping": setiap penulisan, panggilan, pengiriman, atau penghapusan yang fitur ini lakukan, masing-masing ditandai "diharapkan" (cocok dengan maksud) atau "tak terduga" (tandai untuk ditinjau). | A06 Insecure Design |
| Pastikan fitur diuji untuk apa yang TIDAK boleh terjadi, bukan hanya untuk apa yang seharusnya. Daftar kasus yang ditangani kode ketika diberi input buruk, kosong, atau bermusuhan, bukan cuma jalur mulus (happy path). | Tes yang lolos membuktikan fitur jalan ketika dipakai dengan benar. Ia tidak berkata apa pun soal apa yang terjadi ketika seseorang sengaja memakainya dengan salah. Kasus yang tidak diuji siapa pun adalah kasus yang pertama kali akan ditemukan penyerang. | Daftar singkat kasus "jalur tidak mulus" yang benar-benar ditangani kode (input kosong, tipe salah, izin hilang, input kebesaran) dan kasus yang tidak ditangani, supaya celahnya kelihatan. | A06 Insecure Design; NIST SSDF PW.1 |
| Nyatakan dengan jelas apa arti "benar dan aman" untuk tiap fitur sebelum menilai kode terhadapnya, supaya keberhasilan diukur dengan standar tertulis, bukan dengan firasat. | Kalau standar "selesai" cuma "kelihatan benar pas aku coba", kamu sedang mempercayai firasat yang sama yang menurut bukti Stanford menunjuk ke arah salah ketika AI terlibat. Standar tertulis adalah sesuatu yang bisa diperiksa agen; firasat tidak. | Satu paragraf "definisi benar dan aman" per fitur, ditulis sebelum kode dinilai, yang lalu dipakai untuk mengecek tabel maksud vs perilaku. | NIST SSDF PW.1 |

## Pemeriksaan standard

Tim yang kompeten melakukan ini. Jalankan pada permukaan domain ini ketika S1 (uang) atau S2 (identitas/auth) menyentuh fitur, sesuai sinyal taruhan di atas.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus diproduksi agen | Sitasi |
|---|---|---|---|
| Untuk fitur apa pun yang menyentuh uang atau identitas, telusuri setiap jalur kode yang bisa diambil input dari masuk sampai hasil, bukan hanya jalur yang kamu klik. Pastikan tiap cabang tetap cocok dengan maksud. | Jalur yang kamu uji cuma satu dari beberapa. Fitur "transfer Rp10.000" yang juga menerima angka negatif lalu mentransfer uang ke arah sebaliknya akan lolos tesmu dan gagal buat semua orang lain. Cabang yang tidak pernah kamu lewati secara definisi belum teraudit. | Telusur jalur per fitur uang/identitas: tiap cabang yang bisa diambil kode (tiap `if`, tiap kasus error, tiap peran) didaftar bersama hasilnya, dan tiap cabang yang hasilnya tidak cocok dengan maksud yang dinyatakan ditandai. | OWASP API Security Top 10 2023 (API6 Unrestricted Access to Sensitive Business Flows) |
| Pastikan fitur benar-benar menegakkan aturan yang kamu maksudkan di tingkat server, sampai server menolak aksinya. Tombol yang disembunyikan masih meninggalkan aksinya bisa dipanggil; cek bahwa server menolaknya, bukan hanya mengandalkan layar yang menghilangkan pilihan. | Menyembunyikan tombol "hapus pengguna lain" di tampilan tidak menghentikan seseorang memanggil aksi yang mendasarinya secara langsung. Kalau maksudnya "hanya admin yang boleh", penegakannya harus ada di kode server. Aturan yang cuma hidup di tampilan tinggal jadi hiasan. | Untuk tiap aturan yang dimaksudkan pembuat ("hanya pemilik yang boleh mengedit", "hanya pengguna berbayar yang boleh mengekspor"), bukti bahwa kode sisi server mengeceknya, dengan lokasi persis pengecekan itu, atau penanda bahwa aturannya hanya ada di tampilan. | OWASP Top 10:2025 A06 Insecure Design |
| Cek bahwa desain fitur mencakup kontrol keamanan yang diasumsikan pembuat sudah ada, bukan berasumsi si AI menambahkannya karena itu "sudah jelas". | Non-coder berasumsi AI mengisi pengaman yang sudah jelas (rate limit, cek kepemilikan, batas input) karena seorang profesional manusia akan begitu. Bukti berkata ia sering tidak begitu, dan bilang "bikin yang aman" tidak membuatnya begitu. Sebuah kontrol yang diasumsikan-tapi-tidak-ada adalah lubang yang bentuknya persis seperti harapanmu. | "Daftar kontrol yang hilang": kontrol keamanan yang akan diharapkan orang yang wajar ada di fitur ini, masing-masing ditandai ada (dengan lokasi) atau tidak ada (tandai), diukur terhadap definisi benar dan aman yang tertulis. | NIST SSDF PW.1; OWASP Top 10:2025 A06 Insecure Design |

## Pemeriksaan extra-mile

Ketelitian tingkat frontier (paling depan). Bahkan tim engineering yang kuat memperlakukan ini sebagai upaya ekstra dan tambahan. Jalankan pada permukaan domain ini hanya ketika gerbang taruhan memaksanya, seperti yang ditandai.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus diproduksi agen | Sitasi | Gerbang taruhan + pola frontier |
|---|---|---|---|---|
| Bangun evals-dan-golden-suite kecil untuk fitur ini: satu set input tetap (termasuk yang bermusuhan) yang dipasangkan dengan output dan perilaku persis yang boleh diterima, lalu jalankan fitur terhadapnya pada tiap perubahan supaya pelencengan maksud tertangkap otomatis. | Ketika sebuah AI agent bisa bertindak sendiri, kamu tidak bisa mengawasi tiap aksi dengan tangan. Golden suite adalah satu-satunya hal yang berdiri di antara "fitur masih melakukan apa yang aku maksudkan" dan "fitur berubah di bawahku dan tidak ada yang sadar". Ia mengubah maksud jadi sesuatu yang dicek ulang mesin untukmu. | Artefak golden-suite: daftar kasus input, perilaku/output yang ditegaskan boleh diterima untuk masing-masing, dan satu hasil lolos/gagal yang menunjukkan kode saat ini terhadap tiap kasus. | NIST SSDF PW.1; OWASP Top 10 for LLM Apps 2025 LLM09 Misinformation | Dipaksa oleh S4 Otonomi. Pola frontier: evals + golden suites. |
| Tambahkan langkah verifikasi-output yang secara mandiri mengecek hasil fitur terhadap hasil yang dimaksudkan sebelum hasil itu dikomit, terutama untuk aksi yang tak terbalikkan, supaya hasil yang melenceng dari maksud tertangkap sebelum ia berlaku. | Kalau aksinya tidak bisa dibatalkan (transfer, penghapusan, posting publik, pesan terkirim), menangkap kesalahan sesudahnya itu tidak ada gunanya. Langkah verifikasi yang berjalan sebelum aksi dikomit adalah beda antara "kita berhasil menangkapnya" dan "ia sudah hilang". | Artefak verifikasi-output: pengecekan mandiri yang dijalankan kode atas hasilnya sendiri, apa yang ia bandingkan (hasil yang dimaksudkan), dan apa yang ia lakukan saat keduanya tidak cocok (blokir, tahan untuk manusia, gulung balik/rollback), dengan bukti pengecekan itu menyala sebelum langkah tak terbalikkan. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; OWASP Top 10 for LLM Apps 2025 LLM05 Improper Output Handling | Dipaksa oleh S6 Tak terbalikkan (dan S4 Otonomi). Pola frontier: harness verifikasi-output (self-consistency). |
| Hadapkan fitur pada threat model (pemetaan ancaman) tertulis dan formal: telusuri bagaimana seseorang akan dengan sengaja membuatnya melakukan sesuatu di luar maksud, dokumentasikan tiap jalur penyalahgunaan, dan pastikan ada kontrol yang memblokir masing-masing. | Pemeriksaan floor menanyakan "apa yang ia lakukan". Ini menanyakan "apa yang bisa dibuat seseorang yang bertekad agar ia lakukan". Untuk fitur yang berjalan sendiri atau tidak bisa dibatalkan, jarak antara dua pertanyaan itu adalah tempat penyerang sungguhan beroperasi, dan satu-satunya cara menutupnya adalah berpikir seperti dia di atas kertas dulu. | Sebuah threat model tertulis untuk fitur: daftar jalur penumbangan maksud yang bisa dipakai penyerang, kontrol yang memblokir masing-masing, dan tiap jalur tanpa kontrol ditandai sebagai risiko sisa (residual risk). | OWASP Top 10:2025 A06 Insecure Design; NIST SSDF PW.1 | Dipaksa oleh S4 Otonomi atau S6 Tak terbalikkan. Pola frontier: threat model formal. |

## Kapan berhenti dan menyewa manusia

Datangkan peninjau manusia independen untuk domain ini ketika salah satu dari ini benar:

- Fitur menyentuh uang atau identitas DAN tabel maksud-vs-perilaku atau telusur jalur menunjukkan perbedaan yang tidak sepenuhnya kamu pahami. Ketidakcocokan yang tidak bisa kamu jelaskan pada jalur uang atau identitas bukan tempat untuk menebak.
- Sebuah AI agent di aplikasimu bisa mengambil aksi sendiri (S4), dan kamu tidak bisa mendapat daftar efek samping dan golden suite yang bersih dan lengkap untuk aksi-aksi itu. Otonomi yang tidak bisa sepenuhnya kamu pertanggungjawabkan adalah otonomi yang tidak seharusnya kamu jalankan tanpa ditinjau.
- Fitur melakukan aksi yang tak terbalikkan (S6) dan langkah verifikasi-output tidak menyala secara andal sebelum aksi dikomit. Aksi permanen tanpa pengecekan pra-komit layak dapat penilaian manusia.

Protokol ini menangkap sebagian berarti dari celah maksud dengan murah. Ia bukan jaminan, dan AI yang mengecek AI lebih lemah daripada peninjauan manusia independen pada kasus-kasus yang paling penting. Domain K membahas apa yang ditambah peninjauan profesional dan di mana batas jujurnya berada. Untuk fitur bertaruhan tinggi, arahkan ke sana.

## Instruksi agen

```
DOMAIN A: VERIFIKASI MAKSUD

Lingkup berdasarkan taruhan:
  Selalu jalankan FLOOR. Maksud adalah floor universal; ia berjalan bahkan pada taruhan nol.
  Kalau S1 (uang) atau S2 (identitas/auth) menyentuh sebuah fitur, tambahkan STANDARD pada fitur itu.
  Kalau S4 (otonomi) atau S6 (tak terbalikkan) menyentuh sebuah fitur, tambahkan EXTRA-MILE pada fitur itu.
  Kalau sebuah fitur punya sinyal taruhan nol, jalankan FLOOR saja. JANGAN tambahkan evals, harness
  verifikasi-output, atau threat model formal ke fitur bertaruhan nol.

Catatan penerapan untuk Indonesia:
  Konfirmasikan dulu: apakah produk komersial dan melayani pengguna Indonesia? Jawaban itu menggerakkan
  pendaftaran PSE Lingkup Privat (lihat Domain H dan L, Permenkominfo 5/2020) dan keberlakuan UU PDP
  No. 27/2022 atas data pribadi (lihat Domain D). Catat jawabannya sebagai bagian dari maksud produk.

Catatan sirkularitas (lihat protokol circularity-guard):
  Verifikasi maksud justru tempat self-audit dalam konteks yang sama gagal: agen yang menulis kode
  "tahu apa yang ia maksudkan" lalu menilai ke arah itu, bukan ke arah apa yang sebenarnya diminta.
  Jalankan domain ini dalam konteks BERSIH dan baru tanpa akses ke rasional pembangunan. Lebih baik
  pakai model yang berbeda dari yang menulis kodenya. Baca maksud yang dinyatakan pembuat dan kode
  apa adanya; jangan merekonstruksi penalaran si penulis.

Produksikan artefak ini (bukan vonis):
  FLOOR:
    1. Tabel maksud-vs-perilaku: per fitur, maksud yang dinyatakan vs perilaku teramati, perbedaan ditandai.
    2. Daftar efek samping: tiap penulisan/panggilan/pengiriman/penghapusan fitur, masing-masing "diharapkan" atau "tak terduga".
    3. Daftar jalur-tidak-mulus: kasus input buruk/kosong/bermusuhan yang ditangani kode, dan celah yang tidak.
    4. Definisi benar-dan-aman: satu paragraf per fitur, ditulis sebelum menilai kode.
  STANDARD (fitur uang/identitas):
    5. Telusur jalur: tiap cabang yang bisa diambil input, dengan hasil, cabang yang melenceng dari maksud ditandai.
    6. Bukti penegakan-server: per aturan yang dimaksudkan, di mana server (bukan layar) menegakkannya, atau penanda.
    7. Daftar kontrol-hilang: kontrol keamanan yang diharapkan ada (dengan lokasi) atau tidak ada (ditandai).
  EXTRA-MILE (fitur otonomi/tak terbalikkan):
    8. Golden suite: kasus input + perilaku boleh-diterima yang ditegaskan + hasil lolos/gagal saat ini.
    9. Artefak verifikasi-output: pengecekan pra-komit, apa yang ia bandingkan, apa yang ia lakukan saat tak cocok.
    10. Threat model: jalur penumbangan maksud, kontrol yang memblokir masing-masing, jalur tak terkontrol sebagai risiko sisa.

Keluarkan tabel temuan dengan kolom ini dan tidak ada yang lebih lemah dari bukti:
  | Tingkat keparahan | Risiko bisnis dalam kata biasa | Artefak bukti | Sitasi | Saran perbaikan |

Aturan:
  - Terjemahkan tiap temuan jadi konsekuensi bisnis konkret yang dipahami non-coder.
  - Sitasi hanya kontrol yang disebut dalam domain ini (A06, A08, PW.1, API6, LLM05, LLM09). Jangan mengarang ID.
  - Tidak ada vonis telanjang. "Kelihatannya beres" bukan temuan. Lampirkan artefak yang membuktikan klaimnya.
  - Kalau kamu tidak bisa memproduksi artefak yang dituntut sebuah pemeriksaan, katakan begitu dan tandai pemeriksaan itu INCOMPLETE.
```

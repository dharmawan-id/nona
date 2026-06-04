# Domain E: Pembayaran, Monetisasi, dan Biaya AI

## Apa ini

Domain ini mencakup setiap tempat di mana uang atau pemakaian berbayar mengalir lewat aplikasimu: menerima pembayaran, mencatat bahwa sebuah pembayaran berhasil, memberikan kredit atau langganan, mengukur pemakaian, dan memanggil layanan AI berbayar yang menagihmu per request. Bahayanya bukan cuma "bisakah orang asing mencuri nomor kartu". Tapi juga "bisakah seseorang mendapat paket berbayar secara gratis", "bisakah sebuah skrip menyalahgunakan alur yang membuatmu keluar uang di tiap jalannya", dan "bisakah pemakaian AI-mu diam-diam menghasilkan tagihan yang tak sanggup kamu bayar". Penyedia pembayaran mengurus data kartu; aplikasimu tetap harus memverifikasi apa yang penyedia itu beri tahu, memberikan hanya yang benar-benar dibayar, dan memasang langit-langit untuk apa pun yang membelanjakan uang atas namamu.

## Yang tidak kelihatan di sini

Ketika sebuah tool pembayaran menjatuhkan tombol checkout ke aplikasimu dan uang masuk ke rekeningmu saat pengujian, kelihatannya sudah selesai. Bagian yang tidak kamu lihat adalah segala hal yang terjadi setelah pelanggan membayar. Penyedia pembayaran mengirim aplikasimu sebuah pesan kecil di latar belakang (sebuah "webhook", yaitu notifikasi otomatis dari server ke server yang berkata "order 123 sudah dibayar") dan aplikasimu seharusnya bereaksi dengan membuka produknya. Dua kegagalan bersembunyi di sini dan keduanya tidak muncul di pengujian biasa.

Pertama, sebuah webhook bisa dipalsukan. Siapa pun yang mengetahui atau menebak alamat webhook-mu bisa mengirim aplikasimu pesan "pembayaran berhasil" yang palsu, dan kalau aplikasimu memercayainya tanpa mengecek tanda tangan kriptografis (signature, kode yang membuktikan pesan itu benar dari penyedianya) yang dilampirkan penyedia, penyerang mendapat produk berbayarmu secara gratis. Agen AI-mu sendiri, ketika hanya diminta "bikin checkout berfungsi", biasanya akan merangkai jalur yang mulus saja dan melewati pengecekan signature, karena jalur yang mulus itulah yang diuji dan jalur pemalsuannya tidak terlihat sampai ada yang mengeksploitasinya.

Kedua, jumlah, paket, dan order bisa diutak-atik. Kalau aplikasimu membaca harga atau nama paket dari request checkout yang dikirim browser, seorang pengguna bisa menyunting request itu dan membayar seratus rupiah untuk paket yang harganya lima puluh ribu. Perbaikannya adalah mengabaikan apa yang diklaim browser dan mengecek ulang harga sebenarnya serta status order sebenarnya terhadap database-mu sendiri dan catatan penyedianya. Ini jenis hal yang tidak bisa diperiksa oleh seorang non-coder, dan cenderung diloloskan oleh self-review yang dilakukan di konteks yang sama oleh AI yang sama yang menulisnya, karena kodenya "berfungsi" di demo.

Titik buta terbaru adalah biaya. Kalau aplikasimu memanggil layanan AI berbayar, tiap request membelanjakan uang sungguhan, dan sebuah loop otomatis atau pengguna yang menyalahgunakan bisa menaikkannya dengan cepat. Kasus yang dilaporkan menggambarkan sebuah organisasi membelanjakan sekitar USD 500 juta ke satu penyedia AI dalam satu bulan, dan Uber dilaporkan menghabiskan anggaran AI tahunannya dalam empat bulan. Angka persis itu berasal dari satu laporan sekunder dan sebaiknya dibaca sebagai ilustrasi, bukan angka presisi, tapi polanya nyata dan terdokumentasi: pemakaian AI tanpa batas adalah cerita tagihan cloud kebablasan versi baru, dan orang yang menjalankan loop agen adalah yang paling kecil kemungkinannya melihat ini datang.

## Kapan ini penting (sinyal taruhan)

Tier untuk domain ini ditentukan oleh sinyal taruhan mana yang menyentuh permukaan uang atau pemakaian berbayar.

- **S1 Uang** (aplikasi menangani pembayaran, penagihan, payout, atau kredit yang punya nilai tunai): memaksa domain ini ke **standard** minimal.
- **S6 Ketidakbisaan-dibatalkan** (sebuah tagihan, payout, atau pemberian kredit tidak bisa dibatalkan dengan bersih): memaksa domain ini ke **standard** minimal.
- **S5 Radius dampak** (banyak pengguna, multi-tenant, API publik, penagihan bersama): jika dikombinasikan dengan S1 atau S6, memaksa domain ini ke **extra-mile**.

Sebuah aturan keras sejak hari pertama duduk di atas hitungan tadi: kalau aplikasi memanggil layanan AI berbayar di produksi, pengaman biaya AI (sebuah batas pengeluaran keras dan sebuah batas peringatan lunak) wajib ada di tingkat **floor**, bahkan ketika tidak ada sinyal lain yang hadir. Aplikasi kecil tanpa pembayaran tapi punya panggilan AI berbayar yang hidup tetap layak mendapat pemeriksaan batas-biaya floor, karena tagihannya nyata sejak request pertama.

Kalau tidak ada satu pun dari S1, S5, atau S6 yang menyentuh permukaan ini dan tidak ada panggilan AI berbayar, hanya floor yang berlaku, dan kamu tidak perlu membangun pertahanan rumit terhadap penyalahgunaan penagihan untuk sebuah alur yang tidak menggerakkan uang.

## Pemeriksaan floor

Jangan pernah dilewati ketika ada alur uang atau pemakaian berbayar apa pun. Kalau ada panggilan AI berbayar, dua baris batas-biaya berlaku bahkan tanpa pembayaran.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Temukan setiap endpoint webhook yang dipanggil penyedia pembayaran, dan pastikan masing-masing memverifikasi signature dari penyedia sebelum memercayai pesannya. | Tanpa itu, siapa pun yang menemukan alamat webhook bisa mengirim "pembayaran berhasil" yang palsu dan mendapat produk berbayarmu secara gratis. | Daftar setiap rute webhook pembayaran (file dan path), dan untuk masing-masing baris persis yang mengecek signature, atau catatan eksplisit "TIDAK ADA PENGECEKAN SIGNATURE" yang menyebut nama rute yang tak terlindungi itu. | OWASP Top 10:2025 A08 (Software or Data Integrity Failures); OWASP Top 10:2025 A01 (Broken Access Control) |
| Pastikan aplikasi memutuskan apa yang dibuka berdasarkan jumlah, paket, dan status order yang ia baca ulang dari database-nya sendiri dan dari penyedia, tidak pernah dari nilai yang dikirim browser. | Seorang pengguna bisa menyunting request checkout dan membayar seratus rupiah untuk paket lima puluh ribu kalau aplikasi memercayai angka dari browser. | Kode sisi server yang memberikan akses, dianotasi untuk menunjukkan dari mana harga, paket, dan status-terbayar berasal (database sendiri atau lookup ke penyedia), dan baris yang ditandai untuk setiap nilai yang diambil dari body request yang masuk. | OWASP API Security Top 10 2023 API6 (Unrestricted Access to Sensitive Business Flows) |
| Pastikan webhook yang berulang atau diputar-ulang tidak bisa memberikan produk dua kali atau menagih ganda (idempotency: event yang sama, kalau diproses lagi, tidak berdampak apa-apa dengan aman). | Penyedia mengirim ulang webhook saat timeout; tanpa pengaman, satu pembayaran sungguhan bisa memberi kredit dua kali atau memicu payout ganda. | Mekanisme yang mencatat ID event yang sudah diproses (tabel atau key) dan pengecekan yang melewati event yang sudah pernah dilihat, atau catatan bahwa pengiriman ulang dibiarkan tanpa pengaman. | OWASP Top 10:2025 A08 (Software or Data Integrity Failures) |
| Pastikan semua secret key milik penyedia pembayaran (server key, signing secret untuk webhook) hanya hidup di server dan tidak pernah ada di bundle browser atau di git. | Sebuah secret key di kode sisi-klien atau di repo publik membuat siapa pun bisa menagih, refund, atau membaca data pembayaran sebagai dirimu. | Hasil pemindaian bundle klien dan riwayat git untuk pola key penyedia: temuan sebenarnya (bersih, atau lokasi persis key yang terekspos jika ada). | OWASP Top 10:2025 A02 (Security Misconfiguration); OWASP Top 10:2025 A04 (Cryptographic Failures) |
| Kalau aplikasi memanggil layanan AI berbayar, pastikan ada batas pengeluaran total yang keras yang menghentikan pemakaian saat tercapai. | Sebuah loop kebablasan atau pengguna yang menyalahgunakan bisa menghasilkan tagihan jauh di atas apa pun yang sanggup kamu bayar, tanpa berhenti otomatis. | Konfigurasi atau kode persis yang menegakkan batas keras itu (limit anggaran di tingkat penyedia atau penghitung di dalam aplikasi yang memblokir panggilan lebih lanjut), dengan nilai limitnya dinyatakan. | OWASP Top 10 for LLM Apps 2025 LLM10 (Unbounded Consumption) |
| Kalau aplikasi memanggil layanan AI berbayar, pastikan ada rate limit (batasi jumlah panggilan per pengguna/IP dalam rentang waktu) per pengguna atau per sesi supaya satu pihak tidak bisa mendorong panggilan AI berbayar tanpa batas. | Satu pengguna (atau satu loop yang macet) bisa menghabiskan seluruh anggaran dan menutup layanan untuk semua orang sambil menumpuk biaya. | Aturan rate limit yang diterapkan ke jalur AI-berbayar (cakupan, ambang, dan di mana ia ditegakkan), atau catatan bahwa jalur itu tidak dibatasi per pengguna. | OWASP Top 10 for LLM Apps 2025 LLM10 (Unbounded Consumption) |

### Lapisan Indonesia: verifikasi signature per gateway

Sebuah builder yang memakai gateway pembayaran berlisensi (Midtrans, Xendit, iPaymu, DOKU) sebagai **merchant** tidak butuh lisensi Bank Indonesia (PJP, Penyedia Jasa Pembayaran) atau lisensi OJK sendiri. Gateway-lah yang memegang lisensinya; merchant mewarisi kepatuhan dengan memakainya. Jadi yang diaudit di sini adalah keamanan integrasinya saja, dan tidak ada dorongan apa pun ke arah perizinan. Aturan lisensi mengikat penyedia dan agregator, bukan merchant biasa (OJK POJK 4/2025 berlaku 26 Feb 2025; aturan BI PJP).

Baris floor pertama di atas (verifikasi signature webhook) di Indonesia berarti pengecekan konkret per gateway. Pakai skema persis milik gateway yang kamu integrasikan:

| Gateway | Cara memverifikasi callback itu asli | Kesalahan umum yang harus ditandai |
|---|---|---|
| **Midtrans** | Hitung ulang `SHA512(order_id + status_code + gross_amount + ServerKey)` lalu bandingkan dengan field `signature_key` di body notifikasi. Kalau tidak cocok, abaikan. ServerKey bersifat rahasia. | Memercayai body webhook tanpa menghitung ulang signature; memakai ClientKey alih-alih ServerKey; membandingkan tanpa cara yang waktunya konstan. Sumber: docs.midtrans.com (HTTP Notification / Receiving Notifications). |
| **Xendit** | Setiap webhook membawa header `X-CALLBACK-TOKEN`. Bandingkan dengan token verifikasi akunmu (dari dashboard Xendit). Tolak kalau tidak ada atau tidak cocok. | Token statis ini satu-satunya pengecekan identitas yang Xendit beri, jadi membocorkannya atau melewati pengecekan header berarti siapa pun bisa memalsukan callback. Juga: jangan men-log token-nya. Sumber: help.xendit.co + docs.xendit.co (Handling webhooks / Integration security). |
| **iPaymu** | Request/callback memakai HMAC-SHA256. StringToSign = `HTTPMethod:VaNumber:lowercase(SHA256(RequestBody)):ApiKey`, dikirim di header `signature` bersama `va` dan `timestamp` (format YYYYMMDDhhmmss). Signature tidak valid mengembalikan 401. | Mem-hash body dengan encoding JSON yang salah (harus sama persis, mis. slash tidak di-escape), salah huruf besar/kecil (harus lowercase), atau melewati verifikasi sama sekali. Sumber: ipaymu.com API docs + sampel GitHub iPaymu. |

Di atas pengecekan signature itu, dua lapis berikut tetap berlaku untuk semua gateway, sejajar dengan baris floor "baca ulang dari database sendiri" dan "idempotency": validasi ulang `gross_amount`, ID order, dan status terhadap apa yang awalnya kamu minta (signature valid pun belum membuktikan jumlahnya benar), dan pastikan callback berulang tidak bisa memberi produk dua kali. ServerKey, ApiKey, dan X-CALLBACK-TOKEN harus hidup di env var sisi server saja, tidak pernah di bundle publik Next.js, tidak pernah di repo (ini menyambung ke Domain C secrets dan Domain G config). Sumber: NONA Lane Indonesia, bagian 3.

### Lapisan Indonesia: catatan QRIS

Kalau produk menampilkan atau bergantung pada QRIS (standar Bank Indonesia dan ASPI), tiga hal yang relevan untuk diaudit:

- Jangan pernah memperlakukan screenshot bukti pembayaran yang diunggah pengguna sebagai konfirmasi. Hanya callback gateway yang sudah terverifikasi (atau status API) yang mengonfirmasi pembayaran. Screenshot mudah dipalsukan.
- Untuk alur di dalam aplikasi, utamakan QRIS dinamis (per transaksi, nominal terkunci) daripada QRIS statis. QRIS dinamis mengikat pembayaran ke satu transaksi dengan jumlah yang sudah pasti.
- Kalau kamu memang menampilkan QRIS statis, pastikan ia dihasilkan di sisi server dari acquirer berlisensi dan tidak bisa disunting pengguna. Penipuan QRIS dunia nyata yang dominan bersifat operasional (stiker QRIS palsu yang ditempel menutupi yang asli, atau kasir menukar QRIS merchant dengan QRIS pribadi), jadi QR yang bisa diubah-ubah di sisi klien adalah risiko yang nyata.

Sumber: NONA Lane Indonesia, bagian 3 (advisori BI dan acquirer 2024-2025; klaim kebocoran data terkait QRIS pada 2025 adalah klaim pelaku, belum dikonfirmasi BI, perlakukan sebagai sinyal risiko untuk meminimalkan data pembayaran yang disimpan, bukan sebagai fakta).

## Pemeriksaan standard

Tim yang kompeten melakukan ini begitu S1 atau S6 menyentuh permukaan ini.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation |
|---|---|---|---|
| Petakan setiap alur yang menggerakkan uang atau menghabiskan kuota (checkout, upgrade, refund, payout, pemberian kredit, penukaran kupon) dan pastikan masing-masing terlindungi dari penyalahgunaan otomatis (throttling, bot/captcha, batas per akun di tempat yang tepat). | Alur yang membuatmu keluar uang di tiap jalannya akan diskrip: penukaran kupon massal, penyalahgunaan refund, pengurasan payout, perburuan bonus pendaftaran. | Tabel alur bisnis yang berdampak tunai atau kuota, dan untuk masing-masing perlindungan penyalahgunaan yang ada, atau "TIDAK TERLINDUNGI" beserta penyalahgunaan konkret yang ia buka, dalam kata-kata biasa. | OWASP API Security Top 10 2023 API6 (Unrestricted Access to Sensitive Business Flows) |
| Pastikan hanya akun yang memiliki sebuah pembayaran, langganan, atau invoice yang bisa membaca atau mengubahnya, dengan mengecek ulang kepemilikan di server untuk setiap akses ke record penagihan. | Kalau tidak, orang asing bisa membuka invoice pelanggan lain atau membatalkan langganan mereka cuma dengan mengubah sebuah ID di address bar. | Pengecekan authorization di tiap rute record-penagihan (siapa yang diizinkan, bagaimana kepemilikan dikonfirmasi di sisi server), atau rute yang ditandai karena mengembalikan record tanpa pengecekan kepemilikan. | OWASP API Security Top 10 2023 API6 (Unrestricted Access to Sensitive Business Flows); OWASP Top 10:2025 A01 (Broken Access Control) |
| Pastikan event pembayaran dan penagihan dicatat dengan detail yang cukup untuk menyelidiki sengketa dan mendeteksi penyalahgunaan (siapa, berapa jumlahnya, order mana, kapan, berhasil atau gagal). | Tanpa jejak uang, kamu tidak bisa menyelesaikan chargeback, membuktikan berapa yang ditagihkan ke pelanggan, atau menyadari serangan pengurasan yang sedang berlangsung. | Contoh entri log penagihan sebenarnya (field yang dicatat), dan catatan untuk aksi penggerak-uang mana pun yang tidak menghasilkan log. | OWASP Top 10:2025 A09 (Security Logging and Alerting Failures) |
| Pastikan kegagalan pembayaran dan kegagalan panggilan AI ditangani dengan sengaja supaya tagihan yang gagal atau error dari penyedia meninggalkan akun dalam keadaan yang benar dan tidak memberi akses (fail closed, bukan fail open). | Error yang salah ditangani bisa memberikan produk padahal tagihannya sebenarnya gagal, atau menagih pelanggan sambil menampilkan error ke mereka. | Jalur kode untuk kegagalan pembayaran dan error penyedia, dianotasi untuk menunjukkan keadaan akun yang dihasilkan, dan jalur mana pun yang memberi akses atas pembayaran yang belum dikonfirmasi atau gagal. | OWASP Top 10:2025 A10 (Mishandling of Exceptional Conditions) |
| Kalau aplikasi memanggil layanan AI berbayar, tambahkan batas per-pengguna-per-hari dan per-sesi plus ambang peringatan lunak (alert atau turunkan ke model yang lebih murah sebelum batas keras). | Batas berlapis menangkap pengurasan lambat yang dilewatkan oleh satu batas total, dan peringatan lunak memberimu waktu bereaksi sebelum penghentian keras. | Batas yang dikonfigurasi (per sesi, per pengguna per hari, total) dan aksi ambang-lunaknya, ditunjukkan sebagai setelan atau kode sebenarnya. | OWASP Top 10 for LLM Apps 2025 LLM10 (Unbounded Consumption) |

## Pemeriksaan extra-mile

Ketelitian tingkat frontier. Tiap baris menyebut gerbang taruhan yang membenarkannya dan pola bernama yang dipakai. Jangan terapkan ini ke alur yang tidak menggerakkan uang atau ke aplikasi bertaruhan rendah.

| Pemeriksaan | Kenapa ini penting buat bisnismu | Bukti yang harus dihasilkan agen | Citation | Gerbang taruhan + pola frontier |
|---|---|---|---|---|
| Jalankan tinjauan terfokus atas setiap alur bisnis yang punya nilai tunai atau kuota sebagai sasaran penyalahgunaan, dengan benar-benar mencoba penyalahgunaannya (webhook yang diputar ulang, jumlah yang diutak-atik, refund berulang, perburuan kupon) lalu mencatat apa yang dibiarkan aplikasi. Inilah red-teaming alur bisnis. | Alur uang diserang oleh otomasi, bukan keingintahuan; satu lintasan penyalahgunaan yang disengaja menemukan celah yang tak pernah dipicu pengujian biasa. | Log hasil per alur: penyalahgunaan yang dicoba, respons aplikasi, dan lulus atau gagal beserta buktinya (request dan hasil). | OWASP API Security Top 10 2023 API6 (Unrestricted Access to Sensitive Business Flows) | Dipaksa oleh S1 + S5 (uang dalam skala). Pola frontier: red-teaming alur bisnis. |
| Tambahkan rantai model fallback supaya gangguan, rate limit, atau error dari satu penyedia otomatis mencoba ulang di model cadangan, menjaga fitur berbayar tetap hidup tanpa melepas batas pengeluaran. | Satu penyedia AI yang turun atau membatasi laju bisa membuat fitur yang menghasilkan pendapatan jadi mati; percobaan ulang yang tak terkendali juga bisa membengkakkan biaya. | Konfigurasi fallback (model utama, cadangan berurutan, kondisi pemicu) dan konfirmasi bahwa batas biaya tetap berlaku di sepanjang rantai itu. | OWASP Top 10 for LLM Apps 2025 LLM10 (Unbounded Consumption) | Dipaksa oleh AI berbayar di jalur pendapatan atau jalur kritis (S1/S5). Pola frontier: rantai model fallback. |
| Untuk kode apa pun yang memutuskan atau memicu pembayaran, payout, atau pemberian kredit, wajibkan tinjauan oleh model dari garis keturunan yang berbeda dari yang menulisnya, plus gerbang persetujuan manusia sebelum aksi uang yang tak bisa dibatalkan dijalankan. | Model yang sama yang menulis logika penagihan cenderung mengiyakan kesalahannya sendiri; peninjau yang berbeda dan gerbang manusia menghentikan pengeluaran yang salah atau yang dibajak sebelum ia tak bisa dibatalkan. | Catatan tinjauan (model mana yang meninjau, apa yang ia tandai) dan lokasi gerbang persetujuan manusia yang menjaga aksi yang tak bisa dibatalkan itu. | OWASP Top 10:2025 A08 (Software or Data Integrity Failures); OWASP API Security Top 10 2023 API6 (Unrestricted Access to Sensitive Business Flows) | Dipaksa oleh S1 atau S6 pada pengeluaran yang diputuskan AI. Pola frontier: tinjauan lintas-garis-keturunan-model + gerbang persetujuan manusia. |
| Bangun eval kecil (satu set input emas berikut penilainya) dan monitor pemakaian saat berjalan untuk fitur AI berbayar, supaya perubahan prompt atau model yang memperburuk output atau melonjakkan biaya tertangkap sebelum rilis dan terpantau sesudahnya. | Tanpa pengukuran, satu utak-atik prompt atau pergantian model bisa diam-diam menaikkan biaya per request atau menurunkan kualitas, dan kamu baru tahu dari tagihan atau keluhan. | Set tes emas dan output penilainya, plus monitor pemakaian dan biaya beserta ambang alert-nya. | OWASP Top 10 for LLM Apps 2025 LLM10 (Unbounded Consumption); NIST AI RMF 1.0 / AI 100-1 (MEASURE) | Dipaksa oleh fitur AI berbayar yang diandalkan pengguna (S1/S5). Pola frontier: eval golden suite + monitor pemakaian saat berjalan. |

## Kapan berhenti dan menyewa manusia

Datangkan profesional keamanan-pembayaran atau keamanan-aplikasi yang independen, dan jangan bersandar pada self-review AI saja, ketika salah satu dari ini benar: uang pelanggan sungguhan mengalir lewat aplikasi dalam volume; sebuah cacat bisa membuat pengguna mendapat paket berbayar gratis atau menguras payout; aplikasi mengeluarkan refund atau payout yang tidak bisa dibalik; atau sebuah fitur AI berbayar berjalan otonom di mana satu bug saja bisa menghasilkan tagihan yang menghancurkan. Review AI-atas-AI secara murah menangkap sebagian bermakna dari masalah ini, dan dalam uji terisolasi tetap melewatkan sebagian besar error yang ditanam, jadi ia mengurangi risiko tanpa menghilangkannya. Alur uang yang tidak bisa dibatalkan adalah persis tempat di mana risiko sisanya terlalu mahal untuk diterima atas dasar pemeriksaan otomatis, dan tinjauan manusia atas logika pembayaran dan penagihan layak dilakukan sebelum skala membesar.

## Instruksi agen

```
DOMAIN E: PEMBAYARAN, MONETISASI, DAN BIAYA AI

Lingkup berdasarkan sinyal taruhan:
  Deteksi apakah permukaan uang atau pemakaian-berbayar membawa S1 (uang), S5 (radius dampak), atau S6
  (ketidakbisaan-dibatalkan), dan apakah aplikasi membuat panggilan layanan AI berbayar apa pun di produksi.
  Tetapkan tier: floor secara default; standard kalau S1 atau S6 hadir; extra-mile kalau S1 atau S6
  dikombinasikan dengan S5. Terapkan dua baris floor batas-biaya AI kapan pun ada panggilan AI berbayar,
  terlepas dari sinyal lain. Jangan usulkan pertahanan penyalahgunaan-penagihan tingkat extra-mile untuk
  permukaan yang tidak menggerakkan uang.

Jalankan di konteks yang bersih dan baru tanpa akses ke rasionalisasi build kode ini, karena penalaran
  di sesi yang sama yang menghasilkan logika pembayaran dan penagihan cenderung mewarisi titik butanya.
  Pemisahan konteks adalah mekanisme terukur yang memperbaiki tingkat tangkapan di sini.

Hasilkan artefak, bukan vonis:
  Keluarkan daftar rute webhook sebenarnya beserta baris pengecekan signature (atau nama rute tak terlindungi),
  kode sisi server yang menunjukkan dari mana harga, paket, dan status-terbayar dibaca, mekanisme idempotency,
  hasil pemindaian secret pada bundle klien dan riwayat git, serta konfigurasi batas-biaya dan rate limit persis
  beserta nilainya. "Kelihatan aman" bukan output yang diterima; buktinya adalah output-nya.

Keluarkan tabel temuan dengan kolom berikut:
  | Tingkat keparahan | Risiko bisnis dalam kata-kata biasa | Artefak bukti | Citation | Saran perbaikan |
  Satu baris per temuan. Terjemahkan tiap temuan menjadi konsekuensi bisnis konkret (misalnya, "orang asing
  bisa membuka paket berbayar gratis dengan mengirim webhook pembayaran palsu", bukan "verifikasi signature
  hilang"). Cite hanya kendali yang disebut di domain ini. Untuk skema signature spesifik per gateway
  pembayaran, sebut maknanya yang biasa; di Indonesia, terapkan skema gateway yang sesuai: Midtrans
  (hitung ulang SHA512 dari order_id + status_code + gross_amount + ServerKey lalu bandingkan ke field
  signature_key), Xendit (verifikasi header X-CALLBACK-TOKEN terhadap token akun), iPaymu (HMAC-SHA256
  sesuai skemanya). Merchant yang memakai gateway berlisensi TIDAK butuh lisensi Bank Indonesia atau OJK.

Nyatakan risiko sisa:
  Kalau S1 atau S6 hadir dan temuan menyentuh alur uang yang tak bisa dibatalkan, akhiri dengan rekomendasi
  eksplisit dari "Kapan berhenti dan menyewa manusia", dengan catatan bahwa review otomatis ini mengurangi
  risiko tapi tidak menggantikan tinjauan profesional independen untuk alur uang bertaruhan tinggi.

Catatan idempotency dan never-trust-screenshot (Indonesia): gateway mengirim ulang webhook, jadi tandai tiap
  jalur pemenuhan yang bisa memberi-ganda pada callback berulang. Jangan pernah perlakukan screenshot bukti
  pembayaran yang diunggah pengguna sebagai konfirmasi; hanya callback gateway yang terverifikasi yang
  mengonfirmasi pembayaran. Utamakan QRIS dinamis (per transaksi, nominal terkunci); QRIS statis yang
  ditampilkan harus dihasilkan di sisi server dan tidak bisa disunting pengguna.
```

# Penjenjangan Risiko (Stakes Gating): bagaimana audit menyesuaikan dirinya dengan aplikasi kamu

Ini bagian yang menjaga audit tetap jujur ke dua arah. Bagian ini mencegah audit meloloskan aplikasi pembayaran cuma dengan lihat sekilas, sekaligus mencegah audit menimbun aplikasi to-do akhir pekan dengan pekerjaan keamanan yang tidak akan pernah dia butuhkan.

Audit ini tahu banyak hal. Dia tahu dua belas bidang (diberi huruf A sampai L), dan di dalam tiap bidang dia tahu tiga kedalaman pemeriksaan: lantai (floor), standar (standard), dan upaya ekstra (extra mile). Upaya ekstra mencakup praktik yang bahkan tim teknik kuat pun memperlakukannya sebagai pilihan tambahan, usaha yang diperpanjang. Menjalankan semuanya pada setiap aplikasi akan membuang waktu dan uang kamu. Jadi audit tidak melakukan itu. Dia lebih dulu mengukur seberapa besar yang sebenarnya dipertaruhkan di repository (kumpulan kode aplikasimu) yang spesifik milikmu, baru menaikkan kedalaman pemeriksaan hanya di tempat yang risikonya memang pantas.

Kamu tidak perlu tahu bagian mana yang berlaku. Justru itu intinya. Agen membaca kodemu, mengajukan beberapa pertanyaan sederhana untuk mengisi celah, lalu memutuskan. Sisa halaman ini adalah prosedur keputusan persis yang diikuti agen, ditulis lengkap supaya kamu bisa lihat tidak ada tebak-tebakan di dalamnya.

Tiga kedalaman, dengan bahasa sederhana:

- **Lantai (floor)** itu "apakah ada yang mengerjakan hal yang sudah jelas." Setiap aplikasi dapat lantai. Tanpa kecuali.
- **Standar (standard)** itu "apa yang dikerjakan tim yang kompeten." Diterapkan di tempat yang punya sesuatu nyata untuk dilindungi.
- **Upaya ekstra (extra mile)** itu garis terdepan: pola pengurungan (containment) untuk agen AI, pagar pengaman biaya (cost guardrail), threat model formal, tinjauan independen. Disimpan untuk aplikasi yang memang memikul risiko.

---

## Enam sinyal risiko (S1 sampai S6)

"Sinyal risiko" adalah sifat konkret dan bisa dicek dari aplikasimu yang berarti sebuah kesalahan di sini akan benar-benar menyakitkan. Agen memindai repository-mu untuk enam sinyal ini. Semuanya adalah fakta yang bisa diamati tentang kodemu, bukan opini, jadi dua agen berbeda yang melihat repo yang sama seharusnya menemukan sinyal yang sama.

- **S1 Uang.** Aplikasi menangani pembayaran, penagihan, pencairan dana (payout), atau kredit yang punya nilai tunai. Kesalahan di sini bisa memindahkan uang sungguhan ke tempat yang salah.
- **S2 Identitas/Auth.** Aplikasi punya login, sesi, reset kata sandi, atau peran dan izin. "Auth" itu singkatan dari authentication dan authorization: membuktikan siapa seseorang, dan menentukan apa yang boleh dia lakukan. Kesalahan di sini bisa membiarkan orang yang salah masuk, atau membiarkan user biasa bertindak sebagai admin.
- **S3 Data pribadi.** Aplikasi menyimpan PII, yaitu personally identifiable information (data yang bisa mengidentifikasi seseorang): email, nomor HP, nama, detail kesehatan, lokasi, pesan pribadi. Kesalahan di sini bisa membocorkan detail tentang orang sungguhan.
- **S4 Otonomi.** Sebuah agen AI di aplikasimu bisa mengambil tindakan sendiri, misalnya mengirim email, menjalankan kode, memanggil sebuah tool, atau membelanjakan uang, tanpa ada manusia yang menyetujui tiap tindakan lebih dulu. Kesalahan di sini berarti agen yang tertipu atau bingung bertindak sebelum ada yang bisa menghentikannya.
- **S5 Radius dampak (blast radius).** Satu kegagalan menyakiti banyak orang sekaligus: banyak user, beberapa pelanggan terpisah yang berbagi sistem yang sama (multi-tenant), API publik yang bisa dipanggil siapa saja, atau infrastruktur bersama. Kesalahan di sini tidak tinggal kecil.
- **S6 Tidak bisa dibatalkan (irreversibility).** Sebuah tindakan tidak bisa diurungkan begitu terjadi: hapus, transfer, terbitkan, kirim. Kesalahan di sini tidak bisa ditarik balik dengan permintaan maaf dan pengembalian dana.

Kenapa enam dan bukan sekadar "hati-hati": tiap sinyal menyebut satu alasan spesifik kenapa sebuah bug berubah jadi bencana, bukan cuma gangguan. Ketika agen merekomendasikan kerja tambahan, dia akan memberi tahu kamu sinyal mana yang memicunya ("kamu menyimpan data pribadi dan salah satu tindakan hapus-mu tidak bisa dibatalkan, maka..."). Itu celah yang ditutup di sini. Kamu tidak perlu tahu untuk bertanya. Sinyalnya yang bertanya untukmu.

---

## Bagaimana audit memutuskan kedalaman, satu bidang per satu bidang

Aturan paling penting di sini: **risiko itu bersifat lokal.** Aplikasi keuangan pribadi berisiko tinggi pada uang dan data pribadi, dan pada saat yang sama benar-benar berisiko rendah pada, katakanlah, perkakas pemantau uptime server. Akan keliru kalau menyeret bidang uptime itu naik ke pemeriksaan garis terdepan cuma karena bidang pembayarannya berisiko. Jadi agen menghitung kedalaman untuk masing-masing dari dua belas bidang secara terpisah, dengan hanya melihat sinyal risiko yang menyentuh permukaan bidang itu.

Berikut prosedur persis yang dijalankan agen. Baca sebagai resep, bukan sebagai kode yang perlu kamu rawat:

```
untuk tiap bidang A sampai L:
  sinyal_di_sini = sinyal risiko (S1 sampai S6) yang ada di permukaan bidang INI
  jika sinyal_di_sini == 0:                           tier = FLOOR
  jika sinyal_di_sini == 1 dan bukan (S4 atau S6):    tier = STANDARD
  selain itu:                                         tier = EXTRA_MILE
```

Dengan kata-kata:

- Kalau sebuah bidang **tidak punya** sinyal risiko sama sekali, dia dapat **lantai**. Kebersihan dasar yang sudah jelas, tidak lebih.
- Kalau sebuah bidang punya **tepat satu** sinyal, dan sinyal itu bukan otonomi (S4) atau tidak-bisa-dibatalkan (S6), dia dapat **standar**. Satu hal nyata untuk dilindungi pantas mendapat praktik tim yang kompeten.
- Kalau sebuah bidang punya **dua atau lebih** sinyal, atau punya sinyal otonomi maupun tidak-bisa-dibatalkan **berapa pun**, dia dapat **upaya ekstra**. Otonomi dan tidak-bisa-dibatalkan dipisahkan secara khusus karena masing-masing, dengan sendirinya, bisa mengubah bug kecil jadi malapetaka: agen yang bertindak sendiri, atau tindakan yang tidak bisa diurungkan.

Inilah yang membuat audit menyeluruh tanpa boros. Pengetahuan tentang garis terdepan selalu tersedia. Dia cuma menyala di tempat kodemu sendiri memang membutuhkannya.

---

## Pengesampingan keras (eskalasi ini berlaku tak peduli berapa pun hitungannya)

Ada beberapa situasi yang cukup berbahaya sampai agen mengeskalasinya secara prinsip, bahkan kalau hitungan sederhana di atas tidak. Hal-hal ini tidak bisa ditawar dan agen harus menerapkannya sebelum melapor.

- **S4 apa pun (agen AI bertindak sendiri) memaksa upaya ekstra pada tiga bidang: B (keamanan), F (pola kode hasil-AI), dan K (pen-test dan tinjauan profesional).** Konkretnya, agen lalu harus mengecek sandboxing (menjaga agen di ruang terbatas yang tidak bisa dia rusak), least-privilege (memberi agen hanya kuasa minimum yang dia perlukan), red-team prompt injection (sengaja mencoba menipu agen dengan instruksi tersembunyi sebelum penyerang yang melakukannya), dan setidaknya satu pola pengurungan (arsitektur yang membatasi sejauh apa agen yang berulah bisa menjangkau). Ini hal yang tidak bisa ditawar dalam membangun apa pun yang bertindak untukmu.
- **S1 apa pun (uang) atau S6 apa pun (tindakan tak bisa dibatalkan) memaksa setidaknya standar pada D (data dan privasi) dan E (pembayaran, monetisasi, dan integritas biaya AI).** Kalau aplikasi yang sama itu juga punya S5 (radius dampak, kegagalan mengenai banyak orang), kedua bidang itu naik sepenuhnya ke upaya ekstra.
- **Panggilan API AI berbayar apa pun yang berjalan di produksi memaksa pagar pengaman biaya (cost guardrail) di tingkat lantai, sejak hari pertama.** Sebuah "cost guardrail" adalah batas pengeluaran plus peringatan: batas per user per hari, batas per bulan, dan peringatan sebelum kamu menyentuh batas itu. Yang satu ini tidak menunggu tier yang lebih tinggi. Alasannya gamblang: loop AI yang lepas kendali tanpa batas bisa menghasilkan tagihan bencana selagi kamu tidur. Membatasi pengeluaran adalah bagian dari lantai untuk aplikasi apa pun yang membayar penyedia per panggilan.

---

## Aturan anti-rekayasa-berlebihan (dinyatakan terang-terangan, sengaja)

Menyandikan kapan harus **melewati** sama pentingnya dengan menyandikan apa yang harus dilakukan. Menerapkan praktik kelas atas secara berlebihan ke aplikasi berisiko rendah adalah sebuah kegagalan, bukan ketekunan. Itu membuang waktu dan uang si pembangun, dan tidak mengajari apa pun.

Maka aturannya dinyatakan keras-keras, dan agen terikat olehnya:

> Kalau nol sinyal risiko yang ada, agen TIDAK BOLEH mengusulkan bug bounty, chaos engineering, SLO formal, infrastruktur canary, atau kampanye fuzzing. Rekomendasikan hanya lantai.

Penjelasan singkat tentang apa yang agen diminta untuk tahan, karena ini justru istilah yang tidak akan diketahui orang non-koder:

- **Bug bounty** adalah membayar peneliti dari luar untuk menemukan lubang keamanan. Percuma sebelum kamu punya user sungguhan dan orang yang menangani laporannya.
- **Chaos engineering** adalah sengaja merusak sistemmu sendiri untuk menguji bahwa dia pulih. Tidak ada yang perlu dibuat tahan banting pada aplikasi yang belum ada yang bergantung padanya.
- **SLO formal** (service-level objective) adalah janji uptime tertulis seperti "menyala 99,9% sepanjang waktu", dengan aturan bahwa kamu berhenti merilis fitur saat kamu melanggarnya. Itu cuma sandiwara di skala hobi.
- **Infrastruktur canary** merilis sebuah perubahan ke sepotong kecil user dulu dan mengamatinya sebelum semua orang menerimanya. Berlebihan kalau seluruh audiensmu cuma segelintir orang.
- **Kampanye fuzzing** melempar ribuan input acak dan rusak ke kode untuk menemukan crash. Layak untuk kode yang mengurai input yang tidak tepercaya di bawah risiko nyata, bukan untuk formulir sederhana dengan validasi dasar.

Kalau aplikasimu tidak punya uang, tidak punya auth, tidak punya data pribadi, tidak punya agen otonom, tidak punya radius dampak, dan tidak punya tindakan yang tak bisa dibatalkan, jawaban jujurnya adalah kamu tidak butuh satu pun dari hal di atas, dan audit yang memaksakannya padamu cuma menjual kecemasan ke kamu.

---

## Lantai universal (tidak pernah dilewati, bahkan pada risiko nol)

Ada sekumpulan kecil praktik yang audit rekomendasikan untuk setiap aplikasi, termasuk aplikasi akhir pekan yang remeh. Bukan karena risikonya menuntut, tapi karena biayanya hampir nol dan si pembangun biasanya memang tidak tahu bahwa hal itu adalah praktik yang sudah punya nama dan normal dilakukan. Melewati hal-hal ini tidak pernah punya pembenaran.

1. **Dogfooding.** Pakai produkmu sendiri seperti cara pelanggan sungguhan, kerjakan tugas intinya, sebelum kamu merilisnya ke siapa pun. Ini praktik paling mudah diakses di seluruh daftar, dan dia menangkap masalah "secara teknis jalan, sebenarnya rusak" yang tidak akan ditangkap test otomatis mana pun.
2. **Pemindaian shift-left gratis.** "Shift-left" berarti menangkap masalah lebih awal, selagi membangun, bukan setelah peluncuran. Versi gratisnya adalah memasang pemindai otomatis yang berjalan sendiri: sebuah dependency scanner (menandai library yang kamu pakai yang punya celah keamanan diketahui), sebuah secret scanner (menandai kata sandi atau API key yang tak sengaja tertinggal di kode), dan analisis statis dasar (membaca kode untuk mencari kesalahan jelas tanpa menjalankannya).
3. **Satu obrolan pre-mortem.** Sebelum membangun sesuatu yang berarti, bayangkan ini setahun kemudian dan proyeknya gagal parah, lalu daftar alasan kenapa. Lalu perbaiki yang bisa kamu perbaiki sekarang. Ini cuma satu obrolan dengan agenmu dan dia andal memunculkan risiko yang kalau tidak begitu akan kamu lewatkan.
4. **Kalau aplikasi melakukan panggilan AI berbayar apa pun: batas biaya plus satu eval dasar.** Batas biaya adalah batas pengeluaran yang dijelaskan di bagian pengesampingan di atas. Sebuah "eval" adalah rapor kecil untuk sebuah fitur AI: segenggam kasus uji dan cara menilai apakah jawaban AI masih bagus setelah kamu mengubah prompt atau mengganti model, supaya kamu tidak diam-diam merilis versi yang lebih buruk.

Itulah lantainya. Murah, universal, dan cukup untuk aplikasi yang tidak memikul risiko nyata.

---

## Bagaimana agen mengetahui risiko kamu (dan lima pertanyaan untukmu)

Agen mengetahui sinyal risiko kamu dengan dua cara, dan memakai keduanya.

**Utama: dia membaca repository kamu.** Dia melihat kodemu untuk mencari bukti konkret tiap sinyal: library penyedia pembayaran dan handler webhook (S1), kode login dan sesi dan pengecekan peran (S2), tabel dan field database yang menyimpan data pribadi (S3), kode tempat sebuah agen AI memanggil tool atau mengambil tindakan tanpa gerbang manusia (S4), tanda-tanda banyak pelanggan berbagi satu sistem atau sebuah API publik (S5), dan tindakan yang secara permanen menghapus, mentransfer, menerbitkan, atau mengirim (S6). Membaca kode adalah sumber utama karena kode tidak salah ingat.

**Konfirmasi: dia mengajukan lima pertanyaan sederhana kepadamu.** Orang non-koder mungkin tidak menggambarkan risiko aplikasinya sendiri dengan akurat, dan sebagian sinyal lebih mudah dipastikan dengan bertanya daripada dengan menyimpulkan. Maka agen bertanya, dan memperlakukan jawaban "ya" sebagai sinyal yang ada walaupun dia tidak menemukannya di kode (dan sebagai dorongan untuk melihat lagi kalau kode tadi seolah berkata sebaliknya).

Agen harus mengajukan lima pertanyaan ini kepadamu, dengan bahasa sederhana, dan mencatat jawabanmu sebagai bagian dari audit:

1. **Apakah aplikasimu menyentuh uang dengan cara apa pun?** Apakah dia menerima pembayaran, menjalankan langganan atau penagihan, mencairkan dana ke siapa pun, atau membagikan kredit atau poin yang bernilai uang sungguhan? (Memastikan S1.)
2. **Apakah orang login?** Apakah ada akun, kata sandi, sign-in, reset kata sandi, atau gagasan peran berbeda seperti user biasa lawan admin? (Memastikan S2.)
3. **Apakah kamu menyimpan apa pun tentang orang sungguhan?** Nama, email, nomor HP, alamat, lokasi, detail kesehatan, pesan pribadi, apa pun yang mengidentifikasi seseorang? (Memastikan S3.)
4. **Apakah AI di aplikasimu bisa melakukan hal sendiri?** Apakah dia bisa mengirim email, menjalankan kode, memanggil layanan luar, mengubah data, atau membelanjakan uang tanpa kamu menyetujui tindakan spesifik itu lebih dulu? Dan terpisah dari itu, apakah ada tindakan di aplikasimu yang tidak bisa diurungkan setelah dilakukan, seperti menghapus akun, mentransfer sesuatu, menerbitkan, atau mengirim? (Memastikan S4 dan S6.)
5. **Kalau sesuatu rusak, berapa banyak orang yang terkena sekaligus?** Cuma kamu, atau segelintir teman, atau banyak orang asing, beberapa pelanggan terpisah di sistem yang sama, atau siapa saja yang bisa menjangkau alamat publik? (Memastikan S5.)

Lima pertanyaan, enam sinyal: pertanyaan empat sengaja mencakup otonomi sekaligus tidak-bisa-dibatalkan, sebab pembangun cenderung memikirkan "AI bertindak sendiri" dan "ini tidak bisa diurungkan" bersamaan. Jawabanmu, ditambah apa yang agen baca di kode, menentukan sinyal risiko yang menggerakkan tiap keputusan kedalaman di halaman ini. Begitu sinyal itu ditetapkan, prosedur per-bidang berjalan, pengesampingan diterapkan, aturan anti-rekayasa-berlebihan berlaku, dan audit tahu persis seberapa keras harus memeriksa masing-masing dari dua belas bidang, tidak lebih keras, tidak lebih lunak.

# Keamanan dan integritas NONA itu sendiri

NONA adalah sebuah file instruksi. AI agent kamu membacanya lalu mengikutinya, sama seperti ia membaca file konfigurasi lain di proyekmu. Memang itulah intinya: kamu taruh NONA, agen-mu mengambilnya, audit pun berjalan. Tapi itu juga berarti NONA berada di kelas file yang sengaja diincar penyerang, jadi halaman ini soal menjaga NONA sendiri tetap layak dipercaya.

Kalau kamu cuma sempat baca satu bagian, baca "Hal yang tidak akan pernah NONA suruh agen-mu lakukan" dan "Lima hal yang harus kamu lakukan sebelum memercayai salinan NONA mana pun".

## Kenapa file seperti ini jadi sasaran

Agen-mu memperlakukan file seperti NONA sebagai **konfigurasi tepercaya**: file rules, file skill, file instruksi-agen. Agen tidak mempertanyakannya. Ia menganggap siapa pun yang menaruh file itu memang ingin file itu dijalankan, lalu ia mengikuti instruksi di dalamnya. Peneliti yang menguji serangan terhadap kelas file ini persis (rules files, skill, instruksi agen) menemukan bahwa instruksi jahat yang ditanam berhasil lebih dari 85% kali melawan pertahanan yang ada sekarang, bahkan ketika pihak bertahan menyesuaikan diri (Maloyan dan Namiot, arXiv:2601.17548). Sebuah file rules yang sudah dijebak diam-diam bisa mengarahkan agen menjalankan perintah yang tidak pernah si pembangun setujui dan tidak pernah ia lihat.

Marketplace tempat orang berbagi file-file ini terbuka lebar. Sebuah vendor keamanan meninjau 3.984 agent skill yang dipasang publik dan menemukan 36,8% membawa cacat keamanan dalam bentuk apa pun, dan kira-kira 36% mengandung celah prompt injection, artinya teks tersembunyi yang membajak agen (Snyk, "ToxicSkills", 2026-02-05; ini analisis vendor, dimasukkan di sini karena sampelnya besar dan temuannya spesifik). Sebuah skill berjalan dengan izin penuh agen: ia bisa membaca dan menulis file kamu, membaca environment variable kamu (tempat password dan API key tinggal), dan mengirim pesan atas namamu. Jadi file yang diracuni bukan masalah kecil. Ia sebuah pijakan masuk.

Versi sederhana dari risikonya: orang asing yang berhasil menyodorkan satu instruksi jahat ke depan agen-mu bisa membuat agen-mu membocorkan secret kamu (password, API key, token), mengubah kodemu, atau bertindak atas namamu, dan kamu tidak akan tahu itu terjadi karena agen mengira ia cuma mengikuti aturan.

NONA ada di kelas file itu. Sisa halaman ini menjelaskan bagaimana NONA dibangun supaya ia bukan file yang berbahaya, dan bagaimana kamu memastikan salinan yang kamu pegang adalah yang asli.

## Hal yang tidak akan pernah NONA suruh agen-mu lakukan

NONA memberi agen-mu tepat dua jenis instruksi:

1. Baca kode milik si pembangun sendiri, yaitu repository kamu di mesinmu sendiri.
2. Laporkan apa yang ditemukan, dalam bentuk tabel temuan berisi risiko bisnis dalam bahasa sederhana, bukti yang ia hasilkan, sitasi, dan saran perbaikan.

Itu seluruh pekerjaannya. Baca kodemu, lapor balik.

NONA tidak memuat instruksi apa pun yang melakukan hal-hal di bawah ini, dan salinan yang memuatnya bukan salinan yang layak kamu percayai:

- Mengambil sesuatu dari internet lalu menjalankannya. NONA tidak pernah bilang "unduh ini lalu eksekusi", tidak pernah mengarahkan agen-mu ke script jarak jauh, tidak pernah menyuruhnya menarik konten dari luar lalu menuruti instruksi di dalam konten itu.
- Mengirim datamu ke mana pun. Tidak ada upload, tidak ada posting ke webhook (webhook itu sebuah URL yang menerima data secara otomatis), tidak ada pengiriman lewat email atau pesan untuk kode, secret, atau temuanmu ke pihak ketiga.
- Meraih kuasa lebih dari yang dibutuhkan untuk membaca kode. Tidak ada permintaan izin yang dinaikkan, tidak ada instalasi software, tidak ada sentuhan ke kredensial selain menyadari bahwa sebuah secret terekspos lalu memberitahumu.
- Menjalankan perintah shell yang mengubah sistemmu. Audit ini adalah satu kali baca dan satu kali lapor. Ia tidak mengubah file, database, atau deployment kamu dengan sendirinya.

NONA dikirim sebagai teks Markdown polos justru karena alasan ini. Kamu, atau siapa pun, bisa membukanya dan membaca setiap instruksi yang akan pernah ia berikan ke agen-mu. Tidak ada binary terkompilasi yang harus dipercaya begitu saja, tidak ada yang disembunyikan, tidak ada yang baru menunjukkan perilakunya setelah ia berjalan. Kalau ada instruksi di salinan NONA kamu yang akan membocorkan data, menaikkan hak akses, atau menjalankan konten dari luar, instruksi itu bukan bagian dari NONA, dan kamu sudah menemukan file yang dipalsukan atau yang menyamar.

## Lima hal yang harus kamu lakukan sebelum memercayai salinan NONA mana pun

Kamu sebentar lagi menyerahkan file ini ke sebuah agen yang akan membaca kodemu dengan akses luas ke mesinmu. Perlakukan serah-terima itu dengan kehati-hatian yang sama seperti saat memasang alat apa pun. Sebelum memercayai sebuah salinan:

1. **Baca dulu.** NONA sengaja dibuat bisa diaudit manusia. Buka file-nya dan baca sekilas. Yang kamu cari adalah aturan dua-pekerjaan di atas: baca kode, laporkan temuan. Kalau sebuah file menyuruh agen-mu mengambil-lalu-menjalankan, mengirim data keluar, atau memberi dirinya akses lebih, berhenti dan jangan pakai salinan itu. Kamu tidak perlu bisa membaca kode untuk mengenali baris yang berbunyi "kirim ini ke suatu tempat".

2. **Kunci ke versi atau tag tertentu.** Saat mengadopsi NONA, kunci ke sebuah release tag bernama, misalnya git tag `v0.1`. Branch yang bergerak seperti "latest" bisa berubah di bawahmu begitu kamu pull berikutnya, dan kamu jadi menjalankan instruksi yang tidak pernah kamu tinjau. Versi yang terkunci adalah sesuatu yang tetap dan diketahui, yang kamu tinjau sekali dan bisa kamu tinjau lagi. (Sebuah "tag" cuma label permanen yang git tempelkan ke satu snapshot file yang persis.)

3. **Verifikasi hash file-nya.** Hash itu sidik jari pendek yang dihitung dari isi sebuah file. Ubah satu karakter saja, sidik jarinya berubah total. Bandingkan hash dari salinan yang kamu unduh dengan hash yang dipublikasikan untuk versi itu di repository resmi. Kalau cocok, salinanmu sama persis byte demi byte dengan yang dipublikasikan. Kalau tidak cocok, salinanmu sudah diubah saat di perjalanan atau saat tersimpan, dan sebaiknya kamu buang. Agen-mu bisa menghitung dan membandingkan hash itu untukmu kalau kamu minta.

4. **Perlakukan fork pihak ketiga atau skill kemasan ulang mana pun sebagai tidak tepercaya sampai kamu meninjaunya.** Sebuah "fork" adalah salinan proyek ini milik orang lain, yang bebas mereka ubah. Kemasan ulang yang praktis, situs mirror, dan listing di marketplace justru tempat instruksi yang diracuni akan disisipkan, sesuai temuan marketplace di atas. Ambil NONA dari repository resmi, dan kalau kamu memang harus pakai fork atau build skill pihak ketiga, baca baris demi baris sebelum kamu biarkan ia menyentuh proyekmu. Jangan menganggap sebuah fork sama dengan aslinya hanya karena namanya sama.

5. **Jangan pernah biarkan audit bertindak atas konten luar yang tidak tepercaya.** NONA mengarahkan agen-mu ke kodemu. Pertahankan begitu. Jangan rangkai NONA ke dalam alur di mana ia menelan sebuah halaman web, potongan teks yang ditempel, file yang diunggah dari orang asing, atau teks tidak tepercaya lain lalu memperlakukan teks itu sebagai instruksi. Konten tidak tepercaya adalah jalan masuk serangan injection. Audit ini membaca repository kamu dan tidak ada yang lain.

Kalau kamu melakukan lima hal ini, file yang ditelan agen-mu adalah file yang sudah kamu lihat, kamu kunci, kamu cek sidik jarinya, kamu ambil dari tempat yang benar, dan kamu arahkan hanya ke kodemu sendiri.

## Catatan tentang apa yang halaman ini tidak janjikan

Mengikuti panduan ini menjaga NONA agar tidak jadi mata rantai yang lemah. Itu tidak membuat aplikasimu aman dengan sendirinya, dan tidak menggantikan penetration test profesional (seorang ahli yang dibayar untuk benar-benar mencoba membobol aplikasimu) untuk aplikasi yang memegang uang, banyak pengguna, aksi yang tak bisa dibatalkan, atau AI agent yang bertindak sendiri. Audit itu sendiri adalah pengurang risiko, dan batas jujur dari apa yang bisa ditangkap tinjauan AI dijelaskan di `docs/why-nona-exists.md`. Halaman ini lebih sempit: ia soal memercayai instruksi si auditor itu sendiri sebelum kamu menjalankannya.

## Melaporkan masalah keamanan

Kalau kamu menemukan masalah keamanan di NONA itu sendiri, sebuah kelemahan di instruksinya, cara protokol ini bisa diputarbalikkan melawan pengadopsi, atau salinan yang dipalsukan beredar di suatu tempat, tolong laporkan dengan membuka issue di repository proyek. Jelaskan apa yang kamu temukan dan cara mereproduksinya. Karena NONA itu teks polos tanpa perilaku tersembunyi, sebagian besar masalah bisa dibahas terbuka, yang juga membuat setiap pengadopsi mendapat manfaat dari perbaikannya.

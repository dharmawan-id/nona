# Berkontribusi ke NONA

Terima kasih sudah mau membuat NONA lebih baik. Hal paling berharga yang bisa kamu tambahkan adalah sebuah pemeriksaan baru: satu hal lagi yang dicari audit ini, ditulis sedemikian rupa sehingga orang non-coder paham apa taruhannya dan AI agent benar-benar bisa menjalankannya. Halaman ini menjelaskan cara mengusulkannya, cara menjaga banyak file proyek ini tetap sinkron, dan aturan menulis yang diikuti setiap kontribusi.

NONA dibaca oleh dua pembaca sekaligus: orang yang membangun aplikasi dengan alat AI dan tidak bisa membaca kodenya, dan AI agent milik orang itu. Semua yang kamu tulis harus melayani keduanya. Pegang itu, dan sebagian besar aturan di bawah akan terasa jelas dengan sendirinya.

## Cara mengusulkan pemeriksaan baru

Sebuah pemeriksaan layak masuk kalau dia lolos tiga ujian. Lewatkan salah satunya, dan maintainer akan mengembalikan usulanmu.

### 1. Dia bermuara ke otoritas nyata yang bernama jelas

Tiap pemeriksaan floor dan standard di NONA terpetakan ke kontrol yang sudah diterbitkan dan bertanggal: sebuah butir OWASP Top 10, sebuah syarat ASVS, sebuah praktik NIST SSDF, sebuah level build SLSA, sebuah benchmark CIS, sebuah checklist produksi dari vendor. Pemeriksaan itu adalah terjemahan bahasa-biasanya; kutipannya adalah yang membuatnya bisa dipertahankan. Usulan yang cuma bertumpu pada pendapatmu sendiri soal praktik yang baik belum jadi pemeriksaan NONA, sebijak apa pun sarannya.

Jadi sebelum apa pun, temukan otoritasnya. Sebut nama standarnya, versinya, dan tanggalnya. Peta lengkap apa saja yang sudah dikutip NONA ada di `CITATIONS.md`. Kalau pemeriksaanmu cocok dengan otoritas yang sudah terdaftar di sana, tunjuk ke situ. Kalau dia butuh otoritas baru, tambahkan sumbernya ke `CITATIONS.md` di perubahan yang sama, lengkap dengan versi dan tanggal terbitnya.

Dua aturan keras soal kutipan. Jangan pernah mengarang penanda kontrol. Kalau kamu tidak yakin sebuah nomor kontrol itu nyata dan masih berlaku, jangan cetak. Dan saat sebuah kontrol rapuh terhadap versi (sebuah nomor V di ASVS, sebuah seksi benchmark CIS yang bergeser antar-rilis), nyatakan makna sederhana pemeriksaannya lalu kutip standarnya di tingkat dokumen alih-alih menyebut sebuah nomor yang bisa keliru begitu rilis berikutnya keluar. Makna sederhananya adalah bagian yang awet; kutipannya adalah pertahanan di belakangnya.

Pemeriksaan extra-mile adalah satu-satunya tempat sebuah pemeriksaan boleh bertumpu pada praktik garis depan yang bernama jelas atau hasil riset, bukan standar dasar (sebuah pola containment, sebuah harness evaluasi, sebuah studi yang sudah diterbitkan). Sebut nama praktik atau makalahnya secara terus terang, dan katakan dengan jujur seberapa kuat buktinya. Kalau sebuah klaim datang dari vendor yang punya alasan untuk menakut-nakuti, beri label "angka dari vendor". Kalau efeknya nyata tetapi besarannya belum terkunci, rekomendasikan praktiknya sebagai kebijakan yang baik dan jangan menjanjikan angka tangkapan tertentu.

### 2. Dia ditulis untuk orang yang tidak bisa membaca kode

Pemeriksaan NONA bukan satu baris untuk engineer. Dia adalah instruksi yang bisa dibaca orang non-coder dan bisa dijalankan agent. Artinya:

- Bahasa yang sederhana. Saat sebuah istilah teknis pertama kali muncul, beri penjelasan satu klausa pendek dan pertahankan kata Inggrisnya, karena agent milik pembaca dan pencarian web mana pun bekerja berdasarkan istilah Inggris itu. Tulis "RLS (row-level security, aturan database yang membatasi baris mana yang boleh dilihat seorang pengguna)" sekali, lalu pakai RLS dengan bebas setelahnya.
- Sebuah konsekuensi bisnis, jangan cuma label kosong. Jangan tulis "ada IDOR." Tulis apa biayanya bagi orang yang punya aplikasinya: orang asing bisa membuka tagihan pelanggan lain mana pun dengan mengganti sebuah angka di alamat web. Pembaca memutuskan apa yang harus diperbaiki dengan memahami apa yang rusak, jadi jelaskan apa yang rusak.
- Kejujuran soal batas. Kalau sebuah pemeriksaan mengurangi risiko tanpa menghilangkannya, katakan begitu. NONA ada untuk melawan rasa aman yang palsu, jadi pemeriksaan yang menjual dirinya berlebihan justru bekerja melawan seluruh proyek ini.

Kalau kamu ragu apakah kalimatmu nyangkut buat orang non-coder, bacakan dengan suara keras seolah ke seseorang yang belum pernah membuka editor kode. Kalau dia butuh glosarium yang dia tidak punya, tulis ulang.

### 3. Dia menuntut sebuah artefak, bukan sebuah vonis

Inilah ujian yang paling sering gagal dipenuhi usulan, dan inilah yang paling dipedulikan NONA. Sebuah pemeriksaan harus menyuruh agent menghasilkan bukti yang bisa dilihat manusia, bukan menyerahkan sebuah penilaian yang harus dipercaya manusia begitu saja.

"Pastikan autentikasinya aman" bukan pemeriksaan. Itu meminta pendapat dari agent, dan pendapat dari jenis AI yang sama yang menulis kodenya bernilai sangat kecil. "Daftarkan tiap route yang mengubah data, dan untuk masing-masing tunjukkan baris persis yang memastikan pengguna boleh melakukan perubahan itu; tandai route mana pun yang tidak punya baris seperti itu" adalah pemeriksaan. Itu memaksa agent mengerjakan pekerjaannya dan menyerahkan kembali sesuatu yang bisa diperiksa oleh pemiliknya, atau oleh manusia yang dia bayar.

Jadi tulis pemeriksaanmu sebagai perintah yang bisa dijalankan agent, dan sebut artefak yang harus dia hasilkan: daftar nyata secret yang ditemukan, peta nyata siapa bisa menjangkau apa, hasil nyata dari pemeriksaan apakah sebuah package yang disarankan benar-benar ada di registry. Bukti yang bisa kamu lihat mengalahkan angka kepercayaan yang harus kamu telan dengan iman.

### Pemeriksaan ini masuk ke mana

NONA mencakup dua belas area, A sampai L, masing-masing dengan sebuah file di bawah `protocol/`. Cari area tempat pemeriksaanmu berada lalu tentukan tier-nya:

- floor, garis dasar yang tidak bisa ditawar yang dibutuhkan tiap aplikasi.
- standard, apa yang akan dikerjakan tim yang kompeten untuk aplikasi yang menangani taruhan nyata.
- extra-mile, garis depan, diterapkan hanya kalau taruhannya membenarkan.

Kalau pemeriksaanmu berada di standard atau extra-mile, sebut sinyal taruhan (stakes signal) mana dari enam yang menaikkan area itu ke level tersebut: S1 Uang, S2 Identitas/Auth, S3 Data pribadi, S4 Otonomi (sebuah AI bisa bertindak tanpa manusia menyetujui tiap aksi), S5 Radius dampak (banyak pengguna, multi-tenant, API publik, infrastruktur yang dipakai bareng), atau S6 Tidak bisa dibatalkan (sebuah aksi tidak bisa diurungkan). Pemeriksaan yang cuma menyala kalau ada uang nyata di halaman tidak berada di floor. Menaruhnya di sana akan membuat NONA merekomendasikan kerja berat ke orang yang tidak membutuhkannya, dan menerapkan praktik kelas atas berlebihan pada aplikasi taruhan rendah adalah kegagalan menilai, bukan ketekunan. Cocokkan tingkat ketelitiannya dengan risikonya.

Buka issue dulu untuk membahas pemeriksaan baru sebelum kamu menulis perubahannya, terutama untuk area atau tier yang benar-benar baru. Itu menghemat kerja ulang kalau maintainer melihat masalah lebih awal.

## Satu sumber kebenaran: sunting `protocol/`, regenerasi sisanya bersama-sama

NONA ditulis sekali lalu diserahkan ke berbagai agent lewat berbagai file. Cursor membaca sebuah rule `.mdc`. Skill khas Claude membaca `SKILL.md`. Drop-in lintas-agent adalah `AGENTS.md`. Ada definisi slash-command di bawah `commands/`. Semuanya adalah pintu depan. Tidak satu pun dari mereka adalah tempat NONA tinggal.

NONA tinggal di `protocol/`. Tiap file lain yang menjelaskan auditnya adalah tampilan yang lebih pendek darinya. Sebuah pemeriksaan, definisi tier, sinyal taruhan, atau kutipan hanya boleh berasal dari `protocol/` (atau dari `CITATIONS.md` untuk sebuah otoritas, `SECURITY.md` untuk panduan integritas). Pintu-pintu depan menyatakan ulang protokolnya lalu mengarahkan agent masuk ke dalamnya. Mereka tidak boleh menambahkan apa pun yang belum ada di protokol.

Ini penting karena yang dijaganya adalah drift (penyimpangan diam-diam antarsalinan). Perbaiki sebuah kata di rule Cursor lalu lupa pada skill-nya, dan sekarang dua pintu depan mengatakan hal yang berbeda, dua agent menjalankan dua audit yang berbeda di bawah nama yang sama, dan orang yang memercayai laporannya tidak punya cara untuk tahu audit mana yang dia dapat. Protokol yang salinan-salinannya diam-diam menyimpang lebih berbahaya daripada satu sumber jujur tunggal, karena tak seorang pun melihat ketidaksesuaiannya sampai kerusakannya sudah terjadi.

Jadi saat pemeriksaanmu diterima, perubahannya mendarat di sumber kanoniknya lebih dulu, dan file-file sulingan dibawa kembali sejalan dengannya di dalam perubahan yang sama alih-alih ditinggalkan untuk nanti:

1. Sunting sumber kanoniknya. Tambahkan pemeriksaannya ke file area `protocol/` yang tepat, dan tambahkan atau tunjuk otoritasnya di `CITATIONS.md`.
2. Regenerasi tiap file sulingan dalam satu lintasan yang sama, supaya `AGENTS.md`, `skills/nona-audit/SKILL.md` beserta kartu `reference/`-nya, `commands/nona-audit.md`, dan `adapters/cursor/nona.mdc` semuanya cocok. Mereka adalah keluaran dari protokol, disegarkan sebagai satu set. Menyunting satu file secara terpisah adalah cara drift bermula.
3. Periksa invariannya. Tiap file menjaga dua belas huruf area yang sama (A sampai L), tiga nama tier yang sama (floor, standard, extra-mile), dan enam nama sinyal taruhan yang sama (S1 sampai S6 di atas). Saat sebuah file sulingan menunjuk ke dalam `protocol/`, dia menunjuk ke nama file yang benar-benar ada di disk.
4. Jangan mencetak kutipan baru di file sulingan. Tiap kontrol yang disebut sebuah pintu depan sudah ada di `CITATIONS.md`. Kontrol yang rapuh terhadap versi menyatakan makna sederhananya dan mengutip di tingkat dokumen, sama seperti yang dilakukan protokolnya.

Versi lengkap disiplin ini, termasuk bagaimana sebuah script generator akan memekanisasinya nanti, ada di `adapters/README.md`. Baca itu sebelum kamu menyentuh lebih dari satu file. Urutannya berlaku entah bagaimanapun: protokol adalah sumbernya, adapter adalah keluarannya, dan keduanya bergerak bersama. Kalau sebuah pintu depan suatu saat bertentangan dengan protokolnya, protokol yang menang, dan perbaikannya adalah meregenerasi pintu depannya, jangan pernah menyunting protokol agar cocok dengan salinan yang basi.

## Aturan menulis untuk setiap kontribusi

Kredibilitas NONA bertumpu pada prosanya yang terbaca seperti ditulis seorang engineer yang teliti untuk seorang founder yang khawatir, bukan seperti checklist hasil generate. Beberapa aturan menjaganya tetap di sana:

- Tulis dalam prosa yang sederhana dan bervariasi. Campur kalimat pendek dengan yang lebih panjang. Jangan refleks membuka tiap butir daftar dengan satu kata tebal dan titik dua, dan jangan menambal kalimat dengan klausa "-ing" yang menggantung tanpa menambah apa pun. Nyatakan segala sesuatu secara langsung.
- Tidak ada em-dash di mana pun dalam teks yang dikirim. Pakai koma, titik dua, tanda kurung, atau kalimat baru.
- Jangan membingkai sebuah poin sebagai pertentangan ("bukan X, tapi Y"). Nyatakan apa yang benar lalu beri detail yang menunjukkan kenapa.
- Jangan biarkan benda mati bertindak. Kode tidak "mengerti," laporan tidak "memberitahumu," scanner tidak "memutuskan." Sebut orang atau agent yang melakukannya, atau nyatakan temuannya secara langsung.
- Jaga pembaca tetap dalam pandangan. Tiap risiko adalah konsekuensi bisnis dalam kata sehari-hari. Tiap istilah teknis diberi penjelasan sekali saat pertama muncul, dengan kata Inggrisnya dipertahankan.

Periksa kalimatmu terhadap aturan-aturan ini sebelum kamu membuka pull request. Maintainer akan memeriksa hal yang sama, ditambah tiga ujian pemeriksaan di atas, dan aturan firewall di bawah.

## Firewall: apa yang tidak boleh pernah muncul di file yang dikirim

NONA adalah proyek publik. File-file di bawah `protocol/`, `adapters/`, `skills/`, `commands/`, `docs/`, dan dokumen-dokumen di tingkat atas semuanya dibaca orang asing dan agent mereka. Ada hal-hal yang tidak boleh pernah bocor ke dalamnya:

- Tidak ada bahasa kerja internal, nama sandi, nama orang, nama tim, penanda alur kerja, atau referensi apa pun ke bagaimana NONA dibangun. File yang dikirim berbicara tentang auditnya dan pembacanya, jangan pernah tentang proses pembuatannya sendiri.
- Jangan mengatribusikan ide inti NONA ke orang tertentu yang bernama. Gagasan bahwa orang non-coder tidak tahu apa yang dia tidak tahu sekarang adalah copy produk. Nyatakan itu sebagai alasan keberadaan NONA. Jangan mengkreditkan satu individu untuk itu.
- Gerbang taruhan, tiga tier, dan penjaga lingkaran tertutup (circularity guard) adalah konsep produk dan tetap ada. Jelaskan dalam bahasa yang berhadapan dengan pembaca. Mereka adalah bagian dari audit, jadi mereka memang tempatnya di ruang terbuka.

Kalau kamu cuma menyunting tree internal `_build/` atau `_research/`, tidak satu pun dari ini berlaku; keduanya tidak pernah dikirim dan `.gitignore` menjaganya tetap di luar repo publik. Begitu perubahanmu menyentuh sebuah file publik, firewall ini berlaku.

## Mengirim

Buka issue untuk membahas pemeriksaan baru atau perubahan besar. Untuk perbaikan kecil, sebuah pull request sudah cukup. Bagaimanapun caranya, di deskripsimu, sebut otoritas yang menjadi tumpuan perubahanmu, sebut artefak yang dituntut pemeriksaan baru mana pun, dan tegaskan bahwa kamu sudah meregenerasi file-file sulingan berbarengan dengan protokolnya. Dengan berkontribusi, kamu setuju karyamu dirilis di bawah lisensi CC-BY-4.0 proyek ini, syarat yang sama yang ada di `../LICENSE`.

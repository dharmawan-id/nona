# Adapter: satu sumber kebenaran, banyak pintu depan

NONA ditulis sekali lalu diserahkan ke berbagai agent AI lewat berbagai file, karena tiap agent membaca instruksinya dari tempat yang berbeda. Cursor membaca sebuah rule `.mdc`. Skill khas Claude membaca `SKILL.md`. Drop-in lintas-agent adalah `AGENTS.md`. Ada juga definisi slash-command di bawah `commands/`. Semuanya adalah pintu depan menuju NONA. Tidak satu pun dari mereka adalah tempat NONA sebenarnya tinggal.

Catatan ini ada supaya pintu-pintu depan itu tidak pernah mulai mengatakan hal yang berbeda. Ini edisi Indonesia NONA, dan untuk edisi ini tree kanoniknya adalah `id/protocol/`.

## Aturannya

Tree `id/protocol/` adalah yang kanonik untuk edisi Indonesia. Tiap file lain yang menjelaskan auditnya adalah tampilan sulingan darinya.

Auditnya yang lengkap, dengan detail penuh, adalah kumpulan file di bawah `protocol/`. File overview (`00-overview.md`) membawa premisnya, dua belas bidangnya, dan tiga tier-nya. File stakes-gating (`01-stakes-gating.md`) membawa enam sinyal risiko (stakes signals) dan prosedur persis yang menskalakan audit ke aplikasinya. File circularity-guard (`02-circularity-guard.md`) membawa metode untuk mengaudit kode buatan AI tanpa mewarisi titik butanya. Dua belas file bidang, `a-intent.md` sampai `l-decide-and-act.md`, masing-masing mengikuti tata letak yang sama dan masing-masing diakhiri dengan satu blok yang bisa dijalankan agent. Otoritas yang menjadi tujuan tiap pemeriksaan ada di `CITATIONS.md`, panduan untuk memercayai dan mengunci NONA itu sendiri ada di `SECURITY.md`, dan korpus bukti serta glosarium bahasa-biasa ada di `docs/`.

File-file di bawah ini disuling dari `protocol/`. Mereka menyatakan ulang isinya dalam bentuk lebih pendek lalu mengarahkan agent masuk ke dalamnya. Yang tidak boleh mereka lakukan adalah menambahkan apa pun yang belum ada di protokol: tidak ada pemeriksaan baru, tidak ada nama tier baru, tidak ada sinyal risiko baru, tidak ada kutipan baru.

- `AGENTS.md`, tulang punggung lintas-agent, sebuah entrypoint drop-in yang dibaca banyak agent coding secara konvensi.
- `skills/nona-audit/SKILL.md` beserta kartu `reference/`-nya, payload khas Claude di balik pemicu `/nona-audit`.
- `commands/nona-audit.md`, definisi slash-command-nya.
- `adapters/cursor/nona.mdc`, shim rule Cursor yang duduk di sebelah catatan ini.

## Kenapa ini penting buat kamu

Kalau kamu seorang developer yang menjalankan NONA, kamu boleh lewati bagian ini. Pilih pintu depan untuk tool-mu lalu jalankan.

Sisanya untuk siapa pun yang menyunting NONA atau mem-fork-nya, dan hal yang dijaganya adalah drift (penyimpangan diam-diam antarsalinan). Misalkan seseorang memperbaiki sebuah kata di rule Cursor lalu lupa pada skill-nya, atau menambahkan sebuah pemeriksaan ke `AGENTS.md` yang tidak pernah kembali ke file bidangnya. Sekarang dua pintu depan berbeda, dan dua agent menjalankan dua audit yang berbeda di bawah nama yang sama. Developer yang memercayai laporannya tidak punya cara untuk tahu audit mana yang sebenarnya ia dapat. Protokol yang salinan-salinannya diam-diam menyimpang lebih berbahaya daripada satu sumber jujur tunggal, karena tak seorang pun bisa melihat ketidaksesuaiannya sampai kerusakannya sudah terjadi.

## Disiplinnya: tulis sekali, regenerasi bersama-sama

Saat NONA berubah, perubahannya mendarat di `protocol/` lebih dulu, dan file-file sulingan dibawa kembali sejalan dengannya di dalam perubahan yang sama alih-alih ditinggalkan untuk nanti.

Praktiknya ada empat langkah. Pertama, sunting sumber kanoniknya: buat perubahan di file `protocol/` yang relevan, atau di `CITATIONS.md` untuk sebuah otoritas, atau di `SECURITY.md` untuk panduan integritas. Sebuah pemeriksaan, definisi tier, sinyal risiko, atau kutipan hanya boleh berasal dari sana. Kedua, regenerasi tiap file sulingan dalam satu lintasan yang sama, supaya `AGENTS.md`, `skills/nona-audit/SKILL.md` beserta kartu `reference/`-nya, `commands/nona-audit.md`, dan `adapters/cursor/nona.mdc` semuanya cocok dengan sumber kanonik yang baru. Mereka adalah keluaran dari protokol, disegarkan sebagai satu set, dan menyunting satu file secara terpisah adalah cara drift bermula.

Ketiga, periksa invarian yang memikul beban. Tiap file sulingan harus menjaga dua belas huruf bidang yang sama (A sampai L), tiga nama tier yang sama (floor, standard, extra-mile), dan enam nama sinyal risiko yang sama (S1 Uang, S2 Identitas/Auth, S3 Data pribadi, S4 Otonomi, S5 Radius dampak, S6 Tidak bisa dibatalkan). Saat sebuah file sulingan menunjuk ke dalam `protocol/`, ia harus menunjuk ke nama file bidang yang benar-benar ada di disk; penunjuk ke file yang sudah diganti namanya adalah penunjuk yang putus. Keempat, jangan mengarang kutipan di file sulingan. Tiap kontrol yang disebut file sulingan harus sudah ada di `CITATIONS.md`. Sebuah pintu depan tidak boleh mencetak penanda kontrol yang tidak pernah diklaim protokolnya, dan di mana sebuah kontrol rapuh terhadap versi, file sulingan menyatakan maknanya yang sederhana dan mengutip di tingkat dokumen, sama seperti yang dilakukan protokolnya.

Sebuah script generator yang memancarkan file-file sulingan dari `protocol/` adalah cara yang diniatkan untuk menegakkan semua ini, supaya regenerasi jadi mekanis dan drift jadi mustahil secara struktural alih-alih sekadar tidak disukai. Di versi NONA ini disiplinnya didokumentasikan dan diterapkan dengan tangan, dan script-nya bisa menyusul belakangan. Urutannya berlaku entah bagaimanapun: protokol adalah sumbernya, adapter adalah keluarannya, dan keduanya bergerak bersama.

## Kalau sebuah pintu depan berbeda dengan protokolnya

Protokol yang menang. File sulingan yang bertentangan dengan `protocol/` adalah yang ketinggalan, dan perbaikannya adalah meregenerasinya dari protokol. Kebalikannya, menyunting protokol agar cocok dengan adapter yang basi, tidak pernah jadi perbaikannya. Kalau kamu sedang menjalankan NONA dan sebuah pintu depan tampak memberitahumu sesuatu yang tidak dikatakan file bidangnya, percayai file bidangnya dan laporkan ketidaksesuaiannya.

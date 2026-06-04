# Enam sinyal risiko sekilas

Sinyal risiko (stakes signal) adalah sifat konkret dan bisa dicek dari aplikasimu yang berarti sebuah kesalahan di sana akan benar-benar menyakitkan. Agen memindai repository untuk enam ini dan memakainya untuk memutuskan seberapa dalam mengaudit tiap bidang. Semuanya adalah fakta yang bisa diamati tentang kode, bukan opini, jadi dua agen yang melihat repo yang sama seharusnya menemukan sinyal yang sama. Kartu ini adalah referensi cepat; definisi lengkap, prosedur per-bidang, pengesampingan keras, dan lima pertanyaan konfirmasi ada di `../../../protocol/01-stakes-gating.md`.

## S1 sampai S6

| Sinyal | Arti sederhana | Bagaimana wujudnya di kode |
|---|---|---|
| **S1 Uang** | Aplikasi menangani pembayaran, penagihan, pencairan dana (payout), atau kredit yang punya nilai tunai. Kesalahan bisa memindahkan uang sungguhan ke tempat yang salah. | Library penyedia pembayaran, alur checkout, sebuah webhook handler yang mengonfirmasi pembayaran, logika langganan atau penagihan, saldo kredit atau poin yang bernilai uang sungguhan. (Webhook adalah pesan yang dikirim satu layanan ke layanan lain untuk mengonfirmasi sebuah peristiwa, seperti pembayaran yang berhasil.) |
| **S2 Identitas/Auth** | Aplikasi punya login, sesi, reset kata sandi, atau peran dan izin. Kesalahan bisa membiarkan orang yang salah masuk, atau membiarkan user biasa bertindak sebagai admin. "Auth" itu singkatan dari authentication (membuktikan siapa seseorang) dan authorization (menentukan apa yang boleh dia lakukan). | Kode sign-in dan sign-up, penanganan sesi, alur reset kata sandi, adanya peran seperti user versus admin. |
| **S3 Data pribadi** | Aplikasi menyimpan PII (personally identifiable information, data yang bisa mengidentifikasi seseorang): email, nomor HP, nama, detail kesehatan, lokasi, pesan pribadi. Kesalahan bisa membocorkan detail tentang orang sungguhan. | Tabel dan field database yang menyimpan data pribadi, catatan profil, penyimpanan pesan, apa pun yang mengidentifikasi seseorang. |
| **S4 Otonomi** | Sebuah agen AI di aplikasi bisa mengambil tindakan sendiri (mengirim email, menjalankan kode, memanggil sebuah tool, membelanjakan uang) tanpa ada manusia yang menyetujui tiap tindakan lebih dulu. Kesalahan berarti agen yang tertipu atau bingung bertindak sebelum ada yang bisa menghentikannya. | Kode tempat output sebuah model AI memicu tindakan nyata tanpa gerbang persetujuan manusia: sebuah agen yang memanggil tool, menulis data, mengirim pesan, atau melakukan pembelian sendiri. |
| **S5 Radius dampak (blast radius)** | Satu kegagalan menyakiti banyak orang sekaligus: banyak user, beberapa pelanggan terpisah yang berbagi satu sistem (multi-tenant), API publik yang bisa dipanggil siapa saja, atau infrastruktur bersama. Kesalahan tidak tinggal kecil. | Desain multi-tenant, sebuah API publik, basis user yang besar atau terbuka, infrastruktur bersama yang banyak orang bergantung padanya. |
| **S6 Tidak bisa dibatalkan (irreversibility)** | Sebuah tindakan tidak bisa diurungkan begitu terjadi: hapus, transfer, terbitkan, kirim. Kesalahan tidak bisa ditarik balik dengan permintaan maaf dan pengembalian dana. | Kode yang menghapus catatan secara permanen, mentransfer sesuatu, menerbitkan ke publik, atau mengirim pesan maupun pembayaran yang tidak bisa diurungkan. |

## Bagaimana sinyal menetapkan kedalaman

Risiko itu bersifat lokal. Sebuah sinyal hanya mengeskalasi bidang yang dia sentuh. Agen menghitung sebuah tier untuk masing-masing dari dua belas bidang secara terpisah, dengan hanya memakai sinyal yang ada di permukaan bidang itu:

```
untuk tiap bidang A sampai L:
  sinyal_di_sini = sinyal risiko (S1 sampai S6) yang ada di permukaan bidang INI
  jika sinyal_di_sini == 0:                           tier = FLOOR
  jika sinyal_di_sini == 1 dan bukan (S4 atau S6):    tier = STANDARD
  selain itu:                                         tier = EXTRA_MILE
```

Dengan kata-kata: tidak ada sinyal pada sebuah bidang berarti lantai. Tepat satu sinyal yang bukan otonomi atau tidak-bisa-dibatalkan berarti standar. Dua atau lebih sinyal, atau otonomi maupun tidak-bisa-dibatalkan berapa pun, berarti upaya ekstra. Otonomi dan tidak-bisa-dibatalkan dipisahkan secara khusus karena masing-masing, dengan sendirinya, bisa mengubah bug kecil jadi malapetaka.

## Pengesampingan keras (eskalasi ini berlaku tak peduli berapa pun hitungannya)

- **S4 apa pun** (sebuah agen AI bertindak sendiri) memaksa **upaya ekstra** pada **B** (keamanan), **F** (pola kode hasil-AI), dan **K** (pen-test): cek sandboxing (menjaga agen di ruang terbatas), least-privilege (memberi agen hanya kuasa minimum yang dia perlukan), red-team prompt injection (sengaja mencoba menipu agen dengan instruksi tersembunyi sebelum penyerang yang melakukannya), dan setidaknya satu pola pengurungan (containment).
- **S1 apa pun (uang) atau S6 (tindakan yang tidak bisa dibatalkan)** memaksa setidaknya **standar** pada **D** (data dan privasi) dan **E** (pembayaran dan biaya AI). Kalau aplikasi juga punya **S5** (radius dampak), dua bidang itu naik ke **upaya ekstra**.
- **Panggilan AI API berbayar apa pun yang jalan di production** memaksa **cost guardrail pada lantai**, di hari pertama. Sebuah loop AI yang lepas kendali tanpa batas bisa menghasilkan tagihan yang menghancurkan dalam semalam. Cost guardrail (pagar pengaman biaya) adalah batas pengeluaran plus peringatan: sebuah batas per user per hari, sebuah batas per bulan, dan sebuah peringatan sebelum batasnya tercapai.

## Bagaimana agen menemukan sinyalnya

Dua sumber, keduanya dipakai:

1. **Baca repository (utama).** Kode tidak salah ingat. Cari bukti konkret tiap sinyal yang tercantum di tabel di atas.
2. **Ajukan lima pertanyaan konfirmasi sederhana** di `../../../protocol/01-stakes-gating.md`, karena seorang non-coder mungkin tidak menggambarkan taruhan aplikasinya sendiri secara akurat. Sebuah "ya" dihitung sebagai sinyal yang hadir bahkan kalau kodenya tidak jelas-jelas menunjukkannya. Catat jawaban-jawabannya sebagai bagian dari audit. Pertanyaan keempat sengaja mencakup otonomi (S4) sekaligus tidak-bisa-dibatalkan (S6), karena pembuat cenderung memikirkan "AI bertindak sendiri" dan "ini tidak bisa dibatalkan" secara bersamaan.

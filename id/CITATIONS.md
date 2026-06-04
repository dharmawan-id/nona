# Sumber Rujukan

Setiap pemeriksaan tingkat floor dan standard di audit ini berujung pada satu kontrol yang punya nama, tanggal, dan otoritas publik yang nyata. File ini adalah petanya. Ketika sebuah pemeriksaan bilang "lakukan X", kamu bisa lacak X di sini ke OWASP, NIST, SLSA, CIS, atau panduan produksi resmi dari vendor, lalu menjawab pertanyaan yang pasti dilemparkan orang yang skeptis: "memangnya kata siapa?"

Proyek ini adalah lapisan penerjemah, bukan riset keamanan orisinal. Nilai tambahnya ada pada pemilihan (memilih bagian yang penting untuk seseorang yang merilis aplikasi pakai tool AI dan tidak bisa baca kodenya), penerjemahan (merumuskan setiap kontrol jadi risiko bisnis yang gampang dipahami), dan kelayakan-pakai-oleh-agen (menulis pemeriksaan yang bisa dijalankan agen AI dan menghasilkan bukti). Kontrolnya sendiri datang dari sumber-sumber di bawah.

Dua aturan dasar yang dipakai di sepanjang file ini:

- Bagian yang tahan lama dari setiap pemeriksaan adalah makna bahasa-biasanya. Kutipan sumber adalah pertahanannya. Kalau identifier persis sebuah kontrol rentan-versi (bisa bergeser antar edisi), file ini menyebut makna biasanya dan mengutip dokumennya, daripada mencetak nomor kontrol yang detail tapi bisa saja sudah keliru waktu kamu baca.
- Tanpa identifier karangan. Setiap ID di bawah muncul di sebuah standar yang sudah terbit. Kalau sebuah ID tidak bisa dipastikan sampai level detail yang aman untuk dicetak, hal itu disebut terang-terangan di bagian "Pastikan dulu sebelum kamu mengutip ID yang detail" mendekati akhir file.

Versi dan tanggal dicek ke sumbernya pada 2026-06-04. Standar bergerak; cek ulang versinya sebelum kamu mengandalkannya untuk sesuatu yang taruhannya besar.

---

## Bagaimana tiap tier dipetakan ke standarnya

Ada tiga tier ketelitian yang berjalan di seluruh audit. Berikut yang jadi sandaran masing-masing.

- **Floor** ("ada yang ngerjain hal paling mendasar nggak?"): OWASP Top 10:2025 tanpa satu pun kasus muncul, OWASP ASVS 5.0.0 Level 1, CIS Benchmarks Level 1, SLSA Build L1, esensi produksi Supabase, dan floor LLM (ada sebagian mitigasi prompt injection, tidak ada secret atau data pribadi yang jelas bocor, ada batas pemakaian).
- **Standard** ("tim yang kompeten akan melakukan ini"): ASVS 5.0.0 Level 2, OWASP API Security Top 10 2023 versi lengkap, OWASP Top 10 for LLM Applications 2025 versi lengkap, SLSA Build L2, praktik proses NIST SSDF, dan fungsi MAP / MEASURE / MANAGE dari NIST AI RMF.
- **Extra-mile** (level frontier; bahkan tim yang kuat pun menganggap ini usaha tambahan): ASVS Level 3, SLSA Build L3 plus Source Track, CIS Level 2, threat model formal dan pen-test adversarial, serta pola containment dan verifikasi bernama yang diuraikan di dalam protokol.

---

## Peta standar

### OWASP Top 10:2025

Daftar dasar berisi kelemahan keamanan aplikasi web yang paling umum dan paling berdampak. Edisi kedelapan, diumumkan 6 November 2025 di konferensi OWASP Global AppSec di Washington DC, dengan penghalusan prosa final mendarat awal 2026. Kutip sebagai "OWASP Top 10:2025."

Dua perubahan di edisi ini penting untuk aplikasi yang dibangun pakai AI:

- "Vulnerable and Outdated Components" berubah jadi **A03 Software Supply Chain Failures**, dengan cakupan yang diperlebar ke build system, pipeline CI/CD, dependency (paket pihak ketiga yang kamu install), dan provenance (catatan asal-usul bagaimana sesuatu dibangun). Ini otoritas di balik pemeriksaan dependency dan supply chain.
- **SSRF** (Server-Side Request Forgery, ketika penyerang mengelabui server kamu supaya mengirim request yang seharusnya tidak ia kirim) bukan lagi entri tersendiri. Sekarang ia masuk ke dalam **A01 Broken Access Control**. Jangan mengutip "A10 SSRF 2025" yang berdiri sendiri; itu tidak ada di edisi ini.

Daftar lengkapnya, dipakai di seluruh protokol:

| ID | Judul |
|---|---|
| A01 | Broken Access Control (termasuk IDOR dan SSRF) |
| A02 | Security Misconfiguration |
| A03 | Software Supply Chain Failures |
| A04 | Cryptographic Failures |
| A05 | Injection |
| A06 | Insecure Design |
| A07 | Authentication Failures |
| A08 | Software or Data Integrity Failures |
| A09 | Security Logging and Alerting Failures |
| A10 | Mishandling of Exceptional Conditions |

Satu istilah glosarium yang dipakai di atas: **IDOR** (Insecure Direct Object Reference) artinya orang asing bisa membuka data pelanggan lain hanya dengan mengubah satu angka di alamat web. **A09** adalah nama baru dari "Logging and Monitoring Failures" edisi 2021 dan jadi otoritas untuk pemeriksaan deteksi dan alerting di sisi operasional. **A10** baru di edisi ini dan mencakup penanganan error yang gagal-aman (fail safe), bukan gagal-terbuka (fail open).

Sumber: https://owasp.org/Top10/2025/

### OWASP ASVS 5.0.0

Application Security Verification Standard. Kalau Top 10 mendaftar kelemahan yang umum, ASVS adalah checklist detail dan berjenjang yang kamu pakai untuk memverifikasi aplikasi. Versi 5.0.0, dirilis 30 Mei 2025 di OWASP Global AppSec EU di Barcelona. Standar ini mendefinisikan tiga level verifikasi: Level 1 (dasar), Level 2 (standar untuk kebanyakan aplikasi produksi), dan Level 3 (jaminan tinggi). Audit ini memetakan floor ke Level 1 dan standard ke Level 2.

Edisi 5.0.0 menata ulang dan menomori ulang semuanya. Identifier-nya pakai bentuk V-bab.bagian.requirement. Satu identifier cukup stabil untuk dicetak: **V1 1.2.5 (OS command injection)**, artinya input yang tidak tepercaya tidak boleh dirangkai jadi perintah sistem; pakai pemanggilan ber-parameter (parameterized call) sebagai gantinya. Untuk requirement ASVS lain di luar yang satu itu, audit ini mengutip ASVS 5.0.0 di tingkat dokumen dan menyebut makna biasanya, karena penomoran per-bab di 5.0.0 belum dikonfirmasi baris demi baris dan mencetak nomor kontrol yang keliru justru meruntuhkan inti dari mengutip itu sendiri.

Sumber: https://github.com/OWASP/ASVS dan https://owasp.org/www-project-application-security-verification-standard/

### OWASP WSTG (Web Security Testing Guide)

Pendamping cara-menguji untuk ASVS: sebuah metodologi tentang cara benar-benar menguji tiap kelas kelemahan, bukan daftar kelemahan. Domain K mengutipnya sebagai otoritas metodologi pen-test. Ia dikutip di tingkat dokumen; versi persisnya saat ini tidak dicek ulang di putaran ini (lihat "Pastikan dulu sebelum kamu mengutip ID yang detail" mendekati akhir).

Sumber: https://owasp.org/www-project-web-security-testing-guide/

### OWASP API Security Top 10 2023

Ide yang sama dengan Top 10, tapi fokus ke bagian aplikasi yang berbicara mesin-ke-mesin (API-nya). Di sinilah celah otorisasi yang paling sering ditinggalkan tool AI muncul. Edisi 2023 adalah yang berlaku; belum ada edisi 2025. Empat entri yang dipakai di audit ini:

| ID | Judul | Makna biasanya |
|---|---|---|
| API1 | Broken Object Level Authorization (BOLA) | Seorang user bisa membaca atau mengubah data milik orang lain dengan merujuk ID-nya. |
| API2 | Broken Authentication | Pengecekan login atau token di API bisa dilewati. |
| API5 | Broken Function Level Authorization (BFLA) | User biasa bisa memanggil aksi yang khusus admin. |
| API6 | Unrestricted Access to Sensitive Business Flows | Alur uang atau kuota (checkout, signup, redeem) bisa dijalankan otomatis atau disalahgunakan. |

Sumber: https://owasp.org/API-Security/editions/2023/en/0x11-t10/

### OWASP Top 10 for LLM Applications 2025

Padanan Top 10 untuk permukaan AI di dalam aplikasimu: di mana pun aplikasimu mengirim teks user ke model lalu bertindak atas hasilnya. Diterbitkan 12 Maret 2025 oleh OWASP GenAI Security Project. Daftar lengkapnya, dipakai di seluruh protokol:

| ID | Judul |
|---|---|
| LLM01 | Prompt Injection |
| LLM02 | Sensitive Information Disclosure |
| LLM03 | Supply Chain |
| LLM04 | Data and Model Poisoning |
| LLM05 | Improper Output Handling |
| LLM06 | Excessive Agency |
| LLM07 | System Prompt Leakage |
| LLM08 | Vector and Embedding Weaknesses |
| LLM09 | Misinformation |
| LLM10 | Unbounded Consumption |

Dua istilah yang perlu diberi gloss: **prompt injection** (LLM01) adalah ketika seorang user, atau teks yang dibaca model, menyelipkan instruksi yang membajak apa yang dikerjakan model. **Unbounded Consumption** (LLM10) adalah otoritas di balik pemeriksaan batas biaya; tanpa batas, satu panggilan model berbayar bisa menumpuk tagihan tanpa plafon, kadang disebut denial-of-wallet.

Sumber: https://genai.owasp.org/llm-top-10/

### OWASP Risk Rating Methodology

Cara baku untuk memeringkat sebuah temuan menurut seberapa serius ia: perkirakan seberapa mungkin kelemahan itu dieksploitasi, dan seberapa parah dampaknya kalau benar terjadi, lalu gabungkan keduanya (kemungkinan dikali dampak). Domain L memakainya untuk menyortir temuan berdasarkan risiko bisnis supaya yang paling berbahaya dibereskan lebih dulu. Ini sebuah metodologi, bukan daftar kontrol bernomor, jadi dikutip dengan namanya.

Sumber: https://owasp.org/www-community/OWASP_Risk_Rating_Methodology

### NIST SSDF: SP 800-218 v1.1 dan SP 800-218A

Secure Software Development Framework dari US National Institute of Standards and Technology. Ia menjelaskan praktik membangun software secara aman, tersusun dalam empat keluarga:

- **PO** Prepare the Organization
- **PS** Protect the Software
- **PW** Produce Well-Secured Software
- **RV** Respond to Vulnerabilities

Task spesifik yang dikutip audit ini, semuanya dari SP 800-218 v1.1: **PW.1** (rancang software agar memenuhi kebutuhan keamanan dan lakukan threat model atasnya), **PW.4** (peroleh dan pakai ulang software pihak ketiga yang sudah aman), **PS.3** (arsipkan dan lindungi tiap rilis software), dan **RV.1 / RV.2 / RV.3** (identifikasi dan konfirmasi kerentanan, nilai dan perbaiki, lalu analisis akar penyebabnya). Semuanya dikutip di tingkat task lewat identifier yang sudah terbit.

SP 800-218 versi 1.1 (Februari 2022) adalah final yang berlaku sekarang. Sebuah revisi sedang dalam draf; audit ini mengutip v1.1 sampai revisinya dinaikkan jadi final. Pendampingnya, **SP 800-218A** (26 Juli 2024), adalah profil khusus AI generatif: satu-satunya otoritas first-party yang berbicara langsung soal mengamankan AI di dalam proses pengembangan, termasuk meninjau kode buatan AI dan melacak dari mana artefak yang dihasilkan berasal.

Catatan kejujuran soal status: SP 800-218A diterbitkan di bawah sebuah perintah eksekutif AS (EO 14110) yang dicabut pada Januari 2025. Dokumen NIST-nya sendiri tetap terbit dan ditandai final per 2026-06-04, tanpa pemberitahuan penarikan. Kutip keduanya sebagai panduan teknis sukarela, bukan kewajiban kepatuhan.

Sumber: https://csrc.nist.gov/pubs/sp/800/218/final dan https://csrc.nist.gov/pubs/sp/800/218/a/final

### NIST AI RMF: AI 100-1 dan AI 600-1

AI Risk Management Framework. AI 100-1, versi 1.0 (Januari 2023), menyusun kerja risiko AI ke dalam empat fungsi:

- **GOVERN** (lintas-bidang)
- **MAP**
- **MEASURE**
- **MANAGE**

Pendampingnya, **AI 600-1** (26 Juli 2024), adalah profil khusus AI generatif, dengan dua belas kategori risiko dan katalog besar aksi yang disarankan. Tier standard menerapkan MAP, MEASURE, dan MANAGE di tingkat fitur; profil AI generatif menjadi masukan untuk pemeriksaan risiko data dan kode yang khas AI. Catatan pencabutan EO 14110 yang sama di atas juga berlaku untuk AI 600-1: masih terbit dan final, kutip sebagai panduan sukarela.

Sumber: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf dan https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

### SLSA v1.2

Supply-chain Levels for Software Artifacts, dibaca "salsa." Sebuah framework untuk mengetahui bagaimana dan di mana software-mu dibangun, supaya build yang sudah diutak-atik bisa terdeteksi. Versi 1.2, dirilis 24 November 2025, yang menambahkan Source Track. Level Build Track diteruskan tanpa perubahan:

- **Build L1** provenance ada (catatan bagaimana artefak dibangun; bisa jadi belum ditandatangani atau belum lengkap).
- **Build L2** platform build ter-host menghasilkan dan menandatangani provenance itu.
- **Build L3** build berjalan di platform yang sudah dikeraskan dan terisolasi.

Audit ini menaruh Build L1 di floor, Build L2 di tier standard, dan Build L3 plus Source Track di tier extra-mile.

Sumber: https://slsa.dev/spec/v1.2/

### CIS Benchmarks

Baseline pengerasan (hardening) berbasis konsensus dari Center for Internet Security, ditulis sebagai setelan baris-per-baris yang konkret. Tiap benchmark mendefinisikan profil Level 1 (berlaku luas, hambatannya kecil) dan Level 2 (lebih ketat, lebih mengganggu). Dua yang relevan untuk aplikasi tipikal yang dibangun pakai AI:

- **CIS PostgreSQL Benchmark, Level 1**, dikutip untuk versi major yang sedang berjalan. Benchmark-nya terbit per rilis major Postgres (misalnya PG17 v1.0.0, bertanggal 30 Januari 2025, dan edisi PG18 pada 2026). Karena database terkelola menaikkan versi major-nya seiring waktu, audit ini mengutip "CIS PostgreSQL Benchmark, Level 1, untuk versi major yang sedang berjalan" daripada mengunci satu angka.
- **CIS Cloud Foundations Benchmarks, Level 1**, terbit per penyedia cloud.

Tidak ada CIS Benchmark untuk Vercel atau Next.js. Kekosongan itu memang ada dan sengaja diangkat. Untuk stack tersebut, audit ini memakai dokumentasi keamanan resmi vendornya plus panduan OWASP Secure Headers.

Sumber: https://www.cisecurity.org/cis-benchmarks

### Otoritas vendor

Di mana tidak ada standar netral yang mencakup platform tertentu, panduan produksi resmi dari platform itulah otoritasnya. Ini dokumen vendor dan dikutip sebagai dokumen vendor.

- **Supabase Production Checklist** dan **dokumen Row Level Security (RLS)**. RLS adalah fitur database yang membatasi tiap baris hanya untuk user pemiliknya. Esensi yang dikutip di floor: nyalakan RLS untuk setiap tabel di schema yang terekspos, jangan pernah pakai key service_role (key database yang sangat berkuasa) di kode browser atau client, dan paksakan SSL. Dokumen RLS juga memperingatkan agar tidak mempercayai metadata kiriman user di dalam sebuah policy.
- **Dokumentasi keamanan Vercel dan Next.js** plus OWASP Secure Headers, dipakai untuk higiene deploy di stack itu: security headers diatur, dan aturan bahwa variabel `NEXT_PUBLIC_` terlihat di browser sehingga tidak boleh pernah memuat secret.

Sumber: https://supabase.com/docs/guides/deployment/going-into-prod , https://supabase.com/docs/guides/database/postgres/row-level-security , https://vercel.com/docs/frameworks/full-stack/nextjs

### Lapisan Indonesia

Edisi Bahasa Indonesia ini menambahkan otoritas hukum lokal di bawah sebagai entri yang sepenuhnya berlaku. Postur seluruhnya minimal-sufficient: setiap kewajiban menyebut pasal atau regulasi spesifiknya, dan tidak dilebih-lebihkan jadi gaya GDPR. Untuk pembangun solo atau UKM Indonesia, kewajiban nyatanya jauh lebih kecil daripada yang ditakutkan.

Catatan status (verifikasi ulang saat deploy): UU PDP sudah berlaku dan masa transisinya berakhir 17 Oktober 2024, tetapi Peraturan Pemerintah pelaksananya (RPP PDP, 245 pasal) diserahkan ke Presiden pada 6 Oktober 2025 dan masih menunggu penandatanganan menurut pelaporan publik terakhir. Badan Pelindungan Data Pribadi ditargetkan beroperasi pada 2026; sampai badan itu berdiri, pengawasan berjalan secara interim lewat Komdigi. Tingkat keyakinan: TINGGI untuk status undang-undangnya, SEDANG untuk tanggal pasti penandatanganan RPP (sasaran yang bergerak).

#### UU PDP (Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi)

Undang-undang pelindungan data pribadi Indonesia. Set minimal-sufficient untuk pembangun kecil dibaca dari pasal-pasal berikut, dibaca bersama Putusan Mahkamah Konstitusi 151/PUU-XXII/2024 (diucapkan 30 Juli 2025) yang mengubah pemicu kewajiban petugas pelindungan data.

| Pasal | Apa yang harus benar-benar dilakukan pembangun | Makna untuk audit |
|---|---|---|
| **Pasal 20** (dasar pemrosesan / lawful basis) | Punya satu dasar hukum yang sah sebelum memproses data. Untuk produk konsumen kecil ini hampir selalu (a) persetujuan eksplisit untuk tujuan yang dinyatakan, atau (b) pelaksanaan kontrak (misalnya memenuhi pesanan). Praktiknya: satu kotak centang persetujuan yang polos plus pemberitahuan privasi singkat yang menyatakan tujuannya. Jangan dicentang otomatis. | Otoritas untuk pemeriksaan dasar pemrosesan di Domain D. |
| **Pasal 16** (kewajiban pengendali data; termasuk minimalisasi dan akurasi) | Kumpulkan hanya data yang sungguh kamu butuhkan untuk tujuan yang dinyatakan. Kalau aplikasi tidak butuh nomor HP atau NIK, jangan kumpulkan. Jaga akurasinya dan simpan hanya selama dibutuhkan. | Otoritas untuk pemeriksaan minimalisasi data di Domain D. |
| **Pasal 7, 8, 9** (hak subjek data: akses, koreksi, penghapusan / penarikan persetujuan) | Sanggup (1) menunjukkan ke user datanya, (2) mengoreksinya, (3) menghapusnya atau menghormati penarikan persetujuan atas permintaan. Untuk pembangun kecil: satu jalur "hapus akun/data saya" yang berfungsi plus satu email kontak sudah cukup. Tidak ada keharusan portal swalayan yang rumit. | Otoritas untuk pemeriksaan jalur penghapusan data di Domain D. |
| **Pasal 46-47** (notifikasi kebocoran data) | Saat terjadi kebocoran data pribadi, kirim notifikasi tertulis dalam **3x24 jam (72 jam)** kepada (a) subjek data yang terdampak dan (b) otoritas. Notifikasi harus menyebut: data apa yang terekspos, kapan dan bagaimana terjadi, serta langkah pemulihan yang sudah diambil. Praktiknya: siapkan satu template insiden satu halaman plus tahu harus mengirim email ke siapa. | Otoritas untuk playbook respons kebocoran di Domain H (operasional) dan Domain D (privasi). |
| **Pasal 56** (transfer lintas negara) | Kalau kamu menyimpan data di luar Indonesia (Vercel, AWS us-east, Supabase region non-Indonesia, Firebase, dan sejenisnya, semua itu transfer ke luar negeri), kamu butuh dasar hukum. Yang realistis untuk pembangun solo adalah **persetujuan eksplisit user setelah pengungkapan jujur soal risiko transfer**. Jalur "tingkat perlindungan yang setara" dan jalur perjanjian internasional di Pasal 56 tidak praktis untuk individu; persetujuan adalah jalur yang bisa dijalankan. Sebut di pemberitahuan privasimu bahwa data disimpan di server luar negeri. | Otoritas untuk pemeriksaan hosting lintas negara di Domain I (arsitektur). Keyakinan SEDANG (jalur persetujuan adalah pembacaan konsensus; daftar negara yang "memadai" belum diterbitkan). |
| **Pasal 53** (dibaca lewat MK 151/PUU-XXII/2024) (petugas pelindungan data / DPO) | **Pembangun kecil yang memproses data secara biasa dan tidak berskala besar TIDAK perlu menunjuk petugas pelindungan data.** Putusan MK mengubah pemicunya dari "ketiga syarat sekaligus" menjadi "SALAH SATU dari: (1) memberi layanan publik; (2) pemrosesan skala besar; (3) memproses data pribadi spesifik/sensitif atau data terkait tindak pidana". SaaS atau toko pribadi kecil yang tipikal tidak menyentuh satu pun. Kalau nanti kamu memproses data sensitif (kesehatan, biometrik, anak, profil keuangan) atau beroperasi di skala besar, kewajiban itu baru menyala. | Otoritas untuk penilaian eskalasi di Domain D dan Domain K. Keyakinan TINGGI. |
| **Pasal 57** (sanksi administratif) | Kenapa ini penting: gagal memenuhi hal-hal di atas bisa menarik teguran tertulis, penghentian sementara pemrosesan, perintah penghapusan data, dan denda administratif sampai **2% dari pendapatan tahunan**. Ini gigi penegakannya; sifatnya berbasis risiko, jadi postur praktisnya adalah "kerjakan minimum yang murah di atas". | Otoritas untuk pembingkaian taruhan bisnis di Domain K. Keyakinan TINGGI. |

Apa arti "data pribadi spesifik" (data sensitif) menurut UU PDP Pasal 4 ayat (2): data kesehatan, data biometrik, data genetika, catatan kejahatan, data anak, data keuangan pribadi, dan lain-lain. Kalau pembangun menyentuh salah satunya, posturnya naik (pemicu petugas pelindungan data plus kehati-hatian yang lebih tinggi).

Ringkasan minimal-sufficient yang ditegakkan agen: persetujuan + minimalisasi + jalur penghapusan + rencana kebocoran 72 jam + pengungkapan persetujuan lintas negara. Tanpa petugas pelindungan data, tanpa paperwork DPIA, tanpa rekaman-pemrosesan formal yang diwajibkan untuk pembangun kecil berskala biasa (tugas yang lebih berat itu melekat pada pemrosesan skala besar / sensitif / layanan publik).

Sumber: UU No. 27 Tahun 2022 (teks lengkap, peraturan.bpk.go.id/Details/229798); MK Putusan 151/PUU-XXII/2024 (mkri.id, diucapkan 30 Juli 2025).

#### Pendaftaran PSE (Permenkominfo 5/2020 dan PP 71/2019)

PSE adalah Penyelenggara Sistem Elektronik. Dasar hukumnya PP 71/2019 (Penyelenggaraan Sistem dan Transaksi Elektronik) Pasal 6 plus Permenkominfo 5/2020 tentang PSE Lingkup Privat.

Sebuah produk nyata yang punya akun user, menerima pembayaran, atau memasarkan dan menjual ke user Indonesia harus **mendaftar** sebagai PSE Lingkup Privat (lewat NIB di oss.go.id, lalu PSE di pse.komdigi.go.id). Pemicunya bersifat fungsional, bukan berdasarkan ukuran; tidak ada ambang pendapatan atau jumlah user yang membebaskan sebuah PSE komersial yang nyata. Risiko tidak mendaftar adalah sanksi administratif yang meningkat sampai **pemblokiran** layanan di Indonesia, yaitu tuas penegakan yang memang sudah dipakai Komdigi. Blog atau portofolio pribadi tanpa akun, tanpa pembayaran, dan tanpa pengumpulan data pribadi yang berarti umumnya berada di luar kewajiban praktisnya. Keyakinan TINGGI untuk produk komersial; SEDANG untuk kasus di perbatasan (riwayat penafsiran Komdigi cenderung luas, jadi kalau ragu dan produknya komersial, daftar saja).

Sumber: PP 71/2019 (Pasal 6); Permenkominfo 5/2020 (PSE Lingkup Privat); portal pse.komdigi.go.id. Domain G dan Domain L mengutipnya untuk langkah pendaftaran.

#### Kategorisasi keamanan BSSN (terpisah dari pendaftaran PSE)

BSSN adalah Badan Siber dan Sandi Negara. BSSN menjalankan kategorisasi keamanan sistem elektronik di bawah PP 71/2019 dan BSSN Reg 8/2020, dengan skor yang membagi sistem ke tingkat Strategis (36-50), Tinggi (16-35), dan Rendah (10-15). Skor itu menentukan kewajiban keamanan (misalnya ekspektasi ISO 27001 untuk tingkat yang lebih tinggi).

Poin yang sering keliru, dan diperjelas di sini: skoring Strategis/Tinggi/Rendah ini adalah kategorisasi keamanan BSSN, bukan sakelar nyala/mati untuk apakah kamu wajib mendaftar sebagai PSE. Keduanya hal yang berbeda; menyamakannya adalah kesalahan umum. Untuk pembangun kecil yang biasa, tugas berat BSSN tidak melekat. Keyakinan TINGGI.

Sumber: PP 71/2019; BSSN Reg 8/2020. Domain B dan Domain K merujuknya saat menjelaskan tingkat keamanan, bukan sebagai pemicu pendaftaran PSE.

#### Skema tanda tangan callback payment gateway

Verifikasi callback (notifikasi pembayaran) adalah hal nomor satu yang harus diaudit pada integrasi pembayaran. Seorang pembangun yang memakai gateway berlisensi (Midtrans, Xendit, iPaymu, DOKU) sebagai **merchant** tidak butuh lisensi PJP Bank Indonesia atau lisensi OJK sendiri; gateway-nya yang memegang lisensi, dan merchant mewarisi kepatuhan dengan memakainya. Jadi fokus auditnya ada pada keamanan integrasi, sehingga pembangun tidak perlu didorong ke arah perizinan.

| Gateway | Cara memverifikasi callback itu asli | Kesalahan umum yang harus ditandai |
|---|---|---|
| **Midtrans** | Hitung ulang `SHA512(order_id + status_code + gross_amount + ServerKey)` lalu bandingkan dengan field `signature_key` di body notifikasi. Kalau tidak cocok, abaikan. ServerKey itu rahasia (server-side saja). | Mempercayai body webhook tanpa menghitung ulang tanda tangan; memakai ClientKey alih-alih ServerKey; membandingkan tanpa constant-time. Sumber: docs.midtrans.com (HTTP Notification / Receiving Notifications). |
| **Xendit** | Setiap webhook membawa header `X-CALLBACK-TOKEN`. Bandingkan dengan verification token akun kamu (dari dashboard Xendit). Tolak kalau tidak ada atau tidak cocok. | Token statis adalah satu-satunya pengecekan identitas yang diberikan Xendit, jadi membocorkannya atau melewatkan pengecekan header berarti siapa pun bisa memalsukan callback. Juga: jangan mencatat token-nya ke log. Sumber: help.xendit.co dan docs.xendit.co (Handling webhooks / Integration security). |
| **iPaymu** | Request dan callback memakai HMAC-SHA256. StringToSign = `HTTPMethod:VaNumber:lowercase(SHA256(RequestBody)):ApiKey`, dikirim di header `signature` bersama `va` dan `timestamp` (YYYYMMDDhhmmss). Tanda tangan yang tidak valid mengembalikan 401. | Menghash body dengan encoding JSON yang salah (harus sama persis, misalnya slash tidak di-escape), salah kapitalisasi (harus huruf kecil), atau melewatkan verifikasi sama sekali. Sumber: ipaymu.com (API documentation) dan contoh GitHub iPaymu. |

Pemeriksaan pembayaran yang universal (berlaku untuk ketiga gateway, lintas-provider): verifikasi tanda tangan atau token pada **setiap** callback sebelum bertindak; validasi ulang jumlah, order ID, dan status terhadap database-mu sendiri (Xendit secara eksplisit menyarankan ini sebagai lapisan kedua); idempotency, karena gateway mengirim ulang webhook dan satu pembayaran bisa terkirim berkali-kali, jadi tandai jalur pemenuhan apa pun yang bisa memberi ganda pada callback berulang; ServerKey / ApiKey / X-CALLBACK-TOKEN hidup di env var server-side saja, tidak pernah di bundle publik Next.js dan tidak pernah di repo; endpoint webhook HTTPS tanpa open redirect pada return URL. Keyakinan TINGGI.

Catatan QRIS, kalau produk menampilkan atau bergantung pada QRIS: jangan pernah memperlakukan screenshot pembayaran kiriman user sebagai konfirmasi, karena hanya callback gateway yang terverifikasi atau API status yang mengonfirmasi pembayaran (keyakinan TINGGI). Kalau menampilkan QRIS statis, pastikan QRIS dibuat server-side dari acquirer berlisensi dan tidak bisa diubah user; lebih baik QRIS dinamis (per transaksi, jumlahnya terkunci) untuk alur aplikasi (keyakinan SEDANG, panduan operasional). Minimalkan data pembayaran yang disimpan dan jangan pernah menyimpan PAN (nomor kartu).

Sumber: docs.midtrans.com; help.xendit.co dan docs.xendit.co; ipaymu.com dan contoh GitHub iPaymu; advisori QRIS bi.go.id dan bca.co.id (2024-2025). Domain E mengutipnya untuk verifikasi integrasi pembayaran; Domain C untuk penempatan secret server-side. Untuk batas perizinan: OJK POJK 4/2025 (Penyelenggara Agregasi Jasa Keuangan, berlaku 26 Februari 2025) dan aturan PJP Bank Indonesia menyasar provider dan agregator, bukan merchant biasa. Rujuk keduanya hanya untuk memberi tahu pembangun bahwa ia tidak membutuhkannya sebagai merchant, dan untuk menandai garis yang akan ia lewati kalau suatu saat mulai memegang atau menyalurkan dana sendiri.

#### Referensi lokal: OWASP Indonesia, BSSN, dan Komdigi

- **OWASP Indonesia (owasp.or.id) dan chapter OWASP Surabaya** adalah komunitas OWASP lokal yang aktif menjalankan meetup dan melokalkan kesadaran OWASP Top 10. Domain B, Domain J, dan Domain K menjangkarkan diri ke OWASP Top 10 sebagai rujukan lokal yang sama-sama dikenal, dan menunjuk pembangun ke komunitas yang diakui. Nama kerentanan tetap dalam bahasa Inggris (SQL injection, XSS, CSRF, "pentest"). Keyakinan TINGGI.
- **BSSN (Badan Siber dan Sandi Negara)** adalah lembaga siber nasional yang menjalankan kategorisasi keamanan sistem elektronik dan menjadi tuan rumah ekosistem CSIRT (tim respons insiden). Dikutip sebagai otoritas di balik skoring Strategis/Tinggi/Rendah (dengan penegasan bahwa itu tingkat keamanan, bukan sakelar nyala/mati PSE), dan sebagai sumber panduan respons insiden berbahasa Indonesia untuk melokalkan playbook kebocoran di Domain H. Untuk pembangun kecil yang biasa, tugas berat BSSN tidak melekat. Keyakinan TINGGI.
- **Komdigi (pse.komdigi.go.id)** adalah portal pendaftaran PSE Lingkup Privat sekaligus pengawas interim UU PDP sampai Badan PDP berdiri. Tautan kanonis untuk langkah pendaftaran PSE di Domain G dan Domain L, dan alamat tujuan notifikasi kebocoran selama Badan PDP belum beroperasi. Keyakinan TINGGI.

---

## Jangkar empiris

Pitch dan materi "kenapa ini ada" bersandar pada pengukuran yang sudah dipublikasikan, bukan klaim kosong. Tiap jangkar di bawah membawa sumbernya, tanggalnya, dan caveat jujur yang menjaganya agar tidak dilebih-lebihkan. Baca caveat sebagai bagian dari klaimnya.

### Apa yang sebenarnya ikut terbawa di kode buatan AI

**SUSVIBES: 61% benar, 10.5% aman.** Bukti tunggal terkuat bahwa "ini jalan" bukan "ini aman." Pada 200 tugas fitur nyata di tingkat repository yang dibangun dari perbaikan kerentanan historis (mencakup 77 jenis kelemahan, kira-kira 180 baris diedit di beberapa file tiap tugas), sebuah agen yang dipasangkan dengan model frontier menghasilkan kode yang 61% benar secara fungsional tapi hanya 10.5% aman. Menambahkan petunjuk keamanan ke permintaan tidak memperbaikinya, dan itulah kenapa instruksi generik "amankan saja" tidak cukup dan audit terstruktur per pemeriksaan itu perlu. Zhao dkk., arXiv:2512.03262, 2 Desember 2025. https://arxiv.org/abs/2512.03262

**Veracode: 45% kode buatan AI gagal uji keamanan.** Di lebih dari 100 model pada lebih dari 80 tugas, 45% sampel memasukkan kelemahan OWASP Top 10, dengan 2,74 kali lebih banyak kerentanan dibanding kode tulisan manusia, dan tingkat kegagalannya datar tak peduli ukuran model. Poin terakhir itu yang menanggung beban: ketidakamanan di sini bersifat struktural, bukan cacat yang hilang di rilis model berikutnya. Label kejujuran: Veracode adalah vendor keamanan komersial, jadi ini studi vendor; arahnya didukung oleh jangkar akademik independen di atas dan di bawah. Veracode, "2025 GenAI Code Security Report," 30 Juli 2025. https://www.veracode.com/blog/genai-code-security-report/

**Penyeimbang yang konservatif: 12,1% dari file dunia nyata.** Sebuah pemindaian skala besar atas 7.703 file buatan AI dengan analisis statis menemukan 87,9% tidak punya kelemahan yang terpetakan dan 12,1% punya setidaknya satu. Ini tampak jauh lebih ringan dari 45% di atas, dan alasannya ada di desain pengukuran: studi ini menghitung file biasa dengan kompleksitas yang beragam, sedangkan angka 45% dan 10.5% datang dari tugas yang dikurasi dan relevan-keamanan. Keduanya benar. Angka yang menakutkan berlaku persis pada permukaan yang sensitif-keamanan yang disasar audit ini; angka yang lebih ringan berlaku pada kode secara umum. Selalu sajikan rentang 10.5% / 12,1% / 45% bersama caveat ini, jangan memetik yang paling mengkhawatirkan. Schreiber dan Tippe, arXiv:2510.26103, 30 Oktober 2025. https://arxiv.org/abs/2510.26103

**Di lapangan: 5.600 aplikasi yang sudah dirilis.** Pemindaian pasif atas 5.600 aplikasi yang bisa dijangkau publik yang dibangun pakai tool AI menemukan lebih dari 2.000 kerentanan, lebih dari 400 secret terekspos, dan 175 kasus data pribadi yang bocor termasuk rekam medis dan nomor rekening bank. Karena pemindaiannya tidak merusak, ini secara eksplisit hitungan batas-bawah. Label kejujuran: pemindainya adalah vendor keamanan komersial. Escape.tech, 29 Oktober 2025. https://escape.tech/blog/methodology-how-we-discovered-vulnerabilities-apps-built-with-vibe-coding/

### Kenapa pembangun terlalu percaya pada hasilnya

**Rasa aman yang palsu.** Dalam sebuah studi terkontrol yang sudah ditelaah sejawat, orang yang memakai asisten coding AI menulis kode yang kurang aman dan lebih cenderung yakin kodenya aman. Inilah kunci dari seluruh premisnya: pengecekan oleh manusia justru salah kalibrasi ke arah terlalu yakin tepat saat AI terlibat. Perry dkk., ACM CCS 2023, arXiv:2211.03622. https://arxiv.org/abs/2211.03622

**Keyakinan naik justru saat peninjau keliru.** Riset tentang orang non-ahli yang mengawasi keluaran AI menemukan bahwa saat seorang peninjau melewatkan sebuah kesalahan sambil ia sendiri keliru, keyakinannya malah naik bukannya turun (efek terukur, Hedges' g = 0,85). Konsekuensi praktisnya menggerakkan satu aturan inti audit ini: tampilkan bukti dan artefak yang konkret, bukan vonis berskor keyakinan, karena vonis yang terlihat yakin justru memproduksi kepercayaan palsu. Grunde-McLaughlin dkk., arXiv:2602.16844, 2026. https://arxiv.org/html/2602.16844

### Kenapa AI mengaudit AI itu metode yang nyata, sekaligus terbatas

**Masalah sirkularitas, disebut terang-terangan.** Ketika kelas AI yang sama membangun sekaligus menguji, ketidakcocokan protektif yang membuat telaah manusia berguna jadi hilang: "agen penguji mewarisi kelemahan yang sama dengan agen pembuat kode." Sebuah lembaga kredibel menyatakan masalahnya dengan jernih dan tidak menawarkan solusi. Celah itulah yang dijawab penjaga sirkularitas di audit ini. Stanford Law CodeX (Kahana), "Built by Agents, Tested by Agents, Trusted by Whom?", 8 Februari 2026. https://law.stanford.edu/2026/02/08/built-by-agents-tested-by-agents-trusted-by-whom/

**Memisahkan konteks telaah itu membantu, dan murah.** Sebuah eksperimen langsung menemukan bahwa menelaah di sesi baru tanpa riwayat build mengalahkan menelaah di sesi yang sama, dengan keuntungan terbesar pada kesalahan kritis (sekitar 11 poin persentase). Kondisi kontrol (menelaah dua kali di sesi yang sama) tidak menunjukkan keuntungan, yang mengisolasi pemisahan konteks, bukan tambahan putaran, sebagai mekanismenya. Inilah kenapa audit ini berjalan di konteks bersih dan lebih memilih model yang berbeda.

**Dan plafonnya jujur.** Di eksperimen yang sama, bahkan kondisi terbaik hanya menangkap sekitar 28,6% (F1) dari kesalahan yang disuntikkan. AI menelaah AI menangkap sebagian berarti dari bug kritis dengan murah dan, dalam keadaan terisolasi, melewatkan sebagian besar kesalahan yang disuntikkan. Ini bukan pengganti pen-test profesional. Mengklaim sebaliknya akan menciptakan ulang rasa aman palsu yang justru hendak dilawan proyek ini. arXiv:2603.12123, 12 Maret 2026. https://arxiv.org/html/2603.12123

Arah "lebih baik pilih garis keturunan model yang berbeda" punya dukungan teoretis (argumen teori-informasi bahwa agen yang beragam mengurangi titik buta bersama), tapi besarnya keuntungan itu belum dipastikan di literatur. Ia disarankan sebagai praktik terbaik, tanpa janji tingkat tangkapan. Rajan, arXiv:2511.16708, 2025. https://arxiv.org/pdf/2511.16708

### Kenapa kelas file ini harus membela dirinya sendiri

Sebuah file rules, skill, atau instruksi agen diproses oleh agen sebagai konfigurasi tepercaya, dan itu menjadikannya sasaran. Sebuah studi sistematisasi melaporkan tingkat keberhasilan prompt injection di atas 85% terhadap pertahanan saat ini, dengan permukaan serangan yang diuji mencakup persis jenis file yang dirilis audit semacam ini. Maloyan dan Namiot, arXiv:2601.17548, 2025-2026. https://arxiv.org/html/2601.17548v1

Sebuah studi atas 3.984 agent skill yang dipublikasikan menemukan 36,8% membawa cacat keamanan dengan tingkat keparahan tertentu dan sekitar 36% mengandung kerentanan prompt injection, dengan skill mewarisi seluruh izin agen dan ambang publikasinya serendah akun berumur satu minggu tanpa telaah wajib. Inilah kenapa proyek ini merilis panduan integritas: kunci sebuah versi, verifikasi hash file, dan perlakukan fork pihak ketiga apa pun sebagai tidak tepercaya sampai ditelaah. Snyk, "ToxicSkills," 5 Februari 2026. https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/

Satu aturan pembingkaian yang berlaku untuk setiap angka di halaman ini: karya akademik independen (SUSVIBES, pemindaian file skala besar, Perry dkk., eksperimen lintas-konteks) menjangkarkan klaim apa pun yang insentif-untuk-menakuti milik vendor bisa dipersoalkan. Angka vendor dilabeli sebagai angka vendor dan dipakai untuk korroborasi, bukan sebagai satu-satunya dasar sebuah klaim.

---

## Plafon yang jujur

Nyatakan ini di mana pun angka-angka dikutip, karena inilah beda antara alat yang berguna dan klaim yang berlebihan:

- Audit ini menurunkan risiko. Ia tidak menjamin keamanan.
- AI menelaah AI menangkap sebagian berarti dari bug kritis dengan murah, dan dalam keadaan terisolasi melewatkan sebagian besar kesalahan yang disuntikkan (terukur terbaik sekitar 28,6% F1). Ini bukan pengganti pen-test profesional.
- Aplikasi dengan taruhan nyata (uang, banyak user, aksi yang tak bisa dibatalkan, agen otonom) tetap perlu membayar audit manusia yang independen. Audit ini memberi tahu kamu kapan kamu sudah melewati garis itu.
- Angka-angka headline yang mengkhawatirkan datang dari studi dengan desain pengukuran yang berbeda, dan sebagian dari vendor yang punya insentif untuk menakuti. Penyeimbang akademik independennya sengaja dikutip berdampingan.

---

## Pastikan dulu sebelum kamu mengutip ID yang detail

Sebagian identifier rentan-versi: benar hari ini di tingkat dokumen, tapi berisiko dicetak di tingkat yang detail karena angka persisnya bisa bergeser antar edisi atau belum dikonfirmasi baris demi baris. Untuk yang ini, audit menyebut makna biasanya dan mengutip dokumennya. Kalau kamu hendak mengutip salah satunya di tingkat yang lebih halus untuk sesuatu yang penting, pastikan dulu ke sumber primernya.

- **Nomor kontrol ASVS 5.0.0 di luar V1 1.2.5.** Terkonfirmasi: 17 bab, format V-bab.bagian.requirement, V1 adalah Encoding and Sanitization. Belum terkonfirmasi baris demi baris: penomoran per-bab untuk authorization dan bab lain. Tarik daftar kontrol 5.0.0 dari repository ASVS sebelum mencetak nomor V tertentu.
- **Status final-versus-penghalusan-akhir OWASP Top 10:2025.** Kategori dan urutannya stabil dan terverifikasi. Laporan berbeda soal apakah prosa yang sudah dihaluskan difinalkan pada November 2025 atau awal 2026. Cek ulang owasp.org/Top10/2025 untuk stempel final; kutip sebagai "OWASP Top 10:2025" apa pun hasilnya.
- **Versi major CIS PostgreSQL.** Kutip "untuk versi major yang sedang berjalan" daripada angka tetap, karena database terkelola berganti versi major seiring waktu.
- **Revisi NIST SSDF.** Sebuah revisi SP 800-218 sedang dalam draf. Versi 1.1 tetap final yang berlaku; kalau revisinya dinaikkan, petakan ulang identifier task PO / PS / PW / RV.
- **Profil AI generatif NIST di bawah perintah eksekutif yang dicabut.** SP 800-218A dan AI 600-1 tetap terbit dan final per 2026-06-04 meski EO 14110 dicabut. Kutip sebagai panduan teknis sukarela, dan verifikasi ulang menjelang peluncuran apa pun kalau-kalau NIST menerbitkan ulang atau mengganti namanya.
- **Versi OWASP WSTG.** Web Security Testing Guide dirujuk sebagai otoritas metodologi pen-test; versi terkininya tidak dicek ulang di putaran ini. Pastikan versi terbaru kalau kamu mengutip versi tertentu.
- **Versi CIS Cloud Foundations per provider.** Ini ada per penyedia cloud; versi terkini untuk provider tertentu belum dicek satu per satu. Pastikan benchmark spesifik untuk cloud yang disasar aplikasi.
- **Status regulasi pelaksana UU PDP dan otoritas pengawasnya.** RPP PDP (245 pasal) diserahkan ke Presiden 6 Oktober 2025 dan belum dipastikan ditandatangani saat sumber ini disusun; saat ia terbit, akan menambah detail konkret (ambang DPIA, format notifikasi kebocoran, mungkin daftar negara yang memadai untuk transfer lintas negara). Badan Pelindungan Data Pribadi ditargetkan 2026; selama belum berdiri, notifikasi kebocoran dan keluhan melewati Komdigi secara interim. Pasal-pasal UU PDP dikutip di tingkat dokumen sampai regulasi pelaksananya final; cek ulang status keduanya sebelum merilis sesuatu yang taruhannya besar.
- **Keberlakuan Permenkominfo 5/2020.** Pastikan ia belum digantikan regulasi PSE Komdigi yang lebih baru pada 2025-2026 sebelum mengandalkan kewajiban pendaftaran PSE; kutip di tingkat dokumen dan verifikasi ulang saat deploy.

Semua klaim versi dan tanggal di halaman ini dicek ke sumbernya pada 2026-06-04.

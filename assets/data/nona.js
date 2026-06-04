/*
  NONA audit-scoper: data model (bilingual EN + ID).
  Pure data. The logic (the stakes-gate tier computation and the prompt
  builder) lives in app.js. No dependencies, no build step.
*/
window.NONA = {
  // ---- Step 1: the six stakes signals, plus the paid-AI flag ----
  signals: [
    { id: "S1", label: { en: "Money", id: "Uang" },
      q: { en: "It touches money: payments, billing, payouts, or credits worth real cash.",
           id: "Menyentuh uang: pembayaran, tagihan, pencairan, atau kredit yang bernilai uang sungguhan." } },
    { id: "S2", label: { en: "Login & identity", id: "Login & identitas" },
      q: { en: "People log in: accounts, sessions, password reset, or roles like user versus admin.",
           id: "Ada login: akun, sesi, reset kata sandi, atau peran seperti user lawan admin." } },
    { id: "S3", label: { en: "Personal data", id: "Data pribadi" },
      q: { en: "It stores personal data: names, emails, phones, addresses, location, health, messages.",
           id: "Menyimpan data pribadi: nama, email, nomor HP, alamat, lokasi, kesehatan, pesan." } },
    { id: "S4", label: { en: "An AI that acts on its own", id: "AI yang bertindak sendiri" },
      q: { en: "An AI feature can act on its own (send, run code, call a tool, spend) without you approving each action.",
           id: "Fitur AI bisa bertindak sendiri (kirim, jalankan kode, panggil tool, belanjakan) tanpa kamu menyetujui tiap aksi." } },
    { id: "S5", label: { en: "Many users / blast radius", id: "Banyak user / radius dampak" },
      q: { en: "One failure would hit many people at once: many users, several customers on one system, or a public API.",
           id: "Satu kegagalan menyakiti banyak orang sekaligus: banyak user, beberapa pelanggan di satu sistem, atau API publik." } },
    { id: "S6", label: { en: "Irreversible actions", id: "Aksi tak bisa dibatalkan" },
      q: { en: "It can do things that cannot be undone: permanent delete, transfer, publish, send.",
           id: "Bisa melakukan hal yang tak bisa diurungkan: hapus permanen, transfer, terbitkan, kirim." } },
    { id: "paidAI", label: { en: "Calls a paid AI API", id: "Memanggil API AI berbayar" },
      q: { en: "It calls a paid AI API in production (every request costs real money).",
           id: "Memanggil API AI berbayar di produksi (tiap request memakan uang sungguhan)." } }
  ],

  // ---- Step 2 (optional): stack, to tailor the generated prompt ----
  stack: [
    { id: "supabase", label: { en: "Supabase / Postgres", id: "Supabase / Postgres" },
      note: { en: "check Row Level Security (RLS) on every table and that the service_role key is never in the browser",
              id: "cek Row Level Security (RLS) di tiap tabel dan kunci service_role tidak pernah ada di browser" } },
    { id: "vercel", label: { en: "Next.js / Vercel", id: "Next.js / Vercel" },
      note: { en: "check no secret ships in a NEXT_PUBLIC_ variable and that security headers are set",
              id: "cek tidak ada secret yang terkirim di variabel NEXT_PUBLIC_ dan security header sudah dipasang" } },
    { id: "payments", label: { en: "Stripe / a payment gateway", id: "Stripe / payment gateway" },
      note: { en: "verify every payment webhook signature, re-check amount and status against your own database, and make it idempotent",
              id: "verifikasi tiap signature webhook pembayaran, cek ulang jumlah dan status ke database sendiri, dan buat idempoten" } },
    { id: "indonesia", label: { en: "Serves Indonesian users", id: "Melayani pengguna Indonesia" },
      note: { en: "apply the UU PDP minimal set (consent, deletion path, 72-hour breach notice, cross-border consent) and PSE registration",
              id: "terapkan set minimal UU PDP (persetujuan, jalur hapus, notifikasi kebocoran 72 jam, persetujuan lintas-batas) dan pendaftaran PSE" } }
  ],

  // ---- The twelve domains (A to L) ----
  domains: [
    { letter: "A", name: { en: "Intent", id: "Maksud" }, blurb: { en: "does the code do only what you asked, safely", id: "apakah kode hanya melakukan yang kamu minta, dengan aman" } },
    { letter: "B", name: { en: "Secrets, access, auth", id: "Secret, akses, auth" }, blurb: { en: "keys hidden, each user reaches only their own data", id: "kunci tersembunyi, tiap user hanya menjangkau datanya sendiri" } },
    { letter: "C", name: { en: "Input & injection", id: "Input & injection" }, blurb: { en: "clean outside input, including prompt injection", id: "bersihkan input luar, termasuk prompt injection" } },
    { letter: "D", name: { en: "Data & privacy", id: "Data & privasi" }, blurb: { en: "personal data stored, kept from leaking, deletable", id: "data pribadi disimpan, dijaga dari bocor, bisa dihapus" } },
    { letter: "E", name: { en: "Payments & AI cost", id: "Pembayaran & biaya AI" }, blurb: { en: "charge correctly, block billing tricks, cap runaway AI spend", id: "menagih benar, halangi tipuan tagihan, batasi biaya AI liar" } },
    { letter: "F", name: { en: "AI-code & circularity", id: "Kode AI & sirkularitas" }, blurb: { en: "the same AI wrote and audits the code; rebuild the fresh eyes", id: "AI yang sama menulis dan mengaudit; bangun ulang mata segar" } },
    { letter: "G", name: { en: "Dependencies & supply chain", id: "Dependency & supply chain" }, blurb: { en: "every package real, locked, no known holes (slopsquatting)", id: "tiap package nyata, terkunci, tanpa lubang dikenal (slopsquatting)" } },
    { letter: "H", name: { en: "Config & deploy", id: "Config & deploy" }, blurb: { en: "no default creds, no secret in the bundle, safety headers", id: "tanpa kredensial default, tanpa secret di bundle, security header" } },
    { letter: "I", name: { en: "Ops, uptime, backup", id: "Ops, uptime, backup" }, blurb: { en: "notice breakage, fail safe, recover and roll back", id: "sadari kerusakan, gagal aman, pulih dan rollback" } },
    { letter: "J", name: { en: "Architecture", id: "Arsitektur" }, blurb: { en: "sound trust boundaries, damage kept contained", id: "batas kepercayaan sehat, kerusakan terkurung" } },
    { letter: "K", name: { en: "Pen-test & review", id: "Pen-test & tinjauan" }, blurb: { en: "what a real attack tests, and the honest ceiling of AI-on-AI", id: "apa yang diuji serangan nyata, dan batas jujur AI-mengaudit-AI" } },
    { letter: "L", name: { en: "Decide & act", id: "Putuskan & bertindak" }, blurb: { en: "rank by business risk, and when to hire a human", id: "peringkat per risiko bisnis, dan kapan menyewa manusia" } }
  ],

  repo: "https://github.com/dharmawan-id/nona"
};

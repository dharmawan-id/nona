/*
  NONA audit-scoper: behavior. Vanilla JS, no dependencies.
  Reads the data model from data/nona.js. Computes a tier per domain
  from the stakes-gate, then builds a ready-to-paste audit prompt.
*/
(function () {
  "use strict";

  var STRINGS = {
    brandSub: { en: "Non-Coder Audit", id: "Audit Non-Coder" },
    navRead: { en: "Read the protocol", id: "Baca protokol" },
    navRepo: { en: "Source", id: "Sumber" },
    heroEyebrow: { en: "Free audit scoper", id: "Penyetel audit gratis" },
    heroTitleA: { en: "Scope your", id: "Setel" },
    heroTitleB: { en: "audit", id: "auditmu" },
    heroLede: { en: "You built an app with an AI tool and cannot read the code. Answer a few questions about what is at stake, and get a ready-to-paste prompt your own AI agent runs to audit it, scaled to your real risk.", id: "Kamu membangun aplikasi dengan alat AI dan tidak bisa membaca kodenya. Jawab beberapa pertanyaan tentang yang dipertaruhkan, lalu dapat prompt siap-tempel yang dijalankan agen AI-mu sendiri untuk mengauditnya, diskala ke risiko nyatamu." },
    heroMeta1: { en: "12 domains", id: "12 domain" },
    heroMeta2: { en: "3 rigor tiers", id: "3 tingkat rigor" },
    heroMeta3: { en: "your agent runs it", id: "agenmu yang jalankan" },
    heroStart: { en: "Scope my audit", id: "Setel auditku" },
    toolTitle: { en: "The audit scoper", id: "Penyetel audit" },
    step1: { en: "Stakes", id: "Taruhan" },
    step2: { en: "Stack", id: "Stack" },
    step3: { en: "Plan", id: "Rencana" },
    q1: { en: "What is at stake in your app?", id: "Apa yang dipertaruhkan di aplikasimu?" },
    q1hint: { en: "Tap everything that is true. Each one raises the rigor only where it applies. None of it leaves your browser.", id: "Ketuk semua yang benar. Tiap satu menaikkan rigor hanya di tempat yang relevan. Tidak ada yang keluar dari browser-mu." },
    q2: { en: "What is it built with? (optional)", id: "Dibangun dengan apa? (opsional)" },
    q2hint: { en: "Optional. Picking your stack adds the exact checks that matter for it to the prompt.", id: "Opsional. Memilih stack menambahkan pemeriksaan yang persis penting untuknya ke prompt." },
    back: { en: "Back", id: "Kembali" },
    next: { en: "Next: your stack", id: "Lanjut: stack-mu" },
    run: { en: "Build my audit plan", id: "Susun rencana auditku" },
    restart: { en: "Start over", id: "Ulang dari awal" },
    closerNote: { en: "This is a starting scope, not a ruling. The stakes-gate is the same one in the protocol; read the full domain files before you rely on the result. An AI audit reduces risk, it does not guarantee safety, and it is not a human pen-test.", id: "Ini scope awal, bukan vonis. Stakes-gate-nya sama dengan yang di protokol; baca file domain lengkap sebelum bergantung pada hasilnya. Audit AI mengurangi risiko, tidak menjamin keamanan, dan bukan pen-test manusia." },
    closerProto: { en: "Protocol (English)", id: "Protocol (English)" },
    closerId: { en: "Protokol (Indonesia)", id: "Protokol (Indonesia)" },
    closerAgents: { en: "AGENTS.md", id: "AGENTS.md" },
    footAuthor: { en: "Built by Dharmawan.", id: "Dibuat oleh Dharmawan." },
    footLicense: { en: "CC BY 4.0.", id: "CC BY 4.0." },
    // result
    rPlanK: { en: "Your audit plan", id: "Rencana auditmu" },
    rStakes: { en: "What is at stake", id: "Yang dipertaruhkan" },
    rNoStakes: { en: "No stakes signals selected. Run the floor on every domain and ship; re-scope when money, logins, or many users arrive.", id: "Tidak ada sinyal taruhan dipilih. Jalankan floor di tiap domain lalu rilis; setel ulang saat ada uang, login, atau banyak user." },
    rPromptK: { en: "Paste this into your agent", id: "Tempel ini ke agenmu" },
    rPromptHint: { en: "Open your app in a fresh chat, ideally with a different AI model than the one that built it, and paste this.", id: "Buka aplikasimu di chat baru, idealnya dengan model AI berbeda dari yang membangunnya, lalu tempel ini." },
    rCopy: { en: "Copy prompt", id: "Salin prompt" },
    rCopied: { en: "Copied", id: "Tersalin" },
    rTiersK: { en: "Rigor per domain", id: "Rigor per domain" },
    rHireK: { en: "When to hire a human", id: "Kapan menyewa manusia" }
  };

  var TIER = {
    floor: { en: "floor", id: "floor" },
    standard: { en: "standard", id: "standard" },
    "extra-mile": { en: "extra-mile", id: "extra-mile" }
  };
  var SIGTEXT = {
    S1: { en: "real money flows through it", id: "uang sungguhan mengalir di dalamnya" },
    S2: { en: "people log in (accounts, roles)", id: "ada login (akun, peran)" },
    S3: { en: "it stores personal data", id: "menyimpan data pribadi" },
    S4: { en: "an AI feature can act on its own without per-action approval", id: "fitur AI bisa bertindak sendiri tanpa persetujuan tiap aksi" },
    S5: { en: "one failure would hit many people at once", id: "satu kegagalan menyakiti banyak orang sekaligus" },
    S6: { en: "it can take actions that cannot be undone", id: "bisa melakukan aksi yang tak bisa dibatalkan" },
    paidAI: { en: "it calls a paid AI API in production", id: "memanggil API AI berbayar di produksi" }
  };

  var state = { lang: "en", sig: {}, stack: {} };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function t(k) { return (STRINGS[k] && STRINGS[k][state.lang]) || ""; }
  function L(o) { return o ? o[state.lang] : ""; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  // Safety invariant: every value interpolated into innerHTML below is either static,
  // authored data from data/nona.js or is run through esc(). This tool has no user
  // free-text input (only boolean toggles), so no untrusted content reaches the DOM.
  // Keep it that way: if you ever add a text field, escape it with esc() (this is exactly
  // the kind of thing NONA Domain C checks for).
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---------- stakes-gate ----------
  function rank(x) { return x === "extra-mile" ? 3 : x === "standard" ? 2 : 1; }
  function up(a, b) { return rank(a) >= rank(b) ? a : b; }
  function count(s) { var n = 0; ["S1", "S2", "S3", "S4", "S5", "S6"].forEach(function (k) { if (s[k]) n++; }); return n; }

  function tierFor(letter, s) {
    var F = "floor", S = "standard", X = "extra-mile", tr = F;
    switch (letter) {
      case "A": tr = F; if (s.S1 || s.S2) tr = up(tr, S); if (s.S4 || s.S6) tr = up(tr, X); return tr;
      case "B": if (!(s.S2 || s.S3 || s.S4 || s.S5)) return F; tr = S; if (s.S2 && (s.S3 || s.S5)) tr = X; if (s.S4) tr = X; return tr;
      case "C": tr = F; if (s.S3) tr = up(tr, S); if (s.S4) tr = X; return tr;
      case "D": if (!(s.S3 || s.S1 || s.S6)) return F; tr = S; if (s.S5 && (s.S1 || s.S6)) tr = X; return tr;
      case "E": tr = (s.S1 || s.S6) ? S : F; if ((s.S1 || s.S6) && s.S5) tr = X; return tr;
      case "F": tr = F; if (s.S1 || s.S3 || s.S6) tr = up(tr, S); if (s.S4) tr = X; return tr;
      case "G": tr = F; if (s.S5) tr = up(tr, S); if (s.S5 && (s.S1 || s.S6)) tr = X; if (s.S4) tr = X; return tr;
      case "H": tr = F; if (s.S3) tr = up(tr, S); if ((s.S1 || s.S3) && s.S5) tr = X; return tr;
      case "I": tr = F; if (s.S5 || s.S1 || s.S3) tr = up(tr, S); if (s.S5 && count(s) >= 2) tr = X; if (s.S4) tr = X; return tr;
      case "J": tr = F; if (s.S5 || s.S1 || s.S6) tr = up(tr, S); if (s.S5) tr = up(tr, X); if (s.S4) tr = X; return tr;
      case "K": tr = (s.S2 || s.S1 || s.S3) ? S : F; if ((s.S1 || s.S3) && s.S5) tr = X; if (s.S4) tr = X; return tr;
      case "L": tr = (s.S1 || s.S2 || s.S3 || s.S5) ? S : F; if ((s.S3 && s.S5) || count(s) >= 3) tr = X; return tr;
    }
    return F;
  }

  function hireVerdict(s) {
    if (s.S4) return { en: "Yes. An AI that can act on its own needs an independent human review before you trust it in production.", id: "Ya. AI yang bisa bertindak sendiri butuh tinjauan manusia independen sebelum kamu memercayainya di produksi." };
    if ((s.S1 && s.S5) || (s.S6 && (s.S1 || s.S5))) return { en: "Yes. Money or irreversible actions at scale warrant an independent human pen-test before launch.", id: "Ya. Uang atau aksi tak-bisa-dibatalkan di skala besar layak dapat pen-test manusia independen sebelum peluncuran." };
    if (s.S1 || s.S2 || s.S3 || s.S5 || s.S6) return { en: "Not yet, but plan one. Run this audit now; at real scale, pay for an independent human review.", id: "Belum, tapi rencanakan. Jalankan audit ini sekarang; di skala nyata, bayar tinjauan manusia independen." };
    return { en: "Probably not yet. Your stakes are low: run the floor and ship. Re-scope when money, logins, or many users arrive.", id: "Mungkin belum. Taruhanmu rendah: jalankan floor lalu rilis. Setel ulang saat ada uang, login, atau banyak user." };
  }

  function buildPrompt(s) {
    var lang = state.lang;
    var present = ["S1", "S2", "S3", "S4", "S5", "S6", "paidAI"].filter(function (k) { return s[k]; });
    var stakesLine = present.length ? present.map(function (k) { return SIGTEXT[k][lang]; }).join("; ") : (lang === "en" ? "no high-stakes signals" : "tidak ada sinyal taruhan tinggi");
    var tiers = NONA.domains.map(function (d) { return d.letter + " " + L(d.name) + ": " + TIER[tierFor(d.letter, s)][lang]; }).join("\n  ");
    var notes = NONA.stack.filter(function (x) { return state.stack[x.id]; }).map(function (x) { return "- " + x.note[lang]; });
    if (s.paidAI) notes.push(lang === "en" ? "- a paid AI API runs in production, so cap spend on day one (a hard total cap and a per-user rate limit) and watch usage" : "- ada API AI berbayar di produksi, jadi batasi pengeluaran sejak hari pertama (batas total keras dan rate limit per-user) dan pantau pemakaian");
    var notesBlock = notes.length ? ((lang === "en" ? "\nStack-specific checks:\n  " : "\nPemeriksaan khusus stack:\n  ") + notes.join("\n  ")) : "";

    if (lang === "id") {
      return "Jalankan audit NONA pada codebase ini. Protokolnya ada di " + NONA.repo + " (baca AGENTS.md di repo, atau salin AGENTS.md ke proyek ini).\n\n" +
        "Yang dipertaruhkan di app ini: " + stakesLine + ".\n\n" +
        "Audit domain-domain ini pada tier berikut:\n  " + tiers + notesBlock + "\n\n" +
        "Aturan: jalankan ini di konteks yang bersih dan baru (idealnya model AI berbeda dari yang membangun app ini); hasilkan artefak, bukan vonis; keluarkan tabel temuan dengan kolom Tingkat keparahan | Risiko bisnis dalam kata biasa | Artefak bukti | Sitasi | Saran perbaikan; pemeriksaan yang tak bisa kamu buktikan tandai INCOMPLETE; tutup dengan Domain L: peringkat temuan per risiko bisnis dan vonis eksplisit kapan harus menyewa manusia. Mulai dari domain tier tertinggi.";
    }
    return "Run a NONA audit on this codebase. The protocol is at " + NONA.repo + " (read AGENTS.md in the repo, or copy AGENTS.md into this project).\n\n" +
      "What is at stake in this app: " + stakesLine + ".\n\n" +
      "Audit these domains at these tiers:\n  " + tiers + notesBlock + "\n\n" +
      "Rules: run this in a clean, fresh context (ideally a different AI model than the one that built this app); produce artifacts, not verdicts; output a findings table with the columns Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix; mark any check you cannot evidence as INCOMPLETE; finish with Domain L: rank findings by business risk and give an explicit when-to-hire-a-human verdict. Start with the highest-tier domains.";
  }

  // ---------- i18n ----------
  function applyStatic() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach(function (n) { var k = n.getAttribute("data-i18n"); if (STRINGS[k]) n.textContent = STRINGS[k][state.lang]; });
  }

  function goStep(n) {
    $$(".panel").forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-panel") === String(n)); });
    $$(".stepper__item").forEach(function (s) { var sn = Number(s.getAttribute("data-step")); s.classList.toggle("is-current", sn === n); s.classList.toggle("is-done", sn < n); });
    var tool = $("#tool"); if (tool && n > 1) tool.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderSignals() {
    var wrap = $("#signal-cards"); wrap.innerHTML = "";
    NONA.signals.forEach(function (sg, i) {
      var on = !!state.sig[sg.id];
      var card = el("button", "card" + (on ? " is-on" : ""));
      card.type = "button"; card.setAttribute("aria-pressed", on ? "true" : "false");
      card.style.animation = "fade 0.4s var(--snap) " + (i * 0.03) + "s both";
      card.innerHTML = '<span class="card__k">' + esc(sg.id === "paidAI" ? "AI $" : sg.id) + '</span><span class="card__t">' + esc(L(sg.label)) + '</span><p class="card__b">' + esc(L(sg.q)) + "</p>";
      card.addEventListener("click", function () {
        state.sig[sg.id] = !state.sig[sg.id];
        var nowOn = !!state.sig[sg.id];
        card.classList.toggle("is-on", nowOn); card.setAttribute("aria-pressed", nowOn ? "true" : "false");
      });
      wrap.appendChild(card);
    });
  }

  function renderStack() {
    var wrap = $("#stack-chips"); wrap.innerHTML = "";
    NONA.stack.forEach(function (x) {
      var on = !!state.stack[x.id];
      var chip = el("button", "chip" + (on ? " is-active" : ""));
      chip.type = "button"; chip.setAttribute("aria-pressed", on ? "true" : "false");
      chip.textContent = L(x.label);
      chip.addEventListener("click", function () {
        state.stack[x.id] = !state.stack[x.id];
        var nowOn = !!state.stack[x.id];
        chip.classList.toggle("is-active", nowOn); chip.setAttribute("aria-pressed", nowOn ? "true" : "false");
      });
      wrap.appendChild(chip);
    });
  }

  function tierTag(tier) {
    var bg = tier === "extra-mile" ? "var(--gold)" : tier === "standard" ? "var(--navy)" : "var(--card)";
    var fg = tier === "extra-mile" ? "var(--ink)" : tier === "standard" ? "var(--paper)" : "var(--ink-faint)";
    var bd = tier === "floor" ? "border:var(--bd-2);" : "";
    return '<span class="tag" style="font-family:var(--font-mono);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:3px 9px;background:' + bg + ';color:' + fg + ';' + bd + '">' + esc(TIER[tier][state.lang]) + "</span>";
  }

  function renderResult() {
    var s = state.sig;
    var r = $("#result");
    var present = ["S1", "S2", "S3", "S4", "S5", "S6", "paidAI"].filter(function (k) { return s[k]; });
    var prompt = buildPrompt(s);

    var html = "";
    html += '<div class="result__head"><p class="result__k">' + esc(t("rPlanK")) + "</p>";
    html += '<h3 class="result__driver" style="font-size:clamp(1.8rem,5vw,2.8rem)">' + esc(t("rPlanK")) + "</h3>";
    if (present.length) {
      html += '<p class="result__transition" style="margin-top:14px"><strong>' + esc(t("rStakes")) + ":</strong> " + present.map(function (k) { return esc(SIGTEXT[k][state.lang]); }).join(" · ") + "</p>";
    } else {
      html += '<p class="result__transition" style="margin-top:14px">' + esc(t("rNoStakes")) + "</p>";
    }
    html += "</div>";

    // The prompt
    html += '<p class="result__section-k">' + esc(t("rPromptK")) + "</p>";
    html += '<p class="closer__note" style="margin:-6px 0 14px">' + esc(t("rPromptHint")) + "</p>";
    html += '<div class="block" style="position:relative"><button type="button" class="go" id="copybtn" style="position:absolute;top:14px;right:14px;padding:9px 16px;font-size:.72rem">' + esc(t("rCopy")) + "</button>";
    html += '<pre id="promptbox" style="white-space:pre-wrap;word-wrap:break-word;font-family:var(--font-mono);font-size:.82rem;line-height:1.5;color:var(--ink);margin:0;padding-right:120px">' + esc(prompt) + "</pre></div>";

    // Tiers per domain
    html += '<p class="result__section-k">' + esc(t("rTiersK")) + "</p>";
    var rows = NONA.domains.map(function (d) {
      var tier = tierFor(d.letter, s);
      return '<li style="display:flex;align-items:center;gap:12px;justify-content:space-between"><span><span class="tag">' + d.letter + "</span> " + esc(L(d.name)) + ' <span style="color:var(--ink-faint);font-size:.86rem">' + esc(L(d.blurb)) + "</span></span>" + tierTag(tier) + "</li>";
    }).join("");
    html += '<div class="block"><ul>' + rows + "</ul></div>";

    // Hire a human (red focal)
    html += '<p class="result__section-k">' + esc(t("rHireK")) + "</p>";
    html += '<div class="ethic"><p class="ethic__k">' + esc(t("rHireK")) + "</p><p>" + esc(L(hireVerdict(s))) + "</p></div>";

    r.innerHTML = html;

    var cb = $("#copybtn");
    if (cb) cb.addEventListener("click", function () {
      var text = prompt;
      function done() { cb.textContent = t("rCopied"); setTimeout(function () { cb.textContent = t("rCopy"); }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else { var ta = $("#promptbox"); var sel = window.getSelection(); var rng = document.createRange(); rng.selectNodeContents(ta); sel.removeAllRanges(); sel.addRange(rng); try { document.execCommand("copy"); } catch (e) {} done(); }
    });
  }

  function init() {
    applyStatic(); renderSignals(); renderStack();

    $$(".lang__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.lang = btn.getAttribute("data-lang");
        $$(".lang__btn").forEach(function (b) { var on = b === btn; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
        applyStatic(); renderSignals(); renderStack();
        if ($(".panel[data-panel='3']").classList.contains("is-active")) renderResult();
      });
    });

    $$(".back").forEach(function (b) { b.addEventListener("click", function () { goStep(Number(b.getAttribute("data-back"))); }); });
    $("#to2").addEventListener("click", function () { goStep(2); });
    $("#run").addEventListener("click", function () { renderResult(); goStep(3); });
    $("#restart").addEventListener("click", function () { state.sig = {}; state.stack = {}; renderSignals(); renderStack(); goStep(1); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

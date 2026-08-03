// Simple client-side i18n
window.I18N = {
  en: {
    nav: { about: "ABOUT", biography: "BIOGRAPHY", bibliography: "BIBLIOGRAPHY", works: "RECENT WORKS", skill: "SKILL", contact: "CONTACT", awards:"AWARDS" },
    sections: { selected: "SELECTED PUBLICATIONS", awards:"AWARDS", experience:"WORK EXPERIENCE", writings:"WRITINGS", scholarships:"SCHOLARSHIPS" },
    hero: { subtitle: "PORTFOLIO", tagline: "Researching AI-driven drug discovery for medium-sized peptides — language models for chemically modified and macrocyclic structures." },
    labels: { articles: "ARTICLES", conference: "CONFERENCE PAPERS", preprints: "PREPRINTS", presentations: "PRESENTATIONS", download_bib: "Download BibTeX" },
    about: {
      keywords: "AI Drug Discovery / Cheminformatics / Medium-sized Peptides / Machine Learning",
      body: "I am a Master's student at the Graduate School of Medicine, Kyoto University, working in the Okuno Laboratory on AI-driven drug discovery. My research builds transformer-based representations for medium-sized peptides — including chemically modified and macrocyclic structures — bridging the gap between small-molecule chemistry and protein sequence."
    }
  },
  ja: {
    nav: { about: "ABOUT", biography: "BIOGRAPHY", bibliography: "BIBLIOGRAPHY", works: "RECENT WORKS", skill: "SKILL", contact: "CONTACT", awards:"AWARDS" },
    sections: { selected: "SELECTED PUBLICATIONS", awards:"AWARDS", experience:"WORK EXPERIENCE", writings:"WRITINGS", scholarships:"SCHOLARSHIPS" },
    hero: { subtitle: "PORTFOLIO", tagline: "ケモインフォマティクスを活用したAI創薬の研究、現在は化学修飾・環状構造を持つ中分子ペプチドの言語モデル開発に取り組んでいます。" },
    labels: { articles: "ARTICLES", conference: "CONFERENCE PAPERS", preprints: "PREPRINTS", presentations: "PRESENTATIONS", download_bib: "BibTeXをダウンロード" },
    about: {
      keywords: "AI創薬 / ケモインフォマティクス / 中分子ペプチド / 機械学習",
      body: "現在、京都大学医学研究科・奥野研究室の修士課程で、中分子ペプチドを対象としたAI創薬研究に従事しています。学部では生命科学・計算科学・プログラミングの基礎を学び、化学修飾や環状構造を含むペプチドのトランスフォーマー表現学習に取り組んでいます。"
    }
  },
  ko: {
    nav: { about: "ABOUT", biography: "BIOGRAPHY", bibliography: "BIBLIOGRAPHY", works: "RECENT WORKS", skill: "SKILL", contact: "CONTACT", awards:"AWARDS" },
    sections: { selected: "SELECTED PUBLICATIONS", awards:"AWARDS", experience:"WORK EXPERIENCE", writings:"WRITINGS", scholarships:"SCHOLARSHIPS" },
    hero: { subtitle: "PORTFOLIO", tagline: "중분자 펩타이드 AI 신약개발 연구를 하고 있습니다. 특히 화학 수식·고리형 구조를 가진 펩타이드의 언어모델 개발에 집중합니다." },
    labels: { articles: "ARTICLES", conference: "CONFERENCE PAPERS", preprints: "PREPRINTS", presentations: "PRESENTATIONS", download_bib: "BibTeX 다운로드" },
    about: {
      keywords: "AI 신약개발 / 케모인포매틱스 / 중분자 펩타이드 / 머신러닝",
      body: "현재 교토대 의학연구과 오쿠노 연구실 석사과정에서 중분자 펩타이드 대상의 AI 신약개발 연구를 수행 중입니다. 학부에서 생명·계산과학과 프로그래밍 기초를 쌓았고, 화학 수식과 고리형 구조를 가진 펩타이드의 트랜스포머 표현학습에 집중하고 있습니다."
    }
  }
};

window.setLang = function(lang) {
  try { localStorage.setItem('lang', lang); } catch(e) {}
  applyI18n(lang);
};

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
}

window.applyI18n = function(lang) {
  const dict = window.I18N[lang] || window.I18N.en;
  // reflect language on <html lang>
  try { document.documentElement.setAttribute('lang', lang || 'en'); } catch(e) {}
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const v = getPath(dict, key);
    if (typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const v = getPath(dict, key);
    if (typeof v === 'string') el.innerHTML = v;
  });
  // Swap multilingual text content (data-lang-en, data-lang-ja, data-lang-ko)
  // Note: deliberately does NOT set `lang` on swapped elements. `data-lang-en` means
  // "what to show in EN mode", not "English text" — a venue's EN variant is usually
  // the Japanese source name. Language of parts is marked statically instead, on the
  // regions that really are fixed English (see index.html / _layouts/talk.html).
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    const text = el.getAttribute('data-lang-' + lang) || el.getAttribute('data-lang-en');
    if (text) {
      const badge = el.querySelector('.badge');
      if (badge) {
        el.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); });
        el.insertBefore(document.createTextNode(text), badge);
      } else {
        el.innerHTML = text;
      }
    }
  });
  // Swap multilingual HTML content (data-lang-html-en, etc.)
  document.querySelectorAll('[data-lang-html-en]').forEach(el => {
    const html = el.getAttribute('data-lang-html-' + lang) || el.getAttribute('data-lang-html-en');
    if (html) el.innerHTML = html;
  });
  // Update active state
  document.querySelectorAll('.lang-switch [data-lang]').forEach(btn => {
    var isActive = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  let lang = 'en';
  try { lang = localStorage.getItem('lang') || 'en'; } catch(e) {}
  if (!window.I18N[lang]) lang = 'en';
  applyI18n(lang);
});

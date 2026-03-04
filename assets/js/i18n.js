// Simple client-side i18n
window.I18N = {
  en: {
    nav: { about: "ABOUT", biography: "BIOGRAPHY", bibliography: "BIBLIOGRAPHY", works: "RECENT WORKS", skill: "SKILL", contact: "CONTACT", awards:"AWARDS" },
    sections: { selected: "SELECTED PUBLICATIONS", awards:"AWARDS", experience:"WORK EXPERIENCE", writings:"WRITINGS", scholarships:"SCHOLARSHIPS" },
    hero: { subtitle: "PORTFOLIO", tagline: "Researching AI-driven drug discovery for medium-sized peptides, focusing on peptide language models and property prediction." },
    labels: { articles: "ARTICLES", conference: "CONFERENCE PAPERS", preprints: "PREPRINTS", presentations: "PRESENTATIONS", download_bib: "Download BibTeX" },
    about: {
      keywords: "AI Drug Discovery / Cheminformatics / Medium-sized Peptides / Machine Learning",
      body: "I am a Master's student at the Graduate School of Medicine, Kyoto University, working in the Okuno Laboratory on AI-driven drug discovery. My current research focuses on transformer-based language models for medium-sized peptide property prediction, bridging the gap between small-molecule and protein informatics."
    }
  },
  ja: {
    nav: { about: "ABOUT", biography: "BIOGRAPHY", bibliography: "BIBLIOGRAPHY", works: "RECENT WORKS", skill: "SKILL", contact: "CONTACT", awards:"AWARDS" },
    sections: { selected: "SELECTED PUBLICATIONS", awards:"AWARDS", experience:"WORK EXPERIENCE", writings:"WRITINGS", scholarships:"SCHOLARSHIPS" },
    hero: { subtitle: "PORTFOLIO", tagline: "ケモインフォマティクスを活用したAI創薬の研究、現在は中分子ペプチドのインシリコ・スクリーニング／言語モデルに関する研究に取り組んでいます。" },
    labels: { articles: "ARTICLES", conference: "CONFERENCE PAPERS", preprints: "PREPRINTS", presentations: "PRESENTATIONS", download_bib: "BibTeXをダウンロード" },
    about: {
      keywords: "AI創薬 / ケモインフォマティクス / 中分子ペプチド / 機械学習",
      body: "現在、京都大学医学研究科・奥野研究室の修士課程で、中分子ペプチドを対象としたAI創薬研究に従事しています。学部では生命科学・計算科学・プログラミングの基礎を学び、トランスフォーマーモデルによるペプチド物性予測と言語モデルの開発に注力しています。"
    }
  },
  ko: {
    nav: { about: "ABOUT", biography: "BIOGRAPHY", bibliography: "BIBLIOGRAPHY", works: "RECENT WORKS", skill: "SKILL", contact: "CONTACT", awards:"AWARDS" },
    sections: { selected: "SELECTED PUBLICATIONS", awards:"AWARDS", experience:"WORK EXPERIENCE", writings:"WRITINGS", scholarships:"SCHOLARSHIPS" },
    hero: { subtitle: "PORTFOLIO", tagline: "중분자 펩타이드 AI 신약개발 연구를 하고 있습니다. 특히 펩타이드 언어모델과 물성 예측에 집중합니다." },
    labels: { articles: "ARTICLES", conference: "CONFERENCE PAPERS", preprints: "PREPRINTS", presentations: "PRESENTATIONS", download_bib: "BibTeX 다운로드" },
    about: {
      keywords: "AI 신약개발 / 케모인포매틱스 / 중분자 펩타이드 / 머신러닝",
      body: "현재 교토대 의학연구과 오쿠노 연구실 석사과정에서 중분자 펩타이드 대상의 AI 신약개발 연구를 수행 중입니다. 학부에서 생명·계산과학과 프로그래밍 기초를 쌓았고, 트랜스포머 기반 펩타이드 물성 예측과 언어모델 개발에 집중하고 있습니다."
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
  // Update active state
  document.querySelectorAll('.lang-switch [data-lang]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  let lang = 'en';
  try { lang = localStorage.getItem('lang') || 'en'; } catch(e) {}
  applyI18n(lang);
});

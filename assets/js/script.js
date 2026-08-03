document.addEventListener("DOMContentLoaded", function () {

  // ================================
  // Dark Mode Toggle
  // ================================
  var themeToggle = document.getElementById("theme-toggle");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  function getStoredTheme() {
    try { return localStorage.getItem("theme"); } catch(e) { return null; }
  }

  // Persist ONLY on an explicit toggle. The old code persisted the OS-derived
  // value during init, which permanently pinned first-time visitors to whatever
  // their OS said at that moment and made the change listener below dead code.
  function setTheme(theme) {
    applyTheme(theme);
    try { localStorage.setItem("theme", theme); } catch(e) {}
  }

  // Initial theme is already applied by the inline bootstrap in _includes/head.html,
  // before first paint. Nothing to initialize here.

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Follow the OS while the reader has made no explicit choice.
  // Guarded: Safari <= 13.1 has no addEventListener on MediaQueryList, and an
  // exception here would abort every later init in this handler.
  if (typeof prefersDark.addEventListener === "function") {
    prefersDark.addEventListener("change", function (e) {
      if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
    });
  }

  // ================================
  // Mobile Hamburger Menu
  // ================================
  var menuToggle = document.getElementById("menu-toggle");
  var gnav = document.getElementById("gnav");

  if (menuToggle && gnav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isOpen);
      gnav.classList.toggle("is-open", !isOpen);
      document.body.style.overflow = !isOpen ? "hidden" : "";
    });

    // Close menu when clicking nav links
    gnav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        gnav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  // ================================
  // Smooth scroll for anchor links
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      var target = document.querySelector(href === "#" || href === "" ? "html" : href);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector(".header");
      var headerHeight = header ? header.offsetHeight : 0;
      var position = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: position, behavior: "smooth" });
      // preventDefault also cancels the focus move, which silently broke the skip
      // link: focus stayed on it, so the next Tab went back into the header.
      if (target.hasAttribute("tabindex") || /^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
        target.focus({ preventScroll: true });
      }
    });
  });

  // Page top button
  var pageTop = document.getElementById("js-page-top");
  if (pageTop) {
    // Show/hide on scroll
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        pageTop.style.opacity = "1";
        pageTop.style.pointerEvents = "auto";
      } else {
        pageTop.style.opacity = "0";
        pageTop.style.pointerEvents = "none";
      }
    });

    // Initially hidden
    pageTop.style.opacity = "0";
    pageTop.style.pointerEvents = "none";
    pageTop.style.transition = "opacity .3s, transform .25s, background-color .25s";

    pageTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Fade-in animation on scroll.
  // The hidden state lives in CSS (html.js .section), NOT in inline styles: it used
  // to be written here, which left every unscrolled section at opacity:0 when
  // printing or saving to PDF, and with JS disabled. CSS gates it on the `js` class
  // and on prefers-reduced-motion, and forces visibility in @media print.
  var sections = document.querySelectorAll(".section");
  if (typeof IntersectionObserver === "function") {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    sections.forEach(function (section) { observer.observe(section); });
  } else {
    sections.forEach(function (section) { section.classList.add("is-visible"); });
  }

});

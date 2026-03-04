document.addEventListener("DOMContentLoaded", function () {

  // ================================
  // Dark Mode Toggle
  // ================================
  var themeToggle = document.getElementById("theme-toggle");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch(e) {}
  }

  function getStoredTheme() {
    try { return localStorage.getItem("theme"); } catch(e) { return null; }
  }

  // Initialize theme
  var storedTheme = getStoredTheme();
  if (storedTheme) {
    setTheme(storedTheme);
  } else if (prefersDark.matches) {
    setTheme("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Listen for system theme changes
  prefersDark.addEventListener("change", function (e) {
    if (!getStoredTheme()) {
      setTheme(e.matches ? "dark" : "light");
    }
  });

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
      e.preventDefault();
      var href = this.getAttribute("href");
      var target = document.querySelector(href === "#" || href === "" ? "html" : href);
      if (target) {
        var headerHeight = document.querySelector(".header").offsetHeight;
        var position = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: position, behavior: "smooth" });
      }
    });
  });

  // Page top button
  var pageTop = document.getElementById("js-page-top");
  if (pageTop) {
    // Show/hide on scroll
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
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

  // Fade-in animation on scroll
  var sections = document.querySelectorAll(".section");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(function (section) {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity .6s ease, transform .6s ease";
    observer.observe(section);
  });

});

document.addEventListener("DOMContentLoaded", function () {

  // Smooth scroll for anchor links
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

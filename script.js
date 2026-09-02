(function () {
  "use strict";

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeToggle");
  var THEME_KEY = "dga-theme";

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    if (themeBtn) themeBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* ignore */
    }
  }

  var stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var isLight = root.getAttribute("data-theme") === "light";
      var next = isLight ? "dark" : "light";
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* ---------- sticky nav shadow ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");

    var toTop = document.querySelector(".to-top");
    if (toTop) {
      if (window.scrollY > 500) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- back to top ---------- */
  var toTopBtn = document.querySelector(".to-top");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- scroll-spy active nav link ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  function updateActiveLink() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    links.forEach(function (link) {
      var match = current && link.getAttribute("href") === "#" + current.id;
      link.classList.toggle("active", !!match);
    });
  }
  document.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- typing effect for hero role ---------- */
  var roleEl = document.getElementById("typedRole");
  var roles = [
    "Full Stack Developer",
    "Java & Spring Boot Engineer",
    "Angular Frontend Developer",
    "Microservice Architecture Designer"
  ];
  if (roleEl) {
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      roleEl.textContent = roles[0];
    } else {
      var roleIndex = 0;
      var charIndex = 0;
      var deleting = false;
      var holdTicks = 0;

      var tick = function () {
        var current = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            holdTicks++;
            if (holdTicks > 26) {
              deleting = true;
              holdTicks = 0;
            }
          }
        } else {
          charIndex--;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        var delay = deleting ? 32 : 62;
        setTimeout(tick, delay);
      };
      setTimeout(tick, 400);
    }
  }

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/**
 * Developero – main script
 * Mobile-first, accessible, no workarounds. Best practices 2026.
 */

(function () {
  "use strict";

  const VH_PER_WORK_CARD = 80;
  const SCROLL_OPACITY_THRESHOLD = 0.8;
  const SCROLL_TRANSLATE_START = 0.5;

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setFooterYear() {
    const el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const overlay = document.getElementById("nav-overlay");
    if (!toggle || !overlay) return;

    const menuLinks = overlay.querySelectorAll('a[href^="#"]');

    function openMenu() {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Închide meniul");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Deschide meniul");
      document.body.style.overflow = "";
    }

    function toggleMenu() {
      const isOpen = overlay.classList.contains("is-open");
      if (isOpen) closeMenu();
      else openMenu();
    }

    toggle.addEventListener("click", toggleMenu);

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeMenu();
    });
  }

  function initTabs() {
    const tabItems = document.querySelectorAll(".tab-list-item");
    const panels = document.querySelectorAll(".tab-panel-item");
    if (!tabItems.length || !panels.length) return;

    tabItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        tabItems.forEach((el) => el.classList.remove("active"));
        panels.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
        panels[index].classList.add("active");
      });
    });
  }

  function initScrollEffects() {
    const sectionWrappers = document.querySelectorAll(".section-wrapper");
    const titleBigElements = document.querySelectorAll(".section-title .title-big");
    const howSection = document.querySelector(".how-we-work");
    const workItems = howSection ? Array.from(howSection.querySelectorAll(".work-item")) : [];

    if (howSection && workItems.length) {
      const scrollTrack = document.createElement("div");
      scrollTrack.className = "how-we-work-scroll-track";
      scrollTrack.style.height = `calc(100vh + ${workItems.length * VH_PER_WORK_CARD}vh)`;

      howSection.parentNode.insertBefore(scrollTrack, howSection);
      scrollTrack.appendChild(howSection);
    }

    function onScroll() {
      const windowHeight = window.innerHeight;

      sectionWrappers.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visible = 1 - rect.top / windowHeight;
        el.style.opacity = "1";

        let translateY = 0;
        if (visible > SCROLL_TRANSLATE_START) {
          const progress = (visible - SCROLL_TRANSLATE_START) / (1 - SCROLL_TRANSLATE_START);
          translateY = 50 + progress * 100;
        }
        el.style.transform = `translateY(${translateY}px)`;
      });

      titleBigElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visible = 1 - rect.top / windowHeight;
        const progress = Math.min(Math.max(visible, 0), 1);
        const letterSpacing = 25 - progress * 24;
        el.style.letterSpacing = `${letterSpacing}px`;
      });

      if (howSection && workItems.length) {
        const scrollTrack = howSection.parentElement;
        const trackRect = scrollTrack.getBoundingClientRect();
        const trackScrolled = -trackRect.top;
        const scrollZone = Math.max(1, scrollTrack.offsetHeight - windowHeight);
        const totalProgress = Math.max(0, Math.min(1, trackScrolled / scrollZone));

        workItems.forEach((item, i) => {
          const start = i / workItems.length;
          const end = (i + 1) / workItems.length;
          const localProgress = Math.max(0, Math.min(1, (totalProgress - start) / (end - start)));
          const translateY = (1 - localProgress) * 16;
          item.style.opacity = "1";
          item.style.transform = `translateY(${translateY}px)`;
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  ready(function () {
    setFooterYear();
    initMobileNav();
    initTabs();
    initScrollEffects();
  });
})();

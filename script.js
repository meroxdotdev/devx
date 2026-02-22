/**
 * Developero – main script
 * Mobile-first, accessible. Best practices 2026. No jumpy scroll effects.
 */

(function () {
  "use strict";

  const VH_PER_WORK_CARD = 80;

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

  function initHowWeWorkReveal() {
    const howSection = document.querySelector(".how-we-work");
    const workItems = howSection ? Array.from(howSection.querySelectorAll(".work-item")) : [];
    if (!howSection || !workItems.length) return;

    const scrollTrack = document.createElement("div");
    scrollTrack.className = "how-we-work-scroll-track";
    scrollTrack.style.height = `calc(100vh + ${workItems.length * VH_PER_WORK_CARD}vh)`;

    howSection.parentNode.insertBefore(scrollTrack, howSection);
    scrollTrack.appendChild(howSection);

    workItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
    });

    let rafScheduled = false;

    function updateReveal() {
      const scrollTrackEl = howSection.parentElement;
      const trackRect = scrollTrackEl.getBoundingClientRect();
      const trackScrolled = -trackRect.top;
      const scrollZone = Math.max(1, scrollTrackEl.offsetHeight - window.innerHeight);
      const totalProgress = Math.max(0, Math.min(1, trackScrolled / scrollZone));

      workItems.forEach((item, i) => {
        const start = i / workItems.length;
        const end = (i + 1) / workItems.length;
        const localProgress = Math.max(0, Math.min(1, (totalProgress - start) / (end - start)));
        item.style.opacity = String(localProgress);
        item.style.transform = `translateY(${(1 - localProgress) * 20}px)`;
      });

      rafScheduled = false;
    }

    function onScroll() {
      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(updateReveal);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateReveal();
  }

  ready(function () {
    setFooterYear();
    initMobileNav();
    initTabs();
    initHowWeWorkReveal();
  });
})();

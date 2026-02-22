document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".section-wrapper");
  const titleBig = document.querySelectorAll(".section-title .title-big");

  // ─── How We Work – sticky scroll reveal ─────────────────────────────────────
  const section = document.querySelector(".how-we-work");
  const workItems = section ? Array.from(section.querySelectorAll(".work-item")) : [];

  if (section && workItems.length) {
    const VH_PER_CARD = 80; // câte "vh" de scroll durează fiecare card

    // Creăm scroll track-ul
    const scrollTrack = document.createElement("div");
    scrollTrack.classList.add("how-we-work-scroll-track");
    scrollTrack.style.cssText = `
      position: relative;
      height: calc(100vh + ${workItems.length * VH_PER_CARD}vh);
    `;

    section.parentNode.insertBefore(scrollTrack, section);
    scrollTrack.appendChild(section);

    // Facem secțiunea sticky
    section.style.cssText += `
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
    `;

    // Pregătim cardurile
    workItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(24px)";
      item.style.transition = "none";
      item.style.willChange = "opacity, transform";
    });
  }

  // ─── Scroll handler ──────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {

    // Logica ta existentă – section-wrapper
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visible = 1 - rect.top / windowHeight;
      const opacity = visible / 0.8;
      el.style.opacity = Math.min(Math.max(opacity, 0), 1);

      let translateY = 0;
      if (visible > 0.5) {
        const progress = (visible - 0.5) / (1 - 0.5);
        translateY = 50 + progress * 100;
      }
      el.style.transform = `translateY(${translateY}px)`;
    });

    // Logica ta existentă – title-big letter spacing
    titleBig.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visible = 1 - rect.top / windowHeight;
      const progress = Math.min(Math.max(visible, 0), 1);

      const letterSpacing = 25 - progress * (25 - 1);
      el.style.letterSpacing = `${letterSpacing}px`;
    });

    // Logica nouă – work-item sticky reveal
    if (section && workItems.length) {
      const scrollTrack = section.parentNode;
      const trackRect = scrollTrack.getBoundingClientRect();
      const trackScrolled = -trackRect.top;
      const scrollZone = scrollTrack.offsetHeight - window.innerHeight;

      const totalProgress = Math.max(0, Math.min(1, trackScrolled / scrollZone));

      workItems.forEach((item, i) => {
        const start = i / workItems.length;
        const end = (i + 1) / workItems.length;

        const localProgress = Math.max(0, Math.min(1, (totalProgress - start) / (end - start)));

        item.style.opacity = localProgress;
        item.style.transform = `translateY(${(1 - localProgress) * 24}px)`;
      });
    }
  });

  // ─── Tabs – logica ta existentă ─────────────────────────────────────────────
  document.querySelectorAll(".tab-list-item").forEach((item, index) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".tab-list-item").forEach((el) => el.classList.remove("active"));
      document.querySelectorAll(".tab-panel-item").forEach((el) => el.classList.remove("active"));

      item.classList.add("active");
      document.querySelectorAll(".tab-panel-item")[index].classList.add("active");
    });
  });
});
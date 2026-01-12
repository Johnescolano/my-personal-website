// =========================
// Skills Carousel + Back-to-Top
// =========================

/*
  This file controls:
  1) Skills carousel (logos slide left/right + autoplay + dots + keyboard + swipe)
  2) Back-to-top button visibility + scroll behavior
*/

(function skillsCarousel() {
  // PURPOSE: Find the carousel on the page.
  // If it doesn't exist, stop the script so nothing crashes.
  const carousel = document.querySelector(".skills-carousel");
  if (!carousel) return;

  // PURPOSE: Get the important carousel elements
  const track = carousel.querySelector(".sc-track");
  const slides = Array.from(carousel.querySelectorAll(".sc-slide"));
  const prevBtn = carousel.querySelector(".sc-prev");
  const nextBtn = carousel.querySelector(".sc-next");
  const dotsWrap = carousel.querySelector(".sc-dots");
  const viewport = carousel.querySelector(".sc-viewport");

  // PURPOSE: index tells us which slide is currently shown
  let index = 0;

  // PURPOSE: timer for autoplay
  let autoTimer = null;

  // PURPOSE: pause autoplay when mouse is hovering carousel
  let isHovering = false;

  // Get a readable label for each slide (used in dot aria labels)
  function getSlideLabel(slideEl) {
    const span = slideEl.querySelector("span");
    if (span && span.textContent.trim()) return span.textContent.trim();
    const img = slideEl.querySelector("img");
    if (img && img.alt.trim()) return img.alt.trim();
    return "skill";
  }

  // -------------------------
  // DOTS (pagination)
  // PURPOSE: create one dot per slide so user can click to navigate
  // -------------------------
  dotsWrap.innerHTML = "";
  const dots = slides.map((slideEl, i) => {
    const b = document.createElement("button");
    b.className = "sc-dot";
    b.type = "button";
    b.setAttribute("aria-label", `Go to ${getSlideLabel(slideEl)} slide`);
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
    return b;
  });

  // -------------------------
  // SIZING
  // PURPOSE: calculate slide width so translateX is correct
  // -------------------------
  function slideWidth() {
    return slides[0].getBoundingClientRect().width;
  }

  // -------------------------
  // UPDATE UI
  // PURPOSE: move the track + update active dot
  // -------------------------
  function update() {
    const w = slideWidth();
    track.style.transform = `translateX(${-index * w}px)`;
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  }

  // -------------------------
  // NAVIGATION FUNCTIONS
  // PURPOSE: go to specific slide, next, previous
  // -------------------------
  function goTo(i, userAction = false) {
    index = (i + slides.length) % slides.length;
    update();
    if (userAction) restartAuto();
  }

  function next(userAction = false) {
    goTo(index + 1, userAction);
  }

  function prev(userAction = false) {
    goTo(index - 1, userAction);
  }

  // -------------------------
  // AUTOPLAY
  // PURPOSE: slide automatically every few seconds
  // -------------------------
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      if (!isHovering) next(false);
    }, 2600);
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  function restartAuto() {
    startAuto();
  }

  // -------------------------
  // BUTTON EVENTS
  // PURPOSE: arrow buttons control slides
  // -------------------------
  nextBtn.addEventListener("click", () => next(true));
  prevBtn.addEventListener("click", () => prev(true));

  // Pause on hover (desktop)
  carousel.addEventListener("mouseenter", () => (isHovering = true));
  carousel.addEventListener("mouseleave", () => (isHovering = false));

  // -------------------------
  // KEYBOARD SUPPORT
  // PURPOSE: when viewport is focused, use arrow keys to move
  // -------------------------
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next(true);
    if (e.key === "ArrowLeft") prev(true);
  });

  // -------------------------
  // SWIPE SUPPORT (mobile)
  // PURPOSE: swipe left/right to navigate
  // -------------------------
  let startX = 0;
  let isDown = false;

  viewport.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;

    const diff = e.clientX - startX;
    const threshold = 35;

    if (diff > threshold) prev(true);
    else if (diff < -threshold) next(true);
  });

  viewport.addEventListener("pointercancel", () => {
    isDown = false;
  });

  // Recalculate on resize (fixes alignment)
  window.addEventListener("resize", update);

  // Init carousel
  update();
  startAuto();
})();


// =========================
// Back to Top Button
// =========================
(function backToTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;

  // PURPOSE: show button when user scrolls down
  function toggleBtn() {
    if (window.scrollY > 500) btn.style.display = "block";
    else btn.style.display = "none";
  }

  window.addEventListener("scroll", toggleBtn);
  toggleBtn();

  // PURPOSE: smooth scroll to top when clicked
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


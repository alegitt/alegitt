// Home page project slider with arrows, dots and keyboard support.
(function () {
  const slider = document.querySelector(".slider");
  if (!slider) return;
  const track = slider.querySelector(".slider-track");
  const slides = [...track.children];
  const dots = document.querySelector(".slider-dots");
  let i = 0;

  slides.forEach((_, n) => {
    const d = document.createElement("button");
    d.setAttribute("aria-label", `Show project ${n + 1}`);
    d.addEventListener("click", () => go(n));
    dots.appendChild(d);
  });

  function go(n) {
    i = (n + slides.length) % slides.length;   // wraps around both ways
    track.style.transform = `translateX(-${i * 100}%)`;
    slides.forEach((s, k) => s.setAttribute("aria-hidden", k !== i));
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === i));
  }

  slider.querySelector(".prev").addEventListener("click", () => go(i - 1));
  slider.querySelector(".next").addEventListener("click", () => go(i + 1));
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(i - 1);
    if (e.key === "ArrowRight") go(i + 1);
  });

  // Swipe on phones
  let x0 = null;
  track.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });

  go(0);
})();

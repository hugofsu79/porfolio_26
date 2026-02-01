// ======================================================
// Infinite marquee with scroll-driven speed boost "Logo"
// ======================================================

export function initLoopingRow(target, options = {}) {
  const el =
    typeof target === "string" ? document.querySelector(target) : target;

  if (!el) return;

  // Anti double-init (important en Astro)
  if (el.dataset.loopInit === "1") return;
  el.dataset.loopInit = "1";

  // ------------------
  // Options
  // ------------------
  const baseSpeed = options.speed ?? 1;
  const slowSpeed = options.slowSpeed ?? 0.2;
  const ease = options.ease ?? 0.08;
  const direction = options.direction === "right" ? 1 : -1;

  // ------------------
  // Duplicate content
  // ------------------
  el.innerHTML += el.innerHTML;

  let position = 0;
  let speed = baseSpeed;
  let targetSpeed = baseSpeed;
  let loopWidth = 0;

  // Scroll influence
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;

  function updateWidth() {
    loopWidth = el.scrollWidth / 2;

    if (direction === 1 && position === 0) {
      position = -loopWidth;
    }
  }

  // Scroll listener
  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    lastScrollY = currentY;

    scrollVelocity = Math.max(-6, Math.min(6, delta * 0.15));
  });

  function animate() {
    speed += (targetSpeed - speed) * ease;

    position += (speed + scrollVelocity) * direction;

    scrollVelocity *= 0.9;

    if (direction === -1) {
      if (position <= -loopWidth) position = 0;
    } else {
      if (position >= 0) position = -loopWidth;
    }

    el.style.transform = `translate3d(${position}px, 0, 0)`;
    requestAnimationFrame(animate);
  }

  el.addEventListener("mouseenter", () => {
    targetSpeed = slowSpeed;
  });

  el.addEventListener("mouseleave", () => {
    targetSpeed = baseSpeed;
  });

  window.addEventListener("resize", updateWidth);

  requestAnimationFrame(() => {
    updateWidth();
    animate();
  });
}

// ======================================================
// Public init (logos / allies)
// ======================================================

export function marquee() {
  const rows = document.querySelectorAll(".allies");
  if (!rows.length) return;

  rows.forEach((row, i) => {
    initLoopingRow(row, {
      speed: 1,
      slowSpeed: 0.2,
      direction: i % 2 === 0 ? "left" : "right",
    });
  });
}

// ======================================================
// Scroll-driven section sync (About / Learn)
// NO reveal-inner, NO text animation
// ======================================================


const sections = document.querySelectorAll(".learnSection");
const titles = document.querySelectorAll(".titleLearn h2");

// ======================================================
// Scroll-driven ARC deformation (Learn sections)
// ======================================================

let arcCurrent = 0;
let arcTarget = 0;
let arcLastScrollY = window.scrollY;

// Scroll → impulse (velocity-based)
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    const delta = y - arcLastScrollY;
    arcLastScrollY = y;

    // positive = scroll down → convex arc
    arcTarget = Math.max(-1, Math.min(1, delta * 0.004));
  },
  { passive: true }
);

function animateSectionArc() {
  // smooth easing
  arcCurrent += (arcTarget - arcCurrent) * 0.08;
  arcTarget *= 0.9;

  sections.forEach((section) => {
    // ARC illusion:
    // - scaleX shrinks edges
    // - translateY lifts center
    const scaleX = 1 - Math.abs(arcCurrent) * 0.06;
    const liftY = Math.abs(arcCurrent) * 18;

    section.style.transform = `
      perspective(1200px)
      translateY(${-liftY}px)
      scaleX(${scaleX})
    `;
  });

  requestAnimationFrame(animateSectionArc);
}

requestAnimationFrame(animateSectionArc);


titles.forEach((title) => {
  title.addEventListener("click", () => {
    const index = title.dataset.index;
    if (!index) return;

    const targetSection = document.querySelector(
      `.learnSection[data-index="${index}"]`,
    );

    if (!targetSection) return;

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
});

const setActiveTitle = (index, intensity = 0) => {
  titles.forEach((h2) => {
    h2.classList.remove("is-active");

    // ALWAYS force neutral weight (no CSS can override)
    h2.style.setProperty(
      "font-variation-settings",
      '"wght" 300',
      "important",
    );
  });

  const t = document.querySelector(`.titleLearn h2[data-index="${index}"]`);
  if (!t) return;

  t.classList.add("is-active");

  // Clamp intensity
  const clamped = Math.max(0, Math.min(1, intensity));

  const wght = Math.round(300 + clamped * 600);

  t.style.setProperty(
    "font-variation-settings",
    `"wght" ${wght}`,
    "important",
  );
};

let activeIndex = null;
let ticking = false;
let hasScrolled = false;
let rafId = null;

const updateFromScroll = () => {
  if (!hasScrolled) return; // 🔑 NOTHING happens before real scroll

  const viewportCenter = window.innerHeight / 2;
  let closestIdx = null;
  let closestDist = Infinity;
  let closestIntensity = 0;

  sections.forEach((section) => {
    const idx = Number(section.dataset.index);
    if (!Number.isFinite(idx)) return;

    const rect = section.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const dist = Math.abs(center - viewportCenter);

    if (dist < closestDist) {
      closestDist = dist;
      closestIdx = idx;

      const norm = Math.min(dist / viewportCenter, 1);
      closestIntensity = 1 - norm;
    }
  });
  if (closestIdx !== null) {
    activeIndex = closestIdx;
    setActiveTitle(activeIndex, closestIntensity);
  }
};

const onScroll = () => {
  hasScrolled = true;

  if (rafId) return;

  rafId = requestAnimationFrame(() => {
    updateFromScroll();
    rafId = null;
  });
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
  hasScrolled = false;
});
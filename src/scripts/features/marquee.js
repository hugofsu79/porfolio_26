export function initLoopingRow(selector, options = {}) {
  const el = document.querySelector(selector);
  if (!el) return;

  // options
  const baseSpeed = options.speed ?? 0.6;
  const slowSpeed = options.slowSpeed ?? 0.05;
  const ease = options.ease ?? 0.08;

  // Dupliquer le contenu
  el.innerHTML += el.innerHTML;

  let position = 0;
  let speed = baseSpeed;
  let targetSpeed = baseSpeed;

  let loopWidth = 0;

  function updateWidth() {
    loopWidth = el.scrollWidth / 2;
  }

  requestAnimationFrame(() => {
    updateWidth();
    animate();
  });

  function animate() {
    speed += (targetSpeed - speed) * ease;
    position -= speed;

    if (position <= -loopWidth) position = 0;

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
}

export function marquee() {
  const marqueeEl = document.querySelector(".marquee");
  const alliesEl = document.querySelector(".allies");

  if (!marqueeEl && !alliesEl) return;


  if (marqueeEl) {
    initLoopingRow(".marquee", { speed: 0.6, slowSpeed: 0.05 });
  }

  if (alliesEl) {
    requestAnimationFrame(() => {
      initLoopingRow(".allies", { speed: 0.6, slowSpeed: 0.05 });
    });
  }
}
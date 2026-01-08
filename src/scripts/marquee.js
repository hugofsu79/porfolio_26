export function initMarquee() {
  const marquee = document.querySelector(".marquee");
  if (!marquee) return;

  // Dupliquer le contenu pour la boucle infinie
  marquee.innerHTML += marquee.innerHTML;

  let position = 0;
  let speed = 1;
  let targetSpeed = speed;

  const slowSpeed = 0.05;
  const ease = 0.08;

  let marqueeWidth = 0;

  function updateWidth() {
    marqueeWidth = marquee.scrollWidth / 2;
  }

  // Attendre que le layout soit stable
  requestAnimationFrame(() => {
    updateWidth();
    animate();
  });

  function animate() {
    speed += (targetSpeed - speed) * ease;
    position -= speed;

    if (position <= -marqueeWidth) {
      position = 0;
    }

    marquee.style.transform = `translate3d(${position}px, 0, 0)`;
    requestAnimationFrame(animate);
  }

  marquee.addEventListener("mouseenter", () => {
    targetSpeed = slowSpeed;
  });

  marquee.addEventListener("mouseleave", () => {
    targetSpeed = 0.6;
  });

  // Recalcul si resize
  window.addEventListener("resize", updateWidth);
}

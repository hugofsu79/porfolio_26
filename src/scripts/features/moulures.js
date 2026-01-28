const COLORS = ["#E8EBE4", "#FF6421"];

const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const animateMoulure = (selector) => {
  const paths = document.querySelectorAll(`${selector} path`);
  if (!paths.length) return;

  paths.forEach((path) => {
    // couleur initiale
    path.style.fill = randomColor();

    const loop = () => {
      path.style.fill = randomColor();

      // timing irrégulier = plus organique
      const next = 2500 + Math.random() * 3000;
      setTimeout(loop, next);
    };

    // chaque path démarre à un moment différent
    setTimeout(loop, Math.random() * 2000);
  });
};

export function moulures() {
  const hasFront = document.querySelector(".frontMoulure");
  const hasBottom = document.querySelector(".buttomMoulure");

  // rien à faire sur cette page
  if (!hasFront && !hasBottom) return;

  if (hasFront) animateMoulure(".frontMoulure");
  if (hasBottom) animateMoulure(".buttomMoulure");
}

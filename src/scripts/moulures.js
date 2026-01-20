    const COLORS = ["#013723", "#DAECC2"];

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

  const init = () => {
        animateMoulure(".frontMoulure");
    animateMoulure(".buttomMoulure");
  };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
        init();
  }

document.querySelectorAll(".carousel").forEach((root) => {
  const viewport = root.querySelector(".carousel__viewport");
  const slides = root.querySelectorAll(".carousel__slide");
  const steps = root.querySelectorAll(".carousel__step");

  if (!viewport || slides.length === 0 || steps.length === 0) return;

  let current = 0;
  const total = slides.length;
  const delay = 4000;
  let intervalId = null;

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;

    slides[current].classList.remove("is-active");
    steps[current].classList.remove("is-active");

    slides[index].classList.add("is-active");
    steps[index].classList.add("is-active");

    current = index;
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    intervalId = setInterval(next, delay);
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  /* Stepper */
  steps.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      goTo(index);
      startAutoPlay(); // 🔥 reset du timer
    });
  });

  /* Clic gauche / droite */
  viewport.addEventListener("click", (e) => {
    const rect = viewport.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    if (clickX > rect.width / 2) {
      next();
    } else {
      prev();
    }

    startAutoPlay(); // 🔥 reset du timer
  });

  /* Lancement initial */
  startAutoPlay();
});
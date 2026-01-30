import { animate } from "animejs";

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("contactPanel");
  if (!panel) {
    console.warn("[contactPanel] #contactPanel introuvable");
    return;
  }

  let isOpen = false;
  let currentAnimation = null;

  const openContact = () => {
    if (isOpen) return;
    isOpen = true;

    panel.classList.add("is-open");
    document.body.style.overflow = "hidden";

    if (currentAnimation && typeof currentAnimation.pause === "function") {
      currentAnimation.pause();
    }

    currentAnimation = animate({
      targets: panel,
      keyframes: [
        { translateX: "100%", opacity: 0 },
        { translateX: "0%", opacity: 1 },
      ],
      duration: 550,
      easing: "cubicBezier(0.4, 0.0, 0.2, 1)",
    });
  };

  const closeContact = () => {
    if (!isOpen) return;
    isOpen = false;

    if (currentAnimation && typeof currentAnimation.pause === "function") {
      currentAnimation.pause();
    }

    panel.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-contact]")) {
      openContact();
      return;
    }

    if (e.target.closest("[data-close-contact]")) {
      closeContact();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeContact();
    }
  });
});
import { animate } from "animejs";

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("contactPanel");
  if (!panel) return;

  let isOpen = false;
  let currentAnimation = null;

  function openContact() {
    if (isOpen) return;
    isOpen = true;

    panel.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // Stop previous animation if any
    if (currentAnimation) currentAnimation.pause();

    currentAnimation = animate({
      targets: panel,
      keyframes: [
        { translateX: "100%", opacity: 0 },
        { translateX: "0%", opacity: 1 },
      ],
      duration: 550,
      easing: "cubicBezier(0.4, 0.0, 0.2, 1)",
    });
  }

  function closeContact() {
    if (!isOpen) return;
    isOpen = false;

    // Stop any running animation safely
    if (currentAnimation && typeof currentAnimation.pause === "function") {
      currentAnimation.pause();
    }

    // Let CSS handle the exit transition
    panel.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-contact]")) {
      openContact();
    }

    if (e.target.closest(".closed")) {
      closeContact();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeContact();
    }
  });
});
import { animate, splitText, stagger } from "animejs";

export function title() {
  const el = document.querySelector(".heroTitle");
  if (!el) return;

  // éviter double init
  if (el.dataset.animDone === "true") return;
  el.dataset.animDone = "true";

  const split = splitText(el, {
    chars: true,
  });

  animate(split.chars, {
    y: ["100%", "0%"],
    opacity: [0, 1],
    delay: stagger(40),
    duration: 700,
    easing: "out(3)",
  });
}
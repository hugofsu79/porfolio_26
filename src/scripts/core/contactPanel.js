import { animate, splitText, stagger } from "animejs";

function getPanel() {
  return document.getElementById("contactPanel");
}

function openContact() {
  const panel = getPanel();
  if (!panel) return;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  animate(panel, {
    translateX: ["100%", "0%"],
    duration: isMobile ? 600 : 1200,
    easing: isMobile
      ? "cubicBezier(0.4, 0, 0.2, 1)"
      : "in(3)",
  });

  setTimeout(() => {
    animateContactText();
  }, 250);

  document.body.style.overflow = "hidden";
}

function animateContactText() {
  const panel = document.getElementById("contactPanel");
  if (!panel) return;

  const paragraph = panel.querySelector(".textContact p");
  if (!paragraph) return;

  splitText(paragraph, {
    lines: { wrap: "clip" },
  }).addEffect(({ lines }) =>
    animate(lines, {
      y: [{ to: ["100%", "0%"] }],
      delay: stagger(0, { start: 800 }),
      duration: 800,
      easing: "in(3)",
    })
  );
}

function closeContact() {
  const panel = getPanel();
  if (!panel) return;

  animate(panel, {
    translateX: ["0vw", "100vw"],
    duration: 1200,
    easing: "out(3)",
  });

  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  if (e.target.closest?.("[data-open-contact]")) openContact();
  if (e.target.closest?.(".closed")) closeContact();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeContact();
});

function initLaboHeadTitleVariableWidth() {
  const headTitle = document.querySelector(".headTitle");
  if (!headTitle) {
    // No target on this page — silently skip.
    console.warn("[labo.js] .headTitle not found — skipping");
    return;
  }

  const h2 = headTitle.querySelector("h2");
  if (!h2) {
    console.warn("[labo.js] .headTitle found but no h2 inside — skipping");
    return;
  }

  console.log("[labo.js] HeadTitle variable width initialized");

  // Valeurs courantes
  let currentWdth = 100;
  let targetWdth = 100;

  // Réglages VERY BOLD
  const damping = 0.05;
  const minWdth = 60;
  const maxWdth = 160;

  headTitle.addEventListener("mousemove", (e) => {
    const rect = headTitle.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(Math.max(x / rect.width, 0), 1);

    targetWdth = minWdth + progress * (maxWdth - minWdth);
  });

  headTitle.addEventListener("mouseleave", () => {
    targetWdth = 100;
  });

  function animate() {
    currentWdth += (targetWdth - currentWdth) * damping;

    // IMPORTANT: Only works if the font supports the 'wdth' axis.
    h2.style.fontVariationSettings = `"wght" 900, "wdth" ${currentWdth.toFixed(1)}`;

    requestAnimationFrame(animate);
  }

  animate();
}

// Ensure DOM is ready (works even if script is loaded in <head>)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLaboHeadTitleVariableWidth);
} else {
  initLaboHeadTitleVariableWidth();
}
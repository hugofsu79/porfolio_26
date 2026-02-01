/*
  coverEffectBase.js
  Canvas / Three.js effect REMOVED
  This file now acts as a safe no-op placeholder
*/

export function coverFx() {
    const root = document.querySelector("[data-cover-fx]");
    if (!root) return;

    const img = root.querySelector("img");
    const canvas = root.querySelector("canvas");

    // Ensure image is visible
    if (img) {
        img.style.visibility = "visible";
        img.style.opacity = "1";
        img.style.transform = "none";
    }

    // Ensure canvas is disabled
    if (canvas) {
        canvas.style.display = "none";
    }
}
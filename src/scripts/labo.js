const page = document.querySelector(".page");
const h2 = page.querySelector("h2");

// Valeurs courantes
let currentWdth = 100;
let targetWdth = 100;

// Réglages VERY BOLD
const damping = 0.05;      // amorti lourd
const minWdth = 60;        // très condensé
const maxWdth = 160;       // très étendu

page.addEventListener("mousemove", (e) => {
    const rect = page.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = Math.min(Math.max(x / rect.width, 0), 1);

    targetWdth = minWdth + progress * (maxWdth - minWdth);
});

page.addEventListener("mouseleave", () => {
    targetWdth = 100; // retour lent au centre
});

function animate() {
    currentWdth += (targetWdth - currentWdth) * damping;

    h2.style.fontVariationSettings = `
    "wght" 900,
    "wdth" ${currentWdth.toFixed(1)}
  `;

    requestAnimationFrame(animate);
}

animate();
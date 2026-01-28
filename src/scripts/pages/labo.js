export function labo() {
  const page = document.querySelector(".page");
  if (!page) return;

  const h2 = page.querySelector("h2");
  if (!h2) return;

  // Valeurs courantes
  let currentWdth = 100;
  let targetWdth = 100;

  // Réglages VERY BOLD
  const damping = 0.05; // amorti lourd
  const minWdth = 60;   // très condensé
  const maxWdth = 160;  // très étendu

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
}


export function recipeModal() {
  const modal = document.getElementById("recipeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalRecipe = document.getElementById("modalRecipe");

  if (!modal || !modalTitle || !modalImage || !modalRecipe) return;

  document.querySelectorAll("[data-open-recipe]").forEach((btn) => {
    btn.addEventListener("click", () => {
      modalTitle.textContent = btn.dataset.title || "";
      modalImage.src = btn.dataset.image || "";
      modalImage.alt = btn.dataset.title || "";
      modalRecipe.value = btn.dataset.slug || "";

      modal.showModal();
    });
  });

  const closeBtn = document.querySelector("[data-close-modal]");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.close());
  }
}
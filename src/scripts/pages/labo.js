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

document.querySelectorAll(".morceau").forEach((el) => {
  el.addEventListener("mouseenter", (e) => {
    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const fromTop = y < rect.height / 2;

    el.classList.remove(
      "from-top",
      "from-bottom",
      "leave-top",
      "leave-bottom"
    );

    el.classList.add(fromTop ? "from-top" : "from-bottom");
  });

  el.addEventListener("mouseleave", (e) => {
    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const toTop = y < rect.height / 2;

    el.classList.remove(
      "from-top",
      "from-bottom",
      "leave-top",
      "leave-bottom"
    );

    el.classList.add(toTop ? "leave-top" : "leave-bottom");
  });
});



//\ hover stylé musiques\//
document.querySelectorAll(".morceau").forEach((el) => {
  el.addEventListener("mouseenter", (e) => {
    const rect = el.getBoundingClientRect();
    const fromTop = e.clientY - rect.top < rect.height / 2;

    el.classList.remove("leave-top", "leave-bottom");
    el.classList.add("enter", fromTop ? "from-top" : "from-bottom");
  });

  el.addEventListener("mouseleave", (e) => {
    const rect = el.getBoundingClientRect();
    const toTop = e.clientY - rect.top < rect.height / 2;

    el.classList.remove("enter", "from-top", "from-bottom");
    el.classList.add(toTop ? "leave-top" : "leave-bottom");
  });
});
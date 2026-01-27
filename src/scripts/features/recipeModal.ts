export function recipeModal() {
  const modal = document.getElementById("recipeModal") as HTMLDialogElement | null;
  const modalTitle = document.getElementById("modalTitle") as HTMLElement | null;
  const modalImage = document.getElementById("modalImage") as HTMLImageElement | null;

  if (!modal || !modalTitle || !modalImage) {
    return;
  }

  document.querySelectorAll<HTMLElement>("[data-open-recipe]").forEach((btn) => {
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      modalTitle.textContent = btn.dataset.title ?? "";
      modalImage.src = btn.dataset.image ?? "";
      modalImage.alt = modalTitle.textContent ?? "";

      modal.showModal();
    });
  });

  document
    .querySelector<HTMLElement>("[data-close-modal]")
    ?.addEventListener("click", () => modal.close());
}
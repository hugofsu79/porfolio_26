export function recipeToggle() {
    document.querySelectorAll(".gridrSlide article").forEach((article) => {
        const details = article.querySelector("details");

        if (!details) return;

        article.addEventListener("click", (e) => {
            // ❌ On ignore les clics sur éléments interactifs
            if (
                e.target.closest("button") ||
                e.target.closest("a") ||
                e.target.closest("summary")
            ) {
                return;
            }

            details.toggleAttribute("open");
        });
    });
}
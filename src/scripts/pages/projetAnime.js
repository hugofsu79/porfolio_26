
export function projetAnim() {
    // On attend que le DOM existe vraiment
    const run = () => {
        // ----------------------------
        // TITRES HERO / CONTEXT ON SCROLL
        // ----------------------------
        const heroTitle = document.querySelector(".project-title--hero");
        const contextTitle = document.querySelector(".project-title--context");
        const context = document.querySelector(".context");

        if (!heroTitle || !contextTitle || !context) {
            console.warn("[projetAnim] Missing title elements", {
                heroTitle,
                contextTitle,
                context,
            });
        } else {
            let threshold =
                context.getBoundingClientRect().top + window.scrollY - 120;

            const recomputeThreshold = () => {
                threshold =
                    context.getBoundingClientRect().top + window.scrollY - 120;
            };

            function onScroll() {
                if (window.scrollY >= threshold) {
                    heroTitle.style.opacity = "0";
                    heroTitle.style.pointerEvents = "none";

                    contextTitle.style.maxHeight = "80px";
                    contextTitle.style.opacity = "1";
                    contextTitle.style.transform = "translateY(0)";
                } else {
                    heroTitle.style.opacity = "1";
                    heroTitle.style.pointerEvents = "auto";

                    contextTitle.style.maxHeight = "0";
                    contextTitle.style.opacity = "0";
                    contextTitle.style.transform = "translateY(6px)";
                }
            }

            // first run + listeners
            onScroll();
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", recomputeThreshold, {
                passive: true,
            });

            // si images/fonts changent la mise en page après coup
            window.addEventListener("load", () => {
                recomputeThreshold();
                onScroll();
            });
        }

        // ----------------------------
        // MOBILE: TOGGLE SECTIONS
        // ----------------------------
        const isMobile = window.matchMedia("(max-width: 720px)");

        const bindMiniGrid = () => {
            document.querySelectorAll(".grid-mini").forEach((section) => {
                const title = section.querySelector("h4");
                if (!title) return;

                // évite doubles bindings si projetAnim() est rappelé
                if (title.dataset.bound === "1") return;
                title.dataset.bound = "1";

                title.addEventListener("click", () => {
                    section.classList.toggle("is-open");
                });
            });
        };

        // bind immédiat
        if (isMobile.matches) bindMiniGrid();

        // si tu redimensionnes la fenêtre desktop -> mobile
        isMobile.addEventListener("change", (e) => {
            if (e.matches) bindMiniGrid();
        });

        console.log("[projetAnim] bound");
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
        run();
    }
}
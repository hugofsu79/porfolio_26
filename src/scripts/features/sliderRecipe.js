// ============================
// Slider Recettes – Init Function
// ============================

export function sliderRecipe() {
    const slider = document.querySelector(".gridrSlide");
    const arrowLeft = document.querySelector(".sliderArrow.left");
    const arrowRight = document.querySelector(".sliderArrow.right");

    // Page sans slider → on sort proprement
    if (!slider || !arrowLeft || !arrowRight) return;

    // Evite les double-bind si le script est appelé plusieurs fois
    if (slider.dataset.bound === "true") return;
    slider.dataset.bound = "true";

    const GAP = 12;
    const firstCard = slider.querySelector("article");
    const SLIDE_STEP = firstCard ? firstCard.offsetWidth + GAP : 300;

    function updateArrows() {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        const atStart = slider.scrollLeft <= 1;
        const atEnd = slider.scrollLeft >= maxScroll - 1;

        arrowLeft.classList.toggle("is-reduced", atStart);
        arrowRight.classList.toggle("is-reduced", atEnd);
    }

    // Click flèches
    arrowLeft.addEventListener("click", () => {
        slider.scrollBy({ left: -SLIDE_STEP, behavior: "smooth" });
    });

    arrowRight.addEventListener("click", () => {
        slider.scrollBy({ left: SLIDE_STEP, behavior: "smooth" });
    });

    // Drag
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    function startDrag(x) {
        isDragging = true;
        startX = x;
        scrollStart = slider.scrollLeft;
    }

    function moveDrag(x) {
        if (!isDragging) return;
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollStart - walk;
    }

    function endDrag() {
        isDragging = false;
    }

    // Mouse
    slider.addEventListener("mousedown", (e) => startDrag(e.pageX));
    slider.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        moveDrag(e.pageX);
    });
    window.addEventListener("mouseup", endDrag);
    slider.addEventListener("mouseleave", endDrag);

    // Touch
    slider.addEventListener(
        "touchstart",
        (e) => startDrag(e.touches[0].pageX),
        { passive: true }
    );
    slider.addEventListener(
        "touchmove",
        (e) => moveDrag(e.touches[0].pageX),
        { passive: true }
    );
    slider.addEventListener("touchend", endDrag);

    slider.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    updateArrows();
}
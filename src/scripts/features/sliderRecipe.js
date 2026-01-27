
// ============================
// Slider Recettes – Full Script
// ============================

// Elements
const slider = document.querySelector(".gridrSlide");
const arrowLeft = document.querySelector(".sliderArrow.left");
const arrowRight = document.querySelector(".sliderArrow.right");

if (!slider || !arrowLeft || !arrowRight) {
    console.warn("❌ Slider ou flèches introuvables");
} else {
    // ----------------------------
    // CONFIG
    // ----------------------------
    const GAP = 12;
    const firstCard = slider.querySelector("article");
    const SLIDE_STEP = firstCard ? firstCard.offsetWidth + GAP : 300;

    // ----------------------------
    // UPDATE ARROWS (LOGIQUE VALIDÉE)
    // ----------------------------
    function updateArrows() {
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        const atStart = slider.scrollLeft <= 1;
        const atEnd = slider.scrollLeft >= maxScroll - 1;

        // reset
        arrowLeft.classList.remove("is-reduced");
        arrowRight.classList.remove("is-reduced");

        // début du carrousel
        if (atStart) {
            arrowLeft.classList.add("is-reduced");
        }

        // fin du carrousel
        if (atEnd) {
            arrowRight.classList.add("is-reduced");
        }
    }

    // ----------------------------
    // ARROWS CLICK
    // ----------------------------
    arrowLeft.addEventListener("click", () => {
        slider.scrollBy({
            left: -SLIDE_STEP,
            behavior: "smooth",
        });
    });

    arrowRight.addEventListener("click", () => {
        slider.scrollBy({
            left: SLIDE_STEP,
            behavior: "smooth",
        });
    });

    // ----------------------------
    // DRAG (SOURIS + TOUCH)
    // ----------------------------
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

    // Souris
    slider.addEventListener("mousedown", (e) => {
        startDrag(e.pageX);
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        moveDrag(e.pageX);
    });

    slider.addEventListener("mouseup", endDrag);
    slider.addEventListener("mouseleave", endDrag);

    // Touch
    slider.addEventListener(
        "touchstart",
        (e) => {
            startDrag(e.touches[0].pageX);
        },
        { passive: true },
    );

    slider.addEventListener(
        "touchmove",
        (e) => {
            moveDrag(e.touches[0].pageX);
        },
        { passive: true },
    );

    slider.addEventListener("touchend", endDrag);

    // ----------------------------
    // LISTENERS
    // ----------------------------
    slider.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    // ----------------------------
    // INIT
    // ----------------------------
    updateArrows();
}
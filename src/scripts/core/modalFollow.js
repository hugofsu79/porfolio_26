export function modalFollow() {
  const modal = document.querySelector(".modaleFollower");

  // Nothing to animate if the component isn't on the page
  if (!modal) {
    return;
  }

  let hasAnimated = false;

  // Run once we are sure DOM is ready (DOMContentLoaded may have already fired)
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, {
        once: true,
      });
    } else {
      fn();
    }
  };

  const animateIn = async () => {
    if (hasAnimated) return;
    hasAnimated = true;

    // mark visible (re-enables pointer events)
    modal.classList.add("is-visible");

    // Try Anime.js first (if installed/resolvable)
    try {
      const mod = await import("animejs");
      const anime = mod.default ?? mod;

      anime({
        targets: modal,
        translateX: ["120%", "0%"],
        translateY: ["60%", "0%"],
        easing: "easeOutCubic",
        duration: 900,
      });
      return;
    } catch (err) {
      console.warn(
        "[ModaleFollower] Anime.js import failed, falling back to WAAPI",
        err,
      );
    }

    // Fallback: Web Animations API (works in modern browsers)
    modal.animate(
      [
        { transform: "translate(120%, 60%)" },
        { transform: "translate(0%, 0%)" },
      ],
      {
        duration: 900,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );
  };

  onReady(() => {
    // If user has already scrolled a bit (e.g., refresh mid-page), animate immediately
    if (window.scrollY > 80) animateIn();

    // Otherwise animate on first scroll past threshold
    const onScroll = () => {
      if (window.scrollY > 80) {
        animateIn();
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  });
}
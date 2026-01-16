if (!document.body.classList.contains("is-page")) return;

const navbar = document.querySelector("nav.navbar_home");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    navbar.classList.add("navbar--hidden");
  } else {
    navbar.classList.remove("navbar--hidden");
  }

  lastScrollY = currentScrollY;
});

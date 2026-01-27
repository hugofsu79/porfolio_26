import { marquee } from "./features/marquee";
import { moulures } from "./features/moulures";
import { player } from "./core/player";
import { title } from "./core/titleEffect";
import { recipeModal } from "./features/recipeModal";
import { formMessage } from "./core/formMessage";
import { modalFollow } from "./core/modalFollow";
import { labo } from "./pages/labo";
import { $ } from "animejs";

function initApp() {
    marquee();
    moulures();
    player();
    title();
    recipeModal();
    formMessage();
    modalFollow();
    labo();
}

initApp();
document.addEventListener("astro:page-load", initApp);
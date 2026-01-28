import { marquee } from "./features/marquee";
import { moulures } from "./features/moulures";
import { player } from "./core/player";
import { title } from "./core/titleEffect";
import { formMessage } from "./core/formMessage.js";
import { modalFollow } from "./core/modalFollow";
import { recipeModal } from "./features/recipeModal.ts"
import { labo } from "./pages/labo";
import { recipeToggle } from "./core/recipeToggle.js";
import { sliderRecipe } from "./features/sliderRecipe.js";

import { $ } from "animejs";

function initApp() {
    marquee();
    moulures();
    player();
    title();
    formMessage();
    modalFollow();
    labo();
    recipeModal();
    sliderRecipe();
    recipeToggle();
    $();
}

initApp();
document.addEventListener("astro:page-load", initApp);

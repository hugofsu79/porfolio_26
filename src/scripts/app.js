import { pageTransition } from "./pages/pageTransition.ts";
import "./features/carouselEffect.js";
import { marquee } from "./features/marquee";
import { moulures } from "./features/moulures";
import { player } from "./core/player";
import { coverFx } from "./core/coverEffectBase.js";
import { formMessage } from "./core/formMessage.js";
import { modalFollow } from "./core/modalFollow";
import { recipeModal } from "./features/recipeModal.ts"
import { labo } from "./pages/labo";
import { recipeToggle } from "./core/recipeToggle.js";
import { sliderRecipe } from "./features/sliderRecipe.js";
import { projetAnim } from "./pages/projetAnime.js";

import { $ } from "animejs";

function initApp() {
    pageTransition();
    marquee();
    moulures();
    player();
    coverFx();
    formMessage();
    modalFollow();
    labo();
    recipeModal();
    sliderRecipe();
    recipeToggle();
    projetAnim();

    $();
}

initApp();
document.addEventListener("astro:page-load", initApp);

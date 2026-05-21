import { initContactEffects } from "./modules/contact.js";
import { initGsap } from "./modules/gsap-setup.js";
import { hideHeaderCinematic, initSmartHeader } from "./modules/header.js";
import { initHero } from "./modules/hero.js";
import { initMenu } from "./modules/menu.js";
import { initPageLoad } from "./modules/page-load.js";
import { initRevealObserver, initScrollAnimations } from "./modules/reveal.js";
import { initScrollIndicator } from "./modules/scroll-indicator.js";

let isNavigatingViaMenu = false;

function setNavigatingViaMenu(value) {
    isNavigatingViaMenu = value;
}

function initApp() {
    initPageLoad();
    const gsapAvailable = initGsap();

    const menuControls = initMenu({
        hideHeader: hideHeaderCinematic,
        setNavigatingViaMenu
    });

    if (!gsapAvailable) return;

    initScrollAnimations();
    initRevealObserver();
    initHero();
    initScrollIndicator();
    initSmartHeader({
        menuControls,
        isNavigatingViaMenu: () => isNavigatingViaMenu
    });
    initContactEffects({
        hideHeader: hideHeaderCinematic,
        setNavigatingViaMenu
    });
}

initApp();

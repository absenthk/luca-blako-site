import { initHero } from "./modules/hero.js";
import { initMenu } from "./modules/menu.js";
import { scrollToSectionCentered } from "./modules/utils.js";

let isNavigatingViaMenu = false;
let headerAutoHideTimer = null;

const HEADER_AUTO_HIDE_MS = 3000;

function initGsap() {
    if (!window.gsap) {
        document.documentElement.classList.add("no-gsap");
        document.body.classList.add("page-loaded");
        console.warn("GSAP is not available. Animations disabled.");
        return false;
    }

    document.documentElement.classList.remove("no-gsap");

    gsap.config({ force3D: true });

    try {
        if (window.ScrollTrigger && window.ScrollToPlugin) {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        } else {
            console.warn("Some GSAP plugins are not available.");
        }
    } catch (err) {
        console.warn("gsap.registerPlugin failed:", err);
    }

    return true;
}

function initScrollAnimations() {
    const fades = document.querySelectorAll(".fade-in");
    if (!fades.length) return;

    fades.forEach((el) => {
        gsap.set(el, {
            opacity: 0,
            y: 40,
            filter: "blur(15px)"
        });
        gsap.to(el, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            }
        });
    });
}

function initRevealObserver() {
    if (!("IntersectionObserver" in window)) return;

    const scrollElements = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver((entries, ob) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("scroll-show");
                ob.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.05
    });

    scrollElements.forEach(el => {
        if (el && el.id !== "bio") observer.observe(el);
    });
}

function hideHeaderCinematic() {
    const header = document.querySelector(".header");
    if (!header) return;

    gsap.killTweensOf(header);

    if (headerAutoHideTimer) {
        clearTimeout(headerAutoHideTimer);
        headerAutoHideTimer = null;
    }

    gsap.timeline()
        .to(header, {
            opacity: 0,
            duration: 0.18,
            ease: "power1.out"
        })
        .to(header, {
            y: -header.offsetHeight,
            duration: 0.32,
            ease: "power2.out"
        }, "-=0.05");
}

function showHeaderCinematic(menuControls) {
    const header = document.querySelector(".header");
    if (!header) return;

    gsap.killTweensOf(header);

    gsap.timeline()
        .to(header, {
            y: 0,
            duration: 0.18,
            ease: "power2.out"
        })
        .to(header, {
            opacity: 1,
            duration: 0.32,
            ease: "power1.out"
        }, "-=0.1");

    if (headerAutoHideTimer) clearTimeout(headerAutoHideTimer);
    headerAutoHideTimer = setTimeout(() => {
        if (!menuControls?.isOpen()) hideHeaderCinematic();
    }, HEADER_AUTO_HIDE_MS);
}

function initSmartHeader(menuControls) {
    const header = document.querySelector(".header");
    if (!header) return;

    const contactBtn = document.getElementById("contactBtn");
    let hideTimeout = null;

    function clearHeaderAutoHide() {
        if (headerAutoHideTimer) {
            clearTimeout(headerAutoHideTimer);
            headerAutoHideTimer = null;
        }
    }

    menuControls?.menuBtn?.addEventListener("click", clearHeaderAutoHide);
    contactBtn?.addEventListener("click", clearHeaderAutoHide);

    if (headerAutoHideTimer) clearTimeout(headerAutoHideTimer);
    headerAutoHideTimer = setTimeout(() => {
        if (!menuControls?.isOpen()) hideHeaderCinematic();
    }, HEADER_AUTO_HIDE_MS);

    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            if (isNavigatingViaMenu || menuControls?.isOpen()) return;

            if (self.direction === 1) {
                if (!hideTimeout) {
                    hideTimeout = setTimeout(() => {
                        hideHeaderCinematic();
                        hideTimeout = null;
                    }, 220);
                }
                return;
            }

            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            showHeaderCinematic(menuControls);
        }
    });
}

function initContactEffects() {
    let contactTimer = null;
    let contactPulsePlayed = false;
    const contactSection = document.querySelector(".contact-section");
    const contactInner = document.querySelector(".contact-inner");
    const contactCTA = document.querySelector(".contact-cta");
    const contactBtn = document.getElementById("contactBtn");

    if (!contactSection || !contactInner || !contactCTA) return;

    gsap.set(contactCTA, {
        scale: 1,
        opacity: 1
    });
    gsap.set(contactInner, {
        opacity: 0,
        y: 20
    });

    gsap.to(contactInner, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
            trigger: contactSection,
            start: "top 45%"
        }
    });

    ScrollTrigger.create({
        trigger: contactSection,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
            contactPulsePlayed = false;
            contactTimer = setTimeout(() => {
                if (!contactPulsePlayed) {
                    pulseCTA();
                    contactPulsePlayed = true;
                }
            }, 4000);
        },
        onEnterBack: () => {
            contactPulsePlayed = false;
            contactTimer = setTimeout(() => {
                if (!contactPulsePlayed) {
                    pulseCTA();
                    contactPulsePlayed = true;
                }
            }, 4000);
        },
        onLeave: () => {
            clearTimeout(contactTimer);
            contactTimer = null;
        },
        onLeaveBack: () => {
            clearTimeout(contactTimer);
            contactTimer = null;
        }
    });

    function pulseCTA() {
        contactCTA.classList.add("is-animating");
        gsap.timeline()
            .to(contactCTA, {
                scale: 1.0,
                duration: 0.40,
                ease: "power1.out"
            })
            .to(contactCTA, {
                scale: 0.965,
                duration: 0.30,
                ease: "power2.in"
            })
            .to(contactCTA, {
                scale: 1.03,
                boxShadow: "0 0 14px rgba(255,255,255,0.55)",
                duration: 0.80,
                ease: "power3.out"
            })
            .to(contactCTA, {
                scale: 1,
                boxShadow: "0 0 0 rgba(255,255,255,0)",
                duration: 1.5,
                ease: "sine.out",
                clearProps: "boxShadow,transform"
            });
    }

    contactBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        isNavigatingViaMenu = true;
        hideHeaderCinematic();
        setTimeout(() => {
            scrollToSectionCentered(document.querySelector("#contacto"));
        }, 220);
        setTimeout(() => {
            isNavigatingViaMenu = false;
        }, 1100);
    });
}

function initPageLoad() {
    window.addEventListener("load", () => {
        document.body.classList.add("page-loaded");
    });

    if (document.readyState === "complete" || document.readyState === "interactive") {
        document.body.classList.add("page-loaded");
    }
}

function initApp() {
    initPageLoad();
    if (!initGsap()) return;

    const menuControls = initMenu({
        hideHeader: hideHeaderCinematic,
        setNavigatingViaMenu: (value) => {
            isNavigatingViaMenu = value;
        }
    });

    initScrollAnimations();
    initRevealObserver();
    initHero();
    initSmartHeader(menuControls);
    initContactEffects();
}

initApp();

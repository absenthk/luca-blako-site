// FAIL-SAFE: remover modo sin GSAP cuando GSAP está disponible
document.documentElement.classList.remove("no-gsap");

gsap.config({
    force3D: true
});
try {
    if (window.ScrollTrigger && window.ScrollToPlugin) {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    } else {
        console.warn('Some GSAP plugins are not available at registration time.');
    }
} catch (err) {
    console.warn('gsap.registerPlugin failed:', err);
}

// --- Safety wrappers: ignore attempts to animate null/empty targets ---
;(function makeGsapSafe(){
    if (!window.gsap) return;
    const g = window.gsap;
    const wrap = (fnName) => {
        const orig = g[fnName];
        if (typeof orig !== 'function') return;
        g[fnName] = function(targets, vars) {
            // normalize
            if (targets == null) return null;
            // string selector
            if (typeof targets === 'string') {
                const nodes = document.querySelectorAll(targets);
                if (!nodes || nodes.length === 0) return null;
            }
            // NodeList or Array
            if (NodeList && targets instanceof NodeList) {
                if (targets.length === 0) return null;
            }
            if (Array.isArray(targets) && targets.length === 0) return null;
            // single Element not in DOM
            if (targets instanceof Element) {
                if (!document.body.contains(targets)) return null;
            }
            try {
                return orig.apply(this, arguments);
            } catch (e) {
                console.warn('gsap.'+fnName+' failed safely:', e);
                return null;
            }
        };
    };

    ['to','fromTo','set','from','killTweensOf'].forEach(wrap);
})();

// ---- SELECTORES ----
const header = document.querySelector(".header");
let isNavigatingViaMenu = false;
let headerAutoHideTimer = null;
const HEADER_AUTO_HIDE_MS = 3000; // hide header after 3s of no menu/contact click

// ---- MENU ----
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav a");
let menuTimeline = null;
let menuOpen = false;

const scrollElements = document.querySelectorAll(".scroll-reveal");

const hero = document.getElementById("hero");
const heroText = document.querySelector(".hero-text");
const heroTextContent = document.querySelector(".hero-text-content");
const heroImageLayer = document.getElementById("heroImageLayer");

const bioSection = document.getElementById("bio");
const bioTitle = document.querySelector(".bio-title");
const bioWrapper = document.querySelector(".bio-wrapper");

const tattooSection = document.getElementById("tattoo");
const tattooOverlayText = document.querySelector(".tattoo-overlay-text");
const placeholderTitle = document.querySelector(".tattoo-placeholder-title");
const tattooBgLayer1 = document.querySelector(".tattoo-bg.layer-1");
const tattooBgLayer2 = document.querySelector(".tattoo-bg.layer-2");
const arrowLeft = document.querySelector(".arrow.left");
const arrowRight = document.querySelector(".arrow.right");

const openContactFormBtn = document.getElementById("openContactForm");


// =========================================================
// 🚀 CONTROL DE SCROLL Y MENÚ
// =========================================================

// ---- variables scroll/control ----
let ticking = false;
let latestScrollY = 0;
let lastScrollY = 0; // Usado para detectar la dirección

/**
 * Función que se ejecuta en el bucle de requestAnimationFrame.
 * Cierra el menú si hay scroll significativo.
 */
function updateScroll() {
    const SCROLL_TOLERANCE = 10;
    const scrollDelta = Math.abs(latestScrollY - lastScrollY);

    if (menuOpen && scrollDelta > SCROLL_TOLERANCE) {
        if (menuTimeline) menuTimeline.timeScale(1.4).reverse();
        menuOpen = false;
        menuBtn.textContent = 'Menu';
        if (menuTimeline) {
            menuTimeline.eventCallback("onReverseComplete", () => {
                nav.classList.remove("open");
            });
        } else {
            nav.classList.remove("open");
        }
    }

    lastScrollY = latestScrollY;
    ticking = false;
}

// Listener principal de scroll (usa RAF para optimización)
window.addEventListener('scroll', () => {
    latestScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScroll();
        });
        ticking = true;
    }
});


// ---------------------------
// MENU — LÓGICA
// ---------------------------

// Abrir / cerrar
menuBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (!menuOpen) {
        // ABRIR
        nav.classList.add("open");
        menuOpen = true;
        menuBtn.textContent = 'Cerrar';
        if (menuTimeline) menuTimeline.timeScale(1).play();
    } else {
        // CERRAR
        if (menuTimeline) menuTimeline.timeScale(1.4).reverse();
        menuOpen = false;
        menuBtn.textContent = 'Menu';
        if (menuTimeline) {
            menuTimeline.eventCallback("onReverseComplete", () => {
                nav.classList.remove("open");
            });
        } else {
            nav.classList.remove("open");
        }
    }
});

// Cerrar clickeando fuera
document.addEventListener("click", () => {
    if (!menuOpen) return;
    if (menuTimeline) menuTimeline.timeScale(1.4).reverse();
    menuOpen = false;
    menuBtn.textContent = 'Menu';
    if (menuTimeline) {
        menuTimeline.eventCallback("onReverseComplete", () => {
            nav.classList.remove("open");
        });
    } else {
        nav.classList.remove("open");
    }
});


/* =========================================================
   Inicializador global
   ========================================================= */
function initAnimations() {
    initScrollAnimations();
    initCarouselAnimation();
    setupTattooEntrance();
    setupMenuAnimation();
    setupIntersectionObserver();
    setupBioToTattooTransition();
    initTattooCarousel();
    setupTattooSectionFade();
    setupHeroEffects();
    setupSmartHeader();
    setupContactEffects();
    setupIlustracionAnimation();

}

// Ejecutar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", initAnimations);

// Si el script se inyectó después del evento DOMContentLoaded, ejecutar de todos modos
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setTimeout(initAnimations, 0);
}


/* Fade-in genérico para cualquier elemento con la clase .fade-in */
function initScrollAnimations() {
    const fades = document.querySelectorAll(".fade-in");
    if (!fades.length) return;

    fades.forEach((el) => {
        // Ignorar la sección Tattoo
        if (el.id === 'tattoo') return;

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

/* Placeholder para el carrusel (C4) */
function initCarouselAnimation() {
    // Implementación futura del carrusel
}


// ---------------------------
// SMART HEADER
// ---------------------------

function hideHeaderCinematic() {
    gsap.killTweensOf(header);
    // clear any pending auto-hide timer
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

function showHeaderCinematic() {
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

    // Start (or restart) the auto-hide timer: if Menu/Contacto aren't clicked in 3s, hide header
    if (headerAutoHideTimer) clearTimeout(headerAutoHideTimer);
    headerAutoHideTimer = setTimeout(() => {
        // Only hide if the nav isn't open (avoid hiding while menu is open)
        if (!nav.classList.contains('open')) hideHeaderCinematic();
    }, HEADER_AUTO_HIDE_MS);
}

function setupSmartHeader() {
    if (!header) return;
    let hideTimeout = null;

    // Ensure header auto-hide behavior: if Menu or Contacto are not clicked in 3s, hide header
    const contactBtn = document.getElementById('contactBtn');

    function clearHeaderAutoHide() {
        if (headerAutoHideTimer) {
            clearTimeout(headerAutoHideTimer);
            headerAutoHideTimer = null;
        }
    }

    // clicking either button prevents the auto-hide (user interacted)
    menuBtn?.addEventListener('click', () => {
        clearHeaderAutoHide();
    });
    contactBtn?.addEventListener('click', () => {
        clearHeaderAutoHide();
    });

    // Start a timer on init so header auto-hides if no interaction
    if (headerAutoHideTimer) clearTimeout(headerAutoHideTimer);
    headerAutoHideTimer = setTimeout(() => {
        if (!nav.classList.contains('open')) hideHeaderCinematic();
    }, HEADER_AUTO_HIDE_MS);

    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            if (isNavigatingViaMenu) return;
            if (nav.classList.contains("open")) return;

            if (self.direction === 1) {
                if (!hideTimeout) {
                    hideTimeout = setTimeout(() => {
                        hideHeaderCinematic();
                        hideTimeout = null;
                    }, 220);
                }
            } else {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                showHeaderCinematic();
            }
        }
    });
}


// ---------------------------
// HERO EFFECTS
// ---------------------------

function setupHeroEffects() {
    if (!hero || !heroText || !heroTextContent || !bioSection || !heroImageLayer) return;

    const heroWords = document.querySelectorAll(".hero-word");
    const heroHeight = hero.offsetHeight || window.innerHeight;

    // --- 1. SET INICIAL DEL ZOOM ---
    gsap.set(heroImageLayer, {
        scale: 1
    });

    //A// --- ENTRADA DEL HERO ---
    gsap.timeline()
        .to(heroWords, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.5,
            ease: "power3.out",
            delay: 0.5
        })
        // [B] Animación de la Imagen (Zoom Out LENTO)
        .to(heroImageLayer, {
            scale: 1.05, // Hace el zoom out hasta su tamaño original
            duration: 4, // 4 segundos
            ease: "power1.out"
        }, 0); // Inicia a los 0.5 segundos


    // --- FADE OUT + PARALLAX AL HACER SCROLL ---
    gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top", // Termina el parallax justo cuando el hero sale de la vista
                scrub: true,
                //markers: true,
                onUpdate: (self) => {
                    if (self.progress < 0.9) {
                        gsap.set(hero, {
                            zIndex: 5
                        });
                    } else {
                        gsap.set(hero, {
                            zIndex: 0
                        });
                    }
                }
            }
        })
        .to(heroText, {
            y: () => -heroHeight * 0.9,
            scaleY: 2.6,
            ease: "none"
        }, 0)
        .to(heroTextContent, {
            opacity: 0,
            filter: "blur(12px)",
            ease: "none",
            duration: 0.3
        }, 0)
        .to(heroImageLayer, {
            opacity: 0,
            filter: "blur(06px)",
            ease: "power2.out",
            duration: 0.4,
            scale: 1.10, // 🔥 zoom in progresivo con scroll
            ease: "none"
        }, 0);
}


// ---------------------------
// IMAGES (Datos del Carrusel)
// ---------------------------
const tattooImages = [
    "assets/images/carrousel-1.jpg",
    "assets/images/carrousel-2.jpg",
    "assets/images/carrousel-3.jpg",
    "assets/images/carrousel-4.jpg",
    "assets/images/carrousel-5.jpg",
    "assets/images/carrousel-6.jpg"
];

const tattooTexts = [{
        title: "Tatuajes pensados, no improvisados",
        description: "Cada decisión tiene un porqué.."
    },
    {
        title: "Cada proyecto es distinto",
        description: "La idea se define en persona, escuchando y ajustando lo necesario."
    },
    {
        title: "Trabajo con personas que entienden el valor del proceso",
        description: "No es una elección apurada ni un diseño genérico."
    },
    {
        title: "El diseño se construye con criterio",
        description: "Líneas, proporciones y estilo se trabajan hasta que está listo."
    },
    {
        title: "Se realiza en estudio profesional",
        description: "con planificación, atención total y foco en tu comodidad."
    },
    {
        title: "Si este enfoque resuena con vos",
        description: "El primer paso es una consulta."
    }
];

let tattooIndex = 0;
let isAnimating = false;
let autoplayTimer = null;


// ---------------------------
// MENU ANIMATION
// ---------------------------
function setupMenuAnimation() {
    if (!navLinks.length) return;
    gsap.set(navLinks, {
        opacity: 0,
        y: -10,
        filter: "blur(6px)"
    });
    menuTimeline = gsap.timeline({
        paused: true
    });
    menuTimeline.to(navLinks, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.32,
        ease: "power2.out",
        stagger: 0.07
    });
}


// ---------------------------
// SCROLL UTIL
// ---------------------------
function scrollToSectionCentered(section) {
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - (window.innerHeight / 2) + (section.offsetHeight / 2);

    gsap.to(window, {
        duration: 0.9,
        scrollTo: targetY,
        ease: "power2.inOut"
    });
}

// ---------------------------
// NAV LINKS (FIX DEFINITIVO)
// ---------------------------
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const href = link.getAttribute("href");
        if (!href) return;

        // Si es un anchor local (empieza con '#'), hacemos scroll animado
        if (href.startsWith('#')) {
            const target = document.querySelector(href);
            if (!target) return;

            const scrollFunction = () => {
                if (href === "#contacto") {
                    scrollToSectionCentered(target);
                } else {
                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: {
                            y: href,
                            autoKill: false
                        },
                        ease: "power2.inOut"
                    });
                }
            };

            // bloqueamos comportamiento automático
            isNavigatingViaMenu = true;

            if (menuOpen && menuTimeline) {
                // 1️⃣ cerramos primero los links del menú
                menuTimeline.timeScale(1.6).reverse();
                menuTimeline.eventCallback("onReverseComplete", () => {
                    nav.classList.remove("open");
                    menuOpen = false;
                    menuBtn.textContent = "Menu";

                    // 2️⃣ escondemos el header (fade + slide)
                    hideHeaderCinematic();

                    // 3️⃣ micro delay cinematográfico
                    setTimeout(() => {
                        scrollFunction();
                    }, 220);

                    // 4️⃣ liberamos control luego del scroll
                    setTimeout(() => {
                        isNavigatingViaMenu = false;
                    }, 1100);

                    // limpiamos callback
                    menuTimeline.eventCallback("onReverseComplete", null);
                });
            } else {
                // fallback (por si el menú no estaba abierto)
                hideHeaderCinematic();
                setTimeout(() => {
                    scrollFunction();
                }, 220);
                setTimeout(() => {
                    isNavigatingViaMenu = false;
                }, 1100);
            }
            return;
        }

        // Si no es un anchor interno, navegar a la URL (página separada)
        // Aseguramos que el menú se cierre primero para UX consistente
        if (menuOpen && menuTimeline) {
            menuTimeline.timeScale(1.6).reverse();
            menuTimeline.eventCallback("onReverseComplete", () => {
                nav.classList.remove("open");
                menuOpen = false;
                menuBtn.textContent = "Menu";
                hideHeaderCinematic();
                window.location.href = href;
            });
        } else {
            hideHeaderCinematic();
            window.location.href = href;
        }

        // 🔑 bloqueamos comportamiento automático
        isNavigatingViaMenu = true;

        if (menuOpen && menuTimeline) {
            // 1️⃣ cerramos primero los links del menú
            menuTimeline.timeScale(1.6).reverse();
            menuTimeline.eventCallback("onReverseComplete", () => {
                nav.classList.remove("open");
                menuOpen = false;
                menuBtn.textContent = "Menu";

                // 2️⃣ escondemos el header (fade + slide)
                hideHeaderCinematic();

                // 3️⃣ micro delay cinematográfico
                setTimeout(() => {
                    scrollFunction();
                }, 220);

                // 4️⃣ liberamos control luego del scroll
                setTimeout(() => {
                    isNavigatingViaMenu = false;
                }, 1100);

                // limpiamos callback
                menuTimeline.eventCallback("onReverseComplete", null);
            });
        } else {
            // fallback (por si el menú no estaba abierto)
            hideHeaderCinematic();
            setTimeout(() => {
                scrollFunction();
            }, 220);
            setTimeout(() => {
                isNavigatingViaMenu = false;
            }, 1100);
        }
    });
});


// ---------------------------
// INTERSECTION OBSERVER
// ---------------------------
function setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) return;
    const options = {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, ob) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("scroll-show");
                ob.unobserve(entry.target);
            }
        });
    }, options);

    scrollElements.forEach(el => {
        if (el && el.id !== "bio") observer.observe(el);
    });
}


// ---------------------------
// HERO ENTRY (Función no usada, se deja para consistencia)
// ---------------------------
function animateHeroText() {
    const tl = gsap.timeline();
    tl.to(".hero-word", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.5,
        ease: "power3.out"
    });
}


// =============================
// BIO → ENTRADA / SALIDA SUAVE
// =============================
function setupBioToTattooTransition() {
    if (!bioSection) return;
    const bioParagraphs = document.querySelectorAll(".bio-wrapper p");
    const bioElements = [bioTitle, ...bioParagraphs];

    // ── ESTADO BASE ──
    gsap.set(bioElements, {
        opacity: 0,
        y: 60,
        filter: "blur(18px)"
    });

    // ── ENTRADA + SALIDA con scroll directo ──
    gsap.to(bioElements, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.15,
        ease: "none", // sin easing para que siga el scroll
        scrollTrigger: {
            trigger: bioSection,
            start: "top 90%", // empieza cuando entra
            end: "bottom 80%", // termina cuando sale
            scrub: true // clave para que la animación siga el scroll
        }
    });
}



// =========================================
// TATTOO — ENTRADA / SALIDA LIMPIA (SIN TÍTULO)
// =========================================
function setupTattooEntrance() {
    const tattooSection = document.querySelector(".tattoo-section");
    const tattooBg = document.querySelector(".tattoo-bg.layer-2");
    const tattooText = document.querySelector(".tattoo-overlay-text");
    const tattooCTA = document.querySelector('.tattoo-cta');

    if (!tattooSection || !tattooBg || !tattooText) return;

    // Estado base
    gsap.set(tattooBg, {
        scale: 1.15
    });
    gsap.set(tattooText, {
        opacity: 0,
        y: 100,
        filter: "blur(20px)"
    });

    // Ensure CTA participates in the same enter/exit motion (we won't force its opacity here,
    // the carousel logic controls visibility — this keeps its movement in sync with the text)
    if (tattooCTA) {
        gsap.set(tattooCTA, {
            y: 100,
            // filter: "blur(20px)", // 🛑 REMOVED BLUR
            opacity: 0
        });
    }

    gsap.timeline({
            scrollTrigger: {
                trigger: tattooSection,
                start: "top 65%",
                end: "bottom 30%",
                scrub: true,
                // When the section leaves the viewport hide the CTA regardless of slide
                onLeave: () => {
                    if (tattooCTA) {
                        gsap.to(tattooCTA, {
                            opacity: 0,
                            y: -20,
                            duration: 0.15,
                            pointerEvents: 'none'
                        });
                    }
                },
                onLeaveBack: () => {
                    if (tattooCTA) {
                        gsap.to(tattooCTA, {
                            opacity: 0,
                            y: -20,
                            duration: 0.15,
                            pointerEvents: 'none'
                        });
                    }
                },
                // When entering the section, only show CTA if we're on the last slide
                onEnter: () => {
                    if (tattooCTA && tattooIndex === tattooTexts.length - 1) {
                        gsap.to(tattooCTA, {
                            opacity: 1,
                            y: 0,
                            duration: 0.15,
                            pointerEvents: 'auto'
                        });
                    }
                },
                onEnterBack: () => {
                    if (tattooCTA && tattooIndex === tattooTexts.length - 1) {
                        gsap.to(tattooCTA, {
                            opacity: 1,
                            y: 0,
                            duration: 0.15,
                            pointerEvents: 'auto'
                        });
                    }
                },
                // Drive CTA opacity from the scroll progress so it fades in/out like the text
                onUpdate: (self) => {
                    if (!tattooCTA) return;
                    const p = self.progress; // 0..1 across start..end
                    // Adjusted ramps so CTA appears a bit later and disappears earlier
                    // New profile: appear ramp between 0.25..0.45, hold until 0.60, disappear ramp 0.60..0.75
                    const enterStart = 0.25;
                    const enterEnd = 0.45;
                    const holdEnd = 0.60;
                    const exitEnd = 0.75;

                    let op = 0;
                    if (p <= enterStart) op = 0;
                    else if (p <= enterEnd) op = (p - enterStart) / (enterEnd - enterStart);
                    else if (p <= holdEnd) op = 1;
                    else if (p <= exitEnd) op = Math.max(0, 1 - (p - holdEnd) / (exitEnd - holdEnd));
                    else op = 0;

                    // 🛑 REMOVED DYNAMIC BLUR CALCULATION
                    // const maxBlur = 14; // px
                    // const blurPx = Math.max(0, (1 - op) * maxBlur);

                    if (tattooIndex === tattooTexts.length - 1) {
                        // only show when we're on the last slide
                        gsap.set(tattooCTA, {
                            opacity: op,
                            // filter: `blur(${blurPx}px)`, // 🛑 REMOVED
                            pointerEvents: op > 0.05 ? 'auto' : 'none'
                        });
                    } else {
                        gsap.set(tattooCTA, {
                            opacity: 0,
                            // filter: `blur(${maxBlur}px)`, // 🛑 REMOVED
                            pointerEvents: 'none'
                        });
                    }
                }
            }
        })
        // Fondo
        .to(tattooBg, {
            scale: 1,
            ease: "none"
        }, 0)
        // Texto editorial
        .to(tattooText, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out"
        }, 0.2)
        // Make CTA follow the same entrance/exit vertical motion (no opacity override)
        .to(tattooCTA ? tattooCTA : {}, {
            y: 0,
            ease: "power2.out"
        }, 0.2)

        // Salida suave
        .to(tattooText, {
            opacity: 0,
            y: -60,
            filter: "blur(14px)",
            ease: "power2.in"
        }, 0.75)
        .to(tattooCTA ? tattooCTA : {}, {
            y: -60,
            ease: "power2.in"
        }, 0.75)
        // Eco visual del fondo
        .to(tattooBg, {
            scale: 1.1,
            ease: "none"
        }, 0.75);
}


// =========================================
// TATTOO — FADE CINEMATOGRÁFICO (SUAVE + ESTABLE)
// =========================================
function setupTattooSectionFade() {
    if (!tattooSection) return;

    // Estado base
    gsap.set(tattooSection, {
        opacity: 0
    });

    gsap.to(tattooSection, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
            trigger: tattooSection,
            start: "top 95%", // empieza antes
            end: "top 40%", // termina mucho después
            scrub: 1 // scrub suave (no inmediato)
        }
    });
}


// ---------------------------
// TATTOO CAROUSEL
// ---------------------------
function initTattooCarousel() {
    if (!tattooBgLayer1 || !tattooBgLayer2) return;

    const pElement = document.querySelector(".tattoo-placeholder-p");
    const tattooCTA = document.querySelector(".tattoo-cta");

    gsap.set([tattooBgLayer1, tattooBgLayer2], {
        opacity: 1,
        x: 0
    });
    tattooBgLayer1.style.backgroundImage = `url('${tattooImages[0]}')`;
    tattooBgLayer2.style.backgroundImage = `url('${tattooImages[0]}')`;

    // Create pagination dots
    let dotsContainer = document.querySelector('.carousel-dots');
    if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        // append to tattooSection container so positioning is correct
        const container = document.querySelector('.tattoo-content') || document.getElementById('tattoo');
        container.appendChild(dotsContainer);
    }

    dotsContainer.innerHTML = '';
    tattooImages.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Ir a slide ${i+1}`);
        dot.addEventListener('click', () => {
            if (i === tattooIndex) return;
            // direct jump to selected slide
            tattooIndex = i;
            tattooBgLayer1.style.backgroundImage = `url('${tattooImages[i]}')`;
            tattooBgLayer2.style.backgroundImage = `url('${tattooImages[i]}')`;
            updateTattooContent(i);
            setActiveDot(i);
        });
        dotsContainer.appendChild(dot);
    });

    function setActiveDot(idx) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d, j) => d.classList.toggle('active', j === idx));
    }


    // ── UPDATE DE CONTENIDO ─────────────────
    function updateTattooContent(index) {
        if (placeholderTitle) placeholderTitle.textContent = tattooTexts[index].title;
        if (pElement) pElement.textContent = tattooTexts[index].description;

        // CTA → solo último slide
        if (tattooCTA) {
            if (index === tattooTexts.length - 1) {
                gsap.to(tattooCTA, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    pointerEvents: "auto"
                });
            } else {
                gsap.to(tattooCTA, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: "power2.in",
                    pointerEvents: "none"
                });
            }
        }
        setActiveDot(index);
    }
    updateTattooContent(tattooIndex);


    // ── SWITCH DE IMAGEN ────────────────────
    function switchTattooImage(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const nextIndex = (tattooIndex + direction + tattooImages.length) % tattooImages.length;
        tattooBgLayer1.style.backgroundImage = `url('${tattooImages[nextIndex]}')`;

        gsap.killTweensOf([placeholderTitle, pElement, tattooCTA]);

        // Salida del texto
        gsap.to([placeholderTitle, pElement], {
            opacity: 0,
            y: direction > 0 ? -20 : 20,
            filter: "blur(8px)",
            duration: 0.3,
            ease: "power2.out"
        });

        if (tattooCTA) {
            gsap.to(tattooCTA, {
                opacity: 0,
                y: 20,
                duration: 0.25,
                pointerEvents: "none"
            });
        }

        // Transición del fondo
        gsap.to(tattooBgLayer2, {
            x: direction > 0 ? "-100%" : "100%",
            scale: 0.95,
            opacity: 0.8,
            duration: 0.7,
            ease: "power3.inOut",
            onComplete: () => {
                gsap.set(tattooBgLayer2, {
                    backgroundImage: tattooBgLayer1.style.backgroundImage,
                    x: 0,
                    scale: 1,
                    opacity: 1
                });
                tattooIndex = nextIndex;
                updateTattooContent(tattooIndex);

                // Entrada del título
                gsap.to(placeholderTitle, {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.25,
                    ease: "power3.out"
                });

                // Entrada del párrafo
                gsap.to(pElement, {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.25,
                    ease: "power3.out",
                    delay: 0.1
                });

                isAnimating = false;
            }
        });
    }


    // -------------------------------
    // Flechas
    // -------------------------------
    arrowLeft?.addEventListener("click", () => switchTattooImage(-1));
    arrowRight?.addEventListener("click", () => switchTattooImage(1));


    // -------------------------------
    // LÓGICA DE SWIPE
    // -------------------------------
    let touchstartX = 0;
    let touchstartY = 0;
    let isSwiping = false;
    const swipeThreshold = 50;

    function handleTouchStart(e) {
        if (isAnimating) return;
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
        isSwiping = false;
    }

    function handleTouchMove(e) {
        if (isAnimating) return;
        const currentX = e.changedTouches[0].screenX;
        const currentY = e.changedTouches[0].screenY;
        const deltaX = currentX - touchstartX;
        const deltaY = currentY - touchstartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            e.preventDefault();
            isSwiping = true;
        }
    }

    function handleTouchEnd(e) {
        if (isAnimating) return;
        const deltaX = e.changedTouches[0].screenX - touchstartX;
        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) switchTattooImage(1);
            else switchTattooImage(-1);
        }
    }

    tattooSection?.addEventListener("touchstart", handleTouchStart, {
        passive: false
    });
    tattooSection?.addEventListener("touchmove", handleTouchMove, {
        passive: false
    });
    tattooSection?.addEventListener("touchend", handleTouchEnd);


    // ── CTA → CONTACTO ──────────────────────
    tattooCTA?.addEventListener("click", () => {
        scrollToSectionCentered(document.querySelector("#contacto"));
    });
}

// init the hint when DOM ready (removed — using pagination dots instead)
openContactFormBtn?.addEventListener("click", () => {
    // FUTURO:
    // - abrir modal de consulta
    // - o mostrar formulario inline
    // - o redirigir a calendario
    console.log("CTA contacto clickeado");
});
// =============================
// Animación cinematográfica de la sección Ilustración
// =============================
function setupIlustracionAnimation() {
    const seccion = document.getElementById("ilustracion");
    if (!seccion) return;

    const titulo = seccion.querySelector(".ilustracion-title");
    const parrafos = seccion.querySelectorAll(".ilustracion-wrapper p");
    const elementos = [titulo, ...parrafos];

    // Estado inicial
    gsap.set(elementos, {
        opacity: 0,
        y: 60,
        filter: "blur(18px)"
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: seccion,
            start: "top 80%",
            end: "bottom 0%",
            scrub: true
        }
    })
    // Fade-in + entrada
    .to(elementos, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.15,
        ease: "power1.out"
    }, 0)
    // Fade-out al salir (suave)
    .to(elementos, {
        opacity: 0,
        y: -20,
        filter: "blur(12px)",
        stagger: 0.12,
        ease: "power1.in"
    }, 1.40);
}


// =============================
// CONTACT — EFECTOS SUTILES
// =============================
function setupContactEffects() {
    let contactTimer = null;
    let contactPulsePlayed = false;
    const contactSection = document.querySelector(".contact-section");
    const contactInner = document.querySelector(".contact-inner");
    const contactCTA = document.querySelector(".contact-cta");
    const contactBtn = document.getElementById("contactBtn");

    if (!contactSection || !contactInner || !contactCTA) return;

    // --- SET INICIAL ---
    // CTA SIEMPRE visible
    gsap.set(contactCTA, {
        scale: 1,
        opacity: 1
    });
    gsap.set(contactInner, {
        opacity: 0,
        y: 20
    });

    // --- Entrada del contenido (no del CTA) ---
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

    // --- Pulse automático del CTA al estar en sección ---
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
            }, 4000); // 4 segundos reales en sección
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

    // --- Función reutilizable de énfasis ---
    function pulseCTA() {
        contactCTA.classList.add("is-animating");
        gsap.timeline()
            // anticipación casi invisible
            .to(contactCTA, {
                scale: 1.0,
                duration: 0.40,
                ease: "power1.out"
            })
            // micro compresión suave
            .to(contactCTA, {
                scale: 0.965,
                duration: 0.30,
                ease: "power2.in"
            })
            // expansión + glow
            .to(contactCTA, {
                scale: 1.03,
                boxShadow: "0 0 14px rgba(255,255,255,0.55)",
                duration: 0.80,
                ease: "power3.out"
            })
            // asentamiento largo + glow lento
            .to(contactCTA, {
                scale: 1,
                boxShadow: "0 0 0 rgba(255,255,255,0)",
                duration: 1.5,
                ease: "sine.out",
                clearProps: "boxShadow,transform"
            });
    }

    // --- Entrada por botón Contacto → pulse inmediato ---
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


/// ---------------------------
// INIT
// ---------------------------
window.addEventListener("load", () => {
    // PAGE FADE-IN
    document.body.classList.add("page-loaded");
});
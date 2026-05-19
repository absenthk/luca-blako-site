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
        if (menuBtn) menuBtn.textContent = 'Menu';
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
if (menuBtn) {
    menuBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (!menuOpen) {
        // ABRIR
        nav.classList.add("open");
        menuOpen = true;
            if (menuBtn) menuBtn.textContent = 'Cerrar';
        if (menuTimeline) menuTimeline.timeScale(1).play();
    } else {
        // CERRAR
        if (menuTimeline) menuTimeline.timeScale(1.4).reverse();
        menuOpen = false;
            if (menuBtn) menuBtn.textContent = 'Menu';
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
    if (menuBtn) menuBtn.textContent = 'Menu';
    if (menuTimeline) {
        menuTimeline.eventCallback("onReverseComplete", () => {
            nav.classList.remove("open");
        });
    } else {
        nav.classList.remove("open");
    }
});
}

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


// Tattoo carousel data removed — clean start


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

            // Normal navigation behavior (removed special-case for tattoo.html)

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
                    if (menuBtn) menuBtn.textContent = "Menu";

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
                if (menuBtn) menuBtn.textContent = "Menu";
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
                if (menuBtn) menuBtn.textContent = "Menu";

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
    // Removed tattoo-specific transition. No-op.
    return;
}



// =========================================
// TATTOO — ENTRADA / SALIDA LIMPIA (SIN TÍTULO)
// =========================================
function setupTattooEntrance() {
    // Removed tattoo entrance logic. No-op.
    return;
}


// =========================================
// TATTOO — FADE CINEMATOGRÁFICO (SUAVE + ESTABLE)
// =========================================
function setupTattooSectionFade() { return; }


// ---------------------------
// TATTOO CAROUSEL
// ---------------------------
function initTattooCarousel() { return; }

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

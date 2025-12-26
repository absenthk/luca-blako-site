// =============================
// main.js - VERSIÓN LIMPIA (Sin Snap Scrolling)
// =============================
gsap.config({ force3D: true });

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ---- SELECTORES ----
const header = document.querySelector(".header");

let isNavigatingViaMenu = false;


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
        
        menuTimeline.eventCallback("onReverseComplete", () => {
            nav.classList.remove("open");
        });
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
        menuTimeline.eventCallback("onReverseComplete", () => {
            nav.classList.remove("open");
        });
    }
});

// Cerrar clickeando fuera
document.addEventListener("click", () => {
    if (!menuOpen) return;

    if (menuTimeline) menuTimeline.timeScale(1.4).reverse();
    menuOpen = false;
    menuBtn.textContent = 'Menu'; 

    menuTimeline.eventCallback("onReverseComplete", () => {
        nav.classList.remove("open");
    });
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
}

// Ejecutar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", initAnimations);


/* Fade-in genérico para cualquier elemento con la clase .fade-in */
function initScrollAnimations() {
    const fades = document.querySelectorAll(".fade-in");
    if (!fades.length) return;

    fades.forEach((el) => {
        // Ignorar la sección Tattoo
        if (el.id === 'tattoo') return;

        gsap.set(el, { opacity: 0, y: 40, filter: "blur(15px)" });

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
}

function setupSmartHeader() {
    if (!header) return;

    let hideTimeout = null;

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
    gsap.set(heroImageLayer, { scale: 1 });
  
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
                    gsap.set(hero, { zIndex: 5 });
                } else {
                    gsap.set(hero, { zIndex: 0 });
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

const tattooTexts = [
    { title: "Tatuajes pensados, no improvisados", description: "Cada decisión tiene un porqué.." },
    { title: "Cada proyecto es distinto", description: "La idea se define en persona, escuchando y ajustando lo necesario." },
    { title: "Trabajo con personas que entienden el valor del proceso", description: "No es una elección apurada ni un diseño genérico." },
    { title: "El diseño se construye con criterio", description: "Líneas, proporciones y estilo se trabajan hasta que está listo." },
    { title: "Se realiza en estudio profesional", description: "con planificación, atención total y foco en tu comodidad." },
    { title: "Si este enfoque resuena con vos", description: "El primer paso es una consulta." }
];

let tattooIndex = 0;
let isAnimating = false;
let autoplayTimer = null;

// ---------------------------
// MENU ANIMATION
// ---------------------------
function setupMenuAnimation() {
    if (!navLinks.length) return;

    gsap.set(navLinks, { opacity: 0, y: -10, filter: "blur(6px)" });

    menuTimeline = gsap.timeline({ paused: true });
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
    const targetY =
        rect.top +
        window.scrollY -
        (window.innerHeight / 2) +
        (section.offsetHeight / 2);

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

        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);
        if (!target) return;

        const scrollFunction = () => {
            if (targetId === "#contacto") {
                scrollToSectionCentered(target);
            } else {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: { y: targetId, autoKill: false },
                    ease: "power2.inOut"
                });
            }
        };

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

    const options = { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.05 };
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
    y: 60,              // ⬅️ menos desplazamiento
    filter: "blur(18px)"
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: bioSection,
      start: "top 80%",   // ⬅️ empieza antes
      end: "bottom 0%",  // ⬅️ termina mucho después
      scrub: true
    }
  })

  // ── ENTRADA ──
  .to(bioElements, {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    stagger: 0.15,       // ⬅️ más aire entre párrafos
    ease: "power1.out"  // ⬅️ más orgánico
  }, 0)

  // ── SALIDA ──
  .to(bioElements, {
    opacity: 0,
    y: -20,
    filter: "blur(12px)",
    stagger: 0.12,
    ease: "power1.in"
  }, 1.40);              // ⬅️ salida tardía
}


// =========================================
// TATTOO — ENTRADA / SALIDA LIMPIA (SIN TÍTULO)
// =========================================
function setupTattooEntrance() {
  const tattooSection = document.querySelector(".tattoo-section");
  const tattooBg = document.querySelector(".tattoo-bg.layer-2");
  const tattooText = document.querySelector(".tattoo-overlay-text");

  if (!tattooSection || !tattooBg || !tattooText) return;

  // Estado base
  gsap.set(tattooBg, { scale: 1.15 });
  gsap.set(tattooText, {
    opacity: 0,
    y: 100,
    filter: "blur(20px)"
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: tattooSection,
      start: "top 65%",
      end: "bottom 30%",
      scrub: true
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

  // Salida suave
  .to(tattooText, {
    opacity: 0,
    y: -60,
    filter: "blur(14px)",
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
  gsap.set(tattooSection, { opacity: 0 });

  gsap.to(tattooSection, {
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: tattooSection,
      start: "top 95%",     // empieza antes
      end: "top 40%",       // termina mucho después
      scrub: 1             // scrub suave (no inmediato)
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

  gsap.set([tattooBgLayer1, tattooBgLayer2], { opacity: 1, x: 0 });

  tattooBgLayer1.style.backgroundImage = `url(${tattooImages[0]})`;
  tattooBgLayer2.style.backgroundImage = `url(${tattooImages[0]})`;

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
  }

  updateTattooContent(tattooIndex);

  // ── SWITCH DE IMAGEN ────────────────────
  function switchTattooImage(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const nextIndex =
      (tattooIndex + direction + tattooImages.length) % tattooImages.length;

    tattooBgLayer1.style.backgroundImage = `url(${tattooImages[nextIndex]})`;

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

    tattooSection?.addEventListener("touchstart", handleTouchStart, { passive: false });
    tattooSection?.addEventListener("touchmove", handleTouchMove, { passive: false });
    tattooSection?.addEventListener("touchend", handleTouchEnd);

  // ── CTA → CONTACTO ──────────────────────
  tattooCTA?.addEventListener("click", () => {
    scrollToSectionCentered(document.querySelector("#contacto"));
  });
}


openContactFormBtn?.addEventListener("click", () => {
    // FUTURO:
    // - abrir modal de consulta
    // - o mostrar formulario inline
    // - o redirigir a calendario

    console.log("CTA contacto clickeado");
});


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
    gsap.set(contactCTA, { scale: 1, opacity: 1 });
    gsap.set(contactInner, { opacity: 0, y: 20 });

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

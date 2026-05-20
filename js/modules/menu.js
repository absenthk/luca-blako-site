import { scrollToSectionCentered } from "./utils.js";

export function initMenu({ hideHeader, setNavigatingViaMenu }) {
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav a");
    let menuTimeline = null;
    let menuOpen = false;

    if (!nav) {
        return {
            menuBtn,
            nav,
            isOpen: () => false
        };
    }

    function removeOpenClassAfterReverse() {
        if (menuTimeline) {
            menuTimeline.eventCallback("onReverseComplete", () => {
                nav.classList.remove("open");
                menuTimeline.eventCallback("onReverseComplete", null);
            });
            return;
        }

        nav.classList.remove("open");
    }

    function closeMenu(timeScale = 1.4) {
        if (menuTimeline) menuTimeline.timeScale(timeScale).reverse();
        menuOpen = false;
        if (menuBtn) menuBtn.textContent = "Menu";
        removeOpenClassAfterReverse();
    }

    function openMenu() {
        nav.classList.add("open");
        menuOpen = true;
        if (menuBtn) menuBtn.textContent = "Cerrar";
        if (menuTimeline) menuTimeline.timeScale(1).play();
    }

    function setupMenuAnimation() {
        if (!navLinks.length) return;

        gsap.set(navLinks, {
            opacity: 0,
            y: -10,
            filter: "blur(6px)"
        });

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

    function setupScrollClose() {
        let ticking = false;
        let latestScrollY = 0;
        let lastScrollY = 0;

        window.addEventListener("scroll", () => {
            latestScrollY = window.scrollY;
            if (ticking) return;

            window.requestAnimationFrame(() => {
                const scrollDelta = Math.abs(latestScrollY - lastScrollY);

                if (menuOpen && scrollDelta > 10) {
                    closeMenu();
                }

                lastScrollY = latestScrollY;
                ticking = false;
            });

            ticking = true;
        });
    }

    function navigateToAnchor(href) {
        const target = document.querySelector(href);
        if (!target) return;

        const scrollFunction = () => {
            if (href === "#contacto") {
                scrollToSectionCentered(target);
                return;
            }

            gsap.to(window, {
                duration: 0.8,
                scrollTo: {
                    y: href,
                    autoKill: false
                },
                ease: "power2.inOut"
            });
        };

        setNavigatingViaMenu(true);

        const completeNavigation = () => {
            hideHeader();
            setTimeout(scrollFunction, 220);
            setTimeout(() => setNavigatingViaMenu(false), 1100);
        };

        if (menuOpen && menuTimeline) {
            menuTimeline.timeScale(1.6).reverse();
            menuTimeline.eventCallback("onReverseComplete", () => {
                nav.classList.remove("open");
                menuOpen = false;
                if (menuBtn) menuBtn.textContent = "Menu";
                completeNavigation();
                menuTimeline.eventCallback("onReverseComplete", null);
            });
            return;
        }

        completeNavigation();
    }

    function navigateToPage(href) {
        const completeNavigation = () => {
            hideHeader();
            window.location.href = href;
        };

        if (menuOpen && menuTimeline) {
            menuTimeline.timeScale(1.6).reverse();
            menuTimeline.eventCallback("onReverseComplete", () => {
                nav.classList.remove("open");
                menuOpen = false;
                if (menuBtn) menuBtn.textContent = "Menu";
                completeNavigation();
                menuTimeline.eventCallback("onReverseComplete", null);
            });
            return;
        }

        completeNavigation();
    }

    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const href = link.getAttribute("href");
                if (!href) return;

                if (href.startsWith("#")) {
                    navigateToAnchor(href);
                    return;
                }

                navigateToPage(href);
            });
        });
    }

    if (menuBtn) {
        menuBtn.addEventListener("click", e => {
            e.stopPropagation();
            if (menuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener("click", () => {
            if (menuOpen) closeMenu();
        });
    }

    setupMenuAnimation();
    setupScrollClose();
    setupNavigation();

    return {
        menuBtn,
        nav,
        isOpen: () => menuOpen
    };
}

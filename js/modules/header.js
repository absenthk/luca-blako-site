const HEADER_AUTO_HIDE_MS = 3000;

let headerAutoHideTimer = null;

export function hideHeaderCinematic() {
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

export function initSmartHeader({ menuControls, isNavigatingViaMenu }) {
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

        if (headerAutoHideTimer) clearTimeout(headerAutoHideTimer);
        headerAutoHideTimer = setTimeout(() => {
            if (!menuControls?.isOpen()) hideHeaderCinematic();
        }, HEADER_AUTO_HIDE_MS);
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
            if (isNavigatingViaMenu() || menuControls?.isOpen()) return;

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
            showHeaderCinematic();
        }
    });
}

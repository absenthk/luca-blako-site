export function initGsap() {
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

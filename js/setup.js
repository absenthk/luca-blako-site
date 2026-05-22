// Setup tasks shared by static pages.
(function initScrollResetOnLoad() {
    if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
    }

    function shouldResetScroll() {
        if (window.location.hash) return false;

        const navigationEntry = performance.getEntriesByType?.("navigation")?.[0];
        return !navigationEntry || navigationEntry.type === "reload" || navigationEntry.type === "navigate";
    }

    function resetScroll() {
        if (!shouldResetScroll()) return;
        window.scrollTo(0, 0);
    }

    function resetScrollPersistently() {
        if (!shouldResetScroll()) return;

        resetScroll();
        requestAnimationFrame(resetScroll);
        setTimeout(resetScroll, 0);
        setTimeout(resetScroll, 80);
        setTimeout(resetScroll, 250);
    }

    resetScroll();
    window.addEventListener("beforeunload", resetScroll);
    window.addEventListener("pageshow", resetScrollPersistently);
    window.addEventListener("load", resetScrollPersistently);
    document.addEventListener("DOMContentLoaded", resetScrollPersistently);
})();

(function initPageLoader() {
    const startedAt = performance.now();
    const minVisibleMs = 850;
    const fadeOutMs = 700;
    const maxMediaWaitMs = 12000;
    const loader = document.createElement("div");
    let resolveLoaderReady;

    window.blakoLoaderReady = new Promise((resolve) => {
        resolveLoaderReady = resolve;
    });
    document.body.classList.add("is-loading");
    loader.className = "page-loader";
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML = '<img src="assets/images/logos/blakologo1.PNG" alt="">';
    document.body.prepend(loader);

    function waitForWindowLoad() {
        if (document.readyState === "complete") return Promise.resolve();

        return new Promise((resolve) => {
            window.addEventListener("load", resolve, { once: true });
        });
    }

    function waitForHeroMedia() {
        const heroMedia = document.getElementById("heroImageLayer");
        if (!heroMedia || heroMedia.tagName !== "VIDEO") return Promise.resolve();
        if (heroMedia.readyState >= 2) return Promise.resolve();

        return new Promise((resolve) => {
            let settled = false;

            function finish() {
                if (settled) return;
                settled = true;
                cleanup();
                resolve();
            }

            function cleanup() {
                clearTimeout(maxWaitTimer);
                heroMedia.removeEventListener("loadeddata", finish);
                heroMedia.removeEventListener("canplay", finish);
                heroMedia.removeEventListener("error", finish);
            }

            const maxWaitTimer = setTimeout(finish, maxMediaWaitMs);
            heroMedia.addEventListener("loadeddata", finish, { once: true });
            heroMedia.addEventListener("canplay", finish, { once: true });
            heroMedia.addEventListener("error", finish, { once: true });
            heroMedia.load();
        });
    }

    function hideLoader() {
        const elapsed = performance.now() - startedAt;
        const delay = Math.max(0, minVisibleMs - elapsed);

        setTimeout(() => {
            loader.classList.add("is-hidden");
            setTimeout(() => {
                document.body.classList.add("page-loaded");
                resolveLoaderReady();
                window.dispatchEvent(new CustomEvent("blako:loader-ready"));
                loader.remove();
                document.body.classList.remove("is-loading");
            }, fadeOutMs);
        }, delay);
    }

    Promise.all([waitForWindowLoad(), waitForHeroMedia()]).then(hideLoader);
})();

(function initGrainVideo() {
    const grainVideo = document.querySelector(".grain-video");
    if (!grainVideo) return;

    const playVideo = () => {
        grainVideo.play().catch(err => console.warn("grain video failed to play", err));
    };

    grainVideo.addEventListener("loadeddata", playVideo);
    setTimeout(playVideo, 2000);
})();

(function disablePictureInPictureForHero() {
    const heroVideo = document.getElementById("heroImageLayer");
    if (!heroVideo || heroVideo.tagName !== "VIDEO") return;

    try {
        heroVideo.disablePictureInPicture = true;
        heroVideo.disableRemotePlayback = true;
    } catch (err) {
        console.warn("hero video playback options could not be applied", err);
    }
})();

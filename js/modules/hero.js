export function initHero() {
    const hero = document.getElementById("hero");
    const heroText = document.querySelector(".hero-text");
    const heroTextContent = document.querySelector(".hero-text-content");
    const heroImageLayer = document.getElementById("heroImageLayer");

    if (!hero || !heroText || !heroTextContent || !heroImageLayer) return;

    const heroWords = Array.from(document.querySelectorAll(".hero-word"));
    const heroCtaItems = Array.from(document.querySelectorAll(".hero-cta .cta-button, .hero-cta .scroll-indicator-btn"));
    const heroHeight = hero.offsetHeight || window.innerHeight;

    function fitTattooTitleToTagline() {
        if (document.body?.dataset.page !== "tattoo") return;

        const titleWords = Array.from(document.querySelectorAll(".hero-title-lockup .hero-word"));
        const taglineBlock = document.querySelector(".hero-tagline-block");
        const taglines = Array.from(document.querySelectorAll(".hero-tagline-block .tagline"));
        if (!titleWords.length || !taglineBlock || !taglines.length) return;

        if (!window.matchMedia("(max-width: 700px)").matches) {
            titleWords.forEach((word) => {
                word.style.fontSize = "";
            });
            return;
        }

        const taglineBlockWidth = taglineBlock.getBoundingClientRect().width;
        const longestTaglineWidth = Math.max(
            ...taglines.map((tagline) => tagline.getBoundingClientRect().width)
        );
        const targetWidth = Math.min(taglineBlockWidth, longestTaglineWidth);
        if (!targetWidth) return;

        let low = 32;
        let high = 76;

        for (let i = 0; i < 12; i += 1) {
            const mid = (low + high) / 2;
            titleWords.forEach((word) => {
                word.style.fontSize = `${mid}px`;
            });

            const widestTitleLine = Math.max(
                ...titleWords.map((word) => word.getBoundingClientRect().width)
            );

            if (widestTitleLine > targetWidth) {
                high = mid;
            } else {
                low = mid;
            }
        }

        titleWords.forEach((word) => {
            word.style.fontSize = `${low}px`;
        });
    }

    fitTattooTitleToTagline();
    window.addEventListener("resize", fitTattooTitleToTagline);
    document.fonts?.ready?.then(fitTattooTitleToTagline);

    gsap.set(heroImageLayer, { scale: 1 });
    gsap.set(heroCtaItems, {
        opacity: 0,
        y: 60,
        filter: "blur(15px)"
    });

    function playHeroIntro() {
        gsap.timeline({ delay: 0.18 })
            .to(heroWords, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                stagger: 0.5,
                ease: "power3.out",
                delay: 0.35
            })
            .to(heroCtaItems, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                stagger: 0.18,
                ease: "power3.out"
            }, "-=0.2")
            .to(heroImageLayer, {
                scale: 1.05,
                duration: 4,
                ease: "power1.out"
            }, 0);
    }

    if (window.blakoLoaderReady) {
        window.blakoLoaderReady.then(playHeroIntro);
    } else {
        playHeroIntro();
    }

    gsap.timeline({
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                gsap.set(hero, { zIndex: self.progress < 0.9 ? 5 : 0 });
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
            duration: 0.4,
            scale: 1.10,
            ease: "none"
        }, 0);
}

export function initHero() {
    const hero = document.getElementById("hero");
    const heroText = document.querySelector(".hero-text");
    const heroTextContent = document.querySelector(".hero-text-content");
    const heroImageLayer = document.getElementById("heroImageLayer");

    if (!hero || !heroText || !heroTextContent || !heroImageLayer) return;

    const heroWords = document.querySelectorAll(".hero-word");
    const heroHeight = hero.offsetHeight || window.innerHeight;

    gsap.set(heroImageLayer, { scale: 1 });

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
        .to(heroImageLayer, {
            scale: 1.05,
            duration: 4,
            ease: "power1.out"
        }, 0);

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

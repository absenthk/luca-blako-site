export function initScrollAnimations() {
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

export function initRevealObserver() {
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

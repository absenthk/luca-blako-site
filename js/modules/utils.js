export function scrollToSectionCentered(section) {
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - (window.innerHeight / 2) + (section.offsetHeight / 2);

    gsap.to(window, {
        duration: 0.9,
        scrollTo: targetY,
        ease: "power2.inOut"
    });
}

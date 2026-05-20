import { scrollToSectionCentered } from "./utils.js";

export function initContactEffects({ hideHeader, setNavigatingViaMenu }) {
    let contactTimer = null;
    let contactPulsePlayed = false;
    const contactSection = document.querySelector(".contact-section");
    const contactInner = document.querySelector(".contact-inner");
    const contactCTA = document.querySelector(".contact-cta");
    const contactBtn = document.getElementById("contactBtn");

    if (!contactSection || !contactInner || !contactCTA) return;

    gsap.set(contactCTA, {
        scale: 1,
        opacity: 1
    });
    gsap.set(contactInner, {
        opacity: 0,
        y: 20
    });

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

    function pulseCTA() {
        contactCTA.classList.add("is-animating");
        gsap.timeline()
            .to(contactCTA, {
                scale: 1.0,
                duration: 0.40,
                ease: "power1.out"
            })
            .to(contactCTA, {
                scale: 0.965,
                duration: 0.30,
                ease: "power2.in"
            })
            .to(contactCTA, {
                scale: 1.03,
                boxShadow: "0 0 14px rgba(255,255,255,0.55)",
                duration: 0.80,
                ease: "power3.out"
            })
            .to(contactCTA, {
                scale: 1,
                boxShadow: "0 0 0 rgba(255,255,255,0)",
                duration: 1.5,
                ease: "sine.out",
                clearProps: "boxShadow,transform"
            });
    }

    function schedulePulse() {
        contactPulsePlayed = false;
        contactTimer = setTimeout(() => {
            if (!contactPulsePlayed) {
                pulseCTA();
                contactPulsePlayed = true;
            }
        }, 4000);
    }

    function clearPulse() {
        clearTimeout(contactTimer);
        contactTimer = null;
    }

    ScrollTrigger.create({
        trigger: contactSection,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: schedulePulse,
        onEnterBack: schedulePulse,
        onLeave: clearPulse,
        onLeaveBack: clearPulse
    });

    contactBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        setNavigatingViaMenu(true);
        hideHeader();
        setTimeout(() => {
            scrollToSectionCentered(document.querySelector("#contacto"));
        }, 220);
        setTimeout(() => {
            setNavigatingViaMenu(false);
        }, 1100);
    });
}

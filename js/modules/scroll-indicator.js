export function initScrollIndicator() {
    const scrollMax = () => document.documentElement.scrollHeight - window.innerHeight;
    if (scrollMax() <= 80) return;

    const indicator = document.createElement("div");
    indicator.className = "scroll-indicator";
    indicator.setAttribute("role", "scrollbar");
    indicator.setAttribute("tabindex", "0");
    indicator.setAttribute("aria-label", "Navegar la pagina");
    indicator.setAttribute("aria-orientation", "vertical");
    indicator.setAttribute("aria-valuemin", "0");
    indicator.setAttribute("aria-valuemax", "100");
    indicator.innerHTML = `
        <span class="scroll-indicator__track" aria-hidden="true">
            <span class="scroll-indicator__thumb"></span>
        </span>
    `;

    document.body.appendChild(indicator);

    const track = indicator.querySelector(".scroll-indicator__track");
    const thumb = indicator.querySelector(".scroll-indicator__thumb");
    let isDragging = false;
    let dragOffset = 0;

    function updateIndicator() {
        const max = scrollMax();
        const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
        const edgeZone = 0.18;
        const edgeProgress = Math.min(progress / edgeZone, (1 - progress) / edgeZone, 1);
        const thumbHeight = 28 + (42 - 28) * Math.max(edgeProgress, 0);

        thumb.style.setProperty("--scroll-thumb-height", `${thumbHeight}px`);

        const travel = track.offsetHeight - thumbHeight;

        thumb.style.transform = `translate(-50%, ${travel * progress}px)`;
        indicator.setAttribute("aria-valuenow", Math.round(progress * 100).toString());
    }

    function scrollToProgress(progress, immediate = false) {
        const targetY = Math.min(Math.max(progress, 0), 1) * scrollMax();

        if (immediate) {
            window.scrollTo(0, targetY);
            updateIndicator();
            return;
        }

        gsap.to(window, {
            duration: 0.45,
            scrollTo: {
                y: targetY,
                autoKill: false
            },
            ease: "power2.out"
        });
    }

    function getProgressFromPointer(clientY) {
        const rect = track.getBoundingClientRect();
        const travel = track.offsetHeight - thumb.offsetHeight;
        const y = clientY - rect.top - dragOffset;

        return travel > 0 ? Math.min(Math.max(y / travel, 0), 1) : 0;
    }

    function startDrag(event) {
        event.preventDefault();
        isDragging = true;
        indicator.classList.add("is-dragging");
        indicator.setPointerCapture?.(event.pointerId);

        const thumbRect = thumb.getBoundingClientRect();
        if (event.target === thumb) {
            dragOffset = event.clientY - thumbRect.top;
        } else {
            dragOffset = thumbRect.height / 2;
        }

        scrollToProgress(getProgressFromPointer(event.clientY), true);
    }

    function drag(event) {
        if (!isDragging) return;
        event.preventDefault();
        scrollToProgress(getProgressFromPointer(event.clientY), true);
    }

    function endDrag(event) {
        if (!isDragging) return;
        isDragging = false;
        indicator.classList.remove("is-dragging");
        indicator.releasePointerCapture?.(event.pointerId);
    }

    function handleKeydown(event) {
        const step = event.shiftKey ? 0.22 : 0.08;
        const currentProgress = scrollMax() > 0 ? window.scrollY / scrollMax() : 0;

        if (event.key === "ArrowDown" || event.key === "PageDown") {
            event.preventDefault();
            scrollToProgress(currentProgress + step);
        }

        if (event.key === "ArrowUp" || event.key === "PageUp") {
            event.preventDefault();
            scrollToProgress(currentProgress - step);
        }
    }

    indicator.addEventListener("pointerdown", startDrag);
    indicator.addEventListener("pointermove", drag);
    indicator.addEventListener("pointerup", endDrag);
    indicator.addEventListener("pointercancel", endDrag);
    indicator.addEventListener("keydown", handleKeydown);
    window.addEventListener("scroll", () => {
        updateIndicator();
    }, { passive: true });
    window.addEventListener("resize", updateIndicator);

    updateIndicator();
}

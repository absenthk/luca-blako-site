export function initPageLoad() {
    window.addEventListener("load", () => {
        document.body.classList.add("page-loaded");
    });

    if (document.readyState === "complete" || document.readyState === "interactive") {
        document.body.classList.add("page-loaded");
    }
}

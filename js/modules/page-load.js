export function initPageLoad() {
    function showPage() {
        document.body.classList.add("page-loaded");
    }

    if (window.blakoLoaderReady) {
        window.blakoLoaderReady.then(showPage);
        return;
    }

    window.addEventListener("load", showPage);

    if (document.readyState === "complete" || document.readyState === "interactive") {
        showPage();
    }
}

// Setup tasks shared by static pages.
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

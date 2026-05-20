// Setup and initialization tasks that were previously inline
// Grain video playback (index.html)
(function initGrainVideo() {
    const grainVideo = document.querySelector('.grain-video');
    if (grainVideo) {
        const playVideo = () => grainVideo.play().catch(err => console.warn('grain video failed to play', err));
        grainVideo.addEventListener('loadeddata', playVideo);
        setTimeout(playVideo, 2000);
    }
})();

// GSAP readiness check and main.js injection
(function loadMainWhenGSAPReady() {
    function injectMain() {
        var s = document.createElement('script');
        s.src = 'js/main.js';
        s.defer = false;
        document.body.appendChild(s);
    }

    if (window.gsap) {
        injectMain();
        return;
    }

    var attempts = 0;
    var max = 35; // ~7s
    var iv = setInterval(function() {
        attempts++;
        if (window.gsap) {
            clearInterval(iv);
            injectMain();
        } else if (attempts >= max) {
            clearInterval(iv);
            document.documentElement.classList.add('no-gsap');
            window.addEventListener('load', function() { document.body.classList.add('page-loaded'); });
            console.warn('GSAP no cargó: main.js no se inyectó. Activando modo no-gsap.');
        }
    }, 200);
})();

// Picture-in-Picture disable for tattoo hero video
(function disablePictureInPictureForHero() {
    var heroVideo = document.getElementById('heroImageLayer');
    try {
        if (heroVideo) {
            heroVideo.disablePictureInPicture = true;
            heroVideo.disableRemotePlayback = true;
        }
    } catch(e) {}
})();

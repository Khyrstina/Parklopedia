const muteButton = document.getElementById("mute");
const video = document.getElementById("backgroundVideo");

muteButton.addEventListener('click', () => {
    video.volume = .2;
    video.muted = !video.muted;
});
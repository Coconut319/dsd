// ============================================
// CALL DEMOS PAGE
// Tab switching + Audio/Video sync
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const industryTabs = document.querySelectorAll('.industry-tab');
    const audioPlayer = document.getElementById('main-audio');
    const videoPlayer = document.getElementById('call-video');

    // Industry tab switching
    industryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const industry = tab.dataset.industry;

            // Stop audio and video
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
            if (videoPlayer) {
                videoPlayer.pause();
                videoPlayer.currentTime = 0;
            }

            // Remove active class from all tabs
            industryTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Update audio source (when you add real audio files)
            // audioPlayer.src = `audio/${industry}.mp3`;

            // Update video source (when you add real video files)
            // videoPlayer.src = `videos/${industry}.mp4`;
        });
    });

    // Sync audio with video (when both are added)
    if (audioPlayer && videoPlayer) {
        audioPlayer.addEventListener('play', () => {
            videoPlayer.play();
        });

        audioPlayer.addEventListener('pause', () => {
            videoPlayer.pause();
        });

        audioPlayer.addEventListener('seeked', () => {
            videoPlayer.currentTime = audioPlayer.currentTime;
        });
    }

    console.log('Call Demos page loaded! 🎥');
});

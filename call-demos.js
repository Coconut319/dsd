// ============================================
// CALL DEMOS PAGE - SMITH.AI STYLE
// Tab switching + Audio/Video sync
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const industryTabs = document.querySelectorAll('.industry-tab');
    const transcriptContents = document.querySelectorAll('.transcript-content');
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

            // Show corresponding transcript
            transcriptContents.forEach(content => {
                if (content.dataset.industry === industry) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Update audio source (placeholder for now)
            // When you add real audio files, update the src here:
            // audioPlayer.src = `audio/${industry}.mp3`;

            // Update video source (placeholder for now)
            // When you add real video files, update the src here:
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

    // Optional: Highlight transcript as audio plays
    // This would require timestamped data for each message
    // Example structure:
    // const transcriptTimestamps = {
    //     'lead-followup': [
    //         { start: 0, end: 5, messageIndex: 0 },
    //         { start: 5, end: 10, messageIndex: 1 },
    //         // etc...
    //     ]
    // };

    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            // Placeholder for transcript highlighting
            // When you have timestamps, implement highlighting here
            const currentTime = audioPlayer.currentTime;
            // Find which message should be highlighted based on currentTime
            // Add 'highlight' class to that message
        });
    }

    console.log('Call Demos page loaded! 🎥');
});

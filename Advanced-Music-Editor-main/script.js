let wavesurfer;

// Initialize Wavesurfer
function initWaveSurfer() {
    if (typeof WaveSurfer === 'undefined') {
        console.error('Wavesurfer.js is not loaded.');
        return;
    }

    if (typeof WaveSurfer.regions === 'undefined') {
        console.error('Wavesurfer Regions Plugin is not loaded.');
        return;
    }

    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#ddd',
        progressColor: '#4CAF50',
        cursorColor: '#333',
        backend: 'MediaElement',
        height: 200,
        plugins: [
            WaveSurfer.regions.create()
        ]
    });

    wavesurfer.on('ready', function () {
        document.getElementById('volume').value = wavesurfer.getVolume();
    });

    wavesurfer.on('finish', function() {
        console.log('Playback finished');
    });
}

// File upload handler
document.getElementById('audioUpload').addEventListener('change', function(event) {
    let files = event.target.files;
    if (files.length > 0) {
        let fileURL = URL.createObjectURL(files[0]);
        if (wavesurfer) {
            wavesurfer.load(fileURL);
        } else {
            console.error('Wavesurfer is not initialized.');
        }
    }
});

// Play audio
function playAudio() {
    console.log('Play button clicked');
    if (wavesurfer && !wavesurfer.isPlaying()) {
        wavesurfer.play();
    }
}

// Pause audio
function pauseAudio() {
    console.log('Pause button clicked');
    if (wavesurfer && wavesurfer.isPlaying()) {
        wavesurfer.pause();
    }
}

// Stop audio
function stopAudio() {
    if (wavesurfer) {
        wavesurfer.stop();
    }
}

// Set volume
function setVolume(volume) {
    if (wavesurfer) {
        wavesurfer.setVolume(volume);
    }
}

// Trim audio
function trimAudio() {
    if (wavesurfer) {
        let start = wavesurfer.getCurrentTime();
        let end = wavesurfer.getDuration();

        wavesurfer.addRegion({
            start: start,
            end: end,
            color: 'rgba(0, 0, 0.1,)',
            drag: true,
            resize: true,
        });

        wavesurfer.on('region-dblclick', function (region) {
            wavesurfer.clearRegions();
            let trimmedAudio = wavesurfer.backend.buffer.slice(region.start, region.end);
            wavesurfer.loadDecodedBuffer(trimmedAudio); 
        });
    }
}

// Save audio
function saveAudio() {
    if (wavesurfer) {
        let audioBlob = wavesurfer.backend.buffer;
        let wavBlob = audioBufferToWav(audioBlob);
        saveAs(wavBlob, 'edited_audio.wav');
    }
}

// Convert audio buffer to WAV format
function audioBufferToWav(buffer) {
    // Implementation as provided above
}

// Add event listeners for buttons
document.getElementById("playBtn").addEventListener("click", playAudio);
document.getElementById("pauseBtn").addEventListener("click", pauseAudio);
document.getElementById("stopBtn").addEventListener("click", stopAudio);
document.getElementById("trimBtn").addEventListener("click", trimAudio);
document.getElementById("saveBtn").addEventListener("click", saveAudio);

// Initialize Wavesurfer on page load
document.addEventListener('DOMContentLoaded', initWaveSurfer);
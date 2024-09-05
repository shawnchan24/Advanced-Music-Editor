let wavesurfer;
let audioContextStarted = false;

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

    // Check if AudioContext needs resuming
    if (!audioContextStarted) {
        document.body.addEventListener('click', function() {
            if (!audioContextStarted) {
                // Resume AudioContext if it's in a suspended state
                if (wavesurfer.backend.ac.state === 'suspended') {
                    wavesurfer.backend.ac.resume().then(() => {
                        audioContextStarted = true;
                        console.log('AudioContext resumed');
                    });
                } else {
                    audioContextStarted = true;
                }
            }
        }, { once: true });
    }
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
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    const sampleRate = buffer.sampleRate;
    let offset = 0;
    let pos = 0;

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function floatTo16BitPCM(view, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, input[i])) * 0x7FFF;
            view.setInt16(offset, s, true);
        }
    }

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length - 8, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2 * numOfChan, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length - 44, true);

    for (let i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i));
    }

    for (let i = 0; i < channels[0].length; i++) {
        for (let j = 0; j < numOfChan; j++) {
            floatTo16BitPCM(view, pos, channels[j][i]);
            pos += 2;
        }
    }

    return new Blob([view], { type: 'audio/wav' });
}

// Add event listeners for buttons
document.getElementById("playBtn").addEventListener("click", playAudio);
document.getElementById("pauseBtn").addEventListener("click", pauseAudio);
document.getElementById("stopBtn").addEventListener("click", stopAudio);
document.getElementById("trimBtn").addEventListener("click", trimAudio);
document.getElementById("saveBtn").addEventListener("click", saveAudio);

// Initialize Wavesurfer on page load
document.addEventListener('DOMContentLoaded', initWaveSurfer);
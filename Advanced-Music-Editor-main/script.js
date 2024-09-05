let wavesurfer;

// Initialize Wavesurfer
function initWaveSurfer() {
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
        console.log('Playback finished')
          });
    }

    document.getElementById('audioUpload').addEventListener('change', function(event) {
        let files = event.target.files;
        if (files.length > 0) {
            let fileURL = URL.createObjectURL(files[0]);
            wavesurfer.load(fileURL);
        }
    });

// Play audio
function playAudio() {
    console.log('Play button clicked');
    if (wavesurfer.isPlaying()) {
        wavesurfer.play();
    }
}

// Pause audio
function pauseAudio() {
    console.log('Pause button clicked');
    if (!wavesurfer.isPlaying()) {
        wavesurfer.pause();
    }
}

// Stop audio
function stopAudio(){
    wavesurfer.stop();
}

// Set volume
function setVolume(volume) {
    wavesurfer.setVolume(volume);
}

// Trim audio
function trimAudio() {
    let start = wavesurfer.getCurrentTime();
    let end = wavesurfer.getDuration();

    wavesurfer.addRegion({
        start: start,
        end: end,
        color: 'rgba(0, 0, 0.1,)',
        drag: true,
        resize: true,
    });
    
    // Trim the region when double-clicked
    wavesurfer.on('region-dblclick', function (region) {
        wavesurfer.clearRegions();
        let trimmedAudio = wavesurfer.backend.buffer.slice(region.start, region.end);
           
            // Set the trimmed audio as the new buffer
            wavesurfer.loadDecodedBuffer(trimmedAudio); 
        });
}

// Save audio (dummy function, needs backend to fully implement)
function saveAudio() {
    let audioBlob = wavesurfer.backend.buffer;
    let wavBlob = audioBlobToWav(audioBlob);
    saveAs(wavBlob, 'edited_audio.wav');
}

// Convert audio buffer to WAV format
function audioBlobToWav(buffer) {
    let wav = audioBufferToWav(buffer);
    let blob = new Blob([new DataView(wav)], { type: 'audio/wav' });
    return blob;
 }

 // Add event listeners for buttons
document.getElementById("playBtn").addEventListener("click", playAudio);
document.getElementById("pauseBtn").addEventListener("click", pauseAudio);
document.getElementById("stopBtn").addEventListener("click", stopAudio);
document.getElementById("trimBtn").addEventListener("click", trimAudio);
document.getElementById("saveBtn").addEventListener("click", saveAudio);
 
// Initialize Wavesurfer on page load
initWaveSurfer();
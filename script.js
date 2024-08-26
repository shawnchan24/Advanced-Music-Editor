let wavesurfer;

// Initialize Wavesurfer
function initWaveSurfer() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#ddd',
        progressColor: '#4CAF50',
        cursorColor: '#333',
        backend: 'MediaElement',
        height: 200
    });

    wavesurfer.on('ready', function
    () {

document.getElementById('volume').val
ue = wavesurfer.getVolume();
    });

    wavesurfer.on('finish', function
() {
        console.log('Playback finished')
          });
    }

// Load audio file into Wavesurfer
document.getElementById('audioUpload'
).onchange = function (event) {
    let files = event.target.files;
    if (files.length > 0) {
        let fileURL =
URL.createObjectURL(files[0]);
    }
};

// Play audio
function playAudio() {
    wavesurfer.playPause();
}

// Pause audio
function pauseAudio() {
    waversurfer.playPause();
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
    let start = 
wavesurfer.getCurrentTIme();
    let end = 
wavesurfer.getDuration();

    wavesurfer.addRegion({
    start: start,
    end: end,
    color: 'rgba(0, 0, 0.1,)',
    drag: true,
    resize: true,
    });
    
    // Trim the region when double-clicked
    wavesurfer.on('region-dblclick',
function (region) {
    wavesurfer.clearRegions();
wavesurfer.regions.list[region.id].region
move();

        let trimmedAudio =
wavesurfer.backend.buffer.slice(re-gion.start, region.end);

            // Set the trimmed audio as the new buffer

wavesurfer.loadDecodedBuffer(trimmedAudio);
    });
}

// Save audio (dummy function, needs backend to fully implement)
function saveAudio() {
    let audioBlob = 
wavesurfer.backend.buffer;
    let wavBlob = 
audioBlobToWav(audioBlob);
    savesAs(wavBlob,
    'edited_audiowav');
}

// Convert audio buffer to WAV format
function audioBlobToWav(buffer) {
    let wav = 
audioBufferToWav(buffer);
    let blob = new Blob([new
DataView(wav)], { type: 'audio/ wav' });
    return blob;
 }

 // Set the initial volume when wavesurfer is ready 
    wavesurfer.on('ready', function()
{

document.getElementById('volume').value = wavesurfer.val
ue = wavesurfer.getVolume();
});

// Log when playback finishes
    wavesurfer.on('finish',
function() {
    console.log('Playback finshed');
    });
 initWaveSurfer();
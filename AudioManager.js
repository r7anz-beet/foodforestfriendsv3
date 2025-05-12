function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
export var AudioManager = /*#__PURE__*/ function() {
    "use strict";
    function AudioManager() {
        _class_call_check(this, AudioManager);
        this.audioContext = null;
        this.isInitialized = false; // Tracks if context has been attempted to start
    }
    _create_class(AudioManager, [
        {
            // Must be called after a user interaction (e.g., click) to initialize/resume AudioContext
            key: "ensureContextResumed",
            value: function ensureContextResumed() {
                var _this = this;
                if (!this.audioContext) {
                    try {
                        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    } catch (e) {
                        console.error("Web Audio API is not supported in this browser.", e);
                        return;
                    }
                }
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(function() {
                        // console.log("AudioContext resumed successfully.");
                        _this.isInitialized = true;
                    }).catch(function(e) {
                        return console.error("Error resuming AudioContext:", e);
                    });
                } else if (this.audioContext.state === 'running') {
                    this.isInitialized = true;
                }
            }
        },
        {
            key: "playPlantSound",
            value: function playPlantSound() {
                if (!this.isInitialized || !this.audioContext || this.audioContext.state !== 'running') {
                    // console.warn("AudioContext not running. Plant sound not played.");
                    return;
                }
                var now = this.audioContext.currentTime;
                var osc = this.audioContext.createOscillator();
                var gainNode = this.audioContext.createGain();
                osc.type = 'triangle'; // Softer than sine/square, good for a gentle "thump"
                osc.frequency.setValueAtTime(150, now); // A low frequency
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.1); // Quick pitch drop
                gainNode.gain.setValueAtTime(0.25, now); // Start moderately soft
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15); // Fade out quickly
                osc.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        },
        {
            key: "playHarvestSound",
            value: function playHarvestSound() {
                if (!this.isInitialized || !this.audioContext || this.audioContext.state !== 'running') {
                    // console.warn("AudioContext not running. Harvest sound not played.");
                    return;
                }
                var now = this.audioContext.currentTime;
                // Main tone for a "chime"
                var osc1 = this.audioContext.createOscillator();
                var gain1 = this.audioContext.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(523.25, now); // C5 - a clear, pleasant pitch
                gain1.gain.setValueAtTime(0.2, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc1.connect(gain1);
                gain1.connect(this.audioContext.destination);
                osc1.start(now);
                osc1.stop(now + 0.3);
                // Higher, softer overtone for sparkle
                var osc2 = this.audioContext.createOscillator();
                var gain2 = this.audioContext.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(1046.50, now); // C6 - an octave higher
                gain2.gain.setValueAtTime(0.1, now); // Softer than the main tone
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc2.connect(gain2);
                gain2.connect(this.audioContext.destination);
                osc2.start(now + 0.05); // Slightly delayed for effect
                osc2.stop(now + 0.3);
            }
        },
        {
            key: "playFertilizeSound",
            value: function playFertilizeSound() {
                if (!this.isInitialized || !this.audioContext || this.audioContext.state !== 'running') {
                    // console.warn("AudioContext not running. Fertilize sound not played.");
                    return;
                }
                var now = this.audioContext.currentTime;
                // Create a buffer for white noise
                var bufferSize = this.audioContext.sampleRate * 0.2; // 0.2 seconds of noise
                var buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
                var output = buffer.getChannelData(0);
                for(var i = 0; i < bufferSize; i++){
                    output[i] = Math.random() * 2 - 1; // Generate white noise
                }
                var noiseSource = this.audioContext.createBufferSource();
                noiseSource.buffer = buffer;
                // Use a Bandpass filter to shape the noise like a "shhh" or "sprinkle"
                var bandpass = this.audioContext.createBiquadFilter();
                bandpass.type = 'bandpass';
                bandpass.frequency.setValueAtTime(1500, now); // Center frequency
                bandpass.Q.setValueAtTime(1, now); // Quality factor, not too narrow
                // Gain node for volume envelope
                var gainNode = this.audioContext.createGain();
                gainNode.gain.setValueAtTime(0.001, now); // Start almost silent
                gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.02); // Quick rise
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2); // Quick decay
                noiseSource.connect(bandpass);
                bandpass.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                noiseSource.start(now);
                noiseSource.stop(now + 0.2);
            }
        },
        {
            key: "playWinSound",
            value: function playWinSound() {
                var _this = this;
                if (!this.isInitialized || !this.audioContext || this.audioContext.state !== 'running') {
                    return;
                }
                var now = this.audioContext.currentTime;
                var fundamental = 261.63; // C4
                // Ascending arpeggio
                var playNote = function(frequency, startTime, duration, volume) {
                    var osc = _this.audioContext.createOscillator();
                    var gainNode = _this.audioContext.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(frequency, startTime);
                    gainNode.gain.setValueAtTime(volume, startTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                    osc.connect(gainNode);
                    gainNode.connect(_this.audioContext.destination);
                    osc.start(startTime);
                    osc.stop(startTime + duration);
                };
                var noteDuration = 0.15;
                var volume = 0.2;
                playNote(fundamental, now, noteDuration, volume); // C4
                playNote(fundamental * 5 / 4, now + noteDuration * 0.8, noteDuration, volume); // E4 (Major Third)
                playNote(fundamental * 3 / 2, now + noteDuration * 1.6, noteDuration, volume); // G4 (Perfect Fifth)
                playNote(fundamental * 2, now + noteDuration * 2.4, noteDuration * 1.5, volume * 1.2); // C5 (Octave, longer and slightly louder)
            }
        }
    ]);
    return AudioManager;
}();

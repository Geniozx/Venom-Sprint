// Web Audio API context
let audioContext = null;

// Persist the player's sound preference
const SOUND_STORAGE_KEY = "venomSprintSoundEnabled";

let soundEnabled =
    localStorage.getItem(SOUND_STORAGE_KEY) !== "false";

// Check whether sound is enabled
export function isSoundEnabled() {
    return soundEnabled;
}

// Enable or disable sound
export function setSoundEnabled(enabled) {
    soundEnabled = Boolean(enabled);

    localStorage.setItem(
        SOUND_STORAGE_KEY,
        String(soundEnabled)
    );
}

// Create or reuse the audio context
function getAudioContext() {
    if (!audioContext) {
        const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        audioContext = new AudioContextClass();
    }

    return audioContext;
}

// Unlock audio after a user interaction
export async function initializeAudio() {
    const context = getAudioContext();

    if (!context) {
        return;
    }

    if (context.state === "suspended") {
        await context.resume();
    }
}

// Play a short arcade food collection sound
export function playFoodSound() {
    if (!soundEnabled) {
        return;
    }

    const context = getAudioContext();

    if (!context) {
        return;
    }

    // Browsers may suspend audio until the user interacts
    if (context.state === "suspended") {
        context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";

    // Bright arcade pickup tone
    oscillator.frequency.setValueAtTime(
        650,
        context.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        950,
        context.currentTime + 0.12
    );

    // Short fade-out
    gainNode.gain.setValueAtTime(
        0.12,
        context.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime + 0.15
    );

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.15);
}



// Play a two-tone arcade startup sound
export function playStartSound() {
    if (!soundEnabled) {
        return;
    }

    const context = getAudioContext();

    if (!context || context.state !== "running") {
        return;
    }

    const now = context.currentTime;

    const notes = [
        { frequency: 440, start: 0 },
        { frequency: 660, start: 0.12 }
    ];

    notes.forEach(({ frequency, start }) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            frequency,
            now + start
        );

        gainNode.gain.setValueAtTime(
            0.001,
            now + start
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.12,
            now + start + 0.01
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            now + start + 0.15
        );

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(now + start);
        oscillator.stop(now + start + 0.15);
    });
}



// Play a descending arcade game-over sound
export function playGameOverSound() {
    if (!soundEnabled) {
        return;
    }

    const context = getAudioContext();

    if (!context || context.state !== "running") {
        return;
    }

    const now = context.currentTime;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    // Slightly retro electronic tone
    oscillator.type = "triangle";

    // Descending pitch
    oscillator.frequency.setValueAtTime(520, now);

    oscillator.frequency.exponentialRampToValueAtTime(
        130,
        now + 0.45
    );

    // Smooth volume envelope
    gainNode.gain.setValueAtTime(0.001, now);

    gainNode.gain.exponentialRampToValueAtTime(
        0.15,
        now + 0.02
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.5
    );

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
}



// Play a celebratory arcade victory melody
export function playVictorySound() {
    if (!soundEnabled) {
        return;
    }

    const context = getAudioContext();

    if (!context || context.state !== "running") {
        return;
    }

    const now = context.currentTime;

    const notes = [
        { frequency: 523.25, start: 0 },
        { frequency: 659.25, start: 0.14 },
        { frequency: 783.99, start: 0.28 },
        { frequency: 1046.5, start: 0.42 }
    ];

    notes.forEach(({ frequency, start }) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = "triangle";

        const noteStart = now + start;
        const noteEnd = noteStart + 0.2;

        oscillator.frequency.setValueAtTime(
            frequency,
            noteStart
        );

        gainNode.gain.setValueAtTime(0.001, noteStart);

        gainNode.gain.exponentialRampToValueAtTime(
            0.12,
            noteStart + 0.02
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            noteEnd
        );

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(noteStart);
        oscillator.stop(noteEnd);
    });
}


// Play a subtle pause or resume sound
export function playPauseSound(isPaused) {
    if (!soundEnabled) {
        return;
    }

    const context = getAudioContext();

    if (!context || context.state !== "running") {
        return;
    }

    const now = context.currentTime;

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";

    const startFrequency = isPaused ? 550 : 350;
    const endFrequency = isPaused ? 350 : 550;

    oscillator.frequency.setValueAtTime(
        startFrequency,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        endFrequency,
        now + 0.12
    );

    gainNode.gain.setValueAtTime(0.001, now);

    gainNode.gain.exponentialRampToValueAtTime(
        0.08,
        now + 0.01
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.15
    );

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
}
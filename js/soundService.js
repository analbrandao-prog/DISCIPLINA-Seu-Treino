// =====================================================
// soundService.js — Web Audio API synthesized sounds
// =====================================================

let _audioCtx = null;

function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
}

/**
 * Play a simple beep tone.
 * @param {number} freq - Frequency in Hz
 * @param {number} duration - Duration in seconds
 * @param {number} [volume=0.3]
 * @param {'sine'|'square'|'triangle'|'sawtooth'} [type='sine']
 */
function playTone(freq, duration, volume = 0.3, type = 'sine') {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio not available
  }
}

/**
 * Tick sound — each second countdown
 */
function soundTick() {
  playTone(880, 0.08, 0.15, 'square');
}

/**
 * "Go!" sound — start of an exercise phase
 */
function soundGo() {
  playTone(660, 0.12, 0.35, 'sine');
  setTimeout(() => playTone(880, 0.2, 0.3, 'sine'), 120);
}

/**
 * Rest sound — start of a rest phase
 */
function soundRest() {
  playTone(440, 0.25, 0.25, 'sine');
}

/**
 * Fanfare — workout completed
 */
function soundFanfare() {
  const notes = [
    { freq: 523, delay: 0 },      // C5
    { freq: 659, delay: 150 },    // E5
    { freq: 784, delay: 300 },    // G5
    { freq: 1047, delay: 450 },   // C6
    { freq: 784, delay: 600 },    // G5
    { freq: 1047, delay: 750 },   // C6
  ];
  notes.forEach(({ freq, delay }) => {
    setTimeout(() => playTone(freq, 0.2, 0.4, 'sine'), delay);
  });
}

/**
 * Countdown beep
 */
function soundCountdown(n) {
  if (n <= 3 && n > 0) {
    playTone(n === 1 ? 1100 : 880, 0.12, 0.3, 'square');
  }
}

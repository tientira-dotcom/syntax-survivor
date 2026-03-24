// ========== SOUND SYSTEM (Web Audio API) ==========
let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function createOsc(type, freq, duration, vol = 0.15) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function createNoise(duration, vol = 0.08) {
  const ctx = getCtx();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

function sweep(startFreq, endFreq, duration, type = 'sine', vol = 0.12) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export const SFX = {
  cardSelect() {
    createOsc('sine', 880, 0.06, 0.1);
  },

  cardPlace() {
    createOsc('sine', 660, 0.08, 0.12);
    setTimeout(() => createOsc('sine', 880, 0.06, 0.08), 40);
  },

  cardReturn() {
    createOsc('sine', 440, 0.08, 0.08);
  },

  execute() {
    sweep(200, 1200, 0.25, 'sawtooth', 0.1);
    setTimeout(() => createNoise(0.1, 0.06), 200);
  },

  attackHit() {
    createNoise(0.12, 0.1);
    createOsc('sine', 180, 0.15, 0.15);
  },

  attackCrit() {
    createNoise(0.18, 0.14);
    createOsc('sine', 140, 0.2, 0.18);
    setTimeout(() => sweep(300, 900, 0.15, 'sine', 0.1), 80);
  },

  bossAttack() {
    createOsc('sawtooth', 80, 0.3, 0.12);
    setTimeout(() => createNoise(0.15, 0.1), 100);
  },

  shieldBlock() {
    createOsc('sine', 1200, 0.15, 0.1);
    setTimeout(() => createOsc('sine', 1600, 0.1, 0.07), 60);
  },

  misfire() {
    createOsc('square', 120, 0.25, 0.08);
    setTimeout(() => createOsc('square', 90, 0.2, 0.06), 100);
  },

  reflect() {
    sweep(900, 150, 0.3, 'sawtooth', 0.1);
    setTimeout(() => createNoise(0.1, 0.08), 150);
  },

  historianProc() {
    // Mystical chime — ascending harmonics
    createOsc('sine', 523, 0.4, 0.08);
    setTimeout(() => createOsc('sine', 659, 0.35, 0.07), 80);
    setTimeout(() => createOsc('sine', 784, 0.3, 0.06), 160);
    setTimeout(() => createOsc('sine', 1047, 0.4, 0.09), 240);
  },

  turnStart() {
    createOsc('sine', 440, 0.12, 0.06);
    setTimeout(() => createOsc('sine', 554, 0.1, 0.05), 80);
  },

  victory() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => {
      setTimeout(() => createOsc('sine', f, 0.3, 0.1), i * 120);
    });
  },

  defeat() {
    const notes = [440, 370, 311, 261];
    notes.forEach((f, i) => {
      setTimeout(() => createOsc('sine', f, 0.4, 0.08), i * 200);
    });
  },

  bossPhaseTrigger() {
    sweep(100, 400, 0.5, 'sawtooth', 0.08);
    setTimeout(() => createNoise(0.2, 0.06), 300);
  },

  endTurn() {
    createOsc('triangle', 330, 0.1, 0.06);
  },
};

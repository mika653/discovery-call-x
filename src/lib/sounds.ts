let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playKaching() {
  const ctx = getContext();
  const now = ctx.currentTime;

  // First "ka" — short metallic hit
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "square";
  osc1.frequency.setValueAtTime(1200, now);
  osc1.frequency.exponentialRampToValueAtTime(800, now + 0.03);
  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.08);

  // Second "ka" — slightly lower
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "square";
  osc2.frequency.setValueAtTime(1000, now + 0.08);
  osc2.frequency.exponentialRampToValueAtTime(600, now + 0.12);
  gain2.gain.setValueAtTime(0.25, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.16);

  // "Ching" — bright bell ring
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = "sine";
  osc3.frequency.setValueAtTime(3500, now + 0.15);
  osc3.frequency.exponentialRampToValueAtTime(2800, now + 0.6);
  gain3.gain.setValueAtTime(0.4, now + 0.15);
  gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
  osc3.connect(gain3).connect(ctx.destination);
  osc3.start(now + 0.15);
  osc3.stop(now + 0.7);

  // Shimmer overtone
  const osc4 = ctx.createOscillator();
  const gain4 = ctx.createGain();
  osc4.type = "sine";
  osc4.frequency.setValueAtTime(5200, now + 0.15);
  osc4.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
  gain4.gain.setValueAtTime(0.15, now + 0.15);
  gain4.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
  osc4.connect(gain4).connect(ctx.destination);
  osc4.start(now + 0.15);
  osc4.stop(now + 0.55);

  // Coin rattle — noise burst
  const bufferSize = ctx.sampleRate * 0.12;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.12, now + 0.14);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 4000;
  noiseFilter.Q.value = 2;
  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
  noise.start(now + 0.14);
  noise.stop(now + 0.3);
}

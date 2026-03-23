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

  // --- Mechanical "clunk" of the drawer sliding open ---
  // Low thud
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thud.type = "sine";
  thud.frequency.setValueAtTime(120, now);
  thud.frequency.exponentialRampToValueAtTime(60, now + 0.08);
  thudGain.gain.setValueAtTime(0.35, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  thud.connect(thudGain).connect(ctx.destination);
  thud.start(now);
  thud.stop(now + 0.1);

  // Mechanical click/rattle noise
  const clickLen = ctx.sampleRate * 0.06;
  const clickBuf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
  const clickData = clickBuf.getChannelData(0);
  for (let i = 0; i < clickLen; i++) {
    clickData[i] = (Math.random() * 2 - 1) * 0.4;
  }
  const click = ctx.createBufferSource();
  click.buffer = clickBuf;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.2, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  const clickFilter = ctx.createBiquadFilter();
  clickFilter.type = "highpass";
  clickFilter.frequency.value = 800;
  click.connect(clickFilter).connect(clickGain).connect(ctx.destination);
  click.start(now);
  click.stop(now + 0.06);

  // --- Bell "ching!" — the classic cash register ring ---
  // Main bell tone (warm, not shrill)
  const bell = ctx.createOscillator();
  const bellGain = ctx.createGain();
  bell.type = "sine";
  bell.frequency.setValueAtTime(2200, now + 0.1);
  bell.frequency.exponentialRampToValueAtTime(2000, now + 0.8);
  bellGain.gain.setValueAtTime(0.35, now + 0.1);
  bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  bell.connect(bellGain).connect(ctx.destination);
  bell.start(now + 0.1);
  bell.stop(now + 0.9);

  // Bell overtone (gives it that metallic bell character)
  const overtone = ctx.createOscillator();
  const overtoneGain = ctx.createGain();
  overtone.type = "sine";
  overtone.frequency.setValueAtTime(3520, now + 0.1);
  overtone.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
  overtoneGain.gain.setValueAtTime(0.12, now + 0.1);
  overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
  overtone.connect(overtoneGain).connect(ctx.destination);
  overtone.start(now + 0.1);
  overtone.stop(now + 0.65);

  // Second softer bell hit (the "double ding" of a register)
  const bell2 = ctx.createOscillator();
  const bell2Gain = ctx.createGain();
  bell2.type = "sine";
  bell2.frequency.setValueAtTime(2600, now + 0.22);
  bell2.frequency.exponentialRampToValueAtTime(2400, now + 0.7);
  bell2Gain.gain.setValueAtTime(0.2, now + 0.22);
  bell2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
  bell2.connect(bell2Gain).connect(ctx.destination);
  bell2.start(now + 0.22);
  bell2.stop(now + 0.75);

  // Subtle coin jingle
  const jingleLen = ctx.sampleRate * 0.15;
  const jingleBuf = ctx.createBuffer(1, jingleLen, ctx.sampleRate);
  const jingleData = jingleBuf.getChannelData(0);
  for (let i = 0; i < jingleLen; i++) {
    jingleData[i] = (Math.random() * 2 - 1) * 0.15;
  }
  const jingle = ctx.createBufferSource();
  jingle.buffer = jingleBuf;
  const jingleGain = ctx.createGain();
  jingleGain.gain.setValueAtTime(0.08, now + 0.12);
  jingleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  const jingleFilter = ctx.createBiquadFilter();
  jingleFilter.type = "bandpass";
  jingleFilter.frequency.value = 6000;
  jingleFilter.Q.value = 3;
  jingle.connect(jingleFilter).connect(jingleGain).connect(ctx.destination);
  jingle.start(now + 0.12);
  jingle.stop(now + 0.3);
}

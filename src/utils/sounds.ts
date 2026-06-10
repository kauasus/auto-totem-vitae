/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Reutilizável: cria/usa um único AudioContext e toca um click curto.
let audioCtx: AudioContext | null = null;

function ensureCtx() {
  if (!audioCtx) {
    audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  return audioCtx;
}

/**
 * Toca um som de "click" curto.
 * volume: 0..1
 */
export function playClick(volume = 0.12) {
  try {
    const ctx = ensureCtx();
    if (ctx.state === "suspended") ctx.resume();

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    // timbre: curta onda quadrada para click mais "percutido"
    o.type = "square";
    o.frequency.value = 1200; // frequência base do click
    g.gain.value = volume;

    // envelope rápido
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(volume, now + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    o.connect(g);
    g.connect(ctx.destination);

    o.start(now);
    o.stop(now + 0.08);
  } catch (e) {
    // browsers podem bloquear; silenciar falhas
    // console.warn('Audio error', e);
  }
}

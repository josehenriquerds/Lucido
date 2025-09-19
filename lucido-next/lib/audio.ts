export type SoundEffect = "success" | "error" | "click" | "transition";

type AudioCtor = typeof AudioContext;

const toneMap: Record<SoundEffect, { frequency: number; gain: number; duration: number }> = {
  success: { frequency: 523.25, gain: 0.25, duration: 0.18 },
  error: { frequency: 220, gain: 0.25, duration: 0.22 },
  click: { frequency: 760, gain: 0.12, duration: 0.1 },
  transition: { frequency: 440, gain: 0.2, duration: 0.28 },
};

function resolveAudioContext(): AudioCtor | null {
  if (typeof window === "undefined") return null;
  const candidate = window.AudioContext ?? (window as Window & { webkitAudioContext?: AudioCtor }).webkitAudioContext;
  return candidate ?? null;
}

export async function playTone(effect: SoundEffect, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextCtor = resolveAudioContext();
  if (!AudioContextCtor) return;

  try {
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const { frequency, gain: gainValue, duration } = toneMap[effect];

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);

    setTimeout(() => void context.close(), (duration + 0.1) * 1000);
  } catch (error) {
    console.warn("[audio] Unable to play tone", effect, error);
  }
}

export async function speakText(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 0.9;
  utterance.pitch = 1.15;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

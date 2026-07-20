type SoundKind = "select" | "mode" | "success" | "softError";

let audioContext: AudioContext | null = null;

export function playUiSound(kind: SoundKind, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const audio = getAudioContext();
  if (!audio) return;
  void audio.resume?.();

  if (kind === "success") {
    playTone(audio, 620, 0, 0.11, 0.052, "sine");
    playTone(audio, 880, 0.08, 0.16, 0.04, "triangle");
    playTone(audio, 1240, 0.16, 0.18, 0.025, "sine");
    return;
  }

  if (kind === "softError") {
    playTone(audio, 260, 0, 0.12, 0.035, "triangle");
    playTone(audio, 210, 0.08, 0.16, 0.025, "sine");
    return;
  }

  if (kind === "mode") {
    playTone(audio, 420, 0, 0.09, 0.035, "sine");
    playTone(audio, 680, 0.06, 0.12, 0.025, "triangle");
    return;
  }

  playTone(audio, 540, 0, 0.1, 0.032, "sine");
}

function getAudioContext() {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ??= new AudioContextClass();
  return audioContext;
}

function playTone(
  audio: AudioContext,
  frequency: number,
  delay: number,
  duration: number,
  volume: number,
  type: OscillatorType,
) {
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const now = audio.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

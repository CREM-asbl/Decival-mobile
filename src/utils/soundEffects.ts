let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

interface SoundEffect {
  frequency: number;
  type: OscillatorType;
  duration: number;
  volume: number;
  fadeOut?: boolean;
}

const SOUND_EFFECTS: Record<string, SoundEffect> = {
  click: {
    frequency: 800,
    type: 'sine',
    duration: 0.05,
    volume: 0.2
  },
  hover: {
    frequency: 600,
    type: 'sine',
    duration: 0.03,
    volume: 0.1
  },
  correct: {
    frequency: 880,
    type: 'sine',
    duration: 0.15,
    volume: 0.3,
    fadeOut: true
  },
  incorrect: {
    frequency: 220,
    type: 'triangle',
    duration: 0.2,
    volume: 0.3,
    fadeOut: true
  },
  complete: {
    frequency: 440,
    type: 'sine',
    duration: 0.3,
    volume: 0.4,
    fadeOut: true
  }
};

export function playEffect(effectName: keyof typeof SOUND_EFFECTS): void {
  const ctx = getAudioContext();
  const effect = SOUND_EFFECTS[effectName];

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = effect.type;
  oscillator.frequency.value = effect.frequency;

  gainNode.gain.value = effect.volume;

  if (effect.fadeOut) {
    gainNode.gain.setValueAtTime(effect.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAt(0.01, ctx.currentTime + effect.duration);
  }

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + effect.duration);
}

// Expose pour le debuggage
if (typeof window !== 'undefined') {
  (window as any).playEffect = playEffect;
}
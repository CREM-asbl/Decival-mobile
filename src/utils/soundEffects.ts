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

export function playEffect(soundName: string, userVolume: number = 1) {
  const context = getAudioContext();
  const effect = SOUND_EFFECTS[soundName];

  if (!effect) {
    console.warn(`Son "${soundName}" non trouvé`);
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = effect.type;
  oscillator.frequency.setValueAtTime(effect.frequency, context.currentTime);

  gainNode.gain.setValueAtTime(effect.volume * userVolume, context.currentTime);

  if (effect.fadeOut) {
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + effect.duration);
  }

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + effect.duration);
}
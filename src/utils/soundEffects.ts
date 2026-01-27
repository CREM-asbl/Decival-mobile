let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// Fonction utilitaire pour créer du bruit (pour les applaudissements)
function createNoiseBuffer(context: AudioContext): AudioBuffer {
  const bufferSize = context.sampleRate * 2; // 2 secondes de bruit
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

export function playEffect(soundName: string, userVolume: number = 1) {
  const context = getAudioContext();
  const now = context.currentTime;
  const masterGain = context.createGain();
  masterGain.connect(context.destination);
  masterGain.gain.setValueAtTime(userVolume, now);

  switch (soundName) {
    case 'start': // Son de démarrage (petit "pop" montant)
      playTone(context, masterGain, 300, 'sine', now, 0.1, 0.1);
      playTone(context, masterGain, 600, 'sine', now + 0.05, 0.1, 0.1);
      break;

    case 'click': // Son de clic (bref et sec)
      playTone(context, masterGain, 800, 'sine', now, 0.05, 0.05);
      break;

    case 'hover': // Son de survol (très léger)
      playTone(context, masterGain, 400, 'sine', now, 0.03, 0.02);
      break;

    case 'correct': // Son de succès (accord majeur C-E-G montant)
      // Do (C5)
      playTone(context, masterGain, 523.25, 'sine', now, 0.4, 0.1);
      // Mi (E5)
      playTone(context, masterGain, 659.25, 'sine', now + 0.05, 0.4, 0.1);
      // Sol (G5)
      playTone(context, masterGain, 783.99, 'sine', now + 0.1, 0.6, 0.1);
      // Do (C6) - petit éclat final
      playTone(context, masterGain, 1046.50, 'sine', now + 0.15, 0.8, 0.05);
      break;

    case 'incorrect': // Son d'erreur (descendant et un peu dissonant/buzz)
      // Son principal "buzz"
      playTone(context, masterGain, 150, 'sawtooth', now, 0.3, 0.15);
      // Descendant
      playTone(context, masterGain, 100, 'sawtooth', now + 0.1, 0.3, 0.15);
      break;

    case 'complete': // Applaudissements
      playApplause(context, masterGain, now, 2.5);
      // Un petit "Ta-da!" musical par dessus
      playTone(context, masterGain, 523.25, 'triangle', now, 0.2, 0.1); // C5
      playTone(context, masterGain, 659.25, 'triangle', now + 0.1, 0.2, 0.1); // E5
      playTone(context, masterGain, 783.99, 'triangle', now + 0.2, 0.2, 0.1); // G5
      playTone(context, masterGain, 1046.50, 'triangle', now + 0.3, 1.0, 0.2); // C6
      break;

    default:
      console.warn(`Son "${soundName}" non géré`);
  }
}

// Helper pour jouer une tone simple
function playTone(
  context: AudioContext,
  destination: AudioNode,
  freq: number,
  type: OscillatorType,
  startTime: number,
  duration: number,
  vol: number
) {
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.01); // Attack rapide
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration); // Decay

  osc.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// Helper complexe pour les applaudissements (bruit rose filtré et modulé)
function playApplause(context: AudioContext, destination: AudioNode, startTime: number, duration: number) {
  const buffer = createNoiseBuffer(context);

  // On crée plusieurs "claps" aléatoires pour simuler une foule
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2000;
  filter.connect(destination);

  // Enveloppe globale du volume (fade in rapide, sustain, fade out lent)
  const masterApplauseGain = context.createGain();
  masterApplauseGain.gain.setValueAtTime(0, startTime);
  masterApplauseGain.gain.linearRampToValueAtTime(0.8, startTime + 0.5);
  masterApplauseGain.gain.linearRampToValueAtTime(0, startTime + duration);
  masterApplauseGain.connect(filter);

  // Source de bruit
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(masterApplauseGain);

  source.start(startTime);
  source.stop(startTime + duration);
}
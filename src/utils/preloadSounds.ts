import { SOUNDS } from '../stores/soundStore';

const preloadedSounds = new Map<string, AudioBuffer>();

async function loadSound(url: string): Promise<AudioBuffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContext();
  return await audioContext.decodeAudioData(arrayBuffer);
}

export async function preloadSounds(): Promise<void> {
  try {
    const loadPromises = Object.entries(SOUNDS).map(async ([key, url]) => {
      const buffer = await loadSound(url);
      preloadedSounds.set(key, buffer);
    });

    await Promise.all(loadPromises);
    console.log('Sons préchargés avec succès');
  } catch (error) {
    console.error('Erreur lors du préchargement des sons:', error);
  }
}

export function getPreloadedSound(key: keyof typeof SOUNDS): AudioBuffer | undefined {
  return preloadedSounds.get(key);
}
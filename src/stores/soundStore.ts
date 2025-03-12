import { playEffect } from '../utils/soundEffects';

// Map of sound names to their audio file paths
export const SOUNDS = {
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  complete: '/sounds/complete.mp3'
} as const;

interface SoundPreferences {
  enabled: boolean;
  volume: number;
}

let preferences: SoundPreferences = {
  enabled: true,
  volume: 0.7
};

// Initialiser les préférences depuis le localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('soundPreferences');
  if (stored) {
    preferences = JSON.parse(stored);
  }
}

function savePreferences() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('soundPreferences', JSON.stringify(preferences));
  }
}

export function getSoundPreferences(): SoundPreferences {
  return { ...preferences };
}

export function updateSoundPreferences(newPreferences: Partial<SoundPreferences>) {
  preferences = { ...preferences, ...newPreferences };
  savePreferences();
}

// Fonction utilitaire pour jouer un son
export function playSound(soundName: string, volume?: number) {
  if (!preferences.enabled) return;

  try {
    if (soundName in SOUNDS) {
      playEffect(soundName as any);
    } else {
      console.warn(`Sound "${soundName}" not found`);
    }
  } catch (err) {
    console.log('Erreur lors de la lecture du son:', err);
  }
}
import { playEffect } from '../utils/soundEffects';

// Map des noms de sons disponibles
export const SOUNDS = {
  click: 'click',
  hover: 'hover',
  correct: 'correct',
  incorrect: 'incorrect',
  complete: 'complete'
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
export function playSound(soundName: string) {
  if (!preferences.enabled) return;

  try {
    playEffect(soundName, preferences.volume);
  } catch (error) {
    console.error(`Erreur lors de la lecture du son ${soundName}:`, error);
  }
}
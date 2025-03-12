interface AnimationPreferences {
  reducedMotion: boolean;
  animationsEnabled: boolean;
}

let preferences: AnimationPreferences = {
  reducedMotion: false,
  animationsEnabled: true
};

// Initialiser les préférences depuis le localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('animationPreferences');
  if (stored) {
    preferences = JSON.parse(stored);
  }

  // Vérifier la préférence système pour la réduction de mouvement
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  preferences.reducedMotion = mediaQuery.matches;

  // Écouter les changements de préférence système
  mediaQuery.addEventListener('change', (e) => {
    preferences.reducedMotion = e.matches;
    savePreferences();
  });
}

function savePreferences() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('animationPreferences', JSON.stringify(preferences));
  }
}

export function getAnimationPreferences(): AnimationPreferences {
  return { ...preferences };
}

export function updateAnimationPreferences(newPreferences: Partial<AnimationPreferences>) {
  preferences = { ...preferences, ...newPreferences };
  savePreferences();
}

export function shouldAnimate(): boolean {
  return preferences.animationsEnabled && !preferences.reducedMotion;
}

// Classes d'animation conditionnelles
export function getConditionalAnimationClass(animationClass: string): string {
  return shouldAnimate() ? animationClass : '';
}
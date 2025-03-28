import { SOUNDS } from '../stores/soundStore';

export async function preloadSounds() {
  const audioFiles = Object.values(SOUNDS);

  const loadPromises = audioFiles.map((audioPath) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = audioPath;

      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = reject;

      // Déclencher le chargement
      audio.load();
    });
  });

  try {
    await Promise.all(loadPromises);
    console.log('Sons préchargés avec succès');
  } catch (error) {
    console.error('Erreur lors du préchargement des sons:', error);
  }
}
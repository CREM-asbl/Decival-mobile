<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto shadow-xl p-6 border border-transparent dark:border-gray-700 animate-bounce-in">
      <div class="text-center py-4">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold mb-2 dark:text-white">Félicitations !</h3>
        <p class="mb-4 dark:text-gray-200">Tu as terminé le test de {{ testType }}.</p>
        
        <div class="bg-accent/10 dark:bg-accent/20 rounded-xl p-4 mb-6">
          <div class="text-lg dark:text-gray-200 mb-1">
            Score : <span class="font-bold text-accent text-2xl">{{ score }}%</span>
          </div>
          <div v-if="gamificationResults" class="flex flex-col gap-2 mt-2">
            <div class="text-green-600 dark:text-green-400 font-bold animate-pulse">
              +{{ gamificationResults.xpGained }} XP gagnés !
            </div>
            <div v-if="gamificationResults.leveledUp" class="bg-yellow-400 text-yellow-900 text-sm font-black py-1 px-3 rounded-full self-center uppercase tracking-wider animate-bounce">
              NIVEAU SUPÉRIEUR : {{ gamificationResults.newLevel }} !
            </div>
          </div>
        </div>

        <div v-if="gamificationResults?.newlyUnlockedBadges?.length" class="mb-6">
          <p class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Badge débloqué !</p>
          <div class="flex justify-center gap-2">
            <div v-for="badgeId in gamificationResults.newlyUnlockedBadges" :key="badgeId" class="text-4xl animate-bounce">
              {{ getBadgeIcon(badgeId) }}
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400">
          Consulte tes progrès pour voir tes badges et ton niveau !
        </p>
      </div>
      <div class="flex flex-col sm:flex-row-reverse sm:justify-start gap-3 mt-6">
        <button @click="onRestart" class="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover font-medium transition-transform active:scale-95">
          Recommencer
        </button>
        <a href="/progress" class="no-underline w-full sm:w-auto">
          <button class="w-full px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-500 font-medium transition-transform active:scale-95">
            Voir progrès
          </button>
        </a>
        <a href="/tests" class="no-underline w-full sm:w-auto">
          <button class="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-transform active:scale-95">
            Fermer
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import confetti from 'canvas-confetti';
import { BADGES } from '../../stores/badgeStore';
import { playSound } from '../../stores/soundStore';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  testType: {
    type: String,
    required: true,
    validator: (value) => ['addition', 'soustraction', 'multiplication', 'comparaison'].includes(value)
  },
  gamificationResults: {
    type: Object,
    default: () => null
  }
});

// Émets des événements pour les actions
const emit = defineEmits(['restart']);

// Fonction pour gérer le restart
function onRestart() {
  emit('restart');
}

function getBadgeIcon(id) {
  return BADGES[id]?.icon || '🏆';
}

// Déclencher les confettis quand la modal s'affiche
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Jouer le son d'applaudissements
    playSound('complete');

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }
});
</script>

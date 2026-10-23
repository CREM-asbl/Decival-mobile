<template>
  <dialog ref="dialogRef" v-if="show" class="test-complete-modal fixed inset-0 w-full max-w-none max-h-none bg-black bg-opacity-50 flex items-center justify-center p-4 z-100" @close="onClose">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg mx-auto shadow-xl border border-transparent dark:border-gray-700 animate-bounce-in my-8 max-h-[calc(100dvh-6rem)] flex flex-col">
      <div class="text-center p-6 pb-0 overflow-y-auto flex-1 min-h-0">
        <div class="text-6xl mb-4">{{ completeCopy.emoji }}</div>
        <h3 class="text-2xl font-bold mb-2 dark:text-white">{{ completeCopy.title }}</h3>
        <p class="mb-4 dark:text-gray-200">Tu as terminé le test de {{ testType }}.</p>
        
        <div class="bg-accent/10 dark:bg-accent/20 rounded-xl p-6 mb-6 border border-accent/20">
          <div class="text-sm font-bold text-accent uppercase tracking-widest mb-1">Score final</div>
          <div class="text-5xl font-black text-accent mb-2">{{ score }}%</div>
          
          <div v-if="gamificationResults" class="flex flex-col gap-1">
            <div class="text-green-600 dark:text-green-400 font-black flex items-center justify-center gap-2">
              <span class="text-xl">✨</span> +{{ gamificationResults.xpGained }} XP
            </div>
            <div v-if="gamificationResults.leveledUp" class="mt-2 bg-yellow-400 text-yellow-900 text-xs font-black py-1 px-3 rounded-full self-center uppercase tracking-wider animate-bounce shadow-lg">
              NIVEAU SUPÉRIEUR : {{ gamificationResults.newLevel }} !
            </div>
          </div>
        </div>

        <div v-if="gamificationResults?.teacherFeedback" class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6 border border-indigo-100 dark:border-indigo-800/50">
          <p class="text-sm text-indigo-800 dark:text-indigo-300 font-medium">
            Une analyse pédagogique de tes résultats est disponible dans tes progrès.
          </p>
          <a v-if="testId" :href="`/progress/feedback/${testId}`" class="inline-block mt-2 text-sm font-semibold text-indigo-700 dark:text-indigo-200 underline underline-offset-2 hover:text-indigo-900 dark:hover:text-white">
            Pourquoi me suis-je trompé ?
          </a>
        </div>

        <div v-if="gamificationResults?.newlyUnlockedBadges?.length" class="mt-6 mb-6">
          <p class="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Badge débloqué !</p>
          <div class="flex justify-center gap-2">
            <div v-for="badgeId in gamificationResults.newlyUnlockedBadges" :key="badgeId" class="text-4xl animate-bounce">
              {{ getBadgeIcon(badgeId) }}
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Consulte tes progrès pour voir tes badges et ton niveau ! Montre tes résultats à ton enseignant : demande-lui de t'expliquer tes erreurs et de t'aider à progresser.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row-reverse sm:justify-start gap-3 p-6">
        <a href="/progress" data-autofocus class="no-underline w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover font-medium text-center transition-transform active:scale-95 motion-reduce:transition-none motion-reduce:transform-none">
          Voir progrès
        </a>
        <button @click="onRestart" class="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-transform active:scale-95 motion-reduce:transition-none motion-reduce:transform-none">
          Recommencer
        </button>
        <a href="/tests" class="no-underline w-full sm:w-auto sm:ml-auto self-center text-center">
          <span class="text-sm text-gray-500 dark:text-gray-400 underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200">
            Fermer
          </span>
        </a>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { watch, ref, computed } from 'vue';
import confetti from 'canvas-confetti';
import { BADGES } from '../../stores/badgeStore';
import { playSound } from '../../stores/soundStore';
import { getTestCompleteCopy } from '../../logic/progressLogic';

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
  },
  testId: {
    type: String,
    default: null
  }
});

// Émets des événements pour les actions
const emit = defineEmits(['restart', 'close']);

const completeCopy = computed(() => getTestCompleteCopy(props.score));

// Fonction pour gérer le restart
function onRestart() {
  emit('restart');
}

function onClose() {
  // Esc uniquement : show encore true. Fermeture programmatique (restart/quit)
  // → show déjà false, ne rien émettre pour éviter handleQuit après handleRestart.
  if (props.show) emit('close');
}

function getBadgeIcon(id) {
  return BADGES[id]?.icon || '🏆';
}

// Focus management for dialog
const dialogRef = ref(null)

// `v-if` sur le <dialog> racine : l'instance monte avec show=false et le nœud
// n'existe qu'une fois show à true → le watcher doit s'exécuter après le rendu.
watch(() => props.show, (newVal) => {
  if (newVal) {
    dialogRef.value?.showModal()
    // Focus action primaire (Voir progrès), pas Recommencer
    const primary = dialogRef.value?.querySelector('[data-autofocus]')
    if (primary instanceof HTMLElement) primary.focus()
  } else {
    dialogRef.value?.close()
  }
}, { immediate: true, flush: 'post' })

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

<style scoped>
/* Célébration volontaire (apparition unique du modal, pill niveau, badges) : animations coupées si prefers-reduced-motion. */
@media (prefers-reduced-motion: reduce) {

  .test-complete-modal * {
    animation: none;
  }
}
</style>


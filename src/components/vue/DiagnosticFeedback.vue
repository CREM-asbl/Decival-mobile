<template>
  <div class="diagnostic-feedback mt-6 p-4 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-2xl">👨‍🏫</span>
      <h4 class="text-lg font-bold text-accent dark:text-accent-hover uppercase tracking-wider">
        Conseils pédagogiques
      </h4>
    </div>

    <!-- Profil Diagnostique (Comparaison uniquement) -->
    <div v-if="feedback.comparisonProfile" class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4" :style="{ borderColor: feedback.comparisonProfile.color }">
      <div class="flex items-center gap-3 mb-2">
        <span class="text-2xl">{{ feedback.comparisonProfile.icon }}</span>
        <h5 class="text-md font-bold dark:text-white">{{ feedback.comparisonProfile.label }}</h5>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
        {{ feedback.comparisonProfile.description }}
      </p>
    </div>

    <!-- Texte de feedback global -->
    <div v-else class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 border-accent">
       <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {{ feedback.feedbackText }}
      </p>
    </div>

    <!-- Résultats par type -->
    <div class="results-by-type">
      <button 
        @click="showDetails = !showDetails"
        class="flex items-center justify-between w-full text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-tighter hover:text-accent transition-colors"
        :aria-expanded="showDetails"
        aria-controls="diagnostic-details"
      >
        <span>Détail par type d'item</span>
        <span class="text-xs transition-transform duration-300" :style="{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0)' }" aria-hidden="true">
          ▼
        </span>
      </button>
      
      <transition name="expand">
        <div v-if="showDetails" id="diagnostic-details" class="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-hidden">
          <div v-for="res in feedback.resultsByType" :key="res.type" 
            class="flex items-center justify-between p-2 rounded bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            :aria-label="`${res.label}: ${res.correct} sur ${res.total} réussis. ${res.mastered ? 'Maîtrisé' : 'En cours d\'acquisition'}`"
          >
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ res.label || `Type ${res.type}` }}</span>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1" aria-hidden="true">
                <div v-for="n in res.total" :key="n" 
                  class="w-2 h-2 rounded-full"
                  :class="n <= res.correct ? 'bg-green-500' : 'bg-red-200 dark:bg-red-900/30'"
                  :title="n <= res.correct ? 'Correct' : 'Incorrect'">
                </div>
              </div>
              <span class="text-xs font-bold flex items-center gap-1" :class="res.mastered ? 'text-green-600' : 'text-red-500'">
                {{ res.correct }}/{{ res.total }}
                <span v-if="res.mastered" class="text-[10px]">✅</span>
                <span v-else class="text-[10px]">⚠️</span>
              </span>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="mt-4 pt-4 border-t border-accent/10">
       <p class="text-[10px] text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest">
         Diagnostic basé sur l'algorithme Decival (CREM)
       </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  feedback: {
    type: Object,
    required: true
  }
});

const showDetails = ref(false);
</script>

<style scoped>
.diagnostic-feedback {
  animation: slide-up 0.5s ease-out;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 500px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

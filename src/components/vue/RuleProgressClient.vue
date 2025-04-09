<template>  <div>
    <div v-if="progress === null">
      <!-- Afficher une version de base avec des valeurs à 0 plutôt qu'un placeholder -->
      <div class="flex justify-between text-xs text-gray-600 mb-1">
        <span>Taux de réussite: 0%</span>
      </div>

      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-accent rounded-full" style="width: 0%"></div>
      </div>

      <div class="text-xs text-center mt-1 text-gray-500">
        Pas encore pratiquée
      </div>
    </div>
    <div v-else>
      <div class="flex justify-between text-xs text-gray-600 mb-1">
        <span>Taux de réussite: {{ successRate }}%</span>
        <div class="relative group">
          <span v-if="progress.mastered" class="text-emerald-500 font-medium flex items-center">
            Maîtrisée ✓
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1 w-48 z-10">
              Une règle devient maîtrisée après 5 succès consécutifs.
            </div>
          </span>
          <span v-else-if="progress.consecutiveSuccesses > 0" class="text-amber-500 font-medium flex items-center">
            En progression ({{ progress.consecutiveSuccesses }}/5)
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-1 w-48 z-10">
              Une règle devient maîtrisée après 5 succès consécutifs.
            </div>
          </span>
        </div>
      </div>

      <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-accent rounded-full"
          :style="{ width: `${successRate}%` }"
        ></div>
      </div>

      <div v-if="progress.successCount > 0 || progress.failureCount > 0" class="flex justify-between text-xs mt-1">
        <span>{{ progress.successCount }} succès</span>
        <span>{{ progress.failureCount }} échecs</span>
      </div>
      <div v-else class="text-xs text-center mt-1 text-gray-500">
        Pas encore pratiquée
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@nanostores/vue';
import { computed } from 'vue';
import { ruleProgress } from '../../stores/ruleProgressStore';

export default {
  name: 'RuleProgressClient',
  props: {
    ruleId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore(ruleProgress);

    const progress = computed(() => {
      return store.value.progress[props.ruleId] || null;
    });

    const successRate = computed(() => {
      if (!progress.value) return 0;

      const total = progress.value.successCount + progress.value.failureCount;
      return total > 0
        ? Math.round((progress.value.successCount / total) * 100)
        : 0;
    });

    return {
      progress,
      successRate
    };
  }
}
</script>
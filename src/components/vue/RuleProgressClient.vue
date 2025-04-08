<template>
  <div>
    <div v-if="!progress" class="h-6 bg-gray-100 rounded animate-pulse"></div>
    <div v-else>
      <div class="flex justify-between text-xs text-gray-600 mb-1">
        <span>Taux de réussite: {{ successRate }}%</span>
        <span v-if="progress.mastered" class="text-emerald-500 font-medium">Maîtrisée ✓</span>
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
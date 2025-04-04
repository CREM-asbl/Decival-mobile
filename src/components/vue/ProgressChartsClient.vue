<template>
  <div>
    <!-- Sélecteur de période -->
    <div class="flex justify-end mb-4">
      <div class="inline-flex rounded-md shadow-sm">
        <button
          v-for="option in periodOptions"
          :key="option.value"
          type="button"
          :class="`px-4 py-2 text-sm font-medium ${
            selectedPeriod === option.value
              ? 'bg-accent text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } ${
            option.value === periodOptions[0].value
              ? 'rounded-l-md'
              : option.value === periodOptions[periodOptions.length-1].value
                ? 'rounded-r-md'
                : ''
          } border border-gray-300`"
          @click="selectedPeriod = option.value"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Graphiques par type de règle -->
    <div class="grid gap-6">
      <div v-for="type in ruleTypes" :key="type">
        <h3 class="text-lg font-semibold mb-2">{{ typeLabels[type] }}</h3>
        <ProgressChartClient
          :type="type"
          :days="selectedPeriod"
          :showSuccessRate="true"
          :showStreaks="true"
          :showLearningSpeed="selectedPeriod >= 14"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@nanostores/vue';
import { computed, ref } from 'vue';
import { rulesSummary, ruleTypes } from '../../stores/rulesSummaryStore';
import ProgressChartClient from './ProgressChartClient.vue';

export default {
  name: 'ProgressChartsClient',
  components: {
    ProgressChartClient
  },
  setup() {
    // Utiliser le store avec le hook useStore pour le rendre réactif
    const summary = useStore(rulesSummary);

    // Options disponibles pour filtrer la période
    const selectedPeriod = ref(30);
    const periodOptions = [
      { value: 7, label: '7 jours' },
      { value: 30, label: '30 jours' },
      { value: 90, label: '90 jours' }
    ];

    // Accéder aux labels depuis le store
    const typeLabels = computed(() => summary.value.typeLabels || {});

    return {
      ruleTypes,
      typeLabels,
      selectedPeriod,
      periodOptions
    };
  }
}
</script>
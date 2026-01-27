<template>
  <!-- Tableau de bord principal -->
  <div class="grid gap-6 md:grid-cols-2">
    <template v-for="(type, index) in ruleTypes" :key="index">
      <div v-if="typeStats[type]" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-none p-6 border border-transparent dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <i class="w-6 h-6 text-accent">
              <svg v-if="type === 'addition'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              <svg v-else-if="type === 'subtraction'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"></path>
              </svg>
              <svg v-else-if="type === 'multiplication'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 7l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"></path>
              </svg>
              <svg v-else-if="type === 'comparison'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                <path d="M11 7h2v6h-2V7zm0 8h2v2h-2v-2z"></path>
              </svg>
            </i>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ typeLabels[type] }}</h2>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ typeStats[type].masteredRules }}/{{ typeStats[type].totalRules }} maîtrisées
          </div>
        </div>

        <div class="bg-accent/10 dark:bg-accent/20 rounded-lg p-4 mb-4">
          <div class="flex items-center gap-2">
            <i class="w-5 h-5 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14zM7 10h2v7H7v-7zm4-3h2v10h-2V7zm4 6h2v4h-2v-4z"></path>
              </svg>
            </i>
            <span class="font-medium text-gray-900 dark:text-gray-100">
              Série actuelle : {{ typeStats[type].currentStreak }}
            </span>
          </div>

          <!-- Mini tendance d'apprentissage -->
          <div v-if="learningTrends[type] && learningTrends[type].length > 1" class="mt-3 flex items-center text-sm">
            <span class="mr-2 text-gray-700 dark:text-gray-300">Progression : </span>
            <div class="flex items-center h-4">
              <div v-for="(item, i) in learningTrends[type].slice(-5)" :key="i"
                   class="w-2 mx-0.5 rounded-sm"
                   :class="{'bg-green-500': item.value > 0, 'bg-gray-300 dark:bg-gray-700': item.value === 0}"
                   :style="`height: ${Math.max(4, item.value * 4)}px`">
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div
            v-for="rule in getSortedRules(type).slice(0, visibleRules[type] || 3)"
            :key="rule.id"
            class="border dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ rule.title }}</h3>
            </div>
            <RuleProgressClient :ruleId="rule.id" />
          </div>
        </div>

        <div class="mt-4 text-center">
          <div v-if="getRulesByType(type).length > (visibleRules[type] || 3)" class="mb-2">
            <button
              @click="showMoreRules(type)"
              class="inline-flex items-center text-accent hover:text-accent/80 dark:text-accent-hover dark:hover:text-accent"
            >
              Voir plus de règles
              <svg
                class="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          <a
            :href="`/rules/${type}`"
            class="inline-flex items-center text-accent hover:text-accent/80 dark:text-accent-hover dark:hover:text-accent"
          >
            Voir toutes les règles
            <svg
              class="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useStore } from '@nanostores/vue';
import { computed, onMounted, ref } from 'vue';
import { getRulesByType } from '../../stores/rulesStore';
import { ruleProgress } from '../../stores/ruleProgressStore';
import { getMasteredRulesTrend, getRecommendations, getRulesSummary, rulesSummary, ruleTypes } from '../../stores/rulesSummaryStore';
import RuleProgressClient from './RuleProgressClient.vue';

const summary = useStore(rulesSummary);
const progressStore = useStore(ruleProgress);
const visibleRules = ref({});

onMounted(() => {
  getRulesSummary();

  // Initialiser avec 3 règles visibles par type
  ruleTypes.forEach(type => {
    visibleRules.value[type] = 3;
  });
});

const getSortedRules = (type) => {
  const rules = getRulesByType(type);
  const progress = progressStore.value.progress;
  
  return [...rules].sort((a, b) => {
    const progA = progress[a.id];
    const progB = progress[b.id];
    
    // Si l'un a de la progression et pas l'autre, celui avec progression passe devant
    const hasProgA = progA && (progA.successCount > 0 || progA.failureCount > 0);
    const hasProgB = progB && (progB.successCount > 0 || progB.failureCount > 0);
    
    if (hasProgA && !hasProgB) return -1;
    if (!hasProgA && hasProgB) return 1;
    
    // Sinon, garder l'ordre d'origine
    return 0;
  });
};

const showMoreRules = (type) => {
  const currentCount = visibleRules.value[type] || 3;
  const totalRules = getRulesByType(type).length;

  // Augmenter de 3 règles à chaque clic, ou montrer toutes les règles
  visibleRules.value[type] = Math.min(currentCount + 3, totalRules);
};

const typeStats = computed(() => summary.value.typeStats || {});
const typeLabels = computed(() => summary.value.typeLabels || {});
const recommendations = computed(() => getRecommendations());
const learningTrends = computed(() => {
  const trends = {};
  ruleTypes.forEach(type => {
    trends[type] = getMasteredRulesTrend(type, 30);
  });
  return trends;
});
</script>
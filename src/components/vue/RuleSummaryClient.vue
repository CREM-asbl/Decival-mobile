<template>
  <!-- Tableau de bord principal -->
  <div class="grid gap-6 md:grid-cols-2">
    <template v-for="(type, index) in ruleTypes" :key="index">
      <div v-if="typeStats[type]" class="bg-white rounded-lg shadow-lg p-6">
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
            <h2 class="text-xl font-semibold">{{ typeLabels[type] }}</h2>
          </div>
          <div class="text-sm text-gray-600">
            {{ typeStats[type].masteredRules }}/{{ typeStats[type].totalRules }} maîtrisées
          </div>
        </div>

        <div class="bg-accent/10 rounded-lg p-4 mb-4">
          <div class="flex items-center gap-2">
            <i class="w-5 h-5 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14zM7 10h2v7H7v-7zm4-3h2v10h-2V7zm4 6h2v4h-2v-4z"></path>
              </svg>
            </i>
            <span class="font-medium">
              Série actuelle : {{ typeStats[type].currentStreak }}
            </span>
          </div>

          <!-- Mini tendance d'apprentissage -->
          <div v-if="learningTrends[type] && learningTrends[type].length > 1" class="mt-3 flex items-center text-sm">
            <span class="mr-2">Progression : </span>
            <div class="flex items-center h-4">
              <div v-for="(item, i) in learningTrends[type].slice(-5)" :key="i"
                   class="w-2 mx-0.5 rounded-sm"
                   :class="{'bg-green-500': item.value > 0, 'bg-gray-300': item.value === 0}"
                   :style="`height: ${Math.max(4, item.value * 4)}px`">
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="rule in getRulesByType(type).slice(0, 3)"
            :key="rule.id"
            class="border rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium">{{ rule.title }}</h3>
            </div>
            <RuleProgressClient :ruleId="rule.id" />
          </div>
        </div>

        <div class="mt-4 text-center">
          <a
            :href="`/rules/${type}`"
            class="inline-flex items-center text-accent hover:text-accent/80"
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
import { computed, onMounted } from 'vue';
import { getRulesByType } from '../../stores/rulesStore';
import { getMasteredRulesTrend, getRecommendations, getRulesSummary, rulesSummary, ruleTypes } from '../../stores/rulesSummaryStore';
import RuleProgressClient from './RuleProgressClient.vue';

const summary = useStore(rulesSummary);

onMounted(() => {
  getRulesSummary();
});

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
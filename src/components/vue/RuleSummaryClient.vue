<template>
  <div class="grid gap-6 md:grid-cols-2">
    <template v-for="(type, index) in ruleTypes" :key="index">
      <div v-if="typeStats[type]" class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <i class="w-6 h-6 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
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
        </div>

        <div class="space-y-4">
          <div
            v-for="rule in getRulesByType(type)"
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
import { getRulesSummary, rulesSummary, ruleTypes } from '../../stores/rulesSummaryStore';
import RuleProgressClient from './RuleProgressClient.vue';

const summary = useStore(rulesSummary);

onMounted(() => {
  getRulesSummary();
});

const typeStats = computed(() => summary.value.typeStats || {});
const typeLabels = computed(() => summary.value.typeLabels || {});
</script>
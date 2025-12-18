<template>
  <div v-if="recommendations.length > 0" class="mb-8 bg-accent/5 dark:bg-accent/10 rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
      <svg class="w-6 h-6 mr-2 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z"></path>
      </svg>
      Recommendations personnalisées
    </h2>
    <ul class="space-y-3">
      <li v-for="(rec, index) in recommendations.slice(0, 3)" :key="index"
          class="p-3 rounded-lg"
          :class="{
            'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800': rec.type === 'strength',
            'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800': rec.type === 'weakness',
            'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': rec.type === 'opportunity',
            'bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': rec.type === 'tip'
          }">
        <div class="flex items-start">
          <span class="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" :class="{
            'text-green-600 dark:text-green-400': rec.type === 'strength',
            'text-red-600 dark:text-red-400': rec.type === 'weakness',
            'text-blue-600 dark:text-blue-400': rec.type === 'opportunity',
            'text-amber-600 dark:text-amber-400': rec.type === 'tip'
          }">
            <svg v-if="rec.type === 'strength'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
            </svg>
            <svg v-else-if="rec.type === 'weakness'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
            <svg v-else-if="rec.type === 'opportunity'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-2-5h4v2h-4zm0-9h4v7h-4z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1zm-4-4h8v2H8v-2zm4-8c2.21 0 4 1.79 4 4 0 1.93-1.36 3.56-3.22 3.92-.11.03-.22.06-.33.08-.44.1-.77.5-.77.97v.5H9v-.5c0-.47-.33-.87-.77-.97-.11-.02-.22-.05-.33-.08C6.36 10.56 5 8.93 5 7c0-2.21 1.79-4 4-4z"></path>
            </svg>
          </span>
          <div>
            <p class="text-gray-800 dark:text-gray-200">{{ rec.message }}</p>
            <a v-if="rec.ruleId" :href="`/rule/${rec.ruleId}`" class="text-accent dark:text-accent font-medium text-sm mt-1 inline-block hover:underline">
              Voir la règle
            </a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getRecommendations } from '../../stores/rulesSummaryStore';

const recommendations = computed(() => getRecommendations());
</script>

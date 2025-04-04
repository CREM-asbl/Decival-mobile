<template>
  <div v-if="recommendations.length > 0" class="bg-white rounded-lg shadow-lg p-6 mb-6">
    <div class="flex items-center gap-2 mb-4">
      <i class="w-5 h-5 text-accent">
        <!-- Icône chart -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.5 3h-13A2.5 2.5 0 003 5.5v13A2.5 2.5 0 005.5 21h13a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0018.5 3zm-13 2h13a.5.5 0 01.5.5v13a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5z"></path>
          <path d="M17 8.5a1 1 0 00-1-1h-3a1 1 0 000 2h3a1 1 0 001-1zm0 4a1 1 0 00-1-1h-3a1 1 0 000 2h3a1 1 0 001-1zm0 4a1 1 0 00-1-1h-3a1 1 0 000 2h3a1 1 0 001-1zm-8-8a1 1 0 00-1-1H7a1 1 0 000 2h1a1 1 0 001-1zm0 4a1 1 0 00-1-1H7a1 1 0 000 2h1a1 1 0 001-1zm0 4a1 1 0 00-1-1H7a1 1 0 000 2h1a1 1 0 001-1z"></path>
        </svg>
      </i>
      <h2 class="text-xl font-semibold">Recommandations personnalisées</h2>
    </div>

    <div class="space-y-3">
      <div
        v-for="(rec, index) in recommendations"
        :key="index"
        :class="`p-4 rounded-lg border ${colors[rec.type]} flex items-start gap-3`"
      >
        <div :class="`rounded-full p-2 ${colors[rec.type]}`">
          <i class="w-5 h-5">
            <!-- Icônes dynamiques selon le type -->
            <svg v-if="rec.type === 'strength'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.5 5.5A2.5 2.5 0 0012 3a2.5 2.5 0 00-2.5 2.5V4a1 1 0 10-2 0v1.5A4.5 4.5 0 0012 10a1 1 0 100-2 2.5 2.5 0 01-2.5-2.5V4a1 1 0 10-2 0v1.5a4.5 4.5 0 004.5 4.5 2.5 2.5 0 002.5 2.5 2.5 2.5 0 002.5-2.5V8a1 1 0 10-2 0v2a4.5 4.5 0 01-4.5-4.5z"></path>
            </svg>
            <svg v-else-if="rec.type === 'weakness'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path>
              <path d="M12 6a1 1 0 100 2 4 4 0 014 4 1 1 0 102 0 6 6 0 00-6-6z"></path>
            </svg>
            <svg v-else-if="rec.type === 'opportunity'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3a1 1 0 011 1v8a1 1 0 01-2 0V4a1 1 0 011-1zm0 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path>
              <path d="M12 7a1 1 0 011 1v4a1 1 0 01-2 0V8a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z"></path>
            </svg>
          </i>
        </div>
        <div>
          <div class="font-medium">
            {{
              rec.type === 'strength' ? 'Point fort' :
              rec.type === 'weakness' ? 'Point à améliorer' :
              rec.type === 'opportunity' ? 'Opportunité' : 'Conseil'
            }}
          </div>
          <p class="text-sm mt-1">{{ rec.message }}</p>
          <a
            v-if="rec.ruleId"
            :href="`/rules/detail/${rec.ruleId}`"
            class="inline-flex items-center text-sm mt-2 text-accent hover:underline"
          >
            Voir la règle
            <svg class="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@nanostores/vue';
import { rulesSummary } from '../../stores/rulesSummaryStore';

export default {
  name: 'RecommendationsClient',
  setup() {
    // Définir les couleurs selon le type de recommandation
    const colors = {
      strength: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      weakness: 'text-red-600 bg-red-50 border-red-200',
      opportunity: 'text-blue-600 bg-blue-50 border-blue-200',
      tip: 'text-amber-600 bg-amber-50 border-amber-200'
    };

    // Utiliser le store avec le hook useStore pour le rendre réactif
    const summary = useStore(rulesSummary);

    return {
      summary,
      colors,
      // Accéder aux recommandations depuis le store
      get recommendations() {
        return summary.value.recommendations || [];
      }
    };
  }
}
</script>
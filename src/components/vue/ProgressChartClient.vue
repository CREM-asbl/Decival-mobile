<template>
  <div class="bg-white rounded-lg shadow-lg p-4 my-4">
    <h3 class="text-lg font-semibold mb-3">Progression sur {{ days }} jours</h3>

    <div v-if="hasData">
      <div class="relative" :style="`height: ${graphHeight}px; width: 100%`">
        <svg class="absolute inset-0 w-full h-full" :viewBox="`0 0 ${graphWidth} ${graphHeight}`">
          <!-- Lignes horizontales -->
          <line
            v-for="(_, i) in 5"
            :key="i"
            x1="0"
            :y1="i * graphHeight / 4"
            :x2="graphWidth"
            :y2="i * graphHeight / 4"
            stroke="#e5e7eb"
            stroke-width="1"
          />

          <!-- Graphique de règles maîtrisées -->
          <path
            :d="masteredPath"
            fill="none"
            stroke="#3b82f6"
            stroke-width="2"
          />

          <!-- Graphique de taux de réussite -->
          <path
            v-if="showSuccessRate"
            :d="successRatePath"
            fill="none"
            stroke="#10b981"
            stroke-width="2"
            stroke-dasharray="5,5"
          />

          <!-- Graphique de séries -->
          <path
            v-if="showStreaks"
            :d="streakPath"
            fill="none"
            stroke="#f59e0b"
            stroke-width="2"
            stroke-dasharray="3,3"
          />

          <!-- Étiquettes des dates -->
          <text
            v-for="(label, i) in xLabels"
            :key="i"
            :x="(i / (xLabels.length - 1 || 1)) * graphWidth"
            :y="graphHeight + 15"
            font-size="10"
            text-anchor="middle"
            fill="#6b7280"
          >{{ label }}</text>
        </svg>
      </div>

      <!-- Légende -->
      <div class="flex flex-wrap gap-4 mt-4 justify-center">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span class="text-sm">Règles maîtrisées ({{ lastMasteredValue }})</span>
        </div>

        <div v-if="showSuccessRate" class="flex items-center gap-2">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span class="text-sm">Taux de réussite ({{ lastSuccessRateValue }}%)</span>
        </div>

        <div v-if="showStreaks" class="flex items-center gap-2">
          <div class="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span class="text-sm">Série actuelle ({{ lastStreakValue }})</span>
        </div>
      </div>

      <!-- Vitesse d'apprentissage -->
      <div v-if="showLearningSpeed && learningSpeed.length > 0" class="mt-6">
        <h4 class="text-md font-medium mb-2">Vitesse d'apprentissage</h4>
        <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="(period, index) in learningSpeed" :key="index" class="bg-gray-50 p-3 rounded-lg text-center">
            <div class="text-xs text-gray-500">{{ period.period }}</div>
            <div class="text-xl font-bold text-accent mt-1">{{ period.newMastered }}</div>
            <div class="text-xs">nouvelles règles</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <p>Pas assez de données pour afficher la progression.</p>
      <p class="text-sm mt-2">Continuez à pratiquer pour voir votre évolution!</p>
    </div>
  </div>
</template>

<script>
import { useStore } from '@nanostores/vue';
import { computed, ref, watch } from 'vue';
import {
    getLearningSpeed,
    getMasteredRulesTrend,
    getStreakTrend,
    getSuccessRateTrend,
    rulesSummary
} from '../../stores/rulesSummaryStore';

export default {
  name: 'ProgressChartClient',
  props: {
    type: {
      type: String,
      required: true
    },
    days: {
      type: Number,
      default: 30
    },
    showSuccessRate: {
      type: Boolean,
      default: true
    },
    showStreaks: {
      type: Boolean,
      default: true
    },
    showLearningSpeed: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    // Utiliser le store avec le hook useStore pour le rendre réactif
    const summary = useStore(rulesSummary);

    // État local pour les données des graphiques
    const masteredTrend = ref(getMasteredRulesTrend(props.type, props.days));
    const successRateTrend = ref(props.showSuccessRate ? getSuccessRateTrend(props.type, props.days) : []);
    const streakTrend = ref(props.showStreaks ? getStreakTrend(props.type, props.days) : []);
    const learningSpeed = ref(props.showLearningSpeed ? getLearningSpeed(props.type, 7, props.days) : []);

    // Mettre à jour les données quand le store change
    watch(() => summary.value, () => {
      masteredTrend.value = getMasteredRulesTrend(props.type, props.days);
      if (props.showSuccessRate) {
        successRateTrend.value = getSuccessRateTrend(props.type, props.days);
      }
      if (props.showStreaks) {
        streakTrend.value = getStreakTrend(props.type, props.days);
      }
      if (props.showLearningSpeed) {
        learningSpeed.value = getLearningSpeed(props.type, 7, props.days);
      }
    }, { deep: true });

    // Mettre à jour les données quand les props changent
    watch(() => props.days, (newDays) => {
      masteredTrend.value = getMasteredRulesTrend(props.type, newDays);
      if (props.showSuccessRate) {
        successRateTrend.value = getSuccessRateTrend(props.type, newDays);
      }
      if (props.showStreaks) {
        streakTrend.value = getStreakTrend(props.type, newDays);
      }
      if (props.showLearningSpeed) {
        learningSpeed.value = getLearningSpeed(props.type, 7, newDays);
      }
    });

    // Formater les dates pour l'affichage
    const formatDateLabel = (date) => {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    // Générer les labels pour l'axe X
    const xLabels = computed(() => masteredTrend.value.map(item => formatDateLabel(item.date)));

    // Déterminer le maximum pour l'échelle du graphique
    const maxMastered = computed(() => Math.max(...masteredTrend.value.map(item => item.value), 1));
    const maxSuccessRate = computed(() => {
      return props.showSuccessRate
        ? Math.max(...successRateTrend.value.map(item => item.value), 100)
        : 100;
    });
    const maxStreak = computed(() => {
      return props.showStreaks
        ? Math.max(...streakTrend.value.map(item => item.value), 5)
        : 5;
    });

    // Calculer la hauteur du graphique
    const graphHeight = 200;
    const graphWidth = computed(() => Math.max(xLabels.value.length * 40, 300));

    // Générer le path pour les lignes du graphique
    const generatePath = (data, max) => {
      if (data.length === 0) return '';

      return data.map((item, index) => {
        const x = (index / (data.length - 1 || 1)) * graphWidth.value;
        const y = graphHeight - (item.value / max) * graphHeight;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');
    };

    // Préparer les données pour le graphique
    const masteredPath = computed(() => generatePath(masteredTrend.value, maxMastered.value));
    const successRatePath = computed(() => {
      return props.showSuccessRate
        ? generatePath(successRateTrend.value, maxSuccessRate.value)
        : '';
    });
    const streakPath = computed(() => {
      return props.showStreaks
        ? generatePath(streakTrend.value, maxStreak.value)
        : '';
    });

    // S'assurer qu'il y a des données à afficher
    const hasData = computed(() => masteredTrend.value.length > 0);

    // Obtenir les dernières valeurs pour l'affichage
    const lastMasteredValue = computed(() => {
      const lastItem = masteredTrend.value[masteredTrend.value.length - 1];
      return lastItem ? lastItem.value : 0;
    });

    const lastSuccessRateValue = computed(() => {
      if (!props.showSuccessRate || successRateTrend.value.length === 0) return 0;
      const lastItem = successRateTrend.value[successRateTrend.value.length - 1];
      return lastItem ? Math.round(lastItem.value) : 0;
    });

    const lastStreakValue = computed(() => {
      if (!props.showStreaks || streakTrend.value.length === 0) return 0;
      const lastItem = streakTrend.value[streakTrend.value.length - 1];
      return lastItem ? lastItem.value : 0;
    });

    return {
      masteredTrend,
      successRateTrend,
      streakTrend,
      learningSpeed,
      xLabels,
      graphHeight,
      graphWidth,
      masteredPath,
      successRatePath,
      streakPath,
      hasData,
      lastMasteredValue,
      lastSuccessRateValue,
      lastStreakValue
    };
  }
}
</script>
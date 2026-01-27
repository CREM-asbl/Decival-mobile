<template>
  <div class="flex flex-col gap-6">
    <!-- XP and Level Section -->
    <div class="bg-gradient-to-r from-accent to-indigo-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div class="flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 text-4xl shadow-inner">
            🚀
          </div>
          <div>
            <div class="text-white/80 text-sm font-bold uppercase tracking-wider">Niveau</div>
            <div class="text-5xl font-black">{{ testStats.level || 1 }}</div>
          </div>
        </div>
        
        <div class="flex-1 w-full max-w-md">
          <div class="flex justify-between items-end mb-2">
            <div class="text-sm font-bold uppercase tracking-wider text-white/80">Progression XP</div>
            <div class="font-black">{{ testStats.xp % 100 }} / 100</div>
          </div>
          <div class="h-4 bg-black/20 rounded-full overflow-hidden border border-white/10 shadow-inner p-1">
            <div 
              class="h-full bg-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
              :style="{ width: `${testStats.xp % 100}%` }"
            ></div>
          </div>
          <div class="mt-2 text-xs text-center text-white/60">Encore {{ 100 - (testStats.xp % 100) }} XP pour le niveau {{ (testStats.level || 1) + 1 }} !</div>
        </div>
      </div>
    </div>

    <!-- Encouragement section with Mr Comma -->
    <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6 border border-indigo-100 dark:border-indigo-800/50">
      <MrComma :variant="encouragementVariant" animate class="w-16 h-16 sm:w-24 sm:h-24" />
      <div>
        <h2 class="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
          {{ encouragementTitle }}
        </h2>
        <p class="text-indigo-700 dark:text-indigo-300">
          {{ encouragementMessage }}
        </p>
      </div>
    </div>

    <!-- Mes Badges -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-transparent dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold dark:text-white">Mes Badges</h2>
        <span class="text-xs font-bold px-2 py-1 bg-accent/10 text-accent rounded-full">
          {{ unlockedBadgesIds.length }} / {{ Object.keys(BADGES).length }}
        </span>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <BadgeIcon 
            v-for="badge in Object.values(BADGES)" 
            :key="badge.id"
            :badge="badge"
            :unlocked="unlockedBadgesIds.includes(badge.id)"
            showDescription
          />
        </div>
      </div>
    </div>

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700 transition-transform hover:scale-[1.02]">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold dark:text-gray-100">Tests</h2>
        </div>
        <p class="text-3xl font-black text-blue-600 dark:text-blue-400">{{ testStats.totalTests }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700 transition-transform hover:scale-[1.02]">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
            <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold dark:text-gray-100">Moyenne</h2>
        </div>
        <p class="text-3xl font-black text-green-600 dark:text-green-400">{{ formattedAvgScore }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700 transition-transform hover:scale-[1.02]">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold dark:text-gray-100">Record</h2>
        </div>
        <p class="text-3xl font-black text-yellow-600 dark:text-yellow-400">{{ formattedBestScore }}</p>
      </div>
    </div>

    <!-- Règles maîtrisées -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 border border-transparent dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold dark:text-white">Règles maîtrisées</h2>
        <a
          href="/rules/summary"
          class="text-accent hover:text-accent-hover flex items-center gap-2 font-medium"
        >
          Toutes les règles
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
      <div class="p-6">
        <p v-if="masteredRules.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed dark:border-gray-700">
          Continue à t'entraîner pour maîtriser tes premières règles !
        </p>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="rule in masteredRules" :key="rule.id" class="border dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/30 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-2">
              <div class="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="font-bold dark:text-white">{{ rule.title }}</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ rule.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Analyses d'erreurs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 border border-transparent dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700">
        <h2 class="text-xl font-semibold dark:text-white">Analyses des erreurs</h2>
      </div>
      <div class="p-4">
        <ErrorAnalysisPanel />
      </div>
    </div>

    <!-- Historique des tests -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-transparent dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700">
        <h2 class="text-xl font-semibold dark:text-white">Historique des tests</h2>
      </div>
      <div class="p-4">
        <p v-if="recentTests.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
          Aucun test complété pour le moment
        </p>
        <div v-else class="space-y-4">
          <div v-for="test in recentTests" :key="test.id" class="border dark:border-gray-700 rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/30">
            <div class="flex items-center justify-between mb-2">
              <div class="font-bold dark:text-white text-lg">{{ getTestTypeName(test.type) }}</div>
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{{ formatDate(test.startTime) }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500">Mode: {{ getModeName(test.mode) }}</span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span class="text-sm font-bold text-accent">{{ calculateScore(test) }}%</span>
              </div>
              <div class="text-sm font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                {{ getCorrectAnswersCount(test) }}/{{ test.items.length }} vrais
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton pour réinitialiser les données (pour déboguer) -->
    <button @click="resetData" class="px-6 py-3 mt-6 text-gray-400 hover:text-red-500 text-sm font-medium transition-colors self-center">
      Réinitialiser ma progression
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { ruleProgress, resetProgress } from '../../stores/ruleProgressStore'
import { getRuleById } from '../../stores/rulesStore'
import { stats, testHistory, resetTestData } from '../../stores/testStore'
import { BADGES, unlockedBadges } from '../../stores/badgeStore'
import ErrorAnalysisPanel from './ErrorAnalysisPanel.vue'
import MrComma from './MrComma.vue'
import BadgeIcon from './BadgeIcon.vue'

// Composant qui accède uniquement aux stores et expose des données réactives
// sans manipuler directement le localStorage

// Données réactives dérivées des stores
const testStats = computed(() => stats.get())
const allProgress = computed(() => ruleProgress.get())
const unlockedBadgesIds = computed(() => unlockedBadges.get())

const formattedAvgScore = computed(() => `${Math.round(testStats.value.averageScore)}%`)
const formattedBestScore = computed(() => `${Math.round(testStats.value.bestScore)}%`)

// Récupération des règles maîtrisées
const masteredRules = computed(() => {
  if (!allProgress.value || !allProgress.value.progress) return []

  return Object.entries(allProgress.value.progress)
    .filter(([_, ruleProgress]) => ruleProgress.mastered)
    .map(([ruleId]) => getRuleById(ruleId))
    .filter(rule => rule !== undefined)
})

// Récupération des tests récents
const recentTests = computed(() => {
  const history = testHistory.get()
  return history.slice(0, 10) // Limiter à 10 tests
})

// Fonctions utilitaires
function getTestTypeName(type) {
  const types = {
    addition: "Addition",
    subtraction: "Soustraction",
    multiplication: "Multiplication",
    comparison: "Comparaison",
    division: "Division"
  }
  return types[type] || type
}

function getModeName(mode) {
  const modes = {
    integer: "Entiers",
    decimal: "Décimaux"
  }
  return modes[mode] || mode
}

function formatDate(date) {
  return new Date(date).toLocaleString([], {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calculateScore(test) {
  const correctAnswers = getCorrectAnswersCount(test)
  return Math.round((correctAnswers / test.items.length) * 100)
}

function getCorrectAnswersCount(test) {
  return test.items.filter(item => item.isCorrect).length
}

// Fonction pour réinitialiser les données (pour déboguer)
function resetData() {
  if (confirm("Voulez-vous réinitialiser toutes les données de progression ? Cette action est irréversible.")) {
    resetProgress()
    resetTestData()
    alert("Données réinitialisées avec succès")
  }
}

// Logique d'encouragement dynamique
const encouragementVariant = computed(() => {
  if (testStats.value.averageScore >= 80) return 'happy'
  if (testStats.value.totalTests === 0) return 'pointing'
  if (testStats.value.averageScore < 50) return 'pointing'
  return 'default'
})

const encouragementTitle = computed(() => {
  if (testStats.value.totalTests === 0) return "C'est parti !"
  if (testStats.value.averageScore >= 90) return "Excellent travail !"
  if (testStats.value.averageScore >= 70) return "Tu progresses bien !"
  if (testStats.value.averageScore >= 50) return "Continue tes efforts !"
  return "N'abandonne pas !"
})

const encouragementMessage = computed(() => {
  if (testStats.value.totalTests === 0) return "Commence ton premier exercice pour voir ta progression s'afficher ici."
  if (testStats.value.averageScore >= 90) return "Tes résultats sont impressionnants. Tu maîtrises vraiment bien les concepts !"
  if (testStats.value.averageScore >= 70) return "Tes efforts portent leurs fruits. Continue comme ça pour atteindre le sommet !"
  if (testStats.value.averageScore >= 50) return "Tu es sur la bonne voie. Pratique encore un peu pour gagner en assurance."
  return "Les mathématiques demandent de la pratique. Fais encore quelques tests pour t'améliorer !"
})

// Initialisation - s'assurer que les stores sont bien initialisés
onMounted(() => {
  console.log("ProgressPanel monté")
  console.log("État des stats:", testStats.value)
  console.log("État de la progression:", allProgress.value)
  console.log("Règles maîtrisées:", masteredRules.value)
  console.log("Tests récents:", recentTests.value)
})
</script>
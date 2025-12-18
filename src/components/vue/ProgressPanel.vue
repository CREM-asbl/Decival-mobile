<template>
  <div class="flex flex-col gap-6">
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

    <!-- Statistiques globales -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 class="text-lg font-semibold dark:text-gray-100">Tests complétés</h2>
        </div>
        <p class="text-2xl font-bold text-accent">{{ testStats.totalTests }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 class="text-lg font-semibold dark:text-gray-100">Score moyen</h2>
        </div>
        <p class="text-2xl font-bold text-accent">{{ formattedAvgScore }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 class="text-lg font-semibold dark:text-gray-100">Meilleur score</h2>
        </div>
        <p class="text-2xl font-bold text-accent">{{ formattedBestScore }}</p>
      </div>
    </div>

    <!-- Règles maîtrisées -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 border border-transparent dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold dark:text-white">Règles maîtrisées</h2>
        <a
          href="/rules/summary"
          class="text-accent hover:text-accent-hover flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Voir toutes les règles
        </a>
      </div>
      <div class="p-4">
        <p v-if="masteredRules.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-8">
          Aucune règle maîtrisée pour le moment
        </p>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="rule in masteredRules" :key="rule.id" class="border dark:border-gray-700 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="font-semibold dark:text-white">{{ rule.title }}</h3>
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
          <div v-for="test in recentTests" :key="test.id" class="border dark:border-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="font-semibold dark:text-white">{{ getTestTypeName(test.type) }} - {{ getModeName(test.mode) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(test.startTime) }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div>Score : <span class="font-bold text-accent">{{ calculateScore(test) }}%</span></div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ getCorrectAnswersCount(test) }}/{{ test.items.length }} correctes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton pour réinitialiser les données (pour déboguer) -->
    <button @click="resetData" class="px-6 py-3 mt-6 bg-red-500 text-white rounded-md hover:bg-red-600">
      Réinitialiser les données
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { resetProgress, ruleProgress } from '../../stores/ruleProgressStore'
import { getRuleById } from '../../stores/rulesStore'
import { resetTestData, stats, testHistory } from '../../stores/testStore'
import ErrorAnalysisPanel from './ErrorAnalysisPanel.vue'
import MrComma from './MrComma.vue'

// Composant qui accède uniquement aux stores et expose des données réactives
// sans manipuler directement le localStorage

// Données réactives dérivées des stores
const testStats = computed(() => stats.get())
const allProgress = computed(() => ruleProgress.get())

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
  return new Date(date).toLocaleDateString()
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
<template>
  <div class="flex flex-col gap-6">
    <div role="tablist" aria-label="Sections de ta progression" class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-full" @keydown="onTabKeydown">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :id="`tab-${tab.id}`"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="selectTab(tab.id)"
        class="flex-1 min-h-[44px] px-4 rounded-full text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        :class="activeTab === tab.id ? 'bg-white dark:bg-gray-800 text-accent shadow' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-show="activeTab === 'progres'" role="tabpanel" id="panel-progres" aria-labelledby="tab-progres" tabindex="0" class="flex flex-col gap-6">
    <!-- XP and Level Section -->
        <div class="bg-linear-to-r from-accent to-accent-active rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-indigo-900/20 overflow-hidden relative">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-5 sm:gap-6 relative z-10">
        <div class="flex items-center gap-4">
          <div class="bg-white/20 p-2 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
                <MrComma :variant="commaVariant" :class="commaClass" :level="levelProgress.level" class="w-20 h-20" />
          </div>
          <div>
                <div class="text-white/90 text-sm font-bold uppercase tracking-wider">{{ getLevelTitle(levelProgress.level) }}</div>
                <div class="text-5xl font-black">Niveau {{ levelProgress.level }}</div>
          </div>
        </div>
        
        <div class="flex-1 w-full max-w-md">
          <div class="flex justify-between items-end mb-2">
            <div class="text-sm font-bold uppercase tracking-wider text-white/90">Progression XP</div>
                <div class="font-black">{{ levelProgress.xpIntoLevel }} / {{ levelProgress.xpForNextLevel }}</div>
          </div>
              <div class="h-6 bg-black/20 rounded-full overflow-hidden border border-white/10 shadow-inner p-1" role="progressbar" :aria-valuenow="levelProgress.percent" aria-valuemin="0" aria-valuemax="100" aria-label="Progression vers le niveau suivant" aria-live="polite">
            <div 
                            class="h-full bg-yellow-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(250,204,21,0.5)] motion-reduce:transition-none"
                  :style="{ width: `${levelProgress.percent}%` }"
            ></div>
          </div>
              <div class="mt-2 text-xs text-center text-white/80">
                <span class="sr-only">Progression : {{ levelProgress.percent }} pour cent</span>
                Encore {{ levelProgress.remainingXp }} XP pour le niveau {{ levelProgress.nextLevel }} !
              </div>
            </div>
          </div>
        </div>

    <!-- Encouragement section with Mr Comma -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-200 dark:border-gray-600">
          <MrComma :variant="progressEncouragement.variant" animate class="w-16 h-16 sm:w-24 sm:h-24" />
      <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ progressEncouragement.title }}
        </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ progressMessage }}
            </p>
          </div>
        </div>

    <a href="/tests" class="flex items-center justify-center min-h-[44px] px-6 rounded-full bg-accent text-white font-bold hover:bg-accent-active transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">Continuer à t'entraîner</a>
    </div>
    <div v-show="activeTab === 'badges'" role="tabpanel" id="panel-badges" aria-labelledby="tab-badges" tabindex="0" class="flex flex-col gap-6">
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
            v-for="badge in visibleBadges"
            :key="badge.id"
            :badge="badge"
            :unlocked="unlockedBadgesIds.includes(badge.id)"
            :progress="getProgressForBadge(badge.id)"
            showDescription
          />
        </div>
        <button
          v-if="hiddenBadgeCount > 0 || showAllBadges"
          @click="showAllBadges = !showAllBadges"
          class="mt-4 text-sm font-bold text-accent hover:underline"
          :aria-expanded="showAllBadges"
        >
          {{ showAllBadges ? 'Voir moins' : `Voir les ${hiddenBadgeCount} autres` }}
        </button>
      </div>
    </div>

    </div>
    <div v-show="activeTab === 'stats'" role="tabpanel" id="panel-stats" aria-labelledby="tab-stats" tabindex="0" class="flex flex-col gap-6">
    <!-- Statistiques globales -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
            <span class="text-xl">🔥</span>
          </div>
          <h2 class="text-lg font-semibold dark:text-gray-100">Série</h2>
        </div>
        <p class="text-3xl font-black text-amber-600 dark:text-amber-400">{{ testStats.dailyStreak || 0 }}j</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-accent/10 p-2 rounded-lg">
                      <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold dark:text-gray-100">Tests</h2>
        </div>
        <p class="text-3xl font-black text-accent">{{ testStats.totalTests }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                      <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold dark:text-gray-100">Moyenne</h2>
        </div>
        <p class="text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ formattedAvgScore }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-transparent dark:border-gray-700">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
            <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold dark:text-gray-100">Record</h2>
        </div>
        <p class="text-3xl font-black text-amber-600 dark:text-amber-400">{{ formattedBestScore }}</p>
      </div>
    </div>

    <!-- Maîtrise des sous-compétences -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 border border-transparent dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-semibold dark:text-white">Maîtrise des sous-compétences</h2>
        <span
          class="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full"
          role="progressbar"
          :aria-valuenow="masterySummary.percent"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${masterySummary.masteredCount} sur ${masterySummary.totalCount} sous-compétences maîtrisées`"
          :style="{ background: `linear-gradient(to right, #a7f3d0 ${masterySummary.percent}%, #ecfdf5 ${masterySummary.percent}%)` }"
        >
              {{ masterySummary.masteredCount }} / {{ masterySummary.totalCount }} sous-compétences maîtrisées ({{ masterySummary.percent }}%)
        </span>
      </div>
      <div class="p-6">
        <p v-if="masteredTypes.length === 0" class="text-gray-600 dark:text-gray-300 text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed dark:border-gray-600">
          Continue à t'entraîner pour maîtriser tes premières sous-compétences !
        </p>
        <div v-else class="space-y-6">
          <div v-for="category in visibleCategories" :key="category.id" class="space-y-3">
            <h3 class="font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
              {{ category.name }}
              <span class="h-px flex-1 bg-gray-200 dark:bg-gray-600"></span>
              <span
                class="text-[11px] font-bold px-2 py-0.5 rounded-full normal-case tracking-normal"
                :class="isIntegerMastered(category.id)
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'"
              >
                {{ isIntegerMastered(category.id) ? 'Entiers maîtrisés' : 'Entiers à consolider' }}
              </span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="type in getMasteredTypesByCategory(category.id)" :key="type.type" 
                   class="border dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-700/50 flex items-center gap-3">
                <div class="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-full shrink-0">
                                  <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold dark:text-white text-sm">{{ getTypeLabel(category.id, type.type) }}</h4>
                  <p class="text-xs text-gray-600 dark:text-gray-300">Dernier score : {{ Math.round(type.lastScore) }}%</p>
                </div>
              </div>
            </div>
          </div>
          <button
            v-if="hiddenCategoryCount > 0 || showAllCategories"
            @click="showAllCategories = !showAllCategories"
            class="mt-4 text-sm font-bold text-accent hover:underline"
            :aria-expanded="showAllCategories"
          >
            {{ showAllCategories ? 'Voir moins' : `Voir les ${hiddenCategoryCount} autres` }}
          </button>
        </div>
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
          <div v-for="test in visibleTests" :key="test.id" class="border dark:border-gray-700 rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div class="flex items-center justify-between mb-2">
              <div class="font-bold dark:text-white text-lg">{{ getTestTypeName(test.type) }}</div>
              <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{{ formatDate(test.startTime) }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600 dark:text-gray-300">Mode: {{ getModeName(test.mode) }}</span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span class="text-sm font-bold text-accent">{{ calculateScore(test) }}%</span>
              </div>
              <div class="flex items-center gap-2">
                <a :href="`/progress/feedback/${test.id}`" class="text-xs font-bold text-accent hover:underline flex items-center gap-1 bg-accent/5 px-2 py-1 rounded-lg transition-colors hover:bg-accent/10">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Analyser
                </a>
                <div class="text-sm font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                  {{ getCorrectAnswersCount(test) }}/{{ test.items.length }} vrais
                </div>
              </div>
            </div>
          </div>
          <button
            v-if="recentTests.length > 5 || showAllTests"
            @click="showAllTests = !showAllTests"
            class="mt-4 text-sm font-bold text-accent hover:underline"
            :aria-expanded="showAllTests"
          >
            {{ showAllTests ? 'Voir moins' : `Voir les ${recentTests.length - 5} tests précédents` }}
          </button>
        </div>
      </div>
    </div>

    </div>
    <!-- Demande aide à ton enseignant -->
    <div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/50 flex items-center gap-3">
      <span class="text-2xl" aria-hidden="true">🧑‍🏫</span>
      <p class="text-sm text-amber-800 dark:text-amber-300 font-medium">
        Montre ces résultats à ton enseignant : demande-lui de t'expliquer tes erreurs et de t'aider à progresser.
      </p>
    </div>

    <!-- Zone dangereuse : réinitialisation, séparée et confirmée -->
    <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-center">
      <button @click="showResetModal = true" :disabled="!hasActiveStudent" class="px-4 py-2 min-h-[44px] text-xs text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors underline underline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
        Réinitialiser ma progression
      </button>
    </div>

    <div
      v-if="showResetModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-reset-title"
      @click.self="showResetModal = false"
      @keydown.esc="showResetModal = false"
      @keydown.tab="trapResetFocus"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 id="progress-reset-title" class="text-xl font-bold mb-2 dark:text-white">Effacer ta progression ?</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Tes tests, tes badges et ta maîtrise seront remis à zéro. Cette action est définitive.
        </p>
        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            ref="resetConfirmRef"
            data-autofocus
            @click="confirmReset"
            class="inline-flex items-center justify-center font-medium rounded-md px-4 py-2 min-h-[44px] text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            Tout effacer
          </button>
          <button
            @click="showResetModal = false"
            class="inline-flex items-center justify-center font-medium rounded-md px-4 py-2 min-h-[44px] border border-gray-300 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Garder ma progression
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from '@nanostores/vue'
import { stats, testHistory, resetTestData } from '../../stores/testStore'
import { typeMastery, resetTypeMastery, isIntegerMastered } from '../../stores/typeMasteryStore'
import { BADGES, unlockedBadges } from '../../stores/badgeStore'
import { getActiveStudent, studentState } from '../../stores/studentStore'
import MrComma from './MrComma.vue'
import BadgeIcon from './BadgeIcon.vue'
import { getLevelProgress, getLevelTitle, getProgressEncouragement, getProgressMessage, getBadgeProgress, summarizeMastery, PROGRESS_TABS, resolveProgressTab } from '../../logic/progressLogic'
import { CATEGORY_TYPE_COUNTS, CATEGORY_BADGES } from '../../config/constants'
import { onErrorCaptured } from 'vue'

const tabs = PROGRESS_TABS
const activeTab = ref('progres')
function selectTab(id) {
  activeTab.value = resolveProgressTab(id)
}
function onTabKeydown(event) {
  const ids = tabs.map((t) => t.id)
  const current = ids.indexOf(activeTab.value)
  let next = -1
  if (event.key === 'ArrowRight') next = (current + 1) % ids.length
  else if (event.key === 'ArrowLeft') next = (current - 1 + ids.length) % ids.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = ids.length - 1
  if (next < 0) return
  event.preventDefault()
  selectTab(ids[next])
  document.getElementById(`tab-${ids[next]}`)?.focus()
}

const activeStudent = useStore(studentState)
const hasActiveStudent = computed(() => !!activeStudent.value.activeStudentId)
onErrorCaptured((err) => {
  console.error('[ProgressPanel] mount error:', err)
  return false
})
// Données réactives dérivées des stores (réactives aux changements d'élève actif)
const testStats = useStore(stats)
const unlockedBadgesIds = useStore(unlockedBadges)
const masteryState = useStore(typeMastery)
const testHistoryStore = useStore(testHistory)

const CATEGORY_BADGE_MAP = {
  MASTERY_ADDITION: 'addition',
  MASTERY_SUBTRACTION: 'subtraction',
  MASTERY_MULTIPLICATION: 'multiplication',
  MASTERY_COMPARISON: 'comparison'
}

function countMasteredInCategory(category) {
  return Object.values(masteryState.value.mastery ?? {}).filter(
    m => m.category === category && (m.mode ?? 'decimal') === 'decimal' && m.mastered
  ).length
}

function getProgressForBadge(badgeId) {
  if (badgeId.startsWith('LEVEL_')) {
    return getBadgeProgress(badgeId, {
      level: levelProgress.value.level,
      xpIntoLevel: levelProgress.value.xpIntoLevel,
      xpForNextLevel: levelProgress.value.xpForNextLevel
    })
  }
  const category = CATEGORY_BADGE_MAP[badgeId]
  if (category && CATEGORY_BADGES.includes(badgeId)) {
    return getBadgeProgress(badgeId, {
      masteredInCategory: countMasteredInCategory(category),
      categoryTotal: CATEGORY_TYPE_COUNTS[category]
    })
  }
  return getBadgeProgress(badgeId, {
    masteredCount: masterySummary.value.masteredCount,
    dailyStreak: testStats.value.dailyStreak,
    totalTests: testStats.value.totalTests,
    bestScore: testStats.value.bestScore
  })
}

const formattedAvgScore = computed(() => `${Math.round(testStats.value.averageScore)}%`)
const formattedBestScore = computed(() => `${Math.round(testStats.value.bestScore)}%`)

// Nouvelle logique de progression
const levelProgress = computed(() => getLevelProgress(testStats.value.xp))
const masterySummary = computed(() => summarizeMastery(masteryState.value.mastery))
const progressEncouragement = computed(() => getProgressEncouragement({
  totalTests: testStats.value.totalTests,
  averageScore: testStats.value.averageScore
}))
const progressMessage = computed(() => getProgressMessage(progressEncouragement.value.title))

const categories = [
  { id: 'addition', name: 'Addition' },
  { id: 'subtraction', name: 'Soustraction' },
  { id: 'multiplication', name: 'Multiplication' },
  { id: 'comparison', name: 'Comparaison' }
]

const additionLabels = [
  'Dixièmes sans retenue',
  'Centièmes sans retenue',
  'Précisions différentes',
  'Dixièmes avec retenue',
  'Centièmes avec retenue',
  'Plusieurs décimales',
  'Entier et décimal'
]

const subtractionLabels = [
  'Dixièmes sans emprunt',
  'Centièmes sans emprunt',
  'Précisions différentes',
  'Dixièmes avec emprunt',
  'Centièmes avec emprunt',
  'Nombres mixtes',
  'Entier et décimal'
]

const multiplicationLabels = [
  'X simple (0,x * 0,y)',
  'X par 10, 100, ...',
  'X entier * décimal',
  'X précisions diff.',
  'X avec retenue',
  'X par 0,1, 0,01, ...',
  'X nombre à 2 chiffres'
]

const comparisonLabels = [
  'Simple (mêmes décimales)',
  'Zéro à gauche',
  'Zéro intercalé',
  'Précisions différentes',
  'Plus de chiffres ≠ plus grand',
  'Zéro non significatif à droite',
  'Égalités avec zéros à droite'
]

function getTypeLabel(category, type) {
  if (category === 'addition') return additionLabels[type] || `Type ${type}`
  if (category === 'subtraction') return subtractionLabels[type] || `Type ${type}`
  if (category === 'multiplication') return multiplicationLabels[type] || `Type ${type}`
  if (category === 'comparison') return comparisonLabels[type] || `Type ${type}`
  return `Type ${type}`
}

const masteredTypes = computed(() => {
  return Object.values(masteryState.value.mastery).filter(m => m.mastered)
})

function getMasteredTypesByCategory(category) {
  return masteredTypes.value.filter(m => m.category === category)
}

const commaVariant = computed(() => {
  const level = levelProgress.value.level
  if (level >= 15) return 'happy'
  if (level >= 5) return 'pointing'
  return 'default'
})

const commaClass = computed(() => {
  const level = levelProgress.value.level
  let classes = 'transition-all duration-500 '
  if (level >= 50) classes += 'scale-110'
  return classes
})

// Récupération des tests récents
const recentTests = computed(() => {
  const history = testHistoryStore.value
  return history.slice(0, 10) // Limiter à 10 tests
})

// Disclosure progressive : 5 tests visibles, catégories vides masquées, badges repliés
const showAllTests = ref(false)
const showAllCategories = ref(false)
const showAllBadges = ref(false)
const visibleBadges = computed(() => {
  const all = Object.values(BADGES)
  const unlocked = all.filter(b => unlockedBadgesIds.value.includes(b.id))
  if (showAllBadges.value) return all
  return unlocked.length > 0 ? unlocked : all.slice(0, 5)
})
const hiddenBadgeCount = computed(() => Object.keys(BADGES).length - visibleBadges.value.length)
const visibleTests = computed(() => showAllTests.value ? recentTests.value : recentTests.value.slice(0, 5))
const visibleCategories = computed(() => {
  const withMastery = categories.filter(c => getMasteredTypesByCategory(c.id).length > 0)
  if (showAllCategories.value || withMastery.length === 0) return categories
  return withMastery
})
const hiddenCategoryCount = computed(() => categories.length - visibleCategories.value.length)

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

function resetData() {
  const active = getActiveStudent()
  if (!active) return
  resetTestData(active.id)
  resetTypeMastery(active.id)
}

const showResetModal = ref(false)
const resetConfirmRef = ref(null)

watch(showResetModal, (open) => {
  if (open) nextTick(() => resetConfirmRef.value?.focus?.())
})

function confirmReset() {
  resetData()
  showResetModal.value = false
}

function trapResetFocus(event) {
  const dialog = event.currentTarget
  const focusables = Array.from(dialog.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled)
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

</script>
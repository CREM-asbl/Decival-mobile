<template>
  <div class="container mx-auto px-4 py-8 mt-16">
    <!-- Mode selector -->
    <TestModeSelector
      v-if="!testStarted"
      testType="comparison"
      @modeSelected="startTestWithMode"
    />

    <div v-if="testStarted" class="mb-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Question {{ currentQuestionIndex + 1 }}/{{ test.items.length }}
        </div>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
        <div class="bg-accent h-2 rounded-full" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <form v-if="testStarted" @submit.prevent class="mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg mx-auto border border-transparent dark:border-gray-700">
        <div class="flex flex-col items-center gap-8 py-4">
          <p class="text-gray-600 dark:text-gray-400 text-center text-lg mb-2">Sélectionnez le nombre le plus grand, ou le signe égal s'ils sont identiques :</p>
          
          <div class="flex items-center justify-center gap-2 sm:gap-6 w-full max-w-md mx-auto">
            <button
              type="button"
              @click="handleAnswer('>')"
              class="flex-1 py-6 px-2 sm:px-4 text-3xl sm:text-4xl font-bold rounded-xl transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-gray-600 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/30"
              aria-label="Sélectionner le premier nombre"
            >
              {{ currentItem.firstNumberDisplay }}
            </button>

            <button
              type="button"
              @click="handleAnswer('=')"
              class="w-14 h-14 sm:w-16 sm:h-16 shrink-0 text-3xl font-mono font-bold rounded-full flex items-center justify-center transition-all duration-300 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-accent/30"
              aria-label="Ils sont égaux"
            >
              =
            </button>

            <button
              type="button"
              @click="handleAnswer('<')"
              class="flex-1 py-6 px-2 sm:px-4 text-3xl sm:text-4xl font-bold rounded-xl transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-gray-600 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/30"
              aria-label="Sélectionner le deuxième nombre"
            >
              {{ currentItem.secondNumberDisplay }}
            </button>
          </div>
        </div>
      </div>
    </form>

    <!-- Modal de fin de test -->
    <TestCompleteModal
      :show="showCompleteModal"
      :score="score"
      :gamificationResults="gamificationResults"
      testType="comparaison"
      @restart="handleRestart"
    />
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { analyzeError, createComparisonTest } from '../../logic/comparisonLogic'
import { useMathTest } from '../../composables/useMathTest'
import { playSound } from '../../stores/soundStore'
import TestCompleteModal from '../tests/TestCompleteModal.vue'
import TestModeSelector from '../tests/TestModeSelector.vue'
import MrComma from './MrComma.vue'

// Utiliser le composable avec les fonctionnalités de base
const {
  testStarted,
  currentQuestionIndex,
  showResultModal,
  showCompleteModal,
  isCorrect,
  score,
  gamificationResults,
  continueBtn,
  test,
  progress,
  currentItem,
  startTestWithMode,
  handleContinue,
  handleRestart
} = useMathTest({
  createTest: createComparisonTest,
  analyzeError: analyzeError,
  testType: 'comparaison',
  isComparison: true
})

// Gérer la touche Enter pour continuer
function handleKeyDown(event) {
  if (event.key === 'Enter' && showResultModal.value) {
    handleContinue()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// Gérer la réponse de comparaison (spécifique à ce composant)
function handleAnswer(answer) {
  if (!['<', '=', '>'].includes(answer)) {
    return
  }

  isCorrect.value = answer === currentItem.value.correctAnswer

  test.value.items[currentQuestionIndex.value].userAnswer = answer
  test.value.items[currentQuestionIndex.value].isCorrect = isCorrect.value

  if (!isCorrect.value) {
    const analysis = analyzeError(currentItem.value, answer)
    test.value.items[currentQuestionIndex.value].errorAnalysis = analysis
  }

  playSound('click')
  handleContinue()
}


</script>
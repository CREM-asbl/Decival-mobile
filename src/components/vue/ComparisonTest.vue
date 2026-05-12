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
        <div class="text-center mb-8">
          <div class="text-4xl font-bold mb-6 flex items-center justify-center gap-4 dark:text-white">
            <span class="transition-all duration-300 hover:scale-110">{{ currentItem.firstNumberDisplay }}</span>
            <span class="text-3xl transition-all duration-300 font-mono text-accent">
              ?
            </span>
            <span class="transition-all duration-300 hover:scale-110">{{ currentItem.secondNumberDisplay }}</span>
          </div>
        </div>

        <div class="flex flex-col items-center gap-6">
          <div class="flex justify-center gap-4">
            <button type="button" @click="handleAnswer('<')"
              class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md flex items-center justify-center transition-all duration-300 bg-accent text-white hover:bg-accent-hover hover:scale-105 active:scale-95"
              aria-label="Plus petit que">
              &lt;
            </button>
            <button type="button" @click="handleAnswer('=')"
              class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md flex items-center justify-center transition-all duration-300 bg-accent text-white hover:bg-accent-hover hover:scale-105 active:scale-95"
              aria-label="Égal à">
              =
            </button>
            <button type="button" @click="handleAnswer('>')"
              class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md flex items-center justify-center transition-all duration-300 bg-accent text-white hover:bg-accent-hover hover:scale-105 active:scale-95"
              aria-label="Plus grand que">
              &gt;
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
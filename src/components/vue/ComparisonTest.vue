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
            <span class="transition-all duration-300 hover:scale-110">{{ currentItem.firstNumberDisplay || formatNumber(currentItem.firstNumber) }}</span>
            <span class="text-3xl transition-all duration-300 font-mono" 
              :class="showResultModal ? (isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : 'text-accent'">
              {{ showResultModal ? currentItem.userAnswer : '?' }}
            </span>
            <span class="transition-all duration-300 hover:scale-110">{{ currentItem.secondNumberDisplay || formatNumber(currentItem.secondNumber) }}</span>
          </div>
        </div>

        <div class="flex flex-col items-center gap-6">
          <div class="flex justify-center gap-4">
            <button type="button" @click="() => !showResultModal && handleAnswer('<')"
              :disabled="showResultModal"
              class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md flex items-center justify-center transition-all duration-300"
              :class="[
                showResultModal
                  ? (currentItem.userAnswer === '<'
                    ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                    : (currentItem.correctAnswer === '<' ? 'border-2 border-green-500 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'))
                  : 'bg-accent text-white hover:bg-accent-hover hover:scale-105 active:scale-95'
              ]"
              aria-label="Plus petit que">
              &lt;
            </button>
            <button type="button" @click="() => !showResultModal && handleAnswer('=')"
              :disabled="showResultModal"
              class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md flex items-center justify-center transition-all duration-300"
              :class="[
                showResultModal
                  ? (currentItem.userAnswer === '='
                    ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                    : (currentItem.correctAnswer === '=' ? 'border-2 border-green-500 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'))
                  : 'bg-accent text-white hover:bg-accent-hover hover:scale-105 active:scale-95'
              ]"
              aria-label="Égal à">
              =
            </button>
            <button type="button" @click="() => !showResultModal && handleAnswer('>')"
              :disabled="showResultModal"
              class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md flex items-center justify-center transition-all duration-300"
              :class="[
                showResultModal
                  ? (currentItem.userAnswer === '>'
                    ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                    : (currentItem.correctAnswer === '>' ? 'border-2 border-green-500 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'))
                  : 'bg-accent text-white hover:bg-accent-hover hover:scale-105 active:scale-95'
              ]"
              aria-label="Plus grand que">
              &gt;
            </button>
          </div>

          <!-- Inline Feedback & Continue Button -->
          <div v-if="showResultModal" class="flex flex-col items-center gap-4 w-full animate-fade-in">
            <MrComma :variant="isCorrect ? 'happy' : 'confused'" animate />
            <p v-if="!isCorrect" class="text-red-600 dark:text-red-400 font-medium text-center">
              La bonne réponse était : <span class="font-bold underline">{{ currentItem.firstNumberDisplay || formatNumber(currentItem.firstNumber) }} {{ currentItem.correctAnswer }} {{ currentItem.secondNumberDisplay || formatNumber(currentItem.secondNumber) }}</span>
            </p>
            <button ref="continueBtn" @click="handleContinue" type="button"
              class="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent w-full max-w-xs transition-colors">
              Continuer
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
  formatNumber,
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

  playSound(isCorrect.value ? 'correct' : 'incorrect')
  showResultModal.value = true

  nextTick(() => {
    continueBtn.value?.focus()
  })
}
</script>
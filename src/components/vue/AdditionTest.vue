<template>
  <div class="container mx-auto px-4 py-8 mt-16">
    <!-- Mode selector -->
    <TestModeSelector
      v-if="!testStarted"
      testType="addition"
      @modeSelected="startTestWithMode"
    />

    <div v-if="testStarted" class="mb-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Question {{ currentQuestionIndex + 1 }}/{{ test.items.length }}
        </div>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2">
              <div class="bg-accent h-4 rounded-full transition-all duration-300 @media (prefers-reduced-motion: reduce) { transition: none; }" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

        <div v-if="testStarted" class="mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg mx-auto border border-transparent dark:border-gray-700">
        <div class="text-center mb-8">
          <div class="text-4xl font-bold mb-6 flex items-center justify-center gap-4 dark:text-white">
            <span>{{ formatNumber(currentItem.firstNumber) }}</span>
            <span class="text-accent">+</span>
            <span>{{ formatNumber(currentItem.secondNumber) }}</span>
          </div>
                <form @submit.prevent="handleSubmit" class="w-full max-w-xs mx-auto">
                      <label for="addition-answer" class="sr-only">Réponse à l'addition</label>
                      <input ref="answerInput" id="addition-answer" v-model="answer" type="text" required
                          :step="inputStep"
                          class="w-full px-4 py-2 rounded-md border text-center text-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-300 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                          :inputmode="test.mode === 'decimal' ? 'decimal' : 'numeric'" />
                        <small v-if="test.mode === 'decimal'" class="text-gray-500 dark:text-gray-400 text-center">Utilisez une virgule (,) comme séparateur décimal</small>
                      </form>
        </div>

        <div class="flex flex-col items-center gap-4">
                <button type="submit" form="addition-form"
                      class="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform active:scale-95 @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
            Suivant
          </button>
        </div>
      </div>
        </div>

    <!-- Modal de fin de test -->
    <TestCompleteModal
      :show="showCompleteModal"
      :score="score"
      :gamificationResults="gamificationResults"
      testType="addition"
      @restart="handleRestart"
    />
  </div>
</template>

<script setup>
import { analyzeError, createAdditionTest } from '../../logic/additionLogic'
import { useMathTest } from '../../composables/useMathTest'
import TestCompleteModal from '../tests/TestCompleteModal.vue'
import TestModeSelector from '../tests/TestModeSelector.vue'
import MrComma from './MrComma.vue'

const {
  testStarted,
  currentQuestionIndex,
  answer,
  showResultModal,
  showCompleteModal,
  isCorrect,
  score,
  gamificationResults,
  continueBtn,
  answerInput,
  test,
  progress,
  inputStep,
  currentItem,
  startTestWithMode,
  handleSubmit,
  formatNumber,
  handleContinue,
  handleRestart
} = useMathTest({
  createTest: createAdditionTest,
  analyzeError: analyzeError,
  testType: 'addition',
  isComparison: false
})
</script>
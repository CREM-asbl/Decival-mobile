<template>
  <div class="container mx-auto px-4 py-8 mt-16">
    <!-- Mode selector -->
    <TestModeSelector
      v-if="!testStarted"
      testType="subtraction"
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

    <form v-if="testStarted" @submit.prevent="handleSubmit" class="mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg mx-auto border border-transparent dark:border-gray-700">
        <div class="text-center mb-8">
          <div class="text-4xl font-bold mb-6 flex items-center justify-center gap-4 dark:text-white">
            <span>{{ formatNumber(currentItem.firstNumber) }}</span>
            <span class="text-accent">−</span>
            <span>{{ formatNumber(currentItem.secondNumber) }}</span>
          </div>

          <div class="w-full max-w-xs mx-auto">
            <div class="flex flex-col gap-1">
              <input ref="answerInput" v-model="answer" type="text" required
                :step="inputStep"
                :disabled="showResultModal"
                class="w-full px-4 py-2 rounded-md border text-center text-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-300 bg-white dark:bg-gray-700 dark:text-white"
                :class="[
                  showResultModal
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'border-gray-300 dark:border-gray-600'
                ]"
                :inputmode="test.mode === 'decimal' ? 'decimal' : 'numeric'" />
              <small v-if="test.mode === 'decimal' && !showResultModal" class="text-gray-500 dark:text-gray-400 text-center">Utilisez une virgule (,) comme séparateur décimal</small>
              
              <!-- Inline Feedback -->
              <div v-if="showResultModal" class="mt-2 text-center animate-fade-in flex flex-col items-center gap-2">
                <MrComma :variant="isCorrect ? 'happy' : 'confused'" animate />
                <p v-if="!isCorrect" class="text-red-600 dark:text-red-400 font-medium">
                  La bonne réponse était : <span class="font-bold underline">{{ formatNumber(currentItem.correctAnswer) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <button v-if="!showResultModal" type="submit"
            class="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
            Suivant
          </button>
          <button v-else ref="continueBtn" @click="handleContinue" type="submit"
            class="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
            Continuer
          </button>
        </div>
      </div>
    </form>


    <!-- Utilisation du composant réutilisable pour la modal de fin de test -->
    <TestCompleteModal
      :show="showCompleteModal"
      :score="score"
      :gamificationResults="gamificationResults"
      testType="soustraction"
      @restart="handleRestart"
    />
  </div>
</template>

<script setup>
import { analyzeError, createSubtractionTest } from '../../logic/subtractionLogic'
import { useMathTest } from '../../composables/useMathTest'
import TestCompleteModal from '../tests/TestCompleteModal.vue'
import TestModeSelector from '../tests/TestModeSelector.vue'
import MrComma from './MrComma.vue'

// Utiliser le composable avec la configuration spécifique à la soustraction
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
  createTest: createSubtractionTest,
  analyzeError: analyzeError,
  testType: 'soustraction',
  isComparison: false
})
</script>
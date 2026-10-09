<template>
  <div class="container mx-auto px-4 py-8 mt-16">
    <!-- Mode selector -->
    <TestModeSelector
      v-if="!testStarted"
      :testType="testType"
      @modeSelected="startTestWithMode"
    />

    <div v-if="testStarted" class="mb-6 sticky top-[120px] z-30 bg-gray-50/95 dark:bg-gray-900/95 py-2">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Question {{ currentQuestionIndex + 1 }}/{{ test.items.length }}
        </div>
        <div class="text-sm font-bold text-accent" aria-hidden="true">
          {{ Math.round(progress) }} %
        </div>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2" role="progressbar" :aria-valuenow="Math.round(progress)" aria-valuemin="0" aria-valuemax="100" aria-label="Progression du test" aria-live="polite">
              <div class="bg-accent h-4 rounded-full transition-all duration-300 motion-reduce:transition-none" :style="{ width: `${progress}%` }"></div>
      </div>
      <p class="text-sm font-medium text-accent mt-2 text-center" aria-live="polite">{{ inTestMessage }}</p>
    </div>

    <div v-if="testStarted" class="mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg mx-auto border border-transparent dark:border-gray-700">
        <!-- Operation-specific content slot -->
        <slot name="question" :currentItem="currentItem" :formatNumber="formatNumber" :test="test" :answer="answer" :inputStep="inputStep" :answerInput="answerInput" :handleSubmit="handleSubmit" :isComparison="isComparison" :handleComparisonSubmit="handleComparisonSubmit" :handleContinue="handleContinueWithFocusReset">
          <!-- Default fallback for non-comparison tests -->
          <div v-if="!isComparison" class="text-center mb-8">
            <div class="text-4xl font-bold mb-6 flex items-center justify-center gap-4 dark:text-white">
              <span>{{ formatNumber(currentItem.firstNumber) }}</span>
              <span class="text-accent">{{ operationSymbol }}</span>
              <span>{{ formatNumber(currentItem.secondNumber) }}</span>
            </div>
            <form :id="`${testType}-form`" @submit.prevent="handleSubmit" class="w-full max-w-xs mx-auto">
              <label :for="`${testType}-answer`" class="sr-only">{{ answerLabel }}</label>
              <input ref="answerInput" :id="`${testType}-answer`" v-model="answer" type="text" required
                  :step="inputStep"
                  class="w-full px-4 py-2 rounded-md border text-center text-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors duration-300 bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  :inputmode="test.mode === 'decimal' ? 'decimal' : 'numeric'" />
              <small v-if="test.mode === 'decimal'" class="text-gray-500 dark:text-gray-400 text-center block mt-1">Utilisez une virgule (,) comme séparateur décimal</small>
            </form>
          </div>
          
          <!-- Default fallback for comparison test -->
          <div v-else class="flex flex-col items-center gap-8 py-4">
            <p class="text-gray-600 dark:text-gray-400 text-center text-lg mb-2">Sélectionne le nombre le plus grand, ou le signe égal s'ils sont identiques :</p>
            <div :key="currentQuestionIndex" class="flex items-center justify-center gap-2 sm:gap-6 w-full max-w-md mx-auto">
              <button
                type="button"
                @click="handleComparisonSubmit('>')"
                              class="flex-1 py-6 px-2 sm:px-4 text-3xl sm:text-4xl font-bold rounded-xl transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-gray-600 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/30"
                aria-label="Sélectionner le premier nombre"
              >
                {{ currentItem.firstNumberDisplay }}
              </button>

              <button
                type="button"
                @click="handleComparisonSubmit('=')"
                              class="w-14 h-14 sm:w-16 sm:h-16 shrink-0 text-3xl font-mono font-bold rounded-full flex items-center justify-center transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-accent/30"
                aria-label="Ils sont égaux"
              >
                =
              </button>

              <button
                type="button"
                @click="handleComparisonSubmit('<')"
                              class="flex-1 py-6 px-2 sm:px-4 text-3xl sm:text-4xl font-bold rounded-xl transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-accent dark:hover:border-accent hover:bg-white dark:hover:bg-gray-600 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-accent/30"
                aria-label="Sélectionner le deuxième nombre"
              >
                {{ currentItem.secondNumberDisplay }}
              </button>
            </div>
          </div>
        </slot>

        <!-- Submit button for non-comparison tests -->
        <div v-if="!isComparison" class="flex flex-col items-center gap-4 mt-6">
          <button type="submit" :form="`${testType}-form`"
                          class="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform active:scale-95 motion-reduce:transition-none motion-reduce:transform-none">
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
      :testType="testTypeLabel"
      @restart="handleRestart"
    />
  </div>
</template>

<script setup lang="ts">
import { useMathTest } from '../../composables/useMathTest'
import { getInTestEncouragement } from '../../logic/progressLogic'
import { computed } from 'vue'
import { playSound } from '../../stores/soundStore'
import { clearActiveElementFocus } from '../../utils/clearActiveElementFocus'
import TestCompleteModal from '../tests/TestCompleteModal.vue'
import TestModeSelector from '../tests/TestModeSelector.vue'

const props = defineProps({
  testType: {
    type: String,
    required: true,
    validator: (value) => ['addition', 'subtraction', 'multiplication', 'comparison'].includes(value)
  },
  createTest: {
    type: Function,
    required: true
  },
  analyzeError: {
    type: Function,
    required: true
  },
  testTypeLabel: {
    type: String,
    required: true
  },
  operationSymbol: {
    type: String,
    required: true
  },
  answerLabel: {
    type: String,
    default: 'Réponse'
  },
  isComparison: {
    type: Boolean,
    default: false
  }
})

const { 
  testStarted,
  currentQuestionIndex,
  answer,
  showResultModal,
  showCompleteModal,
  isCorrect,
  score,
  gamificationResults,
  testMode,
  errorAnalysis,
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
  createTest: props.createTest,
  analyzeError: props.analyzeError,
  testType: props.testType,
  isComparison: props.isComparison
})

// Expose handleComparisonSubmit for comparison tests
const inTestMessage = computed(() =>
  getInTestEncouragement(currentQuestionIndex.value, test.value.items.length)
)

const handleComparisonSubmit = (answer: string) => {
  if (!['<', '=', '>'].includes(answer)) return

  isCorrect.value = answer === currentItem.value?.correctAnswer

  test.value.items[currentQuestionIndex.value].userAnswer = answer
  test.value.items[currentQuestionIndex.value].isCorrect = isCorrect.value

  if (!isCorrect.value) {
    const analysis = props.analyzeError(currentItem.value, answer)
    test.value.items[currentQuestionIndex.value].errorAnalysis = analysis
  }

  playSound('click')
  handleContinueWithFocusReset()
}

function handleContinueWithFocusReset() {
  clearActiveElementFocus()
  handleContinue()
}
</script>
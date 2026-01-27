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


    <!-- Utilisation du composant réutilisable pour la modal de fin de test -->
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { analyzeError, createComparisonTest } from '../../logic/comparisonLogic'
import { playSound } from '../../stores/soundStore'
import { completeTest, currentTest } from '../../stores/testStore'
import TestCompleteModal from '../tests/TestCompleteModal.vue'
import TestModeSelector from '../tests/TestModeSelector.vue'
import MrComma from './MrComma.vue'

// État local
const testStarted = ref(false)
const currentQuestionIndex = ref(0)
const showResultModal = ref(false)
const showCompleteModal = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const gamificationResults = ref(null)
const testMode = ref('integer')
const errorAnalysis = ref(null) // Pour stocker l'analyse de l'erreur
const continueBtn = ref(null) // Référence pour le bouton continuer

// Gérer la touche Enter pour continuer
function handleKeyDown(event) {
  if (event.key === 'Enter' && showResultModal.value) {
    handleContinue();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// Récupérer ou créer un test
const test = ref(null)

// Démarrer un test avec le mode sélectionné
function startTestWithMode(mode) {
  testMode.value = mode
  test.value = createComparisonTest(5, mode)
  currentTest.set(test.value)
  testStarted.value = true
}

// Calculer la progression
const progress = computed(() => ((currentQuestionIndex.value + 1) / test.value?.items.length) * 100)

// Obtenir l'item courant
const currentItem = computed(() => test.value?.items[currentQuestionIndex.value])

// Formater un nombre pour l'affichage (afficher les décimaux de manière adaptée)
function formatNumber(number) {
  if (test.value?.mode === 'decimal') {
    // Déterminer le nombre de décimales nécessaires
    const numberStr = number.toString();
    const decimalPart = numberStr.includes('.') ? numberStr.split('.')[1] : '';

    // Si le nombre a un type spécifique (pour les exercices proportionnels)
    if (currentItem.value && currentItem.value.type !== undefined) {
      // Pour les comparaisons, les types impliquent différentes précisions
      const type = currentItem.value.type;

      // Types 0, 6 = 1 décimale, type 1, 2, 3, 4, 5 peuvent avoir 2 décimales
      const precision = (type === 0 || type === 6) ? 1 :
                       ((type >= 1 && type <= 5) ? 2 : 1);

      return number.toFixed(precision).replace('.', ',');
    }
    // Si pas de type spécifique mais le nombre a des décimales significatives
    else if (decimalPart && decimalPart.length > 1 && parseFloat('0.' + decimalPart) !== 0) {
      // Conserver les décimales significatives (jusqu'à 2 maximum)
      return number.toFixed(Math.min(decimalPart.length, 2)).replace('.', ',');
    }
    // Par défaut, afficher au moins une décimale pour les nombres décimaux
    else {
      return number.toFixed(1).replace('.', ',');
    }
  }
  return number;
}

// Gérer la réponse
function handleAnswer(answer) {
  // Vérifier que la réponse est valide (doit être l'un des symboles de comparaison)
  if (!['<', '=', '>'].includes(answer)) {
    return; // Ne rien faire si la réponse est invalide
  }

  // Vérifier si la réponse est correcte
  isCorrect.value = answer === currentItem.value.correctAnswer;

  // Mettre à jour l'item avec la réponse
  test.value.items[currentQuestionIndex.value].userAnswer = answer;
  test.value.items[currentQuestionIndex.value].isCorrect = isCorrect.value;

  // Analyser l'erreur si la réponse est incorrecte
  if (!isCorrect.value) {
    const analysis = analyzeError(currentItem.value, answer);
    // Stocker l'analyse dans l'item au lieu de l'afficher directement
    test.value.items[currentQuestionIndex.value].errorAnalysis = analysis;
  }

  // Jouer le son approprié
  playSound(isCorrect.value ? 'correct' : 'incorrect');

  // Afficher le résultat
  showResultModal.value = true;
  
  // Donner le focus au bouton continuer pour permettre de valider avec Enter
  nextTick(() => {
    continueBtn.value?.focus();
  });
}

// Gérer le clic sur Continuer
function handleContinue() {
  showResultModal.value = false

  if (currentQuestionIndex.value + 1 >= test.value.items.length) {
    // Calculer le score final
    const correctAnswers = test.value.items.filter(item => item.isCorrect).length
    score.value = Math.round((correctAnswers / test.value.items.length) * 100)

    // Terminer le test
    const results = completeTest(test.value)
    gamificationResults.value = results

    // Afficher la modal de fin
    showCompleteModal.value = true
  } else {
    // Passer à la question suivante
    currentQuestionIndex.value++
  }
}

// Gérer le redémarrage
function handleRestart() {
  // Créer un nouveau test avec le même mode
  const newTest = createComparisonTest(5, testMode.value)
  test.value = newTest
  currentTest.set(newTest)

  // Réinitialiser l'état local
  currentQuestionIndex.value = 0
  showCompleteModal.value = false
  score.value = 0
}
</script>
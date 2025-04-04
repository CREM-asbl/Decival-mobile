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
        <div class="text-sm text-gray-600">
          Question {{ currentQuestionIndex + 1 }}/{{ test.items.length }}
        </div>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div class="bg-accent h-2 rounded-full" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <form v-if="testStarted" @submit.prevent class="mt-8">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
        <div class="text-center mb-8">
          <div class="text-4xl font-bold mb-6 flex items-center justify-center gap-4">
            <span class="transition-all duration-300 hover:scale-110">{{ formatNumber(currentItem.firstNumber) }}</span>
            <span class="text-accent text-3xl" aria-hidden="true">?</span>
            <span class="transition-all duration-300 hover:scale-110">{{ formatNumber(currentItem.secondNumber) }}</span>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button type="submit" @click="() => handleAnswer('<')"
            class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md bg-accent text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="Plus petit que">
            &lt;
          </button>
          <button type="submit" @click="() => handleAnswer('=')"
            class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md bg-accent text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="Égal à">
            =
          </button>
          <button type="submit" @click="() => handleAnswer('>')"
            class="w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl rounded-md bg-accent text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="Plus grand que">
            &gt;
          </button>
        </div>
      </div>
    </form>

    <div v-if="showResultModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl p-6">
        <div class="text-center py-4">
          <p class="text-xl mb-2">
            Votre réponse est <span :class="isCorrect ? 'text-green-600' : 'text-red-600'">{{ isCorrect ? 'correcte !' :
              'incorrecte' }}</span>
          </p>
          <p class="text-gray-600 mb-2">
            La bonne réponse était : <span class="font-semibold">{{ currentItem.firstNumber }} {{ currentItem.correctAnswer }} {{ currentItem.secondNumber }}</span>
          </p>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button @click="handleContinue" class="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover">
            Continuer
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCompleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl p-6">
        <div class="text-center py-4">
          <h3 class="text-xl font-bold mb-4">Félicitations !</h3>
          <p class="mb-2">Vous avez terminé le test de comparaison.</p>
          <div class="text-lg">
            Score : <span class="font-bold text-accent">{{ score }}</span>%
          </div>
          <p class="mt-4 text-sm text-gray-600">
            Consultez vos progrès dans l'onglet "Progrès"
          </p>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <a href="/tests" class="no-underline">
            <button class="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Fermer
            </button>
          </a>
          <button @click="handleRestart" class="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover">
            Recommencer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { analyzeError, createComparisonTest } from '../../logic/comparisonLogic'
import { playSound } from '../../stores/soundStore'
import { completeTest, currentTest } from '../../stores/testStore'
import TestModeSelector from '../tests/TestModeSelector.vue'

// État local
const testStarted = ref(false)
const currentQuestionIndex = ref(0)
const showResultModal = ref(false)
const showCompleteModal = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const testMode = ref('integer')
const errorAnalysis = ref(null) // Pour stocker l'analyse de l'erreur

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

      return number.toFixed(precision);
    }
    // Si pas de type spécifique mais le nombre a des décimales significatives
    else if (decimalPart && decimalPart.length > 1 && parseFloat('0.' + decimalPart) !== 0) {
      // Conserver les décimales significatives (jusqu'à 2 maximum)
      return number.toFixed(Math.min(decimalPart.length, 2));
    }
    // Par défaut, afficher au moins une décimale pour les nombres décimaux
    else {
      return number.toFixed(1);
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

  // Afficher la modal de résultat
  showResultModal.value = true;
}

// Gérer le clic sur Continuer
function handleContinue() {
  showResultModal.value = false

  if (currentQuestionIndex.value + 1 >= test.value.items.length) {
    // Calculer le score final
    const correctAnswers = test.value.items.filter(item => item.isCorrect).length
    score.value = Math.round((correctAnswers / test.value.items.length) * 100)

    // Terminer le test
    completeTest(test.value)

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
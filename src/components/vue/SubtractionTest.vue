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
      testType="soustraction"
      @restart="handleRestart"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { analyzeError, createSubtractionTest } from '../../logic/subtractionLogic'
import { playSound } from '../../stores/soundStore'
import { completeTest, currentTest } from '../../stores/testStore'
import TestCompleteModal from '../tests/TestCompleteModal.vue'
import TestModeSelector from '../tests/TestModeSelector.vue'
import MrComma from './MrComma.vue'

// État local
const testStarted = ref(false)
const currentQuestionIndex = ref(0)
const answer = ref('')
const showResultModal = ref(false)
const showCompleteModal = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const testMode = ref('integer')
const errorAnalysis = ref(null) // Pour stocker l'analyse de l'erreur
const continueBtn = ref(null) // Référence pour le bouton continuer
const answerInput = ref(null) // Référence pour le champ de saisie

// Récupérer ou créer un test
const test = ref(null)

// Helper pour donner le focus au champ de saisie
function focusInput() {
  nextTick(() => {
    answerInput.value?.focus();
  });
}

// Démarrer un test avec le mode sélectionné
function startTestWithMode(mode) {
  testMode.value = mode
  test.value = createSubtractionTest(5, mode)
  currentTest.set(test.value)
  testStarted.value = true
  focusInput()
}

// Calculer la progression
const progress = computed(() => ((currentQuestionIndex.value + 1) / test.value?.items.length) * 100)

// Calculer le pas d'incrément pour l'input
const inputStep = computed(() => {
  // Utiliser un step uniforme pour tous les tests décimaux (0.01) pour ne pas induire la réponse
  // Cela permet aux utilisateurs de saisir des valeurs avec jusqu'à 2 décimales dans tous les cas
  if (test.value?.mode === 'decimal') {
    return 0.01;
  }
  // Par défaut pour les entiers
  return 1;
});

// Obtenir l'item courant
const currentItem = computed(() => test.value?.items[currentQuestionIndex.value])

// Gérer la soumission du formulaire
function handleSubmit() {
  // Si le résultat est déjà affiché, le Enter doit continuer
  if (showResultModal.value) {
    handleContinue();
    return;
  }

  // Vérifier que la réponse n'est pas vide
  if (answer.value === null || answer.value === undefined || answer.value === '') {
    return; // Ne rien faire si le champ est vide
  }

  // Convertir et valider la réponse
  let userAnswer;

  if (test.value.mode === 'decimal') {
    // Convertir en string pour la validation du format si ce n'est pas déjà une string
    // On remplace la virgule par un point pour le traitement interne
    const answerStr = String(answer.value).replace(',', '.');

    // Vérifier que c'est un nombre décimal valide
    if (!/^-?\d+(\.\d+)?$/.test(answerStr)) {
      // Format invalide, ne pas soumettre
      return;
    }
    userAnswer = parseFloat(answerStr);

    // Vérifier que c'est dans la plage acceptable
    if (isNaN(userAnswer) || userAnswer < 0 || userAnswer > 1000) {
      return;
    }

    // Pour les décimaux, on utilise une précision de 1 décimale pour la soustraction
    const expectedAnswer = parseFloat(currentItem.value.correctAnswer.toFixed(1));
    const normalizedUserAnswer = parseFloat(userAnswer.toFixed(1));
    isCorrect.value = normalizedUserAnswer === expectedAnswer;
  } else {
    // Convertir en string pour la validation du format si ce n'est pas déjà une string
    const answerStr = String(answer.value);

    // Vérifier que c'est un entier valide
    if (!/^-?\d+$/.test(answerStr)) {
      // Format invalide, ne pas soumettre
      return;
    }
    userAnswer = parseInt(answerStr);

    // Vérifier que c'est dans la plage acceptable
    if (isNaN(userAnswer) || userAnswer < 0 || userAnswer > 1000) {
      return;
    }

    // Pour les entiers, comparaison simple
    isCorrect.value = userAnswer === currentItem.value.correctAnswer;
  }

  // Mettre à jour l'item avec la réponse
  test.value.items[currentQuestionIndex.value].userAnswer = userAnswer;
  test.value.items[currentQuestionIndex.value].isCorrect = isCorrect.value;

  // Analyser l'erreur si la réponse est incorrecte
  if (!isCorrect.value) {
    const analysis = analyzeError(currentItem.value, userAnswer);
    // Stocker l'analyse dans l'item au lieu de l'afficher directement
    test.value.items[currentQuestionIndex.value].errorAnalysis = analysis;
  } else {
    errorAnalysis.value = null;
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

// Formater un nombre pour l'affichage (afficher les décimaux de manière adaptée)
function formatNumber(number) {
  if (test.value?.mode === 'decimal') {
    // Déterminer le nombre de décimales nécessaires
    const numberStr = number.toString();
    const decimalPart = numberStr.includes('.') ? numberStr.split('.')[1] : '';

    // Si le nombre a des décimales significatives
    if (decimalPart && decimalPart.length > 1 && parseFloat('0.' + decimalPart) !== 0) {
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

// Gérer le clic sur Continuer
function handleContinue() {
  showResultModal.value = false
  answer.value = ''

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
    focusInput()
  }
}

// Gérer le redémarrage
function handleRestart() {
  // Créer un nouveau test avec le même mode
  const newTest = createSubtractionTest(5, testMode.value)
  test.value = newTest
  currentTest.set(newTest)

  // Réinitialiser l'état local
  currentQuestionIndex.value = 0
  answer.value = ''
  showCompleteModal.value = false
  score.value = 0
  focusInput()
}
</script>
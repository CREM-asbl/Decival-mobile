<template>
  <div class="container mx-auto px-4 py-8 mt-16">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Question {{ currentQuestionIndex + 1 }}/{{ test.items.length }}
        </div>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div class="bg-accent h-2 rounded-full" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="mt-8">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
        <div class="text-center mb-8">
          <div class="text-4xl font-bold mb-6 flex items-center justify-center gap-4">
            <span>{{ currentItem.firstNumber.toFixed(1) }}</span>
            <span class="text-accent">+</span>
            <span>{{ currentItem.secondNumber.toFixed(1) }}</span>
          </div>
          <MrComma :variant="mrCommaVariant" :animate="showMrCommaAnimation" class="mx-auto mb-4" />
          <div class="w-full max-w-xs mx-auto">
            <div class="flex flex-col gap-1">
              <input v-model="answer" type="number" step="0.1" required min="0" max="999"
                class="w-full px-4 py-2 rounded-md border border-gray-300 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                inputmode="decimal" />
              <small class="text-gray-500 text-center">Utilisez un point (.) comme séparateur décimal</small>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button type="submit"
            class="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
            Suivant
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
          <p class="text-gray-600">
            La bonne réponse était : <span class="font-semibold">{{ currentItem.correctAnswer.toFixed(1) }}</span>
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
          <p class="mb-2">Vous avez terminé le test de nombres décimaux.</p>
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
import { computed, ref } from 'vue';
import { createDecimalTest } from '../../logic/decimalLogic';
import { playSound } from '../../stores/soundStore';
import { completeTest, currentTest } from '../../stores/testStore';
import MrComma from './MrComma.vue';

// État local
const currentQuestionIndex = ref(0);
const answer = ref('');
const showResultModal = ref(false);
const showCompleteModal = ref(false);
const isCorrect = ref(false);
const score = ref(0);
const mrCommaVariant = ref('default');
const showMrCommaAnimation = ref(false);

// Récupérer ou créer un test
const test = currentTest.get() || createDecimalTest(5);

// Calculer la progression
const progress = computed(() => ((currentQuestionIndex.value + 1) / test.items.length) * 100);

// Obtenir l'item courant
const currentItem = computed(() => test.items[currentQuestionIndex.value]);

// Gérer la soumission du formulaire
function handleSubmit() {
  const userAnswer = parseFloat(answer.value);

  // Arrondir à une décimale pour la comparaison
  const expectedAnswer = parseFloat(currentItem.value.correctAnswer.toFixed(1));
  const normalizedUserAnswer = parseFloat(userAnswer.toFixed(1));

  isCorrect.value = normalizedUserAnswer === expectedAnswer;

  // Mettre à jour l'item avec la réponse
  test.items[currentQuestionIndex.value].userAnswer = userAnswer;
  test.items[currentQuestionIndex.value].isCorrect = isCorrect.value;

  // Animer Mr Comma en fonction du résultat
  mrCommaVariant.value = isCorrect.value ? 'happy' : 'confused';
  showMrCommaAnimation.value = true;

  // Jouer le son approprié
  playSound(isCorrect.value ? 'correct' : 'incorrect');

  // Afficher la modal de résultat
  showResultModal.value = true;
}

// Gérer le clic sur Continuer
function handleContinue() {
  showResultModal.value = false;
  answer.value = '';
  showMrCommaAnimation.value = false;
  mrCommaVariant.value = 'default';

  if (currentQuestionIndex.value + 1 >= test.items.length) {
    // Calculer le score final
    const correctAnswers = test.items.filter(item => item.isCorrect).length;
    score.value = Math.round((correctAnswers / test.items.length) * 100);

    // Terminer le test
    completeTest(test);

    // Afficher la modal de fin
    showCompleteModal.value = true;
  } else {
    // Passer à la question suivante
    currentQuestionIndex.value++;
  }
}

// Gérer le redémarrage
function handleRestart() {
  // Créer un nouveau test
  const newTest = createDecimalTest(5);
  currentTest.set(newTest);

  // Réinitialiser l'état local
  currentQuestionIndex.value = 0;
  answer.value = '';
  showCompleteModal.value = false;
  score.value = 0;
  mrCommaVariant.value = 'default';
  showMrCommaAnimation.value = false;
}
</script>
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
            <span>{{ currentItem.firstNumber }}</span>
            <span class="text-accent">×</span>
            <span>{{ currentItem.secondNumber }}</span>
          </div>

          <div class="w-full max-w-xs mx-auto">
            <div class="flex flex-col gap-1">
              <input v-model="answer" type="number" required min="0" max="999"
                class="w-full px-4 py-2 rounded-md border border-gray-300 text-center text-2xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                inputmode="numeric" pattern="[0-9]*" />
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
            La bonne réponse était : <span class="font-semibold">{{ currentItem.correctAnswer }}</span>
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
          <p class="mb-2">Vous avez terminé le test de multiplication.</p>
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
import { ref, computed } from 'vue'
import { currentTest, completeTest } from '../../stores/testStore'
import { createMultiplicationTest } from '../../logic/multiplicationLogic'
import { playSound } from '../../stores/soundStore'

// État local
const currentQuestionIndex = ref(0)
const answer = ref('')
const showResultModal = ref(false)
const showCompleteModal = ref(false)
const isCorrect = ref(false)
const score = ref(0)

// Récupérer ou créer un test
const test = currentTest.get() || createMultiplicationTest(5)

// Calculer la progression
const progress = computed(() => ((currentQuestionIndex.value + 1) / test.items.length) * 100)

// Obtenir l'item courant
const currentItem = computed(() => test.items[currentQuestionIndex.value])

// Gérer la soumission du formulaire
function handleSubmit() {
  const userAnswer = parseInt(answer.value)
  isCorrect.value = userAnswer === currentItem.value.correctAnswer

  // Mettre à jour l'item avec la réponse
  test.items[currentQuestionIndex.value].userAnswer = userAnswer
  test.items[currentQuestionIndex.value].isCorrect = isCorrect.value

  // Jouer le son approprié
  playSound(isCorrect.value ? 'correct' : 'incorrect')

  // Afficher la modal de résultat
  showResultModal.value = true
}

// Gérer le clic sur Continuer
function handleContinue() {
  showResultModal.value = false
  answer.value = ''

  if (currentQuestionIndex.value + 1 >= test.items.length) {
    // Calculer le score final
    const correctAnswers = test.items.filter(item => item.isCorrect).length
    score.value = Math.round((correctAnswers / test.items.length) * 100)

    // Terminer le test
    completeTest(test)

    // Afficher la modal de fin
    showCompleteModal.value = true
  } else {
    // Passer à la question suivante
    currentQuestionIndex.value++
  }
}

// Gérer le redémarrage
function handleRestart() {
  // Créer un nouveau test
  const newTest = createMultiplicationTest(5)
  currentTest.set(newTest)

  // Réinitialiser l'état local
  currentQuestionIndex.value = 0
  answer.value = ''
  showCompleteModal.value = false
  score.value = 0
}
</script>
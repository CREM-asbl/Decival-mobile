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
            <span class="transition-all duration-300 hover:scale-110">{{ currentItem.firstNumber }}</span>
            <span class="text-accent text-3xl" aria-hidden="true">?</span>
            <span class="transition-all duration-300 hover:scale-110">{{ currentItem.secondNumber }}</span>
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
import { ref, computed } from 'vue'
import { currentTest, completeTest } from '../../stores/testStore'
import { createComparisonTest } from '../../logic/comparisonLogic'
import { playSound } from '../../stores/soundStore'

// État local
const currentQuestionIndex = ref(0)
const showResultModal = ref(false)
const showCompleteModal = ref(false)
const isCorrect = ref(false)
const score = ref(0)

// Récupérer ou créer un test
const test = currentTest.get() || createComparisonTest(5)

// Calculer la progression
const progress = computed(() => ((currentQuestionIndex.value + 1) / test.items.length) * 100)

// Obtenir l'item courant
const currentItem = computed(() => test.items[currentQuestionIndex.value])

// Gérer la réponse
function handleAnswer(answer) {
  isCorrect.value = answer === currentItem.value.correctAnswer

  // Mettre à jour l'item avec la réponse
  test.items[currentQuestionIndex.value].userAnswer = answer
  test.items[currentQuestionIndex.value].isCorrect = isCorrect.value

  // Jouer le son approprié
  playSound(isCorrect.value ? 'correct' : 'incorrect')

  // Afficher la modal de résultat
  showResultModal.value = true
}

// Gérer le clic sur Continuer
function handleContinue() {
  showResultModal.value = false

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
  const newTest = createComparisonTest(5)
  currentTest.set(newTest)

  // Réinitialiser l'état local
  currentQuestionIndex.value = 0
  showResultModal.value = false
  showCompleteModal.value = false
  score.value = 0
}
</script>
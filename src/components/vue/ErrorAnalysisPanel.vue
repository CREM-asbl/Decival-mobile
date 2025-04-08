<template>
  <div class="error-analysis-panel">
    <h3 class="text-lg font-semibold mb-4">Analyses des erreurs</h3>

    <div v-if="!hasErrorAnalysis" class="text-gray-500 text-center py-4">
      Aucune analyse d'erreur disponible
    </div>

    <div v-else class="space-y-4">
      <div v-for="(test, testIndex) in testsWithErrors" :key="testIndex" class="border rounded-lg p-4">
        <div class="font-semibold mb-2">
          Test {{ testIndex + 1 }} - {{ formatTestType(test.type) }} ({{ formatDate(test.startTime) }})
        </div>

        <div v-for="(item, itemIndex) in getItemsWithErrors(test)" :key="`${testIndex}-${itemIndex}`"
             class="bg-red-50 p-3 mb-2 rounded-md">
          <div class="flex items-start gap-2">
            <div class="text-red-600 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-medium">Exercice {{ itemIndex + 1 }}</div>
              <div class="text-sm mb-2">
                {{ formatQuestion(item, test.type) }}
              </div>
              <div class="text-sm mb-1">
                <span class="text-gray-700">Votre réponse : </span>
                <span class="font-mono">{{ formatAnswer(item.userAnswer, test.type) }}</span>
              </div>
              <div class="text-sm mb-2">
                <span class="text-gray-700">Réponse correcte : </span>
                <span class="font-mono">{{ formatAnswer(item.correctAnswer, test.type) }}</span>
              </div>
              <div v-if="item.errorAnalysis" class="mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                <div class="font-medium text-amber-800">Analyse :</div>
                <div class="text-sm text-amber-700">{{ item.errorAnalysis.feedback }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getRecentTests } from '../../stores/testStore';

// Nombre de tests récents à afficher
const recentTestsLimit = 5;
// Récupérer les tests récents avec des erreurs
const testsWithErrors = computed(() => {
  const recentTests = getRecentTests(recentTestsLimit);
  return recentTests.filter(test =>
    test.items.some(item => !item.isCorrect && item.errorAnalysis)
  );
});

// Vérifier s'il y a des analyses d'erreurs disponibles
const hasErrorAnalysis = computed(() => testsWithErrors.value.length > 0);

// Récupérer les items avec des erreurs pour un test
function getItemsWithErrors(test) {
  return test.items.filter(item => !item.isCorrect && item.errorAnalysis);
}

// Formater le type de test pour l'affichage
function formatTestType(type) {
  const typeMap = {
    'addition': 'Addition',
    'subtraction': 'Soustraction',
    'multiplication': 'Multiplication',
    'comparison': 'Comparaison'
  };
  return typeMap[type] || type;
}

// Formater la date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Formater la question en fonction du type de test
function formatQuestion(item, testType) {
  switch (testType) {
    case 'addition':
      return `${item.firstNumber} + ${item.secondNumber} = ?`;
    case 'subtraction':
      return `${item.firstNumber} - ${item.secondNumber} = ?`;
    case 'multiplication':
      return `${item.firstNumber} × ${item.secondNumber} = ?`;
    case 'comparison':
      return `${item.firstNumber} ? ${item.secondNumber}`;
    default:
      return 'Question non disponible';
  }
}

// Formater la réponse en fonction du type de test
function formatAnswer(answer, testType) {
  if (answer === undefined || answer === null) return 'Non répondu';

  if (testType === 'comparison') {
    // Pour les tests de comparaison, la réponse est un symbole
    return answer;
  } else {
    // Pour les autres tests, la réponse est un nombre
    return typeof answer === 'number' ? answer.toString() : answer;
  }
}
</script>
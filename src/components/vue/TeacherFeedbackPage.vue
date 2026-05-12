<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div class="mb-8 flex items-center justify-between">
      <a href="/progress" class="flex items-center text-accent hover:underline gap-2 font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux progrès
      </a>
      <h1 class="text-2xl font-black dark:text-white uppercase tracking-tight">Feedback Pédagogique</h1>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
      <p class="text-gray-500">Chargement de l'analyse...</p>
    </div>

    <div v-else-if="!test" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 rounded-2xl text-center">
      <div class="text-5xl mb-4">🔍</div>
      <h2 class="text-xl font-bold text-red-800 dark:text-red-400 mb-2">Test non trouvé</h2>
      <p class="text-red-600 dark:text-red-300 mb-6">Nous ne parvenons pas à retrouver les données de ce test.</p>
      <a href="/progress" class="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
        Retourner à la progression
      </a>
    </div>

    <div v-else class="space-y-6">
      <!-- En-tête du test -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex flex-wrap justify-between items-start gap-4 mb-4">
          <div>
            <div class="text-xs font-bold text-accent uppercase tracking-widest mb-1">{{ test.type }}</div>
            <h2 class="text-3xl font-black dark:text-white">{{ getTestTypeName(test.type) }}</h2>
            <p class="text-gray-500 dark:text-gray-400">{{ formatDate(test.startTime) }}</p>
          </div>
          <div class="bg-accent/10 dark:bg-accent/20 px-6 py-3 rounded-2xl text-center border border-accent/20">
            <div class="text-sm font-bold text-accent uppercase tracking-tighter">Score</div>
            <div class="text-4xl font-black text-accent">{{ calculateScore(test) }}%</div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t dark:border-gray-700">
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">Mode</div>
            <div class="font-bold dark:text-white">{{ test.mode === 'decimal' ? 'Décimaux' : 'Entiers' }}</div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">Questions</div>
            <div class="font-bold dark:text-white">{{ test.items.length }}</div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-400 uppercase mb-1">Correctes</div>
            <div class="font-bold text-green-600 dark:text-green-400">{{ getCorrectAnswersCount(test) }}</div>
          </div>
        </div>
      </div>

      <!-- Section Feedback -->
      <div class="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-1 border border-indigo-100 dark:border-indigo-800/30 shadow-lg">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
            <span class="bg-accent p-1.5 rounded-lg text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Analyse diagnostique
          </h3>
          
          <DiagnosticFeedback v-if="feedback" :feedback="feedback" />
          
          <div v-else class="text-center py-10">
            <p class="text-gray-500">Aucun feedback détaillé n'est disponible pour ce test.</p>
          </div>
        </div>
      </div>

      <!-- Détail par item (Optionnel mais utile pour l'enseignant) -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
        <button 
          @click="showDetails = !showDetails" 
          class="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <span class="font-bold dark:text-white">Voir le détail des questions</span>
          <svg class="w-5 h-5 transition-transform" :class="{ 'rotate-180': showDetails }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div v-if="showDetails" class="p-4 border-t dark:border-gray-700 space-y-3">
          <div v-for="(item, idx) in test.items" :key="idx" 
               class="flex items-center justify-between p-3 rounded-xl border"
               :class="item.isCorrect ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30' : 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30'">
            <div class="flex items-center gap-4">
              <span class="text-xs font-bold text-gray-400 w-6">{{ idx + 1 }}.</span>
              <div class="font-mono text-lg dark:text-white">
                <template v-if="test.type === 'comparison'">
                  {{ item.firstNumberDisplay }} <span class="text-accent font-bold">{{ item.userAnswer || '?' }}</span> {{ item.secondNumberDisplay }}
                </template>
                <template v-else>
                  {{ item.firstNumber }} {{ getOpSign(test.type) }} {{ item.secondNumber }} = <span class="font-bold">{{ item.userAnswer || '?' }}</span>
                </template>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div v-if="!item.isCorrect" class="text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-tighter">
                Attendu: {{ item.correctAnswer }}
              </div>
              <span v-if="item.isCorrect" class="text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span v-else class="text-red-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { testHistory } from '../../stores/testStore';
import { generateTeacherFeedback } from '../../logic/teacherFeedback';
import DiagnosticFeedback from './DiagnosticFeedback.vue';

const props = defineProps({
  testId: {
    type: String,
    required: true
  }
});

const test = ref(null);
const feedback = ref(null);
const loading = ref(true);
const showDetails = ref(false);

onMounted(() => {
  // Petite pause pour laisser Nanostores s'initialiser
  setTimeout(() => {
    const history = testHistory.get();
    test.value = history.find(t => t.id === props.testId);
    
    if (test.value) {
      feedback.value = generateTeacherFeedback(test.value);
    }
    
    loading.value = false;
  }, 100);
});

function getTestTypeName(type) {
  const types = {
    addition: "Addition",
    subtraction: "Soustraction",
    multiplication: "Multiplication",
    comparison: "Comparaison"
  };
  return types[type] || type;
}

function getOpSign(type) {
  if (type === 'addition') return '+';
  if (type === 'subtraction') return '-';
  if (type === 'multiplication') return '×';
  return '?';
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleString([], {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function calculateScore(test) {
  const correctAnswers = test.items.filter(item => item.isCorrect).length;
  return Math.round((correctAnswers / test.items.length) * 100);
}

function getCorrectAnswersCount(test) {
  return test.items.filter(item => item.isCorrect).length;
}
</script>

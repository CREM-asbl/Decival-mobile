<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto shadow-xl p-6 border border-transparent dark:border-gray-700">
      <div class="text-center py-4">
        <h3 class="text-xl font-bold mb-4 dark:text-white">Félicitations !</h3>
        <p class="mb-2 dark:text-gray-200">Vous avez terminé le test de {{ testType }}.</p>
        <div class="text-lg dark:text-gray-200">
          Score : <span class="font-bold text-accent">{{ score }}</span>%
        </div>
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Consultez vos progrès dans l'onglet "Progrès"
        </p>
      </div>
      <div class="flex flex-col sm:flex-row-reverse sm:justify-start gap-3 mt-6">
        <button @click="onRestart" class="w-full sm:w-auto px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover font-medium">
          Recommencer
        </button>
        <a href="/progress" class="no-underline w-full sm:w-auto">
          <button class="w-full px-6 py-3 bg-gray-500 dark:bg-gray-600 text-white rounded-md hover:bg-gray-600 dark:hover:bg-gray-500 font-medium">
            Voir progrès
          </button>
        </a>
        <a href="/tests" class="no-underline w-full sm:w-auto">
          <button class="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
            Fermer
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  testType: {
    type: String,
    required: true,
    validator: (value) => ['addition', 'soustraction', 'multiplication', 'comparaison'].includes(value)
  }
});

// Émets des événements pour les actions
const emit = defineEmits(['restart']);

// Fonction pour gérer le restart
function onRestart() {
  emit('restart');
}
</script>
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl p-6">
      <div class="text-center py-4">
        <h3 class="text-xl font-bold mb-4">Félicitations !</h3>
        <p class="mb-2">Vous avez terminé le test de {{ testType }}.</p>
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
        <a href="/progress" class="no-underline">
          <button class="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600">
            Voir progrès
          </button>
        </a>
        <button @click="onRestart" class="px-6 py-3 bg-accent text-white rounded-md hover:bg-accent-hover">
          Recommencer
        </button>
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
<template>
  <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-transparent dark:border-gray-700">
    <h2 class="text-xl font-bold mb-4 text-center dark:text-white">Choisissez un mode</h2>
    <div class="flex flex-col md:flex-row gap-4 justify-center">
      <button
        @click="selectMode('integer')"
        class="px-6 py-4 rounded-lg transition-all flex-1"
        :class="selectedMode === 'integer'
          ? 'bg-accent text-white shadow-lg scale-105'
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200'"
      >
        <div class="flex flex-col items-center">
          <span class="text-xl font-semibold mb-2">Nombres entiers</span>
          <span class="text-sm">Ex: 42, 17, 35...</span>
        </div>
      </button>

      <button
        @click="selectMode('decimal')"
        class="px-6 py-4 rounded-lg transition-all flex-1"
        :class="selectedMode === 'decimal'
          ? 'bg-accent text-white shadow-lg scale-105'
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200'"
      >
        <div class="flex flex-col items-center">
          <span class="text-xl font-semibold mb-2">Nombres décimaux</span>
          <span class="text-sm">Ex: 3,5; 2,7; 8,9...</span>
        </div>
      </button>
    </div>

    <div class="mt-6 text-center">
      <button
        @click="startTest"
        class="px-8 py-3 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors"
        :disabled="!selectedMode"
        :class="{'opacity-50 cursor-not-allowed': !selectedMode}"
      >
        Commencer le test
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  testType: {
    type: String,
    required: true,
    validator: (value) => ['addition', 'subtraction', 'multiplication', 'comparison'].includes(value)
  }
});

const emit = defineEmits(['modeSelected']);

const selectedMode = ref('');

function selectMode(mode) {
  selectedMode.value = mode;
}

function startTest() {
  if (selectedMode.value) {
    emit('modeSelected', selectedMode.value);
  }
}
</script>
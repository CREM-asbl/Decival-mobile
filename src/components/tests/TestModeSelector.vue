<template>
  <div class="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-transparent dark:border-gray-700">
    <!-- Encouragement banner before test start -->
        <div class="mb-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-100 dark:border-violet-800/50">
      <div class="flex items-center gap-3">
            <div class="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-lg">
              <svg class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
              <h3 class="text-lg font-bold text-violet-900 dark:text-violet-100">{{ testEncouragement.title }}</h3>
              <p class="text-violet-700 dark:text-violet-300 text-sm">{{ testEncouragement.message }}</p>
        </div>
      </div>
    </div>

    <h2 class="text-xl font-bold mb-4 text-center dark:text-white">Choisis un mode</h2>
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
import { ref, computed } from 'vue';
import { getTestEncouragement } from '../../logic/progressLogic';
import { ITEMS_COUNT_ADDITION, ITEMS_COUNT_SUBTRACTION, ITEMS_COUNT_MULTIPLICATION, ITEMS_COUNT_COMPARISON } from '../../config/constants';

const props = defineProps({
  testType: {
    type: String,
    required: true,
    validator: (value) => ['addition', 'subtraction', 'multiplication', 'comparison'].includes(value)
  }
});

const emit = defineEmits(['modeSelected']);

const selectedMode = ref('');

const itemCounts = {
  addition: ITEMS_COUNT_ADDITION,
  subtraction: ITEMS_COUNT_SUBTRACTION,
  multiplication: ITEMS_COUNT_MULTIPLICATION,
  comparison: ITEMS_COUNT_COMPARISON
};

const testEncouragement = computed(() => getTestEncouragement(props.testType, itemCounts[props.testType] || 0));

function selectMode(mode) {
  selectedMode.value = mode;
}

function startTest() {
  if (selectedMode.value) {
    emit('modeSelected', selectedMode.value);
  }
}
</script>
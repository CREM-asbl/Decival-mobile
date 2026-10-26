<template>
  <div class="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-transparent dark:border-gray-700">
    <!-- Encouragement banner before test start -->
        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
      <div class="flex items-center gap-3">
            <div class="bg-gray-200 dark:bg-gray-600 p-2 rounded-lg">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ testEncouragement.title }}</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ testEncouragement.message }}</p>
        </div>
      </div>
    </div>

    <h2 class="text-xl font-bold mt-2 mb-1 text-center dark:text-white">Choisis un mode</h2>
    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 text-center mb-5">
      Étape 3 sur 3 — Mode
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        @click="selectMode('integer')"
        class="px-6 py-5 rounded-xl transition-all min-h-32"
        :class="selectedMode === 'integer'
          ? 'bg-accent text-white shadow-lg scale-[1.02]'
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200'"
      >
        <div class="flex flex-col items-center">
          <span class="text-xl font-semibold mb-2">Nombres entiers</span>
          <span class="text-sm">Ex: 42, 17, 35...</span>
        </div>
      </button>

      <button
        @click="selectMode('decimal')"
        class="px-6 py-5 rounded-xl transition-all min-h-32"
        :class="selectedMode === 'decimal'
          ? 'bg-accent text-white shadow-lg scale-[1.02]'
          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200'"
      >
        <div class="flex flex-col items-center">
          <span class="text-xl font-semibold mb-2">Nombres décimaux</span>
          <span class="text-sm">Ex: 3,5; 2,7; 8,9...</span>
        </div>
      </button>
    </div>

    <div class="mt-6 text-center">
      <p v-if="showIntegerWarning" class="mb-3 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg px-3 py-2">
        Maîtrise les entiers d'abord (prérequis) — tu peux quand même continuer.
      </p>
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
import { TEST_TYPE_IDS } from '../../types/test';
import { isIntegerMastered } from '../../stores/typeMasteryStore';
import { ITEMS_COUNT_ADDITION, ITEMS_COUNT_SUBTRACTION, ITEMS_COUNT_MULTIPLICATION, ITEMS_COUNT_COMPARISON } from '../../config/constants';

const props = defineProps({
  testType: {
    type: String,
    required: true,
    validator: (value) => TEST_TYPE_IDS.includes(value)
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

const showIntegerWarning = computed(() => selectedMode.value === 'decimal' && !isIntegerMastered(props.testType));

function selectMode(mode) {
  selectedMode.value = mode;
}

function startTest() {
  if (selectedMode.value) {
    emit('modeSelected', selectedMode.value);
  }
}
</script>
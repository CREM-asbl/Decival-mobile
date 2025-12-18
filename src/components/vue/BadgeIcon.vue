<template>
  <div 
    class="flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300"
    :class="[
      unlocked 
        ? 'bg-white dark:bg-gray-800 border-accent shadow-md scale-100' 
        : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50 grayscale scale-95'
    ]"
    :title="badge.description"
  >
    <div class="text-4xl mb-2">{{ badge.icon }}</div>
    <div class="text-sm font-bold text-center dark:text-white">{{ badge.title }}</div>
    <div v-if="showDescription" class="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
      {{ badge.description }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  badge: {
    type: Object,
    required: true
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  showDescription: {
    type: Boolean,
    default: false
  }
});
</script>

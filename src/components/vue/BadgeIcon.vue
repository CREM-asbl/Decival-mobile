<template>
  <div 
    class="flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300"
    :class="[
      unlocked 
        ? 'bg-white dark:bg-gray-800 border-accent shadow-md scale-100' 
        : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50 grayscale scale-95'
    ]"
    :aria-label="badge.description"
  >
    <IconGlyph :name="badge.icon" class="w-10 h-10 mb-2" :aria-label="badge.title" />
    <div class="text-sm font-bold text-center dark:text-white">{{ badge.title }}</div>
    <div v-if="showDescription" class="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
      {{ badge.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import IconGlyph from '../common/IconGlyph.vue';
import type { Badge } from '../../stores/badgeStore';

defineProps({
  badge: {
    type: Object as () => Badge,
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

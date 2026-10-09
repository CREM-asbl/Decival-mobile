<script setup lang="ts">
import { computed } from 'vue';
import { ICON_PATHS, type IconName } from '../../config/icons';

interface Props {
  name: IconName;
  class?: string;
  'aria-label'?: string;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  'aria-label': undefined
});

const ariaLabel = computed(() => props['aria-label'] || props.name);
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="class"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    :aria-label="ariaLabel"
    role="img"
  >
    <path
      :d="ICON_PATHS[name]"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
</template>
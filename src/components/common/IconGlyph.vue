<script setup lang="ts">
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
      v-for="path in paths"
      :key="path"
      :d="path"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
    />
  </svg>
</template>

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

const paths = computed(() => ICON_PATHS[props.name].split(' ').filter(Boolean));
const ariaLabel = computed(() => props['aria-label'] || props.name);
</script>
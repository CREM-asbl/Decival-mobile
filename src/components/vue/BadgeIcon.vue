<template>
  <div
    class="badge-card"
    :class="{ 'badge-unlocked': effectivelyUnlocked, 'badge-locked': !effectivelyUnlocked }"
    :title="badge.description"
    role="progressbar"
    :aria-valuenow="displayProgress"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="`${badge.title} : ${displayProgress} pour cent`"
  >
    <div class="badge-ring" :style="{ '--badge-progress': `${displayProgress}%` }">
      <div class="badge-emoji badge-emoji-bg" aria-hidden="true">{{ badge.icon }}</div>
      <div
        class="badge-emoji badge-emoji-fg"
        aria-hidden="true"
        :style="{ clipPath: `inset(${100 - displayProgress}% 0 0 0)` }"
      >
        {{ badge.icon }}
      </div>
    </div>
    <div class="text-sm font-bold text-center dark:text-white">{{ badge.title }}</div>
    <div v-if="showDescription" class="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
      {{ badge.description }}
    </div>
    <div v-if="!effectivelyUnlocked" class="badge-percent">{{ displayProgress }}%</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
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
  },
  progress: {
    type: Number,
    default: 0
  }
})

const displayProgress = computed(() => {
  if (props.unlocked) return 100
  if (!Number.isFinite(props.progress)) return 0
  return Math.min(100, Math.max(0, Math.round(props.progress)))
})

const effectivelyUnlocked = computed(() => props.unlocked || displayProgress.value >= 100)
</script>

<style scoped>
.badge-card {
  --badge-size: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-width: 2px;
  border-style: solid;
  transition: all 0.3s;
}

.badge-unlocked {
  background-color: #fff;
  border-color: var(--color-accent, #7c3aed);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
}

.badge-locked {
  background-color: #f3f4f6;
  border-color: #e5e7eb;
  opacity: 0.85;
  transform: scale(0.95);
}

.badge-ring {
  --badge-progress: 0%;
  position: relative;
  width: var(--badge-size);
  height: var(--badge-size);
  border-radius: 9999px;
  margin-bottom: 0.5rem;
  background: conic-gradient(var(--color-accent, #7c3aed) var(--badge-progress), #e5e7eb 0);
  padding: 3px;
}

.badge-unlocked .badge-ring {
  background: var(--color-accent, #7c3aed);
}

.badge-emoji {
  position: absolute;
  inset: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  line-height: 1;
  border-radius: 9999px;
  overflow: hidden;
  background-color: #fff;
}

.badge-emoji-bg {
  filter: grayscale(1);
  opacity: 0.35;
}

.badge-emoji-fg {
  align-items: center;
  filter: none;
  opacity: 1;
}

.badge-unlocked .badge-emoji-bg {
  display: none;
}

.badge-unlocked .badge-emoji-fg {
  position: static;
  height: auto;
  background: none;
}

.badge-percent {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-accent, #7c3aed);
}

@media (prefers-reduced-motion: reduce) {
  .badge-card {
    transition: none;
  }
}

.dark .badge-locked {
  background-color: #111827;
  border-color: #1f2937;
}

.dark .badge-unlocked {
  background-color: #1f2937;
}
</style>

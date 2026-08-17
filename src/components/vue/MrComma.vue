<template>
  <div class="mr-comma-container" :class="{ 'animate-float': animate }">
    <!-- Le SVG utilise viewBox pour créer un système de coordonnées absolu et fluide. -->
    <!-- On utilise 0 0 100 100 pour que le personnage prenne toute la place, et on laisse déborder (overflow) les accessoires. -->
    <svg viewBox="0 0 100 100" width="100%" height="100%" class="mr-comma-svg" role="img" :aria-label="altText">
      <defs>
        <!-- Définitions des dégradés -->
        <linearGradient id="cape-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#dc2626" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>
        
        <linearGradient id="lens-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1f2937" />
          <stop offset="100%" stop-color="#000000" />
        </linearGradient>
        
        <radialGradient id="aura-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- 1. Aura (Arrière-plan) -->
      <g v-if="level >= 50" class="aura-sparkles">
        <circle cx="50" cy="50" r="55" fill="url(#aura-gradient)" />
      </g>

      <!-- 2. Cape (Derrière le personnage) -->
      <g v-if="level >= 20" class="cape-container">
        <path :d="capePath" fill="url(#cape-gradient)" class="cape-fabric" />
      </g>

      <!-- 3. Personnage principal (Image PNG) -->
      <image 
        :href="`/images/mrcomma_v2/${variant}.png`" 
        :x="scene.image.x"
        :y="scene.image.y"
        :width="scene.image.width"
        :height="scene.image.height"
        preserveAspectRatio="xMidYMid meet" 
        class="base-image"
        :class="{ 'has-glow': level >= 35, 'has-aura': level >= 50 }"
      />

      <!-- 4. Lunettes -->
      <g v-if="level >= 10" class="glasses" :transform="`translate(${scene.glasses.x}, ${scene.glasses.y})`">
        <!-- Pont -->
        <rect x="-2" y="-0.5" width="4" height="1.5" :fill="level >= 50 ? '#f59e0b' : '#fbbf24'" />
        
        <!-- Verre Gauche -->
        <g transform="translate(-8, 0) rotate(-3)">
          <rect x="-5.5" y="-4.5" width="11" height="9" rx="2" 
                fill="url(#lens-gradient)" 
                :stroke="level >= 50 ? '#f59e0b' : '#fbbf24'" 
                stroke-width="1.5" />
          <!-- Reflet étoile -->
          <polygon points="-2,-2 0,-3 2,-2 3,0 2,2 0,3 -2,2 -3,0" fill="rgba(255,255,255,0.9)" transform="translate(-2, -1) scale(0.6)" />
        </g>
        
        <!-- Verre Droit -->
        <g transform="translate(8, 0) rotate(3)">
          <rect x="-5.5" y="-4.5" width="11" height="9" rx="2" 
                fill="url(#lens-gradient)" 
                :stroke="level >= 50 ? '#f59e0b' : '#fbbf24'" 
                stroke-width="1.5" />
          <polygon points="-2,-2 0,-3 2,-2 3,0 2,2 0,3 -2,2 -3,0" fill="rgba(255,255,255,0.9)" transform="translate(-2, -1) scale(0.6)" />
        </g>
      </g>

      <!-- 5. Couronne -->
      <g
        v-if="crownTier !== 'none'"
        :transform="`translate(${scene.crown.x}, ${scene.crown.y})`"
      >
        <g class="crown" :class="`crown-${crownTier}`">
          <path class="crown-shadow" d="M -14 7 L -9 1 L -3 6 L 0 -1 L 3 6 L 9 1 L 14 7 L 14 10 Q 0 14 -14 10 Z" />
          <path class="crown-body" d="M -14 6 L -10 0 L -3 5 L 0 -2.5 L 3 5 L 10 0 L 14 6 L 14 9.5 Q 0 13 -14 9.5 Z" />
          <path class="crown-rim" d="M -14 9.5 Q 0 13 14 9.5" />
          <circle class="crown-jewel jewel-left" cx="-7" cy="4" r="1.8" />
          <circle class="crown-jewel jewel-center" cx="0" cy="1.5" r="2.1" />
          <circle class="crown-jewel jewel-right" cx="7" cy="4" r="1.8" />
          <circle class="crown-pearl" cx="-10" cy="0" r="1.4" />
          <circle class="crown-pearl" cx="0" cy="-2.5" r="1.6" />
          <circle class="crown-pearl" cx="10" cy="0" r="1.4" />
        </g>
      </g>
      
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCrownTier, getMrCommaScene } from '../../utils/mrCommaScene'

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // options: default, happy, confused, pointing
  },
  level: {
    type: Number,
    default: 1
  },
  animate: {
    type: Boolean,
    default: false
  },
  altText: {
    type: String,
    default: 'Monsieur Virgule',
    required: false
  }
})

const scene = computed(() => getMrCommaScene(props.variant))
const crownTier = computed(() => getCrownTier(props.level))

const capePath = computed(() => {
  const { topLeft, topRight, bottomRight, bottomLeft } = scene.value.cape
  return `M ${topLeft.x} ${topLeft.y} L ${topRight.x} ${topRight.y} L ${bottomRight.x} ${bottomRight.y} L ${bottomLeft.x} ${bottomLeft.y} Z`
})
</script>

<style scoped>
.mr-comma-container {
  width: 80px;
  height: 80px;
  position: relative;
  /* Rend visible ce qui déborde (la couronne et la cape) */
  overflow: visible; 
}

.mr-comma-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  /* Empêche la sélection de l'image SVG */
  user-select: none;
}

/* Animations de la cape */
.cape-inside {
  transform-origin: 40px 40px;
  transform-box: view-box;
  animation: cape-flutter-inner 2.5s infinite ease-in-out;
}

.cape-fabric {
  transform-origin: 40px 40px;
  transform-box: view-box;
  animation: cape-flutter 2.5s infinite ease-in-out;
  filter: drop-shadow(0px 8px 8px rgba(0,0,0,0.5));
}

@keyframes cape-flutter {
  0% { transform: scale(1) rotate(0deg) skewX(0deg) skewY(0deg); }
  25% { transform: scaleX(1.05) scaleY(1.02) rotate(3deg) skewX(8deg) skewY(2deg); }
  50% { transform: scale(0.95) rotate(0deg) skewX(-2deg) skewY(0deg); }
  75% { transform: scaleX(1.05) scaleY(1.02) rotate(-3deg) skewX(-8deg) skewY(-2deg); }
  100% { transform: scale(1) rotate(0deg) skewX(0deg) skewY(0deg); }
}

@keyframes cape-flutter-inner {
  0% { transform: scale(1) rotate(0deg) skewX(0deg); }
  25% { transform: scale(0.95) rotate(1deg) skewX(3deg); }
  50% { transform: scale(1) rotate(0deg) skewX(-1deg); }
  75% { transform: scale(0.95) rotate(-1deg) skewX(-3deg); }
  100% { transform: scale(1) rotate(0deg) skewX(0deg); }
}

/* Effets sur la couronne */
.crown {
  transform-box: fill-box;
  transform-origin: center;
}

.crown-shadow {
  fill: rgba(15, 23, 42, 0.22);
  transform: translate(1px, 1.5px);
}

.crown-body,
.crown-rim {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.crown-silver {
  filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.45));
}

.crown-silver .crown-body {
  fill: #e5e7eb;
  stroke: #94a3b8;
  stroke-width: 1.4;
}

.crown-silver .crown-rim {
  fill: none;
  stroke: #cbd5e1;
  stroke-width: 1.4;
}

.crown-gold {
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
  animation: crown-shimmer 2s infinite alternate;
}

.crown-gold .crown-body {
  fill: #fbbf24;
  stroke: #d97706;
  stroke-width: 1.4;
}

.crown-gold .crown-rim {
  fill: none;
  stroke: #fde68a;
  stroke-width: 1.4;
}

.crown-jewel {
  stroke: rgba(255, 255, 255, 0.85);
  stroke-width: 0.7;
}

.jewel-left,
.jewel-right {
  fill: #60a5fa;
}

.jewel-center {
  fill: #fb7185;
}

.crown-pearl {
  fill: #ffffff;
  opacity: 0.95;
}

@keyframes crown-shimmer {
  from { transform: rotate(-2deg) scale(1); }
  to { transform: rotate(2deg) scale(1.04); }
}

/* Effets sur le personnage */
.base-image {
  transition: filter 0.5s ease;
}

.base-image.has-glow {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
}

.base-image.has-aura {
  filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.9));
}

/* Aura Background */
.aura-sparkles {
  animation: aura-pulse 3s infinite linear;
  transform-origin: 50px 50px;
}

@keyframes aura-pulse {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(0.95); opacity: 0.5; }
}

/* Animation douce globale */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.animate-float {
  animation: float 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}
</style>

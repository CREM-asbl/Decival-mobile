<template>
  <div class="mr-comma-container" :class="{ 'animate-bounce': animate }">
    <!-- Le SVG utilise viewBox pour créer un système de coordonnées absolu et fluide. -->
    <!-- On utilise 0 0 100 100 pour que le personnage prenne toute la place, et on laisse déborder (overflow) les accessoires. -->
    <svg viewBox="0 0 100 100" width="100%" height="100%" class="mr-comma-svg">
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
        <!-- Cape dessinée de X=35 à X=65 en haut, s'élargissant vers le bas -->
        <path d="M 25 40 L 55 40 L 85 100 L 15 100 Z" fill="url(#cape-gradient)" class="cape-fabric" />
      </g>

      <!-- 3. Personnage principal (Image PNG) -->
      <!-- Coordonnées 0 à 100 -->
      <image 
        :href="`/images/mrcomma_v2/${variant}.png`" 
        x="0" 
        y="0" 
        width="100" 
        height="100" 
        preserveAspectRatio="xMidYMid meet" 
        class="base-image"
        :class="{ 'has-glow': level >= 35, 'has-aura': level >= 50 }"
      />

      <!-- 4. Lunettes -->
      <!-- positionnées dynamiquement sur l'axe X et Y selon la variante -->
      <g v-if="level >= 10" class="glasses" :transform="`translate(${glassesPosition.x}, ${glassesPosition.y})`">
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

      <!-- 5. Couronnes -->      
      <text v-if="level >= 35" x="38" y="18" font-size="28" text-anchor="middle" class="accessory-crown-silver">👑</text>
      <text  v-if="level >= 50" x="45" y="18" font-size="28" text-anchor="middle" class="accessory-crown-gold">👑</text>
      
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

// 🎯 LE RÉGLAGE EST ICI : 
// Permet d'ajuster au pixel près (sur l'échelle 0-100) la position X et Y des lunettes 
// pour chaque variante d'image PNG. 
// X: vers la gauche (< 50) ou la droite (> 50)
// Y: vers le haut (< 30) ou le bas (> 30)
const glassesPosition = computed(() => {
  const positions = {
    default: { x: 42, y: 36 },
    happy: { x: 42, y: 35 },
    pointing: { x: 38, y: 35 }, // Plus à gauche (38) et plus bas (38)
    confused: { x: 42, y: 36 }
  }
  return positions[props.variant] || { x: 42, y: 36 }
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

/* Effets sur les couronnes */
.accessory-crown-silver {
  filter: grayscale(1) brightness(1.5) drop-shadow(0 0 5px white);
  transform-origin: 53px -5px;
  transform: rotate(-5deg);
}

.accessory-crown-gold {
  filter: drop-shadow(0 0 8px #fbbf24);
  transform-origin: 53px -10px;
  animation: crown-shimmer 2s infinite alternate;
}

@keyframes crown-shimmer {
  from { transform: rotate(5deg) scale(1); }
  to { transform: rotate(5deg) scale(1.1); filter: drop-shadow(0 0 15px #fcd34d); }
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

/* Animation de rebond global */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-bounce {
  animation: bounce 1.5s ease infinite;
}
</style>

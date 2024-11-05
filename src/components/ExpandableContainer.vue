<template>
  <div class="expandable-container" ref="containerRef">
    <div
      ref="contentRef"
      :class="{ expanded, visible }"
      class="content"
      @click="expandContent"
    >
      <slot />
    </div>
    <q-btn
      v-if="!expanded"
      @click="expandContent"
      class="arrow-shake"
      label="Развернуть"
      icon="eva-arrow-ios-downward-outline"
      flat
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const expanded = ref(false);
const contentRef = ref<HTMLElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const visible = ref(false);

const expandContent = () => {
  expanded.value = true;
};

const handleScroll = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      visible.value = true;
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});
</script>

<style scoped>
.expandable-container {
  position: relative;
}

.content {
  max-height: 300px;
  overflow: hidden;
  transition:
    max-height 0.6s ease-in-out,
    mask-image 0.6s ease-in-out,
    opacity 1s ease-in-out;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0)
  );
  opacity: 0;
}

.content.visible {
  opacity: 1;
}

.content.expanded {
  max-height: 1000px;
  mask-image: none;
  -webkit-mask-image: none;
}

.arrow-shake {
  animation: moveUpDown 2s ease-in-out infinite; /* Анимация */
}

@keyframes moveUpDown {
  0% {
    transform: translateY(15%);
  }
  50% {
    transform: translateY(-15%); /* Возврат в исходное положение */
  }
  100% {
    transform: translateY(15%); /* Возврат в исходное положение */
  }
}
</style>

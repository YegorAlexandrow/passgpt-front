<template>
  <div
    ref="containerRef"
    :class="['fade-in-container', props.direction, { visible }]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from 'vue';

const props = defineProps<{ direction: 'up' | 'down' | 'left' | 'right' }>();
const containerRef = ref<HTMLElement | null>(null);
const visible = ref(false);

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0.5) {
      // Выползание начинается, когда больше 50% элемента видно
      visible.value = true;
    }
  });
};

onMounted(() => {
  if (containerRef.value) {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Срабатывание, когда элемент виден на 50%
    });
    observer.observe(containerRef.value);
    onUnmounted(() => {
      observer.disconnect();
    });
  }
});
</script>

<style scoped lang="scss">
.fade-in-container {
  opacity: 0;
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;

  --distance: 50px;
}

.fade-in-container.visible {
  opacity: 1;
  transform: translate(0);
}

.fade-in-container.up {
  transform: translateY(var(--distance));
}

.fade-in-container.down {
  transform: translateY(calc(-1 * var(--distance)));
}

.fade-in-container.left {
  transform: translateX(calc(-1 * var(--distance)));
}

.fade-in-container.right {
  transform: translateX(var(--distance));
}

.fade-in-container.visible.up,
.fade-in-container.visible.down,
.fade-in-container.visible.left,
.fade-in-container.visible.right {
  transform: translate(0);
}
</style>

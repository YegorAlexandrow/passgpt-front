<template>
  <div id="container-sin">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMin slice"
      :viewBox="viewBox"
    >
      <!-- Background -->
      <path d="M0 0h728v400H0z" :fill="backgroundColor" />
      <!-- Sinusoidal path -->
      <defs>
        <path id="s-sin" :d="pathDefinition" />
      </defs>
      <!-- Text & link to path -->
      <text :font-family="fontFamily" :font-size="fontSize" :fill="textColor">
        <textPath id="text-sin" xlink:href="#s-sin">
          {{ textContent }}
        </textPath>
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, onBeforeUnmount } from 'vue';

// Define props for configurable attributes
const props = defineProps({
  textContent: {
    type: String,
    default: 'Текст по синусоиде, пример использования JavaScript и CSS.',
  },
  textColor: {
    type: String,
    default: 'var(--q-primary)',
  },
  fontSize: {
    type: String,
    default: '24',
  },
  backgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0)',
  },
  fontFamily: {
    type: String,
    default: 'Rubik, sans-serif',
  },
  viewBox: {
    type: String,
    default: '0 130 600 140',
  },
  pathDefinition: {
    type: String,
    default: 'M0 200 Q 100 100, 200 200 T 400 200 T 600 200 T 800 200',
  },
});

const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
  const textElement = document.querySelector('#text-sin');
  const container = document.querySelector('#container-sin');
  const fullText = props.textContent;
  let index = 0;
  let phase = 1;
  const caret = '⬤';

  function typeText() {
    if (index < 0 || index >= fullText.length + 2) phase *= -1;
    if (textElement) {
      textElement.textContent = fullText.substring(0, index + phase) + caret;
      index += phase;
      setTimeout(typeText, 70);
    }
  }

  if (container) {
    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeText();
          observer.value?.disconnect();
        }
      });
    });
    observer.value.observe(container);
  }
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style scoped>
svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>

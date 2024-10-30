<template>
  <div id="container-stairs">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMin slice"
      :viewBox="viewBox"
    >
      <!-- Background -->
      <path d="M0 0h728v400H0z" :fill="backgroundColor" />
      <!-- Step-like path -->
      <defs>
        <path
          id="s-stairs"
          d="M0 200 L 200 200 L 200 400 L 400 400 L 400 600 L 600 600 L 600 800 L 800 800 L 800 1000 L 1000 1000 L 1000 1200 L 1200 1200 L 1200 1400"
        />
        <linearGradient
          id="gradient-stairs"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" style="stop-color: var(--q-primary)" />
          <stop offset="25%" style="stop-color: var(--q-accent)" />
          <stop offset="50%" style="stop-color: var(--q-primary)" />
          <stop offset="75%" style="stop-color: var(--q-primary)" />
          <stop offset="100%" style="stop-color: var(--q-accent)" />
        </linearGradient>
      </defs>
      <!-- Text & link to path -->
      <text
        :font-family="fontFamily"
        :font-size="fontSize"
        font-weight="700"
        class="text-gradient"
      >
        <textPath id="text-stairs" xlink:href="#s-stairs">
          {{ textContent }}
        </textPath>
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';

// Define props for configurable attributes
const props = defineProps({
  textContent: {
    type: String,
    default: 'Текст по лесенке, пример использования JavaScript и CSS.',
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
    default: '0 130 1200 1400',
  },
});

const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
  const textElement = document.querySelector('#text-stairs');
  const container = document.querySelector('#container-stairs');
  const fullText = props.textContent;
  let index = 0;
  let phase = 1;
  const caret = '⬤';

  function typeText() {
    if (index < 0 || index >= fullText.length + 2) phase *= -1;
    if (textElement) {
      textElement.textContent = fullText.substring(0, index + phase) + caret;
      index += phase;
      setTimeout(typeText, 40);
    }
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeText();
        observer.value?.disconnect();
      }
    });
  });

  if (container) {
    observer.value.observe(container);
  }
});
</script>

<style scoped>
svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.text-gradient {
  fill: url(#gradient-stairs);
  animation: gradientAnimation 3s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>

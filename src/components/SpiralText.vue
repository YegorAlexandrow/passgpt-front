<template>
  <div id="container-spiral" class="rotating-spiral">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMin slice"
      :viewBox="viewBox"
    >
      <!-- Background -->
      <path d="M0 0h728v400H0z" :fill="backgroundColor" />
      <!-- Spiral path -->
      <defs>
        <path
          id="s"
          d="M363.32 203.973c3.65 3.65-3.119 6.72-6.066 6.066-7.986-1.773-9.27-12.002-6.066-18.198 5.731-11.082 20.612-12.38 30.33-6.065 14.26 9.267 15.584 29.339 6.065 42.46-12.686 17.49-38.107 18.828-54.592 6.067-20.745-16.06-22.09-46.897-6.066-66.725 19.408-24.015 55.695-25.365 78.856-6.066 27.294 22.744 28.648 64.502 6.066 90.988-26.071 30.58-73.313 31.935-103.12 6.066-33.869-29.394-35.225-82.127-6.066-115.252 32.713-37.16 90.944-38.518 127.384-6.065 40.455 36.028 41.813 99.762 6.065 139.515-39.342 43.75-108.581 45.11-151.646 6.065-47.048-42.655-48.408-117.402-6.066-163.778 45.966-50.346 126.224-51.706 175.91-6.066 53.645 49.277 55.005 135.047 6.066 188.042-52.587 56.945-143.87 58.305-200.174 6.066-60.244-55.895-61.605-152.693-6.066-212.306 59.204-63.545 161.518-64.906 224.438-6.065 53.59 50.116 66.879 131.92 33.787 197.072"
        />
        <radialGradient
          id="spiralGradient"
          cx="50%"
          cy="50%"
          r="75%"
          fx="50%"
          fy="50%"
        >
          <stop
            offset="0%"
            style="stop-color: var(--q-accent); stop-opacity: 1"
          />
          <stop
            offset="25%"
            style="stop-color: var(--q-primary); stop-opacity: 1"
          />
          <stop
            offset="50%"
            style="stop-color: var(--q-accent); stop-opacity: 1"
          />
          <stop
            offset="75%"
            style="stop-color: var(--q-primary); stop-opacity: 1"
          />
          <stop
            offset="100%"
            style="stop-color: var(--q-accent); stop-opacity: 1"
          />
        </radialGradient>
      </defs>
      <!-- Text & link to path -->
      <text
        :font-weight="700"
        :font-family="fontFamily"
        :font-size="fontSize"
        fill="url(#spiralGradient)"
      >
        <textPath id="text-spiral" xlink:href="#s">
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
    default: 'Текст по спирали, пример использования JavaScript и CSS.',
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
    default: 'Rubik, monospace',
  },
  viewBox: {
    type: String,
    default: '190 0 370 370',
  },
});

const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
  const textElement = document.querySelector('#text-spiral');
  const container = document.querySelector('#container-spiral');
  const fullText = props.textContent;
  let index = 0;
  let phase = 1;
  const caret = '⬤';

  function typeText() {
    if (index < 0 || index >= fullText.length + 2) phase *= -1;
    if (textElement) {
      textElement.textContent = fullText.substring(0, index + phase) + caret;
      index += phase;
      setTimeout(typeText, 30);
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

.rotating-spiral {
  animation: rotateSpiral 60s linear infinite;
  transform-origin: 50% 50%;
}

@keyframes rotateSpiral {
  0% {
    transform: translateY(-50%) rotate(360deg);
  }
  100% {
    transform: translateY(-50%) rotate(0deg);
  }
}
</style>

<template>
  <div id="container-heart">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMin slice"
      :viewBox="viewBox"
    >
      <!-- Background -->
      <path d="M0 0h728v400H0z" :fill="backgroundColor" />
      <!-- Heart-shaped path -->
      <defs>
        <path
          id="s-heart"
          d="M150 200 v-200 h200
          a100,100 90 0,1 0,200
          a100,100 90 0,1 -200,0
          z"
          transform="rotate(225,150,121)"
        />
      </defs>
      <!-- Text & link to path -->
      <text
        :font-weight="900"
        :font-family="fontFamily"
        :font-size="fontSize"
        :fill="textColor"
        :class="pulsateClass"
      >
        <textPath id="text-heart" xlink:href="#s-heart">
          {{ textContent }}
        </textPath>
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, computed } from 'vue';

// Define props for configurable attributes
const props = defineProps({
  textContent: {
    type: String,
    default: 'Текст по форме сердца, пример использования JavaScript и CSS.',
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
    default: '-140 -140 420 390',
  },
});

const observer = ref<IntersectionObserver | null>(null);
const isTypingComplete = ref(false);
const pulsateClass = computed(() =>
  isTypingComplete.value ? 'pulsate-text' : '',
);

onMounted(() => {
  const textElement = document.querySelector('#text-heart');
  const container = document.querySelector('#container-heart');
  const fullText = props.textContent;
  let index = 0;
  const caret = '⬤';

  function typeText() {
    if (textElement) {
      if (index < fullText.length) {
        textElement.textContent = fullText.substring(0, index + 1) + caret;
        index++;
        setTimeout(typeText, 50);
      } else {
        textElement.textContent = fullText; // Убираем каретку после завершения
        isTypingComplete.value = true; // Set flag to true when typing is complete
      }
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
.pulsate-text {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>

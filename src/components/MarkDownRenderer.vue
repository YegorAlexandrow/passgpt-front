<template>
  <div ref="markdownContainer" class="markdown-container"></div>
  <q-spinner-dots
    size="lg"
    v-if="props.inProgress && props.content.length < 1"
  ></q-spinner-dots>
  <div class="row" v-else>
    <q-btn
      flat
      :icon="copied ? 'eva-checkmark-outline' : 'eva-copy-outline'"
      size="md"
      class="q-py-none q-px-sm q-mr-lg"
      @click="onCopy"
    ></q-btn>
    <q-rating
      v-model="rating"
      v-if="props.isLast"
      icon="eva-star-outline"
      size="1.5rem"
      icon-selected="eva-star"
      color="primary"
      :readonly="!!rating"
      :style="{
        transform: props.inProgress ? 'scale(0)' : 'scale(1)',
        transformOrigin: 'left',
        transition: 'ease-in-out 0.3s',
      }"
    ></q-rating>
  </div>

  <!-- Диалог для изображения -->
  <q-dialog v-model="isImageDialogOpen">
    <q-card
      class="q-pa-none"
      style="border-radius: 26px; max-width: 90vw; overflow: hidden"
    >
      <img
        :src="selectedImageSrc"
        alt="Opened Image"
        style="max-width: 100%; max-height: 90vh"
      />
      <q-btn
        icon="eva-download-outline"
        style="
          position: absolute;
          top: 0;
          right: 0;
          margin: 6px;
          background: rgba(0, 0, 0, 0.2);
        "
        class="text-white"
        size="md"
        round
        unelevated
        @click="downloadImage(selectedImageSrc)"
      ></q-btn>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/stackoverflow-dark.css';
import DOMPurify from 'dompurify';
import ClipboardJS from 'clipboard';
import mathjax3 from 'markdown-it-mathjax3';
import { useChatStore } from 'src/stores/chatStore';

const c = useChatStore();

const props = defineProps({
  content: String,
  inProgress: Boolean,
  isLast: Boolean,
});

const markdownContainer = ref(null);
const renderedMarkdown = ref('');
const copied = ref(false);
const rating = ref(0);

// Переменные для диалога с изображением
const isImageDialogOpen = ref(false);
const selectedImageSrc = ref('');

// Функция для открытия диалога с изображением
const openImageDialog = (src) => {
  selectedImageSrc.value = src;
  isImageDialogOpen.value = true;
};

// Функция для скачивания изображения
const downloadImage = async (imageSrc) => {
  const image = await fetch(imageSrc);
  const imageBlob = await image.blob();
  const imageURL = URL.createObjectURL(imageBlob);

  const link = document.createElement('a');
  link.href = imageURL;
  link.download = imageSrc.split('/').pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

watch(rating, () => {
  c.rate(rating.value, props.content.substring(0, 140));
});

async function onCopy() {
  await navigator.clipboard.writeText(props.content);
  copied.value = true;

  window.ym && window.ym(98810411, 'reachGoal', 'COPY_MESSAGE');
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

md.use(mathjax3, {
  loader: {
    load: ['[tex]/colorv2'],
  },
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
  },
  svg: { fontCache: 'global', scale: 2 },
});

const addCopyButtons = () => {
  if (!markdownContainer.value) return;

  const codeBlocks = markdownContainer.value.querySelectorAll('pre');

  codeBlocks.forEach((pre) => {
    if (pre.querySelector('.copy-button')) return;

    const button = document.createElement('button');
    button.innerText = 'Скопировать';
    button.className = 'copy-button';
    button.type = 'button';

    pre.style.position = 'relative';
    pre.appendChild(button);
  });

  const clipboard = new ClipboardJS('.copy-button', {
    target: (trigger) => {
      const pre = trigger.parentElement;
      const code = pre.querySelector('code');
      return code || pre;
    },
    text: (trigger) => {
      const pre = trigger.parentElement;
      const code = pre.querySelector('code');
      return code ? code.textContent || '' : '';
    },
  });

  clipboard.on('success', (e) => {
    const button = e.trigger;
    const originalText = button.innerText;
    button.innerText = 'Скопировано!';
    setTimeout(() => {
      button.innerText = originalText;
    }, 2000);
    e.clearSelection();
  });

  clipboard.on('error', (e) => {
    const button = e.trigger;
    const originalText = button.innerText;
    button.innerText = 'Ошибка';
    setTimeout(() => {
      button.innerText = originalText;
    }, 2000);
  });
};

const render = () => {
  const filteredContent = props.content.replace(/【.*?】/g, '');
  const rawHtml = md.render(
    filteredContent
      .replaceAll('\\( ', '$')
      .replaceAll(' \\)', '$')
      .replaceAll(' \\)', '$')
      .replaceAll('\\[ ', '$$')
      .replaceAll(' \\]', '$$')
      .replaceAll('\\[', '$$')
      .replaceAll('\\]', '$$'),
  );
  renderedMarkdown.value = DOMPurify.sanitize(rawHtml);
};

const addImageClickListeners = () => {
  const images = markdownContainer.value.querySelectorAll('img');
  images.forEach((img) => {
    img.addEventListener('click', () => openImageDialog(img.src));
  });
};

watch(
  () => props.content,
  () => {
    render();
    nextTick(() => {
      if (markdownContainer.value) {
        markdownContainer.value.innerHTML = renderedMarkdown.value;
        addCopyButtons();
        addImageClickListeners();

        if (props.inProgress) {
          const span = document.createElement('span');
          span.innerText = '⬤';
          markdownContainer.value
            .querySelector(':last-child')
            ?.appendChild(span);
        }

        markdownContainer.value.querySelectorAll('a').forEach((a) => {
          if (a.href.includes('javascript:')) {
            a.href = 'javascript:' + a.href.split('javascript:')[1];
          } else a.target = '_blank';
        });
      }
    });
  },
  { immediate: true },
);
</script>

<style>
.markdown-container {
  width: calc(100%);
  max-width: calc(100%);
  word-wrap: break-word; /* Перенос длинных слов */
  padding: 10px;
}

.markdown-container h1 {
  font-size: 3rem;
  font-weight: 600;
  line-height: 3rem;
}

.markdown-container h2 {
  font-size: 2.75rem;
  font-weight: 500;
}

.markdown-container h3 {
  font-size: 2.25rem;
  font-weight: 500;
  line-height: 1.75rem;
}

.markdown-container table {
  border-collapse: collapse;
  border: 1px solid grey;
}

.markdown-container td {
  border-collapse: collapse;
  border: 1px dotted grey;
  padding-left: 6px;
  padding-right: 6px;
}

.markdown-container th {
  border-collapse: collapse;
  border: 1px solid grey;
  padding-left: 6px;
  padding-right: 6px;
}

.markdown-container p:last-child {
  margin-bottom: 0;
}

.markdown-container a {
  color: #1976d2;
  text-decoration: underline;
  text-decoration-thickness: 2px;
}

.markdown-container a:visited {
  color: #ad1457;
}

.markdown-container img {
  max-width: calc(100% - 40px);
  max-height: 50vh;
  margin: 20px;
  border-radius: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.markdown-container img:hover {
  transform: scale(1.03);
  /* box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.5); */
}

.markdown-container svg {
  display: none;
}

.markdown-container p:has(math) {
  text-align: center;
  transform: scale(1.1);
}

.markdown-container a > button {
  padding: 8px;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-right: 10px;
  border: none;
  border-radius: 50px;
  background: var(--q-message-bubble);
  color: var(--q-message-bubble-text);
  cursor: pointer;
}

.markdown-container hr {
  margin-top: 20px;
  margin-bottom: 20px;
  opacity: 0.2;
  border: 2px dotted;
  border-style: none none dotted;
}

pre {
  position: relative;
  padding: 1em;
  overflow: auto;
  border-radius: 10px;
  font-size: 0.9rem;
  max-width: calc(100%); /* Ограничиваем ширину */
  white-space: pre-wrap; /* Разрешаем перенос строк внутри кода */
  word-wrap: break-word; /* Переносим слова */
}

code {
  white-space: pre-wrap; /* То же самое для блока code */
  word-wrap: break-word;
}

/* Стили для кнопки "Скопировать" */
.copy-button {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  padding: 0.2em 0.5em;
  font-size: 0.8em;
  background: #7e57c2;
  color: white;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

/* Стили для кнопки "Скачать" на изображениях */
.download-button {
  position: absolute;
  top: 8px; /* Отступ сверху */
  right: 8px; /* Отступ справа */
  padding: 0.2em 0.5em;
  font-size: 0.8em;
  background: #7e57c2;
  color: white;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.download-button:hover {
  opacity: 1;
}

.hljs {
  padding: 20px;
}

.copy-button:hover {
  opacity: 1;
}
</style>

<template>
  <!-- <div
    class="cool-bg"
    :style="{ opacity: c.messages?.length > 1 ? 0 : 1 }"
  ></div> -->
  <q-page class="q-pb-md column q-mx-auto" style="max-width: 820px">
    <WelcomeScreen
      v-if="
        (!c.currentChatId || c.messages.length == 0) &&
        !c.isMessageLoading &&
        !c.isChatLoading &&
        !c.showSignInForm
      "
      style="height: calc(100vh - 200px)"
    ></WelcomeScreen>
    <div
      class="col q-px-md"
      v-else-if="!c.isChatLoading"
      style="max-width: 100%; overflow: hidden"
    >
      <template v-for="(m, i) in c.messages" :key="m.id">
        <template v-if="m.role == 'assistant'">
          <MarkDownRenderer
            :content="m.text"
            :in-progress="m.progress"
            :is-last="i == c.messages.length - 1"
          />
        </template>
        <template v-else-if="m.role == 'tool'">
          <ToolLabel :message="m"></ToolLabel>
        </template>
        <template v-else>
          <div class="row" v-if="m.attachments && m.attachments.length > 0">
            <q-space></q-space>
            <img
              :src="a"
              v-for="a in m.attachments"
              :key="a"
              class="q-message__image"
            />
          </div>
          <q-chat-message
            :text="[m.text]"
            sent
            class="q-mr-lg q-mt-lg q-mb-lg"
            bg-color="var(--q-message-bubble)"
            style="white-space: pre-wrap"
          ></q-chat-message>
        </template>
      </template>
    </div>
    <div style="height: 400px" v-if="c.messages.length > 0">
      <q-inner-loading class="no-bg" :showing="c.isChatLoading">
        <q-spinner-hourglass size="sm"></q-spinner-hourglass>
        Загружаем сообщения
      </q-inner-loading>
    </div>
    <div
      class="col q-pt-sm q-px-sm bg-secondary text-center"
      style="
        position: fixed;
        bottom: 0;
        width: 100%;
        max-width: 820px;
        border-radius: 32px;
      "
      :style="{
        transform: isDropping ? 'scale(1.05)' : '',
        transition: 'transform ease-in-out 0.2s',
      }"
      @drop="onDrop"
      @dragenter="
        (e: DragEvent) => {
          e.preventDefault();
          isDropping = true;
        }
      "
      @dragover="
        (e: DragEvent) => {
          e.preventDefault();
          isDropping = true;
        }
      "
      @dragleave="
        (e: DragEvent) => {
          e.preventDefault();
          isDropping = false;
        }
      "
    >
      <q-btn
        unelevated
        round
        icon="mdi-arrow-down"
        color="accent"
        dense
        :style="{
          position: 'fixed',
          height: '20px',
          width: '20px',
          transition: 'ease-in-out 0.2s',
          transform:
            maxScrollPosition - scrollPosition > 200
              ? 'translate(-50%, calc(-100% - 20px))'
              : 'translate(-50%, calc(-100% - 20px)) scale(0) rotate(180deg)',
        }"
        @click="scrollDown"
      />
      <input
        type="file"
        id="fileinput"
        style="display: none"
        accept=".c,.cpp,.cs,.css,.doc,.docx,.go,.html,.java,.js,.json,.md,.pdf,.php,.pptx,.py,.rb,.sh,.tex,.ts,.txt,.png,.jpg,.fig,.webp,.xls,.xlsx,.csv"
      />
      <q-input
        class="col"
        v-model="newMessageText"
        rounded
        borderless
        autogrow
        type="text"
        placeholder="Ваше сообщение..."
        input-style="font-size: 1.1rem; font-weight: 400; max-height: 7em;"
        @keyup.enter="
          (e: KeyboardEvent) => {
            if (!e.shiftKey && !c.isMessageLoading) sendMessage();
          }
        "
        @paste="onPaste"
      >
        <template v-slot:prepend>
          <div
            v-if="attachedFile"
            :style="{
              width: '48px',
              aspectRatio: '1 / 1',
              borderRadius: '9px',
              background: `url(${attachedFileUrl})`,
              backgroundSize: 'cover',
              position: 'relative',
            }"
          >
            <q-btn
              dense
              round
              icon="close"
              color="negative"
              size="xs"
              style="position: absolute; top: -4px; right: -4px; z-index: 2000"
              @click="attachedFile = null"
            />
          </div>
        </template>
      </q-input>
      <div class="row" style="margin-right: 2px">
        <q-toggle
          color="amber"
          false-value="gpt-4o-mini"
          true-value="o3-mini"
          v-model="c.model"
          :toggle-indeterminate="false"
          class="text-caption"
          checked-icon="mdi-lightbulb"
          unchecked-icon="mdi-lightbulb-outline"
          size="lg"
        >
          <q-tooltip class="text-body1" style="width: 240px">
            <b>Включить o3-mini</b><br />
            Это новая рассуждающая модель, которая строит цепочки рассуждений
            для решения комплексных задач.</q-tooltip
          >
        </q-toggle>

        <div
          class="col text-caption text-grey q-ma-none"
          style="
            word-wrap: none;
            text-overflow: ellipsis;
            font-size: 0.65rem;
            align-self: flex-end;
            text-align: center;
          "
        >
          ИИ может ошибаться.
          <template v-if="!Platform.is.mobile">
            Проверяйте важную информацию.
          </template>
        </div>

        <q-btn
          round
          flat
          @click="attachFile"
          :disable="
            c.isMessageLoading || !!attachedFile || c.model == 'o3-mini'
          "
          icon="eva-attach-2-outline"
          class="q-mr-sm"
          style="align-self: flex-start"
        ></q-btn>
        <q-btn
          class="bg-primary text-white msg-btn"
          round
          flat
          icon="eva-arrow-upward-outline"
          @touchstart="sendMessage"
          @click="sendMessage"
          :loading="c.isMessageLoading"
          :disable="newMessageText.length < 1"
          style="width: 32px; height: 32px; z-index: 8000"
        >
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useChatStore } from 'src/stores/chatStore';
import MarkDownRenderer from 'src/components/MarkDownRenderer.vue';
import ToolLabel from 'src/components/ToolLabel.vue';
import WelcomeScreen from 'src/components/WelcomeScreen.vue';
import { computed } from 'vue';
import { useMeta } from 'quasar';
import { getMaterialFileIcon } from 'file-extension-icon-js';
import { Platform } from 'quasar';

const c = useChatStore();

const newMessageText = ref('');
const scrollPosition = ref(0);
const maxScrollPosition = ref(1);
const isDropping = ref(false);

async function sendMessage() {
  if (newMessageText.value.length < 1) return;

  const t = newMessageText.value;
  newMessageText.value = '';
  await c.sendMessage(t, attachedFile.value);
  attachedFile.value = null;
}

const attachedFile = ref<File | null>(null);
const attachedFileUrl = computed(() => {
  if (attachedFile.value) {
    return attachedFile.value.type.startsWith('image')
      ? URL.createObjectURL(attachedFile.value)
      : getMaterialFileIcon(attachedFile.value.name);
  }
  return '';
});

watch(
  () => c.model,
  () => {
    if (c.model == 'o3-mini') attachedFile.value = null;
  },
);

function checkFileAttachment() {
  window.ym && window.ym(98810411, 'reachGoal', 'ATTACH_FILE');
  if (c.currentUser == null) {
    c.messages.push({
      id: undefined,
      text: '',
      role: 'assistant',
      progress: true,
      tool_id: undefined,
      tool_name: undefined,
    });
    localStorage.setItem('stagedMessage', newMessageText.value);
    c.showSignInForm = true;
    c.isMessageLoading = false;
    return true;
  }

  // if (c.currentSubscription?.type == 'free') {
  //   c.miniPlansTitle = 'Прикреплять файлы можно в тарифах:';
  //   c.isShowMiniPlans = true;
  //   return true;
  // }
  return false;
}

function attachFile() {
  if (checkFileAttachment()) return;

  const fi: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('fileinput')
  );
  fi!.value = '';
  fi!.onchange = () => {
    if (fi!.files && fi!.files.length > 0) {
      // console.log('Выбран файл:', fi!.files);
      attachedFile.value = fi.files[0];
    }
  };
  // console.log(fi, fi.click);
  fi.click();
}

function scrollDown() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth', // Можно убрать 'smooth', если нужна мгновенная прокрутка
  });
}

function handleScroll() {
  scrollPosition.value = window.scrollY || 0;
  maxScrollPosition.value =
    (document.documentElement.scrollHeight || 0) - (window.innerHeight || 1);
}

const allowedExtensions = [
  '.c',
  '.cpp',
  '.cs',
  '.css',
  '.doc',
  '.docx',
  '.go',
  '.html',
  '.java',
  '.js',
  '.json',
  '.md',
  '.pdf',
  '.php',
  '.pptx',
  '.py',
  '.rb',
  '.sh',
  '.tex',
  '.ts',
  '.txt',
  '.png',
  '.jpg',
  '.fig',
  '.webp',
  '.xls',
  '.xlsx',
  '.csv',
];

function onDrop(event: DragEvent) {
  event.preventDefault();

  isDropping.value = false;

  if (checkFileAttachment()) return;

  if (event.dataTransfer) {
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const extension = file!.name.split('.').pop()?.toLowerCase();
      if (allowedExtensions.includes(`.${extension}`)) {
        attachedFile.value = file;
      }
    }
  }
}

function onPaste(event: ClipboardEvent) {
  if (event.clipboardData) {
    const items = Array.from(event.clipboardData.items);
    for (let item of items) {
      if (item.kind === 'file') {
        if (checkFileAttachment()) return;
        const file = item.getAsFile();
        const extension = file!.name.split('.').pop()?.toLowerCase();
        if (allowedExtensions.includes(`.${extension}`)) {
          attachedFile.value = file;
        }
        break;
      }
    }
  }
}

onMounted(async () => {
  handleScroll();
  window.addEventListener('scroll', handleScroll);

  const stagedMessage = localStorage.getItem('stagedMessage');
  if (stagedMessage) {
    newMessageText.value = stagedMessage;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', () => {
    scrollPosition.value = 0;
    maxScrollPosition.value = 0;
  });
});

watch(
  () => c.currentChat?.display_name,
  () => {
    useMeta({ title: c.currentChat?.display_name });
  },
);
</script>

<style lang="scss">
.msg-btn {
  transition: ease-in-out 0.2s;
}

.no-bg {
  background: none !important;
}

.cool-bg {
  background-image: url('/images/bg6.webp');
  background-size: cover;
  background-position: top;

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;

  transition: opacity ease-in-out 3.5s;
}

.body--light .cool-bg {
  background-image: url('/images/bg8.webp');
  background-position: center;
}
</style>

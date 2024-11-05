<template>
  <q-page class="q-pb-md column q-mx-auto" style="max-width: 820px">
    <WelcomeScreen
      v-if="
        (!c.currentChatId || c.messages.length == 0) &&
        !c.isMessageLoading &&
        !c.isChatLoading
      "
      style="height: calc(100vh - 200px)"
    ></WelcomeScreen>
    <div
      class="col q-px-md"
      v-else-if="!c.isChatLoading"
      style="max-width: 100%; overflow: hidden"
    >
      <template v-for="m in c.messages" :key="m.id">
        <template v-if="m.role == 'assistant'">
          <MarkDownRenderer :content="m.text" :in-progress="m.progress" />
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
        border-radius: 37px 37px 0px 0px;
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
        accept="image/*"
      />
      <q-input
        class="col"
        v-model="newMessageText"
        rounded
        outlined
        autogrow
        type="text"
        placeholder="Ваше сообщение..."
        input-style="padding-left: 20px; padding-right: 20px; margin-right: 20px; font-size: 1.1rem; font-weight: 400; max-height: 7em;"
        @keyup.enter="
          (e: KeyboardEvent) => {
            if (e.ctrlKey && !c.isMessageLoading) sendMessage();
          }
        "
      >
        <template v-slot:prepend>
          <q-btn
            v-if="!attachedFile"
            round
            flat
            @click="attachFile"
            :loading="c.isMessageLoading"
            icon="eva-attach"
          ></q-btn>

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
              style="position: absolute; top: -4px; right: -4px"
              @click="attachedFile = null"
            />
          </div>
        </template>
        <template v-slot:append>
          <q-btn
            class="bg-primary text-white q-pl-xs msg-btn"
            round
            flat
            icon="send"
            @touchstart="sendMessage"
            @click="sendMessage"
            :loading="c.isMessageLoading"
            :disable="newMessageText.length < 1"
            style="transform: translateX(4px); z-index: 8000"
          >
            <q-tooltip> CTRL + ENTER </q-tooltip>
          </q-btn>
        </template>
      </q-input>
      <div
        class="text-caption text-center text-grey q-mt-xs"
        style="word-wrap: none; text-overflow: ellipsis"
      >
        ИИ может ошибаться. Проверяйте важную информацию.
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

const c = useChatStore();

const newMessageText = ref('');
const scrollPosition = ref(0);
const maxScrollPosition = ref(1);

async function sendMessage() {
  if (newMessageText.value.length < 1) return;

  const t = newMessageText.value;
  newMessageText.value = '';
  await c.sendMessage(t, attachedFile.value);
  attachedFile.value = null;
}

const attachedFile = ref<File | null>(null);
const attachedFileUrl = computed(() =>
  attachedFile.value ? URL.createObjectURL(attachedFile.value) : '',
);

function attachFile() {
  const fi: HTMLInputElement = <HTMLInputElement>(
    document.getElementById('fileinput')
  );

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

.msg-btn:hover {
  transform: rotate(-90deg);
}

.no-bg {
  background: none !important;
}
</style>

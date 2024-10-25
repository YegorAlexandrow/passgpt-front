<template>
  <q-page class="q-pb-md column q-mx-auto" style="max-width: 820px">
    <WelcomeScreen
      v-if="(!c.currentChatId || c.messages.length == 0) && !c.isLoading"
      class="col"
    ></WelcomeScreen>
    <div class="col q-px-md" v-else style="max-width: 100%; overflow: hidden">
      <template v-for="m in c.messages" :key="m.id">
        <template v-if="m.role == 'assistant'">
          <MarkDownRenderer :content="m.text" :in-progress="m.progress" />
        </template>
        <template v-else-if="m.role == 'tool'">
          <ToolLabel :message="m"></ToolLabel>
        </template>
        <template v-else>
          <q-chat-message
            :text="[m.text]"
            sent
            class="q-mr-lg q-mt-lg q-mb-lg"
          ></q-chat-message>
        </template>
      </template>
      <div style="height: 400px"></div>
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
              ? 'translateY(calc(-100% - 6px))'
              : 'translateY(calc(-100% - 6px)) scale(0) rotate(180deg)',
        }"
        @click="scrollDown"
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
            if (e.ctrlKey && !c.isLoading) sendMessage();
          }
        "
      >
        <template v-slot:append>
          <q-btn
            class="bg-primary text-white q-pl-xs msg-btn"
            round
            flat
            icon="send"
            @click="sendMessage"
            :loading="c.isLoading"
            style="transform: translateX(4px); z-index: 1000"
          >
            <q-tooltip> CTRL + ENTER </q-tooltip>
          </q-btn>
        </template>
      </q-input>
      <div
        class="text-caption text-center text-grey q-mt-xs"
        style="word-wrap: none"
      >
        ИИ может ошибаться. Проверяйте важную информацию. Не делитесь
        персональными данными.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from 'src/stores/chatStore';
import MarkDownRenderer from 'src/components/MarkDownRenderer.vue';
import ToolLabel from 'src/components/ToolLabel.vue';
import WelcomeScreen from 'src/components/WelcomeScreen.vue';

const c = useChatStore();

const newMessageText = ref('');
const scrollPosition = ref(0);
const maxScrollPosition = ref(1);

async function sendMessage() {
  const t = newMessageText.value;
  newMessageText.value = '';
  await c.sendMessage(t);
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
  c.listChats();
  handleScroll();
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', () => {
    scrollPosition.value = 0;
    maxScrollPosition.value = 0;
  });
});
</script>

<style>
.q-message-text {
  border-radius: 20px 20px 0px 20px;
  padding: 15px;
}

.msg-btn {
  transition: ease-in-out 0.2s;
}

.msg-btn:hover {
  transform: rotate(-90deg);
}
</style>

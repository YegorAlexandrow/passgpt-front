<template>
  <q-page class="q-pb-md column q-mx-auto" style="max-width: 820px">
    <div
      class="col q-px-md"
      v-if="!c.isChatLoading"
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
    <div style="height: 400px">
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useChatStore } from 'src/stores/chatStore';
import MarkDownRenderer from 'src/components/MarkDownRenderer.vue';
import ToolLabel from 'src/components/ToolLabel.vue';

const c = useChatStore();

const scrollPosition = ref(0);
const maxScrollPosition = ref(1);

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
  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get('c');
  if (chatId) c.fetchSharedChatMessages(chatId);

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

<style lang="scss">
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

.q-message-text--sent::before {
  color: var(--q-message-bubble);
}
.q-message-text--sent {
  background: var(--q-message-bubble);
}
.q-message-text-content--sent {
  color: var(--q-message-bubble-text);
}
.no-bg {
  background: none !important;
}
</style>

<template>
  <q-layout view="lHh LpR lFf">
    <q-header style="background: none">
      <q-toolbar class="blurry">
        <q-btn
          icon="eva-menu-arrow-outline"
          size="md"
          flat
          round
          class="text-primary bg-secondary q-mr-sm"
          :style="{
            transition: 'ease-in-out 0.3s',
            transform: leftDrawerOpen ? 'unset' : 'scaleX(-1)',
          }"
          @click="leftDrawerOpen = !leftDrawerOpen"
        ></q-btn>
        <q-btn
          color="primary"
          icon="eva-edit-2-outline"
          size="md"
          round
          flat
          class="text-primary bg-secondary"
          @click="newChat"
        ></q-btn>
        <!-- <q-btn
          color="primary"
          icon="eva-edit-2-outline"
          size="md"
          flat
          round
          class="text-primary bg-secondary"
          @click="purchase"
          >PAY!</q-btn
        > -->
        <q-space></q-space>
        <BuyButton class="q-mr-md"></BuyButton>
        <UserBadge></UserBadge>
      </q-toolbar>
    </q-header>
    <!-- Navigation Drawer -->
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      bordered
      side="left"
      class="column q-mr-sm q-pt-xl"
    >
      <div
        v-if="!c.isChatListLoading && c.chats.length == 0"
        class="text-center text-body1 q-my-auto text-primary"
      >
        Здесь будут ваши чаты🗨️
      </div>
      <q-item-list>
        <q-item
          v-for="chat in c.chats"
          :key="chat.id"
          clickable
          v-ripple
          dense
          :active="c.currentChatId == chat.id"
          active-class="active-item"
          class="hoverable-item text-body1 q-py-xs"
          @click="c.fetchChatMessages(chat.id)"
        >
          <q-item-section>
            <q-item-label>{{ chat.display_name }}</q-item-label>
          </q-item-section>
          <q-item-section side class="action-button">
            <q-btn
              flat
              round
              icon="mdi-dots-vertical"
              size="sm"
              aria-label="Редактировать элемент"
            >
              <q-menu flat bordered>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup @click="shareChat(chat)">
                    <q-item-section avatar>
                      <q-icon name="ios_share" />
                    </q-item-section>
                    <q-item-section>Поделиться</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="renameChat(chat)">
                    <q-item-section avatar>
                      <q-icon name="eva-edit-outline" />
                    </q-item-section>
                    <q-item-section>Переименовать</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="confirmDelete(chat.id)"
                  >
                    <q-item-section avatar>
                      <q-icon color="negative" name="eva-trash-2-outline" />
                    </q-item-section>
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-item-list>

      <q-inner-loading :showing="c.isChatListLoading" class="text-primary">
        <q-spinner-hourglass size="sm" color="primary"></q-spinner-hourglass>
        Загружаем список чатов
      </q-inner-loading>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog v-model="showShareChatDialog">
      <ShareChatCard
        :link="shareChatDialogLink"
        :key="shareChatDialogLink"
      ></ShareChatCard>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore } from 'src/stores/chatStore';
import { useMeta, useQuasar } from 'quasar';
import UserBadge from 'src/components/UserBadge.vue';
import BuyButton from 'src/components/BuyButton.vue';
import ShareChatCard from 'src/components/ShareChatCard.vue';
import { Chat } from 'src/models/Chat';

const c = useChatStore();
const router = useRouter();
const $q = useQuasar();

const leftDrawerOpen = ref(true);

function newChat() {
  c.messages = [];
  c.currentChatId = null;
}

// async function purchase() {
//   const resp = await c.purchase();
//   console.log(resp);
// }

function confirmDelete(chatId: string) {
  $q.dialog({
    title: 'Подтвердите удаление',
    cancel: true,
    persistent: false,
    color: 'negative',
  })
    .onOk(async () => {
      await c.deleteChat(chatId);
    })
    .onCancel(() => {});
}

function renameChat(chat: Chat) {
  $q.dialog({
    title: 'Переименовать чат',
    prompt: {
      model: '',
      type: 'text', // optional
    },
    cancel: true,
    persistent: false,
    color: 'primary',
  })
    .onOk(async (data: string) => {
      await c.patchChat(chat, data);
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
}

const showShareChatDialog = ref(false);
const shareChatDialogLink = ref('');

async function shareChat(chat: Chat) {
  await c.patchChat(chat, chat.display_name, true);
  shareChatDialogLink.value = `${location.origin}/share?c=${chat.id}`;
  showShareChatDialog.value = true;
}

watch(
  () => c.currentChatId,
  () => {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    params.set('c', c.currentChatId || '');
    window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`);
  },
);

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
};

onMounted(async () => {
  const theme = localStorage.getItem('theme') || 'system';
  $q.dark.set(theme == 'system' ? 'auto' : theme == 'dark');

  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get('c');
  if (chatId) c.fetchChatMessages(chatId);

  if (isMobile()) leftDrawerOpen.value = false;

  await c.fetchUser();
  await c.fetchActualSubscription();

  if (!c.currentUser) {
    router.push('/login');
  }
});

watch(
  () => $q.dark.isActive,
  () => {
    useMeta({
      meta: {
        themeColor: {
          name: 'theme-color',
          content: $q.dark.isActive ? '#171717' : '#b388ff',
        },
      },
    });
  },
);
</script>
<style>
/* Контейнер для элемента списка */
.hoverable-item {
  transition: background-color 0.3s ease;
}

/* Изменение фона при наведении курсора */
.hoverable-item:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Выберите подходящий цвет */
}

/* Стилизация боковой кнопки */
.action-button {
  opacity: 0; /* Скрыть кнопку по умолчанию */
  transition: opacity 0.3s ease;
}

/* Показать кнопку при наведении курсора на элемент списка */
.hoverable-item:hover .action-button {
  opacity: 1;
}

.active-item {
  font-weight: 500;
  background-color: rgba(126, 87, 194, 0.15);
}

body {
  overflow-y: scroll;
}
</style>

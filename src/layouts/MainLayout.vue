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
          icon="mdi-chat-plus-outline"
          size="md"
          round
          flat
          class="text-primary bg-secondary q-mr-sm"
          @click="newChat"
        ></q-btn>
        <q-btn-dropdown
          color="primary"
          size="md"
          rounded
          flat
          dense
          no-caps
          :label="c.model"
          dropdown-icon="eva-chevron-down-outline"
          class="text-primary bg-secondary q-mr-sm q-pl-md"
        >
          <q-list class="text-body2" style="border-radius: 26px">
            <q-item clickable @click="c.model = 'gpt-4o-mini'">
              <q-item-section>
                <q-item-label class="text-bold q-mt-sm q-mb-xs"
                  >gpt-4o-mini</q-item-label
                >
                <q-item-label caption>Для повседневных задач</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              :disable="!c.currentUser || c.currentSubscription?.type == 'free'"
              @click="c.model = 'o3-mini'"
            >
              <q-item-section>
                <q-item-label class="text-bold q-mt-sm q-mb-xs"
                  >o3-mini</q-item-label
                >
                <q-item-label caption>Новая рассуждающая модель!</q-item-label>
                <q-item-label caption>Доступно в 💎БАЗОВЫЙ</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              :disable="!c.currentUser || c.currentSubscription?.type != 'pro'"
              @click="c.model = 'gpt-4o'"
            >
              <q-item-section>
                <q-item-label class="text-bold q-mt-sm q-mb-xs"
                  >gpt-4o</q-item-label
                >
                <q-item-label caption>Доступно в 👑ПРО</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!-- <q-btn
          v-if="!isMobile() && c.currentChat"
          color="primary"
          icon="ios_share"
          size="md"
          rounded
          flat
          class="text-primary bg-secondary q-mr-sm q-py-sm"
          @click="shareChat(c.currentChat)"
        >
          <span class="q-pl-xs">Поделиться</span>
        </q-btn> -->
        <q-btn
          v-if="
            messagesLeft != null &&
            messagesLeft <= 3 &&
            !isMobile() &&
            c.atLeastOneMessageSentNow
          "
          class="q-mx-sm bg-secondary"
          @click="
            () => {
              c.miniPlansTitle = 'ОТКРЫТЬ БОЛЬШЕ ВОЗМОЖНОСТЕЙ';
              c.isShowMiniPlans = true;
            }
          "
          rounded
          flat
          no-caps
        >
          {{ Math.max(0, messagesLeft) }}
          сообщ.
        </q-btn>
        <q-space></q-space>
        <BuyButton></BuyButton>
        <UserBadge v-if="c.currentUser || c.isUserLoading"></UserBadge>

        <q-dialog
          v-model="c.isShowPlans"
          full-width
          transition-show="slide-up"
          transition-hide="slide-down"
          transition-duration="500"
        >
          <div>
            <div class="row">
              <q-space></q-space>
              <q-btn
                dense
                round
                icon="close"
                color="primary"
                size="sm"
                class="q-mx-sm"
                @click="c.isShowPlans = false"
              />
            </div>
            <PlansList class="q-pa-none" :show-free="false"></PlansList>
          </div>
        </q-dialog>
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
      <q-items>
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
      </q-items>

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
    <q-dialog
      v-model="c.showSignInForm"
      transition-show="slide-up"
      transition-hide="slide-down"
      transition-duration="500"
      persistent
    >
      <SignInForm></SignInForm>
    </q-dialog>
    <q-dialog
      v-model="c.isShowMiniPlans"
      transition-show="slide-up"
      transition-hide="slide-down"
      transition-duration="500"
    >
      <MiniPlans :title="c.miniPlansTitle"></MiniPlans>
    </q-dialog>
    <q-dialog
      v-model="c.isShowPaymentDialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      transition-duration="500"
      persistent
    >
      <div>
        <div class="row">
          <q-space></q-space>
          <q-btn
            dense
            round
            flat
            icon="close"
            size="md"
            @click="c.isShowPaymentDialog = false"
          />
        </div>
        <PaymentDialog></PaymentDialog>
      </div>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useChatStore } from 'src/stores/chatStore';
import { useMeta, useQuasar } from 'quasar';
import UserBadge from 'src/components/UserBadge.vue';
import BuyButton from 'src/components/BuyButton.vue';
import ShareChatCard from 'src/components/ShareChatCard.vue';
import SignInForm from 'src/components/SignInForm.vue';
import PlansList from 'src/components/PlansList.vue';
import MiniPlans from 'src/components/MiniPlans.vue';
import { Chat } from 'src/models/Chat';
import { computed } from 'vue';
import PaymentDialog from 'src/components/PaymentDialog.vue';

const c = useChatStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);

function newChat() {
  c.messages = [];
  c.currentChatId = null;
}

// async function purchase() {
//   const resp = await c.purchase();
//   console.log(resp);
// }

// const getDeclensionOfMessages = (count: number) => {
//   const lastDigit = count % 10;
//   const lastTwoDigits = count % 100;

//   if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
//     return 'сообщений';
//   }

//   switch (lastDigit) {
//     case 1:
//       return 'сообщение';
//     case 2:
//     case 3:
//     case 4:
//       return 'сообщения';
//     default:
//       return 'сообщений';
//   }
// };

const messagesLeft = computed(() => {
  if (c.currentSubscription != null) {
    const delta =
      c.currentSubscription?.message_per_day_limit -
      c.currentSubscription.messages_in_last_day;

    return Date.now() - (c.currentSubscription?.last_message_at || 0) >
      24 * 3600 * 1000
      ? null
      : delta;
  }

  return null;
});

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

  window.ym && window.ym(98810411, 'reachGoal', 'SHARE_CHAT');
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

  await c.fetchUser();
  await c.fetchActualSubscription();
  await c.listChats();
  await c.listSubscriptions();

  if (urlParams.get('mp')) c.isShowMiniPlans = true;

  // if (isMobile())
  leftDrawerOpen.value = false;

  window.p = (x: string) => {
    c.purchase(x);
    window.ym && window.ym(98810411, 'reachGoal', 'PURCHASE_FROM_CHAT');
  };
  window.mp = () => {
    c.miniPlansTitle = 'ОТКРЫТЬ БОЛЬШЕ ВОЗМОЖНОСТЕЙ';
    c.isShowMiniPlans = true;
    window.ym && window.ym(98810411, 'reachGoal', 'PLANS_FROM_CHAT');
  };
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

<template>
  <q-card flat style="width: min(640px, 98vw); border-radius: 20px">
    <div class="card-header row">
      <q-tabs
        v-model="selectedTab"
        class="wrap-tabs col"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="general" label="Общие" />
        <q-tab name="activeSubscription" label="Подписка" />
        <q-tab name="subscriptionsHistory" label="История" />
      </q-tabs>
      <q-btn
        dense
        round
        icon="close"
        color="primary"
        size="sm"
        class="q-mx-sm"
        @click="emit('close')"
      />
    </div>

    <q-separator />

    <q-tab-panels
      v-model="selectedTab"
      style="height: 80vh; overflow-y: scroll"
    >
      <q-tab-panel name="general">
        <q-card-section>
          <q-select
            v-model="themeSelection"
            :options="[
              { value: 'system', label: 'Системная' },
              { value: 'light', label: 'Светлая' },
              { value: 'dark', label: 'Тёмная' },
            ]"
            emit-value
            map-options
            label="Выбор темы"
            outlined
          />
        </q-card-section>
      </q-tab-panel>

      <q-tab-panel name="activeSubscription">
        <q-card-section
          v-if="c.currentSubscription"
          class="column"
          style="height: 100%"
        >
          <p>
            <strong>План:</strong>
            {{ getSubDisplayName(c.currentSubscription.type) }}
          </p>
          <p>
            <strong>Статус:</strong>
            {{ getStatusDisplayName(c.currentSubscription.status) }}
          </p>
          <p v-if="c.currentSubscription.payment">
            <strong>Сумма:</strong> {{ c.currentSubscription.payment.amount }}
            {{ c.currentSubscription.payment.currency }}
          </p>
          <p>
            <strong>Дата создания:</strong>
            {{ formatDate(c.currentSubscription.created_at) }}
          </p>
          <p v-if="c.currentSubscription.activated_at">
            <strong>Дата активации:</strong>
            {{ formatDate(c.currentSubscription.activated_at) }}
          </p>
          <p>
            <strong>{{
              c.currentSubscription.status === 'frozen'
                ? 'Дата заморозки:'
                : 'Дата окончания:'
            }}</strong>
            {{
              formatDate(
                c.currentSubscription.status === 'frozen'
                  ? (c.currentSubscription.frozen_at ?? 0)
                  : (c.currentSubscription.expires_at ?? 0),
              )
            }}
          </p>
          <p>
            <strong>Последнее сообщение:</strong>
            {{ formatDate(c.currentSubscription.last_message_at ?? 0) }}
          </p>
          <p>
            <strong>Сообщений за последние сутки:</strong>
            {{ c.currentSubscription.messages_in_last_day }} /
            {{ c.currentSubscription.message_per_day_limit }}
          </p>
          <p v-if="c.currentSubscription.payment">
            <PrettyLink
              :to="`https://yoomoney.ru/checkout/payments/v2/contract?orderId=${c.currentSubscription.payment.provider_payment_id}`"
              label="Страница платежа"
            />
          </p>
          <BuyButton></BuyButton>
          <q-space></q-space>
          <q-btn
            v-if="
              !['free', 'daily_boost'].includes(c.currentSubscription.type) &&
              c.currentSubscription.status == 'active'
            "
            color="negative"
            outline
            rounded
            @click="showCancelDialog"
            >Отменить продление</q-btn
          >
        </q-card-section>
      </q-tab-panel>

      <q-tab-panel name="subscriptionsHistory" class="q-pa-sm">
        <q-card-section class="q-pa-sm">
          <q-list separator>
            <q-item
              v-for="(sub, index) in c.subscriptionHistory"
              :key="index"
              clickable
              class="q-py-lg"
            >
              <q-item-section>
                <div class="subscription-info">
                  <div class="text-h6 q-mb-md">
                    <strong>План:</strong> {{ getSubDisplayName(sub.type) }}
                    <br />
                    <q-chip
                      :color="getChipColor(sub.status)"
                      :icon="getChipIcon(sub.status)"
                      outline
                      dense
                      class="q-ml-none"
                    >
                      {{ getStatusDisplayName(sub.status) }}
                    </q-chip>
                  </div>
                  <div>
                    <strong>Дата создания:</strong>
                    {{ formatDate(sub.created_at) }}
                  </div>
                  <div>
                    <strong>{{
                      sub.status === 'frozen'
                        ? 'Дата заморозки:'
                        : 'Дата окончания:'
                    }}</strong>
                    {{
                      formatDate(
                        sub.status === 'frozen'
                          ? (sub.frozen_at ?? 0)
                          : (sub.expires_at ?? 0),
                      )
                    }}
                  </div>
                  <div class="payment-info" v-if="sub.payment">
                    <span
                      >Сумма: {{ sub.payment.amount }}
                      {{ sub.payment.currency }}</span
                    >
                    <PrettyLink
                      :to="`https://yoomoney.ru/checkout/payments/v2/contract?orderId=${sub.payment.provider_payment_id}`"
                      label="Страница платежа"
                    />
                  </div>
                </div>
              </q-item-section>
              <q-separator spaced inset />
            </q-item>
          </q-list>
        </q-card-section>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import PrettyLink from 'src/components/PrettyLink.vue';
import BuyButton from 'src/components/BuyButton.vue';
import { Dark } from 'quasar';
import { useChatStore } from 'src/stores/chatStore';

const emit = defineEmits(['close']);

const $q = useQuasar();
const c = useChatStore();
const selectedTab = ref<string>('general');
const themeSelection = ref<string>(localStorage.getItem('theme') || 'system');

function updateTheme(theme: string) {
  switch (theme) {
    case 'light':
      Dark.set(false);
      break;
    case 'dark':
      Dark.set(true);
      break;
    case 'system':
    default:
      Dark.set('auto');
      break;
  }
  localStorage.setItem('theme', theme);
}

// const selectedReason = ref([]);
const cancelReasons = [
  { label: 'Слишком дорого', value: 'expensive' },
  { label: 'Нашёл лучший сервис', value: 'better_service' },
  { label: 'Не использую', value: 'not_using' },
  { label: 'Проблемы с оплатой', value: 'payment_issues' },
  { label: 'Другое', value: 'other' },
];

function showCancelDialog() {
  $q.dialog({
    title: 'Отмена продления подписки',
    message:
      'Вы можете продолжать пользоваться подпиской до окончания её срока действия.',
    options: {
      type: 'checkbox',
      model: [],
      items: cancelReasons,
    },
    ok: {
      label: 'Подтвердить',
      color: 'negative',
      flat: true,
    },
    cancel: {
      label: 'Отмена',
      color: 'primary',
      flat: true,
    },
  }).onOk(() => {
    c.cancelSubscription();
  });
}

onMounted(async () => {
  await c.listSubscriptions();
});

// Watch for changes in theme selection
watch(themeSelection, (newTheme) => {
  updateTheme(newTheme);
});

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getSubDisplayName(sub: string) {
  return (
    {
      free: 'Пробный🌱',
      base: 'Базовый💎',
      base_special1: 'Базовый (special1)💎',
      base1: 'Базовый💎',
      pro: 'ПРО👑',
      daily_boost: 'DAILY BOOST⚡️',
    }[sub] || sub
  );
}

function getStatusDisplayName(status: string) {
  return (
    {
      pending: 'Ожидает оплаты',
      failed: 'Ошибка оплаты',
      active: 'Активная',
      frozen: 'Заморожена',
      expired: 'Истекла',
      canceled: 'Продление отменено',
    }[status] || status
  );
}

function getChipColor(status: string) {
  return (
    {
      pending: 'orange',
      failed: 'red',
      active: 'green',
      frozen: 'blue',
      expired: 'grey',
      canceled: 'red',
    }[status] || 'primary'
  );
}

function getChipIcon(status: string) {
  return (
    {
      pending: 'mdi-clock-outline',
      failed: 'mdi-alert-circle-outline',
      active: 'mdi-check-circle-outline',
      frozen: 'mdi-snowflake',
      expired: 'mdi-calendar-remove-outline',
      canceled: 'mdi-cancel',
    }[status] || 'mdi-information-outline'
  );
}
</script>

<style scoped>
.q-card {
  max-width: 600px;
  margin: 20px auto;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.wrap-tabs {
  flex-wrap: wrap;
  overflow: auto;
}

.scrollable-list {
  /* max-height: 300px; */
  overflow-y: auto;
}

.compact-section {
  padding: 8px;
}

.compact-item {
  padding: 4px 0;
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

@media (max-width: 600px) {
  .wrap-tabs {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>

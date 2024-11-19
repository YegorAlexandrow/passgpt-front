<template>
  <q-card
    class="q-pa-md"
    flat
    style="min-width: 400px; max-width: 100vw; border-radius: 30px"
  >
    <div class="text-h5 text-center q-my-sm" style="font-weight: bold">
      {{ props.title }}
    </div>
    <div class="row q-px-md q-mt-lg justify-center">
      <div
        class="column q-mx-sm q-py-md q-px-lg q-my-sm"
        v-for="(plan, i) in plans"
        :key="i"
        flat
        bordered
        style="border-radius: 34px; background: rgba(127, 127, 127, 0.1)"
      >
        <div class="text-h5 q-px-sm q-mb-lg" style="font-weight: 500">
          {{ plan.display_name }}
        </div>
        <div
          v-for="feature in plan.features"
          class="q-px-sm q-pb-sm q-pt-xs"
          v-html="feature"
          :key="feature"
        ></div>
        <q-space></q-space>
        <q-btn
          class="q-mt-lg text-h6"
          unelevated
          outline
          rounded
          @click="c.purchase(plan._id)"
        >
          <span
            v-if="plan.old_price"
            class="text-negative q-mr-sm"
            style="text-decoration: line-through"
          >
            {{ plan.old_price }} ₽
          </span>
          <span> {{ plan.price }} ₽ </span>
        </q-btn>
      </div>
    </div>
    <div
      class="q-mt-md text-center text-body2"
      style="cursor: pointer"
      @click="
        c.isShowMiniPlans = false;
        c.isShowPlans = true;
      "
    >
      <q-icon name="eva-info-outline"></q-icon>
      Подробнее про тарифы
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { useChatStore } from 'src/stores/chatStore';

const c = useChatStore();

const props = defineProps({
  title: {
    type: String,
    default: 'Прикреплять файлы можно в подписке!',
  },
});

const plans = [
  {
    _id: 'base',
    old_price: '149',
    price: '99',
    display_name: '💎 БАЗОВЫЙ',
    features: [
      '💬 <b>42</b> запроса в день',
      '🖼️ Работа с фото',
      '📂 Анализ файлов',
      '🔍 Поиск в интернете',
    ],
  },
  {
    _id: 'daily_boost',
    old_price: null,
    price: '59',
    display_name: '🚀 DAILY BOOST',
    features: [
      '💬 <b>151</b> запрос на день',
      '⚡ <b>ВСЁ</b> из Базового',
      '📅 <b>1</b> день',
    ],
  },
];
</script>
<style lang="scss" scoped></style>

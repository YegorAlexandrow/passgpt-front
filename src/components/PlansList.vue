<template>
  <q-card class="scrollable-container" flat>
    <div class="row horizontal-scroll">
      <q-card
        class="col q-ma-xs column scroll-item"
        v-for="plan in filteredPlans"
        :key="plan._id"
        flat
        bordered
      >
        <q-card-section class="row items-center q-pt-lg">
          <div class="text-h5" style="font-weight: 500">
            {{ plan.display_name }}
          </div>
          <q-space></q-space>
          <div class="col-auto text-h5 text-primary" v-if="plan.price">
            {{ `${plan.price} ₽` }}
          </div>
        </q-card-section>
        <q-card-section class="text-body1" style="height: 5em">
          {{ plan.comment }}
        </q-card-section>

        <q-separator />

        <q-card-section class="col q-pt-none">
          <div
            v-for="(feature, index) in plan.features"
            :key="index"
            class="row items-center q-mt-md no-wrap"
          >
            <q-icon :name="feature.icon" color="accent" class="q-mr-sm" />
            <div class="column">
              <div v-html="feature.title"></div>
              <div
                class="text-body2 text-grey"
                v-if="feature.subtitle"
                v-html="feature.subtitle"
              ></div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="row q-mt-lg" v-if="plan.action">
          <q-btn
            class="col q-py-md text-h6"
            color="primary"
            @click="plan.action.callback"
            unelevated
            rounded
          >
            {{ plan.action.title }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { useChatStore } from 'src/stores/chatStore';
import { computed } from 'vue';

const c = useChatStore();

const props = defineProps({
  showFree: {
    type: Boolean,
    default: true,
  },
});

const plans = [
  {
    _id: 'free',
    display_name: '🌱БЕСПЛАТНО',
    price: null,
    comment: 'Начальный уровень для знакомства с основными функциями',
    features: [
      {
        title: 'До <b>7</b> сообщений ChatGPT в день',
        icon: 'eva-checkmark',
      },
      {
        title: 'До <b>7</b> генераций картинок в день',
        icon: 'eva-checkmark',
      },
      {
        title: 'Доступ к базовым функциям',
        subtitle: 'Для комфортного старта',
        icon: 'eva-checkmark',
      },
    ],
    action: {
      title: 'Попробовать',
      callback: () => c.purchase('free'),
    },
  },
  {
    _id: 'base',
    display_name: '🚀БАЗОВЫЙ',
    price: '120',
    comment: 'Расширенные возможности для активного взаимодействия',
    features: [
      {
        title: '<b>42</b> сообщения ChatGPT в день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>42</b> генераций картинок в день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'Поиск в интернете',
        icon: 'eva-plus',
      },
      {
        title: 'Доступ к актуальным новостям',
        icon: 'eva-plus',
      },
    ],
    action: {
      title: 'Выбрать',
      callback: () => c.purchase('base'),
    },
  },
  {
    _id: 'daily_boost',
    display_name: '⚡️DAILY BOOST',
    price: '60',
    comment: 'Интенсивный заряд возможностей на один день',
    features: [
      {
        title: '<b>151</b> сообщение ChatGPT на день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>151</b> генерации картинок',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'Поиск в интернете',
        icon: 'eva-checkmark',
      },
      {
        title: 'Доступ к актуальным новостям',
        icon: 'eva-checkmark',
      },
    ],
    action: {
      title: 'Выбрать',
      callback: () => c.purchase('base'),
    },
  },
  {
    _id: 'pro',
    display_name: '👑ПРО',
    price: '360',
    comment: 'Полный доступ к эксклюзивным функциям и мощным инструментам',
    features: [
      {
        title: '<b>101</b> сообщение ChatGPT в день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>101</b> генерации картинок',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'Поиск в интернете',
        icon: 'eva-checkmark',
      },
      {
        title: 'Доступ к актуальным новостям',
        icon: 'eva-checkmark',
      },
      {
        title: 'Эксклюзивный доступ к <strong>GPT-o1</strong>',
        subtitle: 'Для самых сложных задач и решений',
        icon: 'eva-plus',
      },
      {
        title: 'Работа с фото',
        subtitle: 'Для анализа изображений, распознавания текста',
        icon: 'eva-plus',
      },
      {
        title: 'Будет позже!🕓',
        icon: '',
      },
    ],
    action: {
      title: 'Следить за обновлениями',
      callback: () => c.subscribeEmail('pro_waitlist'),
    },
  },
];

const filteredPlans = computed(() => {
  return plans.filter((x) => x._id != 'free' || props.showFree);
});
</script>
<style>
.scrollable-container {
  width: 100%; /* Задает ширину контейнера */
  overflow-x: auto; /* Включает горизонтальную прокрутку */
  scroll-snap-type: x mandatory;
  scroll-padding: 4px;
}

.horizontal-scroll {
  display: flex; /* Использование флекс-контейнера */
  flex-wrap: nowrap; /* Запрещает перенос элементов */
}

.scroll-item {
  border-radius: 33px;
  min-width: 340px !important;
  scroll-snap-align: start;
}

@media screen and (max-width: 480px) {
  .scroll-item {
    flex: 0 0 auto; /* Отключаем сжатие и перенос */
    width: calc(100vw - 8px) !important;
  }
}
</style>

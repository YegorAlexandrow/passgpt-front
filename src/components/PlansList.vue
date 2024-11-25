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
            <!-- Если есть скидка, выводим старую цену с зачёркиванием -->
            <!-- <span
              v-if="plan.discount"
              class="text-negative"
              style="text-decoration: line-through"
            >
              {{ `${plan.price} ₽` }}
            </span> -->
            <!-- Отображение скидочной цены, если она указана -->
            <!-- <span v-if="plan.discount" class="q-ml-sm text-bold">{{
              `${plan.discount} ₽`
            }}</span> -->
            <!-- Отображение обычной цены, если скидка не указана -->
            <span class="q-ml-sm text-bold">{{ `${plan.price} ₽` }}</span>
          </div>
        </q-card-section>

        <q-card-section
          style="height: 5em; font-size: 1.3rem"
          class="text-center"
        >
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
            v-if="plan._id != 'free' || props.showFreeButton"
            class="col q-py-md text-h6"
            color="primary"
            @click="props.forLanding ? goToApp() : plan.action.callback()"
            unelevated
            rounded
          >
            {{ plan.action.title }}
          </q-btn>
          <q-btn
            v-else
            outline
            unelevated
            rounded
            class="col q-py-md text-h6"
            disabled
            no-caps
            >Уже у Вас</q-btn
          >
        </q-card-actions>
      </q-card>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { useChatStore } from 'src/stores/chatStore';
import { computed } from 'vue';

const c = useChatStore();

function goToApp() {
  location.href = 'https://ask.wowgpt.ru';
}

const props = defineProps({
  showFree: {
    type: Boolean,
    default: true,
  },
  showFreeButton: {
    type: Boolean,
    default: true,
  },
  forLanding: {
    type: Boolean,
    default: false,
  },
});

const plans = [
  {
    _id: 'free',
    display_name: '🌱ПРОБНЫЙ',
    price: null,
    comment: 'Для тех, кто только начинают работать с ChatGPT',
    features: [
      {
        title: 'До <b>6</b> сообщений ChatGPT в день',
        icon: 'eva-checkmark',
      },
      {
        title: 'До <b>6</b> генераций картинок в день',
        icon: 'eva-checkmark',
        subtitle: '',
      },
    ],
    action: {
      title: 'Попробовать',
      callback: () => c.purchase('free'),
    },
  },
  {
    _id: 'daily_boost',
    display_name: '🚀DAILY BOOST',
    price: '59',
    comment: 'Интенсивный заряд возможностей на один день',
    features: [
      {
        title: '<b>151</b> сообщение ChatGPT на 1 день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>151</b> генерации картинок',
        icon: 'eva-arrowhead-up',
      },
      {
        title: '<b>ВСЕ</b> возможности тарифа 💎БАЗОВЫЙ',
        icon: 'eva-plus',
        subtitle: '',
      },
    ],
    action: {
      title: 'Начать сейчас',
      callback: () => c.purchase('daily_boost'),
    },
  },
  {
    _id: 'base',
    display_name: '💎БАЗОВЫЙ',
    price: '149',
    // discount: '99', // Указываем скидочную цену
    comment: 'Вывести продуктивность на новый уровень!',
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
        title: 'Поиск в интернете 🔍',
        icon: 'eva-plus',
      },
      {
        title: 'Доступ к новостям 📰',
        icon: 'eva-plus',
      },
      {
        title: 'Работа с фото 🖼️',
        subtitle: 'Для анализа изображений, распознавания текста',
        icon: 'eva-plus',
      },
      {
        title: 'Анализ файлов 📂',
        subtitle: 'Загружайте документы, презентации, таблицы, код',
        icon: 'eva-plus',
      },
    ],
    action: {
      title: 'Начать сейчас',
      callback: () => c.purchase('base'),
    },
  },
  // {
  //   _id: 'pro',
  //   display_name: '👑ПРО',
  //   price: '399',
  //   comment: 'Полный доступ к эксклюзивным функциям и мощным инструментам',
  //   features: [
  //     {
  //       title: '<b>101</b> сообщение ChatGPT в день',
  //       icon: 'eva-arrowhead-up',
  //     },
  //     {
  //       title: 'До <b>101</b> генерации картинок',
  //       icon: 'eva-arrowhead-up',
  //     },
  //     {
  //       title: 'Работа с фото',
  //       subtitle: 'Для анализа изображений, распознавания текста',
  //       icon: 'eva-checkmark',
  //     },
  //     {
  //       title: 'Поиск в интернете',
  //       icon: 'eva-checkmark',
  //     },
  //     {
  //       title: 'Доступ к актуальным новостям',
  //       icon: 'eva-checkmark',
  //     },
  //     {
  //       title: 'Эксклюзивный доступ к <strong>GPT-o1</strong>',
  //       subtitle: 'Для самых сложных задач и решений',
  //       icon: 'eva-plus',
  //     },
  //     {
  //       title: 'Будет позже!🕓',
  //       icon: '',
  //     },
  //   ],
  //   action: {
  //     title: 'Следить за обновлениями',
  //     callback: () => c.subscribeEmail('pro_waitlist'),
  //   },
  // },
];

// Фильтрация планов в зависимости от showFree
const filteredPlans = computed(() => {
  return plans.filter((x) => x._id != 'free' || props.showFree);
});
</script>

<style>
.scrollable-container {
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 3px;
}

.horizontal-scroll {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.scroll-item {
  border-radius: 33px;
  min-width: 340px !important;
  max-width: 450px !important;
  scroll-snap-align: start;
}

@media screen and (max-width: 480px) {
  .scroll-item {
    flex: 0 0 auto;
    width: calc(100vw - 8px) !important;
  }
}
</style>

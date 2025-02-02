<template>
  <q-card class="scrollable-container" flat>
    <div class="row horizontal-scroll">
      <q-card
        class="col q-ma-xs column scroll-item"
        v-for="plan in filteredPlans"
        :key="plan._id + c.subscriptionHistory.length"
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
            <span
              v-if="plan.discount"
              class="text-negative"
              style="text-decoration: line-through"
            >
              {{ `${plan.price} ₽` }}
            </span>
            <!-- Отображение скидочной цены, если она указана -->
            <span v-if="plan.discount" class="q-ml-sm text-bold">{{
              `${plan.discount} ₽`
            }}</span>
            <!-- Отображение обычной цены, если скидка не указана -->
            <span v-else class="q-ml-sm text-bold">{{
              `${plan.price} ₽`
            }}</span>
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
import { Subscription, SubStatus } from 'src/models/User';
import { useChatStore } from 'src/stores/chatStore';
import { computed, onMounted, ref } from 'vue';

const c = useChatStore();

function goToApp() {
  location.href = 'https://ask.wowgpt.ru';
}

const isBaseOneAllowed = computed(() => {
  return (
    props.forLanding ||
    c.subscriptionHistory.every(
      (s: Subscription) =>
        s.type != 'base1' ||
        ![
          SubStatus.ACTIVE,
          SubStatus.FROZEN,
          SubStatus.CANCELED,
          SubStatus.EXPIRED,
        ].includes(s.status),
    )
  );
});

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

onMounted(async () => {
  await c.listSubscriptions();
});

const plans = ref([
  {
    _id: 'free',
    display_name: '🌱ПРОБНЫЙ',
    price: null,
    comment: 'Для тех, кто только начинают работать с ChatGPT',
    features: [
      {
        title: 'До <b>12</b> сообщений ChatGPT в день',
        icon: 'eva-checkmark',
      },
      {
        title: '<b>4</b> генерации картинок',
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
    price: '99',
    comment: 'Интенсивный заряд возможностей на один день',
    features: [
      {
        title: '<b>151</b> сообщение ChatGPT на 1 день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>36</b> сообщений o3-mini в день',
        subtitle: 'Одно сообщение o3-mini считается за 4 сообщения',
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
    _id: isBaseOneAllowed.value ? 'base1' : 'base',
    display_name: '💎БАЗОВЫЙ',
    price: '149',
    discount: isBaseOneAllowed.value ? '1' : undefined, // Указываем скидочную цену
    comment: 'Вывести продуктивность на новый уровень!',
    features: [
      {
        title: '<b>42</b> сообщения ChatGPT в день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>10</b> сообщений o3-mini в день',
        subtitle: 'Одно сообщение o3-mini считается за 4 сообщения',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>10</b> генераций картинок в день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'Поиск в интернете',
        icon: 'eva-plus',
      },
      {
        title: 'Работа с фото',
        subtitle: 'Для анализа изображений, распознавания текста',
        icon: 'eva-plus',
      },
      {
        title: 'Анализ файлов',
        subtitle: 'Загружайте документы, презентации, таблицы, код',
        icon: 'eva-plus',
      },
      isBaseOneAllowed.value
        ? {
            title: '🎁 Первый месяц - 1 рубль',
            subtitle: 'Дальше 149 руб/мес. Отменить можно в любой момент',
            icon: 'eva-check',
          }
        : { title: '' },
    ],
    action: {
      title: 'Начать сейчас',
      callback: () => c.purchase(isBaseOneAllowed.value ? 'base1' : 'base'),
    },
  },
  {
    _id: 'pro',
    display_name: '👑 ПРО',
    price: '399',
    comment: 'Для сложных задач',
    features: [
      {
        title: 'До <b>200</b> сообщений ChatGPT в день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>50</b> сообщений o3-mini в день',
        subtitle: 'Одно сообщение o3-mini считается за 4 сообщения',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>40</b> сообщений GPT-4o в день',
        subtitle: 'Одно сообщение GPT-4o считается за 5 сообщения',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'До <b>20</b> генераций картинок в день',
        icon: 'eva-arrowhead-up',
      },
      {
        title: 'Поиск в интернете',
        icon: 'eva-plus',
      },
      {
        title: 'Работа с фото',
        subtitle: 'Для анализа изображений, распознавания текста',
        icon: 'eva-plus',
      },
      {
        title: 'Анализ файлов',
        subtitle: 'Загружайте документы, презентации, таблицы, код',
        icon: 'eva-plus',
      },
    ],
    action: {
      title: 'Начать сейчас',
      callback: () => c.purchase('pro'),
    },
  },
]);

// Фильтрация планов в зависимости от showFree
const filteredPlans = computed(() => {
  return plans.value.filter((x) => x._id != 'free' || props.showFree);
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

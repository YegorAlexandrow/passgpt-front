<template>
  <div class="column justify-center text-center">
    <div class="text-h2 text-primary q-mb-lg" style="font-weight: 400">
      Привет!
    </div>
    <div class="text-h4">Чем Вам помочь?</div>
    <div class="row q-mt-xl">
      <q-card
        v-for="p in pickedPropmpts"
        :key="p.text"
        class="col q-mx-sm prompt-card"
        style="border-radius: 20px"
        flat
        bordered
        @click="c.sendMessage(p.text)"
      >
        <q-card-section class="text-h4 q-pb-none">{{ p.emoji }}</q-card-section>
        <q-card-section>{{ p.text }}</q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useChatStore } from 'src/stores/chatStore';

const c = useChatStore();

const prompts = [
  // Учёба и образование (новая категория)
  { emoji: '📚', text: 'Помоги написать эссе по литературе' },
  { emoji: '🔬', text: 'Объясни концепцию квантовой физики' },
  { emoji: '📝', text: 'Как правильно оформить реферат?' },
  { emoji: '🧪', text: 'Идеи для научного проекта' },
  { emoji: '📖', text: 'Составь план подготовки к экзамену' },

  // Карьера и развитие (обновлённая категория "Работа")
  { emoji: '💼', text: 'Как написать эффективное резюме?' },
  { emoji: '🗣️', text: 'Советы для успешного собеседования' },
  { emoji: '📈', text: 'Как развить навыки тайм-менеджмента?' },
  { emoji: '👥', text: 'Как работать в команде над проектом?' },
  { emoji: '🌐', text: 'Возможности стажировок за рубежом' },

  // Лайфстайл и хобби (замена менее релевантных категорий)
  { emoji: '🎨', text: 'Идеи для творческих проектов' },
  { emoji: '🏋️', text: 'Как поддерживать здоровый образ жизни в универе' },
  { emoji: '🍳', text: 'Быстрые рецепты для студентов' },
  { emoji: '🎵', text: 'Музыка для концентрации' },
  { emoji: '🎮', text: 'Рекомендуй игры для отдыха' },

  // Технологии и гаджеты (новая категория)
  { emoji: '💻', text: 'Лучшие приложения для учёбы' },
  { emoji: '📱', text: 'Как оптимизировать смартфон для работы' },
  { emoji: '🔧', text: 'Советы по выбору ноутбука' },
  { emoji: '🌐', text: 'Онлайн-курсы для саморазвития' },
  { emoji: '🖥️', text: 'Настройка рабочего пространства' },

  // Финансы для студентов (обновлённая категория "Финансы")
  { emoji: '💰', text: 'Как сэкономить на бюджете студента?' },
  { emoji: '💳', text: 'Студенческие банковские предложения' },
  { emoji: '📊', text: 'Инвестиции для начинающих' },
  { emoji: '🏷️', text: 'Где найти скидки и акции?' },
  { emoji: '🛒', text: 'Как экономно совершать покупки' },
];

function getRandomPrompts(count = 3) {
  const shuffled = prompts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const pickedPropmpts = ref(getRandomPrompts());
</script>
<style scoped>
.prompt-card {
  cursor: pointer;
  transition: ease-in-out 0.2s;
}

.prompt-card:hover {
  transform: rotate(-7deg);
}
</style>

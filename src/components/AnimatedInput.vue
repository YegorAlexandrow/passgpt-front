<template>
  <q-input
    v-model="newMessageText"
    rounded
    outlined
    type="text"
    placeholder="Ваше сообщение..."
    input-style="padding-left: 12px; padding-bottom: 12px;"
  >
  </q-input>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const prompts = [
  // Учёба и образование
  { emoji: '📝', text: 'Помоги написать реферат' },
  { emoji: '📚', text: 'Объясни сложную тему' },
  { emoji: '🎓', text: 'Как подготовиться к экзамену?' },
  { emoji: '🔬', text: 'Реши задачу по физике' },
  { emoji: '📖', text: 'Составь план урока' },

  // Карьера и развитие
  { emoji: '💼', text: 'Как создать резюме?' },
  { emoji: '🗣️', text: 'Подготовься к собеседованию' },
  { emoji: '📈', text: 'Развивай тайм-менеджмент' },
  { emoji: '👥', text: 'Как работать в команде?' },
  { emoji: '🌐', text: 'Найди стажировку за рубежом' },

  // Лайфстайл и хобби
  { emoji: '🎨', text: 'Предложи идеи для творчества' },
  { emoji: '🏋️', text: 'Как вести ЗОЖ студенту?' },
  { emoji: '🍳', text: 'Подскажи быстрые рецепты' },
  { emoji: '🎵', text: 'Порекомендуй музыку для учёбы' },
  { emoji: '🎮', text: 'Какие игры для отдыха?' },

  // Технологии и гаджеты
  { emoji: '💻', text: 'Рекомендуй приложения для учёбы' },
  { emoji: '📱', text: 'Как оптимизировать смартфон?' },
  { emoji: '🔧', text: 'Помоги выбрать ноутбук' },
  { emoji: '🌐', text: 'Найди онлайн-курсы развития' },
  { emoji: '🖥️', text: 'Настрой рабочее место' },

  // Финансы для студентов
  { emoji: '💰', text: 'Как экономить студенту?' },
  { emoji: '💳', text: 'Какие есть студенческие карты?' },
  { emoji: '📊', text: 'С чего начать инвестировать?' },
  { emoji: '🏷️', text: 'Где найти скидки?' },
  { emoji: '🛒', text: 'Как экономно покупать?' },

  // Здоровье и благополучие
  { emoji: '🧘', text: 'Как справиться со стрессом?' },
  { emoji: '💤', text: 'Как улучшить сон?' },
  { emoji: '🍏', text: 'Что есть для здоровья?' },
  { emoji: '🏃', text: 'Как тренироваться дома?' },
  { emoji: '🧠', text: 'Как развить память?' },

  // Социальная жизнь
  { emoji: '👫', text: 'Как найти друзей?' },
  { emoji: '🎉', text: 'Предложи идеи для вечеринок' },
  { emoji: '💬', text: 'Как улучшить общение?' },
  { emoji: '🌍', text: 'Как стать волонтёром?' },
  { emoji: '🎭', text: 'Какие события в городе?' },

  // Учебные материалы
  { emoji: '📖', text: 'Рекомендуй книги по теме' },
  { emoji: '📝', text: 'Как вести конспекты?' },
  { emoji: '🔎', text: 'Найди полезные статьи' },
  { emoji: '🖇️', text: 'Как организовать заметки?' },
  { emoji: '📅', text: 'Как планировать учёбу?' },
];

const newMessageText = ref('');
const targetText = ref(prompts[0].text);

function getRandomPrompts(count = 3) {
  const shuffled = prompts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

onMounted(() => {
  let index = 0;
  let phase = 1;
  const caret = '⬤';

  function typeText() {
    if (index >= targetText.value.length + 10) {
      phase = -1;
    }

    if (index <= 1) {
      targetText.value = getRandomPrompts(1)[0].text;
      phase = 1;
    }

    newMessageText.value = targetText.value.substring(0, index + phase) + caret;
    index += phase;
    setTimeout(typeText, 42);
  }
  typeText();
});
</script>
<style>
.msg-btn {
  transition: ease-in-out 0.2s;
}

.msg-btn:hover {
  transform: rotate(-90deg);
}
</style>

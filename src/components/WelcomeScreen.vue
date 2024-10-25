<template>
  <div class="column justify-center text-center">
    <div class="text-h2 text-primary q-mb-lg">Привет!</div>
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
  { emoji: '🦸‍♂️', text: 'Придумай историю про супергероя-акулу' },
  { emoji: '📄', text: 'Помоги понять технический документ' },
  { emoji: '📚', text: 'Подготовь задания для изучения слов' },
  { emoji: '✈️', text: 'Расскажи, как вести себя в Сеуле' },
  { emoji: '📝', text: 'Подготовь к экзамену' },
  { emoji: '🎨', text: 'Предложи идею для картины' },
  { emoji: '🛠️', text: 'Объясни, как настроить оборудование' },
  { emoji: '🎬', text: 'Посоветуй фильм на вечер' },
  { emoji: '📅', text: 'Организуй мой день' },
  { emoji: '💡', text: 'Предложи идею для стартапа' },
  { emoji: '🍲', text: 'Подбери рецепт на ужин' },
  { emoji: '🚀', text: 'Объясни концепцию космоса' },
  { emoji: '🧳', text: 'Составь план путешествия' },
  { emoji: '🏋️‍♂️', text: 'Сделай программу тренировок' },
  { emoji: '🎧', text: 'Подбери плейлист для работы' },
  { emoji: '💼', text: 'Помоги написать резюме' },
  { emoji: '💬', text: 'Составь текст для презентации' },
  { emoji: '🌍', text: 'Расскажи про интересные места в мире' },
  { emoji: '👨‍🍳', text: 'Предложи оригинальное блюдо' },
  { emoji: '📅', text: 'Запланируй неделю' },
  { emoji: '🎤', text: 'Помоги подготовить речь' },
  { emoji: '📱', text: 'Подбери полезные приложения' },
  { emoji: '✍️', text: 'Напиши письмо' },
  { emoji: '🏖️', text: 'Организуй отпуск' },
  { emoji: '💼', text: 'Подготовь к собеседованию' },
  { emoji: '🎁', text: 'Посоветуй подарок' },
  { emoji: '💬', text: 'Помоги улучшить ораторские навыки' },
  { emoji: '🛋️', text: 'Предложи идеи для декора комнаты' },
  { emoji: '✈️', text: 'Построй маршрут путешествия' },
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

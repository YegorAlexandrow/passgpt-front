<template>
  <div class="text-h6 q-mt-lg">
    Пользовательские Инструкции <q-badge rounded color="accent">new</q-badge>
  </div>
  <p class="text-body1 q-mt-md q-mb-sm">
    Что ChatGPT должен знать о Вас, чтобы отвечать лучше?
    <q-icon name="eva-question-mark-circle-outline">
      <q-tooltip class="bg-primary text-body1">
        Например:
        <ul>
          <li>Где вы живете?</li>
          <li>Чем вы занимаетесь?</li>
          <li>Какие у вас хобби и интересы?</li>
          <li>О каких темах вы можете говорить часами?</li>
          <li>Какие цели у вас есть?</li>
        </ul>
      </q-tooltip>
    </q-icon>
  </p>
  <q-input
    v-model="aboutUser"
    outlined
    type="textarea"
    class="text-caption"
    rows="3"
    counter
    maxlength="1400"
  ></q-input>

  <p class="text-body1 q-mt-md q-mb-sm">
    Как вы хотите, чтобы ChatGPT отвечал?
    <q-icon name="eva-question-mark-circle-outline">
      <q-tooltip class="bg-primary text-body1">
        Например:
        <ul>
          <li>Насколько формально?</li>
          <li>Длинно или коротко?</li>
          <li>Как к вам обращаться?</li>
          <li>Должен ли ChatGPT иметь мнение?</li>
        </ul>
        GPT гораздо лучше понимает четкие инструкции. Вместо формулировки 'Не
        пиши нумерованными списками' лучше использовать 'Пиши сплошным текстом
        вместо нумерованных списков'.
      </q-tooltip>
    </q-icon>
  </p>
  <q-input
    v-model="aboutModel"
    outlined
    type="textarea"
    class="text-caption"
    rows="5"
    counter
    maxlength="1400"
  ></q-input>
  <div class="row q-mt-md">
    <q-space></q-space>
    <q-btn
      class="bg-primary"
      rounded
      :disable="!isSaveButtonEnabled"
      @click="onSave"
      >Сохранить</q-btn
    >
  </div>
</template>
<script setup lang="ts">
import { useChatStore } from 'src/stores/chatStore';
import { computed, onMounted, ref } from 'vue';

const c = useChatStore();
const aboutUser = ref('');
const aboutModel = ref('');

const isSaveButtonEnabled = computed(() => {
  return (
    c.userInstruction &&
    (c.userInstruction.about_user != aboutUser.value ||
      c.userInstruction.about_model != aboutModel.value)
  );
});

const onSave = async () => {
  c.userInstruction!.about_model = aboutModel.value;
  c.userInstruction!.about_user = aboutUser.value;
  await c.saveUserInstruction();
};

onMounted(async () => {
  await c.fetchUserInstruction();
  aboutUser.value = c.userInstruction?.about_user || '';
  aboutModel.value = c.userInstruction?.about_model || '';
});
</script>

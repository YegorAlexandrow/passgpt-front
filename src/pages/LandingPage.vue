<template>
  <header class="app-navbar">
    <img
      id="logo-header"
      src="/images/logo1.svg"
      style="height: 100%; padding: 6px; padding-left: 12px"
    />
    <q-space></q-space>
    <q-btn
      id="btn-start-navbar"
      :to="appLink"
      class="button-gradient w-boxy q-mx-md"
      rounded
    >
      Войти
    </q-btn>
  </header>
  <main>
    <section class="app-screen row">
      <!-- <TestPage style="position: absolute; z-index: -1"></TestPage> -->
      <div
        class="column blurry q-pl-xl q-pr-md"
        style="max-width: 820px; border-radius: 0 0 40px 0"
      >
        <q-space></q-space>
        <div id="hero" class="w-h1">WowGPT</div>
        <div class="w-h3">Доступ к ChatGPT на русском языке</div>
        <div class="w-body q-mt-lg">
          Для учёбы, работы и творчества<br />
          Удобный доступ, русский язык<br />
          Никаких VPN, зарубежных карт и номеров
        </div>
        <div class="q-mt-xl">
          <q-btn
            id="btn-start-hero"
            :to="loginLink"
            class="button-gradient w-h3 q-px-lg"
            rounded
            >Начать сейчас</q-btn
          >
        </div>
        <q-space></q-space>
      </div>
      <SpiralText
        class="col"
        style="
          position: absolute;
          width: 100vh;
          aspect-ratio: 1 / 1;
          right: 0;
          top: 50vh;
          z-index: -1;
          opacity: 0.5;
        "
        text-content="///////ИДЕИ РАСКРУЧИВАЮТСЯ. ДОСТУП К CHATGPT ОТ OPENAI. ПОГРУЗИТЕСЬ В СПИРАЛЬ ВОЗМОЖНОСТЕЙ И ОТКРОЙТЕ ДЛЯ СЕБЯ ИСКУССТВЕННЫЙ ИНТЕЛЛЕКТ БЕЗ ОГРАНИЧЕНИЙ"
      ></SpiralText>
    </section>
    <section class="app-part-screen snap-start row q-py-xl">
      <div class="col column q-pl-lg q-pr-md">
        <q-space></q-space>
        <div id="cases" class="w-h1 q-pb-lg text-center">Что может WowGPT?</div>
        <p class="w-body q-mx-auto" style="max-width: 820px">
          WowGPT может общаться с вами, редактировать тексты, писать код,
          отвечать на ваши вопросы, создавать изображения и находить нужную
          информацию в интернете. Под капотом - ChatGPT
        </p>
        <q-space></q-space>
      </div>
    </section>
    <section
      class="app-part-screen snap-start q-my-xl q-py-xl row"
      v-for="(s, i) in landingSamples"
      :key="i"
    >
      <div class="col conversation q-ml-lg q-ml-auto" style="max-width: 820px">
        <FadeInContainer direction="right">
          <template v-for="(p, i) in s.prompt" :key="i">
            <div class="row">
              <q-space></q-space>
              <img
                :src="p.src"
                v-if="p.type == 'img'"
                class="q-message__image"
              />
            </div>
            <div class="row">
              <q-space></q-space>
              <q-chat-message
                v-if="p.type == 'text'"
                :text="[p.text]"
                sent
                class="q-mr-lg q-mt-lg q-mb-lg"
                bg-color="var(--q-message-bubble)"
                style="white-space: pre-wrap; max-width: 300px"
              ></q-chat-message>
            </div>
          </template>
        </FadeInContainer>
        <FadeInContainer direction="left">
          <ExpandableContainer :id="`case-${i}-resp`">
            <template v-for="r in s.resp" :key="r">
              <ToolLabel
                v-if="r.type == 'tool'"
                :message="{
                  role: 'tool',
                  text: r.text,
                  progress: false,
                  tool_name: r.tool_name,
                  id: '',
                  tool_id: '',
                }"
              ></ToolLabel>

              <MarkDownRenderer
                v-if="r.type == 'md'"
                :content="r.text"
              ></MarkDownRenderer>
            </template>
          </ExpandableContainer>
        </FadeInContainer>
      </div>

      <div class="w-h3 q-px-md q-mr-auto mobile-title">
        <FadeInContainer
          :id="`case-${i}-title`"
          direction="left"
          class="sticky-title"
          style="position: sticky; top: 60px"
        >
          {{ s.title }}
        </FadeInContainer>
      </div>
    </section>

    <section class="text-center q-my-lg">
      <q-btn
        id="btn-start-cases"
        :to="loginLink"
        class="button-gradient w-h3 q-px-lg"
        rounded
        >Попробовать</q-btn
      >
    </section>

    <section class="app-part-screen snap-start column q-py-xl">
      <div id="features" class="w-h1 q-py-xl text-center">Почему WowGPT?</div>
      <StairsText
        style="position: absolute; width: 100%; opacity: 0.5"
        font-size="36"
        text-content="ПРОСТОТА ДОСТУПА .... ПОДДЕРЖКА РУССКОГО ЯЗЫКА ... ГИБКИЕ ТАРИФЫ .. РАБОТА .. WOWGPT ... CHATGPT .. УЧЁБА .. CHATGPT // ТВОРЧЕСТВО // КАЖДЫЙ ШАГ - НОВАЯ ВОЗМОЖНОСТЬ"
      ></StairsText>
      <FadeInContainer
        v-for="(f, i) in features"
        :key="f.title"
        :direction="i % 2 == 0 ? 'left' : 'right'"
      >
        <q-card
          flat
          class="w-body q-pa-lg q-ma-xs q-mx-auto blurry"
          style="border-radius: 40px; max-width: 700px"
        >
          <div class="w-h3 q-mb-lg">
            {{ f.title }}
          </div>
          <div class="w-body">
            {{ f.text }}
          </div>
        </q-card>
      </FadeInContainer>
    </section>
    <section
      class="app-part-screen snap-center q-pa-xl column justify-center items-center"
    >
      <HeartText
        style="height: 200px; aspect-ratio: 1/1"
        textContent="WowGPT • ChatGPT • WowGPT • ChatGPT • WowGPT • ChatGPT •"
        fontSize="39"
        textColor="#f48fb1"
      ></HeartText>
      <div id="heart" class="w-h3 text-center q-mb-lg" style="max-width: 820px">
        WowGPT — ваш помощник для учебы, работы и творчества. Зарегистрируйтесь
        и начните решать задачи с помощью искусственного интеллекта!
      </div>
      <q-btn
        id="btn-start-heart"
        :to="loginLink"
        class="button-gradient w-h3 q-px-lg q-my-xl"
        rounded
        >Начать сейчас!</q-btn
      >
    </section>
    <section class="app-part-screen snap-center q-pa-lg bg-secondary q-pt-xl">
      <div id="plans" class="w-h1 text-center q-pb-xl">
        Выберите подходящий тариф
      </div>
      <PlansList :show-free="true"></PlansList>
    </section>
    <section
      class="app-part-screen snap-start q-pa-xl q-mt-xl column"
      style="min-height: 100vh"
    >
      <div id="faq" class="w-h1 text-center q-pb-xl">Частые вопросы</div>
      <div class="q-mx-auto">
        <template v-for="q in faq" :key="q.question">
          <q-expansion-item
            :id="`faq-${q.id}`"
            :label="q.question"
            header-class="w-body q-px-md q-py-sm"
            class="q-pa-md"
            style="max-width: 820px"
            expand-icon="eva-plus"
            expanded-icon="eva-minus"
          >
            <div class="q-pa-md">
              {{ q.answer }}
            </div>
          </q-expansion-item>
          <q-separator></q-separator>
        </template>
      </div>
    </section>
    <SinusText
      class="q-mb-xl"
      textContent="...Все в жизни идет волнами, но с WowGPT вы всегда на гребне продуктивности. Держите темп и достигайте новых высот вместе с нами. Начните уже сейчас!"
      fontSize="14"
    ></SinusText>
    <section class="app-part-screen snap-center q-pa-xl row q-pb-xl q-mb-xl">
      <div class="col q-ml-auto" style="max-width: 820px">
        <div id="final" class="w-h3 q-pb-lg">
          Начните использовать WowGPT сегодня
        </div>
        <div class="w-body">
          WowGPT поддерживает русский язык, не требует VPN, зарубежной карты и
          номера телефона, а также предлагает доступные тарифные планы для всех
          категорий пользователей!
        </div>
      </div>

      <q-btn
        id="btn-start-final"
        :to="loginLink"
        class="button-gradient w-h3 q-px-lg q-my-xl q-ml-lg q-mr-auto"
        rounded
        >Попробовать</q-btn
      >
    </section>
    <footer class="app-part-screen row text-center q-pt-xl q-pb-md">
      <p class="col column">
        <a href="#" class="q-mt-auto">Пользовательское соглашение</a>
      </p>
      <p class="col column">
        <a href="mailto:hello@wowgpt.ru" class="q-mt-auto">hello@wowgpt.ru</a>
      </p>
      <p class="col column">
        <img
          src="/images/logo_white.svg"
          class="q-mt-auto"
          style="max-height: 60px"
        />
        <span class="text-grey"> &copy; 2024 WowGPT </span>
      </p>
    </footer>
  </main>
</template>
<script lang="ts" setup>
import PlansList from 'src/components/PlansList.vue';
import MarkDownRenderer from 'src/components/MarkDownRenderer.vue';
import landingSamples from 'src/assets/landingSamples';
import faq from 'src/assets/faq';
import features from 'src/assets/features';
import ToolLabel from 'src/components/ToolLabel.vue';
import SinusText from 'src/components/SinusText.vue';
import HeartText from 'src/components/HeartText.vue';
import SpiralText from 'src/components/SpiralText.vue';
import ExpandableContainer from 'src/components/ExpandableContainer.vue';
import FadeInContainer from 'src/components/FadeInContainer.vue';
import StairsText from 'src/components/StairsText.vue';
import { ref } from 'vue';

const appLink = ref('/');
const loginLink = ref('/login');

// import TestPage from 'src/pages/TestPage.vue';
</script>
<style lang="scss">
.button-gradient {
  border: none;
  color: white;
  background: linear-gradient(
    270deg,
    var(--q-primary),
    var(--q-accent),
    var(--q-primary),
    var(--q-accent)
  );
  background-size: 300% 100%;
  animation: gradientAnimation 3s ease infinite;
  cursor: pointer;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s;
}

/* Эффект при наведении */
.button-gradient:hover {
  transform: scale(1.05);
}

/* Анимация для переливающегося эффекта */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 50% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.app-navbar {
  z-index: 1000;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 56px;
  background: rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  align-items: center;
  backdrop-filter: blur(10px);
}

html {
  scroll-snap-type: y proximity;
}

body {
  overflow-x: hidden;
}

.blurry {
  background: rgba(66, 66, 66, 0.08);
  backdrop-filter: blur(2px);
}

.app-screen {
  width: 100vw;
  height: 100vh;
  // border: 1px dotted cyan;
  box-sizing: border-box;
}

.app-part-screen {
  width: 100vw;
  // border: 1px dotted cyan;
  box-sizing: border-box;
}

.w-h1 {
  font-weight: 900;
  font-size: 54px;
}

.w-h3 {
  font-weight: 600;
  font-size: 32px;
}

.w-body {
  font-weight: 400;
  font-size: 22px;
  line-height: 2.75rem;
}

.sticky-card {
  position: sticky;
  top: 60px;
}

// .snap-start {
//   scroll-snap-align: start;
//   scroll-padding-top: 60px;
// }

// .snap-center {
//   scroll-snap-align: center;
// }

// .snap-end {
//   scroll-snap-align: end;
// }

.mobile-title {
  max-width: 320px;
}

@media (min-width: 1150px) {
  .mobile-title {
    max-width: 480px;
  }
}

.conversation {
  margin-top: 150px;
}

footer {
  background: #111;
}

footer {
  color: white;
}

footer a {
  text-decoration: none;
  color: white;
}

@media (max-width: 600px) {
  .mobile-title {
    width: 100%;
    max-width: unset;
    padding-left: 0;
    padding-right: 0;
    margin-bottom: 16px;
    order: -1;
    text-align: center;
  }
  .sticky-title {
    position: static;
    top: auto;
  }
  .app-part-screen {
    flex-direction: column;
  }
  .w-h3 {
    font-weight: 600;
    font-size: 24px;
  }

  .conversation {
    margin-top: unset;
  }
}
</style>

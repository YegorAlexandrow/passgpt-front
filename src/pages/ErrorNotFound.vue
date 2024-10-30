<template>
  <section class="app-screen row">
    <div class="column blurry q-pl-xl q-pr-xl" style="max-width: 820px">
      <q-space></q-space>
      <div class="w-h1">Упс! Страница не найдена</div>
      <div class="w-h3 q-mt-md">Ошибка 404</div>
      <div class="w-body q-mt-lg">
        Похоже, что страница, которую вы ищете, не существует.<br />
        Но не переживайте, мы поможем вам вернуться на правильный путь.
      </div>
      <div class="q-mt-xl">
        <q-btn class="button-gradient w-h3 q-px-lg" rounded @click="goHome">
          Вернуться на главную
        </q-btn>
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
      text-content="///////СТРАНИЦА НЕ НАЙДЕНА. ВЕРНИТЕСЬ И НАЙДИТЕ ЧТО-ТО ИНТЕРЕСНОЕ. СПИРАЛЬ ВОЗМОЖНОСТЕЙ ВСЕГДА ПОВЕРНЕТСЯ К ВАМ ПРАВИЛЬНОЙ СТОРОНОЙ"
    ></SpiralText>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import SpiralText from 'src/components/SpiralText.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// const theme = localStorage.getItem('theme') || 'system';
$q.dark.set(true);

const router = useRouter();

const goHome = () => {
  router.push('/');
};
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
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
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
  overflow-y: hidden;
}

.blurry {
  background: rgba(0, 0, 0, 0.05);
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

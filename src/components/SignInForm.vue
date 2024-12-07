<template>
  <q-card
    class="q-pa-md"
    flat
    bordered
    style="max-width: 400px; border-radius: 30px"
  >
    <div class="text-h6 text-center q-my-sm">🚀 Быстро продолжить через:</div>
    <div class="column q-px-md q-mt-lg">
      <div class="row" v-for="(opt, i) in options" :key="i">
        <q-space></q-space>
        <q-btn
          flat
          rounded
          no-caps
          class="q-my-sm q-px-xl col-12 color-secondary"
          @click="c.login(opt.provider)"
        >
          <img class="logo" :src="opt.logoPath" />
          <span class="col text-center text-h6 q-px-md">{{ opt.display }}</span>
        </q-btn>
        <q-space></q-space>
      </div>
    </div>
    <div class="text-caption text-grey text-center q-mt-lg">
      Продолжая, я принимаю условия
      <a href="https://wowgpt.ru/offer">оферты</a> и даю
      <a href="https://wowgpt.ru/privacy">согласие</a> на обработку персональных
      данных
    </div>
  </q-card>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useChatStore } from 'src/stores/chatStore';
import { ref } from 'vue';

const $q = useQuasar();
const c = useChatStore();

const options = ref([
  {
    provider: 'yandex',
    display: 'Яндекс',
    logoPath: '/images/logo_yandex.svg',
  },
  {
    provider: 'google',
    display: 'Google',
    logoPath: '/images/logo_google.svg',
  },
  {
    provider: 'vk',
    display: 'VK ID',
    logoPath: '/images/logo_vk.svg',
  },
  {
    provider: 'github',
    display: 'GitHub',
    logoPath: `/images/logo_github_${$q.dark.isActive ? 'white' : 'black'}.svg`,
  },
  // {
  //   provider: 'ok',
  //   display: 'Mail.ru',
  //   logoPath: '/images/logo_mailru.svg',
  // },
  // {
  //   provider: 'vk',
  //   display: 'Одноклассники',
  //   logoPath: '/images/logo_ok.svg',
  // },
]);
</script>
<style lang="scss" scoped>
.logo {
  height: 42px;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.bg-stock {
  background-image: url('/images/background_stock2.webp');
  background-size: cover;
  background-position: center;
}
</style>

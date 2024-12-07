<template>
  <q-layout view="lhr lpr lfr">
    <q-page class="flex flex-center bg-stock">
      <q-card
        class="q-pa-md"
        flat
        bordered
        style="width: 400px; border-radius: 30px"
      >
        <q-card-section class="text-center">
          <div class="text-h4 q-mb-lg">Вход и регистрация</div>
          <div class="text-body1">Представьтесь, чтобы продолжить:</div>
        </q-card-section>
        <q-card-section class="column">
          <q-separator></q-separator>
          <template v-for="(opt, i) in options" :key="i">
            <q-btn flat class="q-my-sm" @click="c.login(opt.provider)">
              <img class="logo" :src="opt.logoPath" />
              <span class="col text-left q-px-xl">{{ opt.display }}</span>
            </q-btn>
            <q-separator></q-separator>
          </template>
        </q-card-section>
        <q-card-section class="text-caption">
          Продолжая, я принимаю условия
          <a href="https://wowgpt.ru/offer">Договора об оказании услуг</a> и даю
          согласие на обработку моих персональных данных в соответствии с
          <a href="https://wowgpt.ru/privacy">Политикой конфиденциальности</a>
        </q-card-section>
      </q-card>
    </q-page>
  </q-layout>
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
  //   provider: 'vk',
  //   display: 'Одноклассники',
  //   logoPath: '/images/logo_ok.svg',
  // },
]);
</script>
<style lang="scss" scoped>
.logo {
  height: 50px;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.bg-stock {
  background-image: url('/images/background_stock2.webp');
  background-size: cover;
  background-position: center;
}
</style>

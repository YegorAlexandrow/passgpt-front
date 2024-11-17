<template>
  <q-page class="flex flex-center bg-stock">
    <q-card
      class="q-pa-md"
      flat
      bordered
      style="width: 600px; border-radius: 40px"
    >
      <div class="row">
        <q-space></q-space>
        <UserBadge style="position: absolute; top: 0; left: 0"></UserBadge>
      </div>
      <q-card-section class="text-center">
        <div class="text-h4 q-mb-lg">
          🎁Подписка WowGPT за <strong>1₽</strong>
        </div>
      </q-card-section>
      <q-card-section class="column q-px-xl text-center">
        Промокод:
        <q-input
          v-model="promoCode"
          class="text-h3 q-mb-xl q-mt-sm"
          outlined
          rounded
          placeholder="Промокод"
          style="font-family: monospace"
          input-class="text-center"
          input-style=" max-height: 7em;"
        ></q-input>
        <q-btn
          class="col q-py-md text-h6"
          color="accent"
          @click="c.purchase(subType, promoCode)"
          unelevated
          rounded
          :loading="loading"
        >
          ОФОРМИТЬ!
        </q-btn>
      </q-card-section>
      <q-card-section class="text-caption q-mt-xl">
        Продолжая, я принимаю условия
        <a href="https://wowgpt.ru/offer">Договора об оказании услуг</a> и даю
        согласие на обработку моих персональных данных в соответствии с
        <a href="https://wowgpt.ru/privacy">Политикой конфиденциальности</a>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import UserBadge from 'src/components/UserBadge.vue';
import { useChatStore } from 'src/stores/chatStore';
import { onMounted, ref } from 'vue';

const c = useChatStore();

const promoCode = ref('');
const subType = ref('');
const loading = ref(true);

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  promoCode.value = urlParams.get('c') || '';
  subType.value = urlParams.get('s') || '';

  await c.fetchUser();
  await c.fetchActualSubscription();
  if (!c.currentUser) location.href = '/login';
  loading.value = false;
});
</script>
<style lang="scss" scoped>
.bg-stock {
  background-image: url('/images/background_stock2.webp');
  background-size: cover;
  background-position: center;
}
</style>

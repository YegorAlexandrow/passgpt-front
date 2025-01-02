<template>
  <q-card
    class="q-pa-md"
    flat
    style="width: 550px; max-width: 100vw; border-radius: 30px"
  >
    <div class="text-h5 text-center q-mt-sm q-mb-xl" style="font-weight: bold">
      Оплата тарифа "{{ subDisplayName }}"
    </div>
    <div id="payment-form"></div>
  </q-card>
</template>

<script setup>
import { useChatStore } from 'src/stores/chatStore';
import { onMounted, computed } from 'vue';

const c = useChatStore();

function returnURL() {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('paramName', 'paramValue');
  const newUrl = currentUrl.toString();
  return newUrl;
}

const subDisplayName = computed(() => {
  return (
    {
      free: 'Пробный',
      base: 'Базовый',
      base_special1: 'Базовый',
      base1: 'Базовый',
      pro: 'ПРО',
      daily_boost: 'DAILY BOOST',
    }[c.paymentSubType] || c.paymentSubType
  );
});

onMounted(() => {
  const checkout = new window.YooMoneyCheckoutWidget({
    confirmation_token: c.paymentConfirmationToken,
    return_url: returnURL(),

    customization: {
      colors: {
        background: getComputedStyle(document.body).getPropertyValue(
          '--q-secondary',
        ), // '#212121',
        control_primary: getComputedStyle(document.body).getPropertyValue(
          '--q-primary',
        ),
        control_secondary: getComputedStyle(document.body).getPropertyValue(
          '--q-primary',
        ),
      },
    },
    error_callback: function (error) {
      console.log(error);
    },
  });

  //Отображение платежной формы в контейнере
  checkout.render('payment-form');
});
</script>

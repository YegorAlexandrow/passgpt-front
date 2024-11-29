<template>
  <q-card flat>
    <q-card-section>
      <div class="text-h5 text-bold q-mb-md text-center">Поделиться чатом</div>
      <div class="qrcode-container">
        <div ref="qrCode"></div>
      </div>
      <q-input
        v-model="linkProxy"
        readonly
        class="q-mb-sm"
        outlined
        dense
        @click="copyLink"
        style="cursor: pointer"
        input-style="cursor: pointer"
      >
        <template v-slot:append>
          <q-icon
            :name="copied ? 'eva-checkmark-outline' : 'eva-copy-outline'"
            @click="copyLink"
          ></q-icon>
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import QRCodeStyling from 'qr-code-styling';

const props = defineProps({
  link: {
    type: String,
    default: '#',
  },
});

const copied = ref(false);
const qrCode = ref<HTMLDivElement | null>(null);

// Инициализация QR-кода с закругленными краями
const qrCodeInstance = new QRCodeStyling({
  width: 300,
  height: 300,
  data: props.link,
  dotsOptions: {
    color: '#000',
    type: 'rounded',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
  },
});

const linkProxy = ref('');

onMounted(() => {
  if (qrCode.value) qrCodeInstance.append(qrCode.value);
  linkProxy.value = props.link;
});

// Функция для копирования ссылки в буфер обмена
const copyLink = () => {
  navigator.clipboard
    .writeText(props.link)
    .then(() => {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000); // Сбрасываем состояние копирования через 2 секунды
    })
    .catch((error) => {
      console.error('Ошибка копирования:', error);
    });
};
</script>

<style scoped>
.qrcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 20px;
  border-radius: 8px;
}
</style>

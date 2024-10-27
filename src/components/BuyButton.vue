<template>
  <q-btn
    class="button-gradient q-px-lg"
    flat
    rounded
    v-show="
      c.currentSubscription?.type == 'free' ||
      (c.currentSubscription?.type != 'daily_boost' && messagesLeft! < 1)
    "
    @click="onClick"
  >
    <template v-if="c.currentSubscription?.type == 'free'">
      Оформить подписку
    </template>
    <template
      v-else-if="
        c.currentSubscription?.type != 'daily_boost' && messagesLeft! < 1
      "
    >
      Взять DAILY BOOST
    </template>

    <q-dialog v-model="isShowPlans" full-width>
      <PlansList class="q-pa-none" :show-free="false"></PlansList>
    </q-dialog>
  </q-btn>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useChatStore } from 'src/stores/chatStore';
import PlansList from 'src/components/PlansList.vue';
import { Platform } from 'quasar';
// import { useRouter } from 'vue-router';

const c = useChatStore();
// const router = useRouter();

const isShowPlans = ref(false);

function onClick() {
  if (Platform.is.mobile) {
    // router.push('/subscribe');
    isShowPlans.value = true;
  } else {
    isShowPlans.value = true;
  }
}

const messagesLeft = computed(() => {
  if (c.currentSubscription) {
    const delta =
      c.currentSubscription?.message_per_day_limit -
      c.currentSubscription.messages_in_last_day;
    return delta;
  }
  return null;
});
</script>
<style lang="scss" scoped>
/* Определяем кнопку с градиентной заливкой */
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

/* Пример использования кнопки в HTML */
/*
<button class="button-gradient">Моя кнопка</button>
*/
</style>

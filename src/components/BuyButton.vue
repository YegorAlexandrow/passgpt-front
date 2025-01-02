<template>
  <q-btn
    :class="{
      'q-px-lg': true,
      'q-py-sm': true,
      'q-mt-xs': true,
      'button-gradient': c.currentSubscription?.type != 'free',
      'bg-secondary': c.currentSubscription?.type == 'free',
      'gradient-border': c.currentSubscription?.type == 'free',
    }"
    flat
    rounded
    v-show="
      c.currentSubscription?.type == 'free' ||
      (c.currentSubscription?.type != 'daily_boost' && messagesLeft! < 1)
    "
    @click="onClick"
  >
    <template v-if="!c.isUserLoading && c.currentUser == null">
      Войти
    </template>
    <template v-else-if="c.currentSubscription?.type == 'free'">
      Открыть больше 🎁
    </template>
    <template
      v-else-if="
        c.currentSubscription?.type != 'daily_boost' && messagesLeft! < 1
      "
    >
      Взять DAILY BOOST
    </template>
  </q-btn>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useChatStore } from 'src/stores/chatStore';
import { Platform } from 'quasar';
// import { useRouter } from 'vue-router';

const c = useChatStore();
// const router = useRouter();

function onClick() {
  if (!c.isUserLoading && c.currentUser == null) {
    c.showSignInForm = true;
  } else if (Platform.is.mobile) {
    // router.push('/subscribe');
    c.isShowPlans = true;
  } else {
    c.isShowPlans = true;
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
.gradient-border {
  --borderWidth: 1.5px;
}
.gradient-border:after {
  content: '';
  position: absolute;
  top: calc(-1 * var(--borderWidth));
  left: calc(-1 * var(--borderWidth));
  height: calc(100% + var(--borderWidth) * 2);
  width: calc(100% + var(--borderWidth) * 2);
  background: linear-gradient(
    60deg,
    var(--q-primary),
    var(--q-accent),
    var(--q-primary),
    var(--q-accent)
  );
  border-radius: 28px;
  z-index: -1;
  animation: animatedgradient 6s ease alternate infinite;
  background-size: 300% 100%;
}

@keyframes animatedgradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
/* Пример использования кнопки в HTML */
/*
<button class="button-gradient">Моя кнопка</button>
*/
</style>

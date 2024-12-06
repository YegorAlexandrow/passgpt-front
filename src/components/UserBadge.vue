<template>
  <q-avatar class="q-ml-md" round style="cursor: pointer">
    <q-inner-loading :showing="c.isUserLoading">
      <q-spinner-hourglass color="primary" size="md" />
    </q-inner-loading>
    <img
      v-if="c.currentUser"
      :src="
        c.currentUser?.avatar ||
        `https://avatar.iran.liara.run/username?username=${(c.currentUser?.first_name || ':')[0]}+${(c.currentUser?.last_name || 'D')[0]}`
      "
      style="object-fit: cover"
    />
    <q-menu class="q-card--bordered">
      <q-card-section>
        <div class="text-h6">
          {{ c.currentUser?.display_name }}
        </div>
        <div class="text-body1">{{ c.currentUser?.email }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="text-body1">
        <p v-if="c.currentSubscription">
          Уровень
          <strong>
            {{ getSubDisplayName(c.currentSubscription?.type) }}
          </strong>
        </p>
        <p>
          Дневной лимит
          <strong>
            {{
              Date.now() - (c.currentSubscription?.last_message_at || 0) >
              24 * 3600 * 1000
                ? 0
                : c.currentSubscription?.messages_in_last_day
            }}
            /
            {{ c.currentSubscription?.message_per_day_limit }}
          </strong>
          сообщ.
        </p>
        <p>
          До
          {{
            new Date(c.currentSubscription?.expires_at || 0).toLocaleString()
          }}
        </p>
        <q-inner-loading :showing="c.isSubLoading">
          <q-spinner-hourglass size="sm"></q-spinner-hourglass>
        </q-inner-loading>
      </q-card-section>
      <q-separator></q-separator>
      <q-list>
        <q-item clickable v-ripple @click="showSettings = true">
          <q-item-section avatar>
            <q-icon name="eva-settings-outline" />
          </q-item-section>
          <q-item-section> Настройки </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="c.logout">
          <q-item-section avatar>
            <q-icon name="mdi-logout" />
          </q-item-section>
          <q-item-section> Выйти </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-avatar>
  <q-dialog v-model="showSettings">
    <SettingsCard @close="onCloseSettings"></SettingsCard>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useChatStore } from 'src/stores/chatStore';
import SettingsCard from 'src/components/SettingsCard.vue';

const c = useChatStore();

const showSettings = ref(false);

function onCloseSettings() {
  showSettings.value = false;
}

function getSubDisplayName(sub: string) {
  return (
    {
      free: 'Пробный🌱',
      base: 'Базовый💎',
      base_special1: 'Базовый💎',
      base1: 'Базовый💎',
      pro: 'ПРО👑',
      daily_boost: 'DAILY BOOST⚡️',
    }[sub] || sub
  );
}
</script>
<style lang="scss">
.q-menu {
  box-shadow: none !important;
  max-width: unset !important;
}
.q-dialog__inner--minimized {
  padding: 0;
}
.q-dialog__inner {
  padding: 0;
}
</style>

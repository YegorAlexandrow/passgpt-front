<template>
  <q-avatar round style="cursor: pointer">
    <img
      :src="
        c.currentUser?.avatar ||
        `https://avatar.iran.liara.run/username?username=${(c.currentUser?.first_name || ':')[0]}+${(c.currentUser?.last_name || 'D')[0]}`
      "
      style="object-fit: cover"
    />
    <q-menu>
      <q-card-section>
        <div class="text-h6">
          {{ c.currentUser?.display_name }}
          <q-chip>{{ c.currentSubscription?.type }}</q-chip>
        </div>
        <div class="text-body1">{{ c.currentUser?.email }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="text-body1">
        <div>
          Дневной лимит:
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
        </div>
        <div>
          Подписка истекает
          {{
            new Date(
              c.currentSubscription?.expires_at || 0,
            ).toLocaleDateString()
          }}
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-list>
        <q-item clickable v-ripple @click="c.logout">
          <q-item-section avatar>
            <q-icon name="mdi-logout" />
          </q-item-section>
          <q-item-section> Выйти </q-item-section>
        </q-item>
      </q-list>
      <!-- <pre>{{ c.currentUser }}</pre> -->
    </q-menu>
  </q-avatar>
</template>
<script setup lang="ts">
import { useChatStore } from 'src/stores/chatStore';

const c = useChatStore();
</script>

<template>
  <q-layout view="lhr lpr lfr">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { useMeta, useQuasar } from 'quasar';
import { onMounted } from 'vue';

const $q = useQuasar();

onMounted(() => {
  const theme = localStorage.getItem('theme') || 'system';
  $q.dark.set(theme == 'system' ? 'auto' : theme == 'dark');
});

useMeta({
  meta: {
    themeColor: {
      name: 'theme-color',
      content: $q.dark.isActive ? '#171717' : '#b388ff',
    },
  },
});
</script>

<template>
  <q-layout view="lhr lpr lfr">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

const theme = localStorage.getItem('theme') || 'system';
$q.dark.set(theme == 'system' ? 'auto' : theme == 'dark');
</script>

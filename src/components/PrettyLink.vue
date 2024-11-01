<template>
  <a v-if="to.startsWith('http')" :href="to" :target="target">
    <q-chip
      dense
      flat
      :icon-right="icon"
      text-color="info"
      class="q-pa-none q-ma-none bg-transparent"
      >{{ label }}</q-chip
    >
  </a>
  <RouterLink v-else :to="to" :target="target" @click.stop>
    <q-chip
      dense
      :icon-right="icon"
      text-color="info"
      class="q-pa-none q-ma-none"
      >{{ label }}</q-chip
    >
  </RouterLink>
</template>
<script setup lang="ts">
defineProps({
  to: { type: String, default: '#' },
  target: { type: String, default: '_blank' },
  label: { type: String, default: '' },
  icon: { type: String, default: 'eva-external-link-outline' },
});
</script>

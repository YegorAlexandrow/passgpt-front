<template>
  <q-chip
    :icon="iconLabel"
    outline
    color="accent"
    class="multi-line-chip q-py-xs"
  >
    {{ props.message.text }}
    <q-spinner-hourglass v-if="props.message.progress"></q-spinner-hourglass>
  </q-chip>
</template>
<script setup lang="ts">
import { Message } from 'src/models/Message';
import { computed } from 'vue';

interface Props {
  message: Message;
}

const props = defineProps<Props>();

const iconLabel = computed(() => {
  return {
    get_weather: 'mdi-weather-night-partly-cloudy',
    search_web: 'eva-search-outline',
    fetch_news: 'mdi-newspaper-variant-outline',
    generate_image: 'eva-brush-outline',
    plot_chart: 'eva-activity-outline',
  }[props.message.tool_name || ''];
});
</script>
<style lang="scss">
.multi-line-chip .q-chip__content {
  white-space: normal;
  /* Optionally, adjust the text alignment */
  text-align: left;
  line-height: 1;
}
.multi-line-chip {
  height: unset;
}
</style>

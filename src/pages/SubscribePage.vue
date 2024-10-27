<template>
  <q-page
    class="column justify-center align-center items-center bg-secondary q-px-sm"
  >
    <div class="text-h4 q-pb-md q-pt-lg text-center text-primary">
      Подписка для новых возможностей!
    </div>
    <PlansList
      class="col"
      :show-free="false"
      style="width: 100%; max-width: unset"
    ></PlansList>
  </q-page>
</template>
<script setup lang="ts">
import PlansList from 'src/components/PlansList.vue';
</script>

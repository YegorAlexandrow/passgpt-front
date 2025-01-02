<template>
  <q-card
    class="q-pa-md"
    flat
    style="min-width: 400px; max-width: 600px; border-radius: 30px"
  >
    <figure
      id="myPlot"
      style="aspect-ratio: 1 / 1; border: 1px solid red"
    ></figure>
  </q-card>
</template>

<script setup>
import { onMounted } from 'vue';
import Plotly from 'plotly.js-dist';

onMounted(async () => {
  // const xArray = ['Italy', 'France', 'Spain', 'USA', 'Argentina'];
  // const yArray = [55, 49, 44, 24, 15];

  // const data = [
  //   {
  //     x: xArray,
  //     y: yArray,
  //     type: 'bar',
  //     orientation: 'v',
  //     marker: { color: 'rgba(0,0,255)' },
  //   },
  // ];

  // const layout = { title: 'World Wide Wine Production' };

  const data1 = await (
    await fetch('http://localhost:8956/plots/8E98U34GCsnmIT9IIjhMZw.json')
  ).json();

  Plotly.newPlot(document.querySelector('figure'), data1.data, data1.layout);
});
</script>

<style scoped></style>

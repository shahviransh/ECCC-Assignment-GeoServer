<template>
    <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { defineProps } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { provide } from 'vue';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

provide(THEME_KEY, 'dark');

defineProps({
    option: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.chart {
    width: 100%;
    height: 80vh;
}
</style>

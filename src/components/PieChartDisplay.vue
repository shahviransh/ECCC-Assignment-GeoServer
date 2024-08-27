<template>
    <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { defineProps } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';
import { provide } from 'vue';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
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

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import VueApexCharts from 'vue3-apexcharts'
import { injectGraphContext } from './context'
import type { TSeries } from './types'

defineProps<{ series: TSeries; options: ApexOptions }>()
const { animationEnd } = injectGraphContext()
</script>

<template>
  <div class="flex-1">
    <VueApexCharts type="line" height="100%" :options="options" :series="series" @animation-end="animationEnd = true" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.apexcharts-xaxis-texts-g text:nth-child(1)),
:deep(.apexcharts-grid > .apexcharts-gridlines-vertical > .apexcharts-gridline:nth-child(1)),
:deep(.apexcharts-grid > .apexcharts-xaxis-tick:nth-child(3)) {
  display: none;
}
:deep(.apexcharts-grid > .apexcharts-gridlines-vertical > .apexcharts-gridline) {
  stroke-dasharray: 6;
}
:deep(.apexcharts-legend-text) {
  margin-bottom: 0.25rem;
}
:deep(.apexcharts-legend-text) {
  transform: translate(1px, -1px);
  display: inline-block;
  margin-right: 0.75rem;
}
</style>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '降雨機率',
  },
})

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

const labels = computed(() => props.data.map((item) => item.time || ''))
const seriesData = computed(() =>
  props.data.map((item) =>
    typeof item.probability === 'number' ? item.probability : null
  )
)
const numericValues = computed(() =>
  seriesData.value.filter((value) => typeof value === 'number')
)
const hasData = computed(() => numericValues.value.length >= 2)

const minMax = computed(() => {
  if (!numericValues.value.length) {
    return { min: null, max: null }
  }
  return {
    min: Math.min(...numericValues.value),
    max: Math.max(...numericValues.value),
  }
})

const tooltipFormatter = (params) => {
  const target = Array.isArray(params) ? params[0] : params
  const label = target?.axisValueLabel || target?.name || ''
  const value = target?.data
  if (value === null || value === undefined) {
    return `${label}<br/>降雨機率：—`
  }
  return `${label}<br/>降雨機率：${value}%`
}

const updateChart = () => {
  if (!chartInstance) {
    return
  }

  chartInstance.setOption(
    {
      backgroundColor: '#ffffff',
      tooltip: {
        trigger: 'axis',
        formatter: tooltipFormatter,
      },
      grid: {
        left: 52,
        right: 20,
        top: 32,
        bottom: 52,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: labels.value,
        axisLine: { lineStyle: { color: '#e2e8f0' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
          rotate: 30,
          hideOverlap: true,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: '#64748b',
        },
        splitLine: { lineStyle: { color: '#e2e8f0' } },
      },
      series: [
        {
          type: 'line',
          data: seriesData.value,
          smooth: true,
          showSymbol: true,
          symbolSize: 6,
          lineStyle: { width: 3, color: '#0ea5e9' },
          itemStyle: { color: '#0ea5e9' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(14, 165, 233, 0.35)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.05)' },
            ]),
          },
        },
      ],
    },
    true
  )
}

const initChart = () => {
  if (!chartRef.value) {
    return
  }
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

const disposeChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

watch(
  [() => props.data, hasData],
  () => {
    if (!hasData.value) {
      disposeChart()
      return
    }
    if (!chartInstance) {
      nextTick(initChart)
      return
    }
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  if (hasData.value) {
    initChart()
  }
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    })
    resizeObserver.observe(chartRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  disposeChart()
})
</script>

<template>
  <el-card class="chart-card">
    <template #header>
      <div class="chart-title">{{ title }}</div>
    </template>
    <el-empty v-if="!hasData" description="資料不足，無法繪製圖表" />
    <div v-else class="chart-wrap">
      <div ref="chartRef" class="chart-canvas" />
      <div class="chart-meta">
        <span>最高：{{ minMax.max }}%</span>
        <span>最低：{{ minMax.min }}%</span>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.chart-card {
  max-width: 960px;
}

.chart-title {
  font-weight: 600;
}

.chart-wrap {
  display: grid;
  gap: 12px;
}

.chart-canvas {
  width: 100%;
  height: 280px;
  border-radius: 12px;
}

.chart-meta {
  display: flex;
  gap: 16px;
  color: #475569;
  font-size: 12px;
}
</style>

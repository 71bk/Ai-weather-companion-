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
    default: '溫度趨勢',
  },
})

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

const labels = computed(() => props.data.map((item) => item.time || ''))
const seriesData = computed(() =>
  props.data.map((item) => (typeof item.temperature === 'number' ? item.temperature : null))
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

const axisRange = computed(() => {
  if (!numericValues.value.length) {
    return { min: null, max: null }
  }
  const min = minMax.value.min
  const max = minMax.value.max
  const gap = Math.max(2, Math.round((max - min) * 0.2))
  return {
    min: Math.floor(min - gap),
    max: Math.ceil(max + gap),
  }
})

const tooltipFormatter = (params) => {
  const target = Array.isArray(params) ? params[0] : params
  const label = target?.axisValueLabel || target?.name || ''
  const value = target?.data
  if (value === null || value === undefined) {
    return `${label}<br/>溫度：—`
  }
  return `${label}<br/>溫度：${value}°C`
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
        min: axisRange.value.min,
        max: axisRange.value.max,
        axisLabel: {
          formatter: '{value}°C',
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
          lineStyle: { width: 3, color: '#2563eb' },
          itemStyle: { color: '#2563eb' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(37, 99, 235, 0.35)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.05)' },
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
        <span>最高：{{ minMax.max }}°C</span>
        <span>最低：{{ minMax.min }}°C</span>
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

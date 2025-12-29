<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const pickValue = (source, keys) => {
  if (!source) {
    return ''
  }
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return ''
}

const startTime = computed(() => pickValue(props.item, ['startTime', 'time']))
const endTime = computed(() => pickValue(props.item, ['endTime']))
const description = computed(() =>
  pickValue(props.item, ['description', 'weather', 'summary', 'wx'])
)
const minTemp = computed(() => pickValue(props.item, ['minTemp', 'min', 'MinT']))
const maxTemp = computed(() => pickValue(props.item, ['maxTemp', 'max', 'MaxT']))
const temperature = computed(() =>
  pickValue(props.item, ['temperature', 'temp', 'T'])
)
const rainProbability = computed(() =>
  pickValue(props.item, [
    'rainProbability',
    'pop',
    'PoP',
    'precipitationProbability',
  ])
)
const comfort = computed(() =>
  pickValue(props.item, ['comfort', 'feelsLike', 'ci'])
)

const timeLabel = computed(() => {
  if (startTime.value && endTime.value) {
    return `${startTime.value} ~ ${endTime.value}`
  }
  return startTime.value || endTime.value || '時段未提供'
})

const temperatureLabel = computed(() => {
  if (minTemp.value && maxTemp.value) {
    return `${minTemp.value}°C - ${maxTemp.value}°C`
  }
  if (temperature.value) {
    return `${temperature.value}°C`
  }
  return '—'
})

const rainLabel = computed(() => {
  if (!rainProbability.value && rainProbability.value !== 0) {
    return '—'
  }
  const value = String(rainProbability.value)
  return value.includes('%') ? value : `${value}%`
})
</script>

<template>
  <el-card class="forecast-card">
    <div class="forecast-time">{{ timeLabel }}</div>
    <div class="forecast-desc">{{ description || '—' }}</div>
    <div class="forecast-meta">
      <span>氣溫：{{ temperatureLabel }}</span>
      <span>降雨：{{ rainLabel }}</span>
      <span v-if="comfort">體感：{{ comfort }}</span>
    </div>
  </el-card>
</template>

<style scoped>
.forecast-card {
  border-radius: 12px;
}

.forecast-time {
  font-size: 12px;
  color: #6b7280;
}

.forecast-desc {
  margin-top: 6px;
  font-weight: 600;
  color: #1f2937;
}

.forecast-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #374151;
  font-size: 12px;
}
</style>

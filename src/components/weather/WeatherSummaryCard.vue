<script setup>
import { computed } from 'vue'
import { MapLocation, Timer, Pouring, Sunny, Warning } from '@element-plus/icons-vue'

const props = defineProps({
  location: {
    type: String,
    default: '',
  },
  currentWeather: {
    type: Object,
    default: null,
  },
  forecast36h: {
    type: Array,
    default: () => [],
  },
  lastUpdated: {
    type: String,
    default: '',
  },
})

// Utility: Pick value from source object
const pickValue = (source, keys) => {
  if (!source) return ''
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null && value !== '') {
      return value
    }
  }
  return ''
}

// Data Extraction
const description = computed(() =>
  pickValue(props.currentWeather, ['description', 'weather', 'summary', 'wx'])
)
const minTemp = computed(() =>
  pickValue(props.currentWeather, ['minTemp', 'min', 'MinT'])
)
const maxTemp = computed(() =>
  pickValue(props.currentWeather, ['maxTemp', 'max', 'MaxT'])
)
const feelsLike = computed(() =>
  pickValue(props.currentWeather, ['feelsLike', 'apparentTemperature', 'AT'])
)
const rainProbability = computed(() =>
  pickValue(props.currentWeather, [
    'rainProbability',
    'pop',
    'PoP',
    'precipitationProbability',
  ])
)
const observationTime = computed(() =>
  pickValue(props.currentWeather, ['time', 'startTime', 'observationTime'])
)

// Formatting
const temperatureRange = computed(() => {
  if (minTemp.value && maxTemp.value) {
    return `${minTemp.value}° ~ ${maxTemp.value}°`
  }
  return '—'
})

const rainLabel = computed(() => {
  if (!rainProbability.value && rainProbability.value !== 0) return '—'
  const value = String(rainProbability.value)
  return value.includes('%') ? value : `${value}%`
})

// Weather Emoji mapping
const weatherIcon = computed(() => {
  const desc = description.value || ''
  if (desc.includes('雨')) return '🌧️'
  if (desc.includes('雲') || desc.includes('陰')) return '☁️'
  if (desc.includes('晴')) return '☀️'
  if (desc.includes('雷')) return '⛈️'
  if (desc.includes('霧')) return '🌫️'
  return '⛅'
})

// Color Theme based on weather
const themeClass = computed(() => {
  const desc = description.value || ''
  if (desc.includes('晴')) return 'theme-sunny'
  if (desc.includes('雨')) return 'theme-rainy'
  return 'theme-cloudy'
})
</script>

<template>
  <div class="summary-widget" :class="themeClass">
    
    <!-- Header: Location & Time -->
    <div class="widget-header">
      <div class="location-badge">
        <el-icon><MapLocation /></el-icon>
        <span>{{ location || '未選擇地區' }}</span>
      </div>
      <div v-if="lastUpdated" class="update-time">
        更新於 {{ new Date(lastUpdated).getHours() }}:{{ String(new Date(lastUpdated).getMinutes()).padStart(2, '0') }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!currentWeather" class="empty-state">
      <el-empty description="請查詢天氣" :image-size="80" />
    </div>

    <!-- Content -->
    <div v-else class="widget-body">
      
      <!-- Main Visual: Icon + Temp -->
      <div class="main-visual">
        <div class="weather-icon-wrapper">
           <span class="emoji-icon">{{ weatherIcon }}</span>
        </div>
        <div class="temp-wrapper">
          <div class="temp-range">{{ temperatureRange }}</div>
          <div class="weather-desc">{{ description }}</div>
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="detail-grid">
        
        <div class="detail-item">
          <div class="detail-label">
            <el-icon><Pouring /></el-icon>
            降雨機率
          </div>
          <div class="detail-value highlight-blue">{{ rainLabel }}</div>
        </div>

        <div class="detail-item">
          <div class="detail-label">
             <el-icon><Sunny /></el-icon>
             體感
          </div>
          <div class="detail-value">{{ feelsLike ? `${feelsLike}` : '—' }}</div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-widget {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.summary-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

/* Themes */
.theme-sunny {
  background: linear-gradient(145deg, #ffffff 0%, #fff7ed 100%); /* Orange-ish tint */
  border-color: #fed7aa;
}
.theme-rainy {
  background: linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%); /* Blue-ish tint */
  border-color: #bae6fd;
}
.theme-cloudy {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%); /* Gray-ish tint */
  border-color: #e2e8f0;
}

/* Header */
.widget-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.location-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: #334155;
  font-size: 1.05rem;
}

.update-time {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Body */
.widget-body {
  padding: 24px 20px;
}

/* Main Visual */
.main-visual {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.emoji-icon {
  font-size: 3.5rem;
  line-height: 1;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.temp-wrapper {
  display: flex;
  flex-direction: column;
}

.temp-range {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.1;
  letter-spacing: -1px;
}

.weather-desc {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

/* Detail Grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  background: rgba(255,255,255,0.6);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #64748b;
}

.detail-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #334155;
}

.highlight-blue {
  color: #2563eb;
}

/* Empty State */
.empty-state {
  padding: 32px;
  display: flex;
  justify-content: center;
}
</style>
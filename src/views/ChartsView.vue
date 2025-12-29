<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import TemperatureChart from '../components/charts/TemperatureChart.vue'
import RainProbabilityChart from '../components/charts/RainProbabilityChart.vue'
import AISummaryButton from '../components/ai/AISummaryButton.vue'
import AIInsightBox from '../components/ai/AIInsightBox.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useAiStore } from '../stores/aiStore'

const weatherStore = useWeatherStore()
const aiStore = useAiStore()

const { forecast36h, currentLocation } = storeToRefs(weatherStore)
const { chartSummary, isLoading: aiLoading, error: aiError } =
  storeToRefs(aiStore)

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const parsed = parseFloat(String(value).replace(/[^\d.-]/g, ''))
  return Number.isNaN(parsed) ? null : parsed
}

const formatTime = (value) => {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = String(date.getHours()).padStart(2, '0')
  return `${month}/${day} ${hour}:00`
}

const temperatureData = computed(() =>
  (forecast36h.value || [])
    .map((item) => {
      const min = toNumber(item.minTemp)
      const max = toNumber(item.maxTemp)
      const single = toNumber(item.temperature)
      const value =
        min !== null && max !== null ? Math.round(((min + max) / 2) * 10) / 10 : single ?? max ?? min
      return {
        time: formatTime(item.startTime || item.time),
        temperature: value,
      }
    })
    .filter((item) => item.temperature !== null)
)

const rainData = computed(() =>
  (forecast36h.value || [])
    .map((item) => ({
      time: formatTime(item.startTime || item.time),
      probability: toNumber(item.rainProbability),
    }))
    .filter((item) => item.probability !== null)
)

const hasChartData = computed(
  () => temperatureData.value.length >= 2 || rainData.value.length >= 2
)

const aiDisabled = computed(
  () => temperatureData.value.length < 2 && rainData.value.length < 2
)

const handleSummary = () => {
  if (aiDisabled.value) {
    return
  }
  aiStore.summarizeCharts(
    {
      location: currentLocation.value,
      temperature: temperatureData.value,
      rainProbability: rainData.value,
    },
    { stream: false }
  )
}
</script>

<template>
  <div class="charts-view">
    <div class="charts-container">
      <!-- Header Section -->
      <div class="charts-header">
        <div class="header-content">
          <h2 class="view-title">天氣趨勢分析</h2>
          <p class="view-subtitle">
            <span v-if="currentLocation" class="location-badge">{{ currentLocation }}</span>
            透過數據圖表，觀察未來 36 小時的溫度與降雨變化
          </p>
        </div>
        
        <div class="header-actions">
           <AISummaryButton
            :loading="aiLoading"
            :disabled="aiDisabled"
            label="AI 智能解讀"
            @click="handleSummary"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!hasChartData" class="empty-charts-state">
        <el-empty description="尚無數據" image-size="200">
           <template #default>
             <p class="empty-hint">請先返回首頁查詢特定地區的天氣資料，<br>這裡將會自動繪製出趨勢圖表。</p>
             <router-link to="/" class="nav-btn">
               <el-button type="primary" round>前往查詢</el-button>
             </router-link>
           </template>
        </el-empty>
      </div>

      <!-- Charts Grid -->
      <div v-else class="charts-content">
        
        <!-- AI Insight Box (Top if available) -->
        <Transition name="slide-fade">
          <div v-if="chartSummary || aiLoading" class="ai-section">
             <AIInsightBox
              title="📊 AI 趨勢分析報告"
              :content="chartSummary"
              :loading="aiLoading"
              :error="aiError"
              empty-message="正在準備分析報告..."
            />
          </div>
        </Transition>

        <div class="charts-grid">
          <TemperatureChart :data="temperatureData" class="chart-item" />
          <RainProbabilityChart :data="rainData" class="chart-item" />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.charts-view {
  min-height: calc(100vh - 64px);
  background: #f1f5f9;
  padding: 32px 24px;
}

.charts-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.charts-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  background: white;
  padding: 24px 32px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.view-title {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.view-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
}

.location-badge {
  background: #eff6ff;
  color: #2563eb;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Empty State */
.empty-charts-state {
  background: white;
  border-radius: 20px;
  padding: 60px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.empty-hint {
  color: #94a3b8;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* AI Section */
.ai-section {
  margin-bottom: 32px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

@media (min-width: 992px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr; /* Two columns on large screens */
  }
}

.chart-item {
  height: 100%;
}
</style>
<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { VideoPlay } from '@element-plus/icons-vue'
import WeatherSearchBar from '../components/weather/WeatherSearchBar.vue'
import WeatherSummaryCard from '../components/weather/WeatherSummaryCard.vue'
import HourlyForecastList from '../components/weather/HourlyForecastList.vue'
import AISummaryButton from '../components/ai/AISummaryButton.vue'
import AIInsightBox from '../components/ai/AIInsightBox.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useAiStore } from '../stores/aiStore'

const weatherStore = useWeatherStore()
const aiStore = useAiStore()

const {
  currentLocation,
  currentWeather,
  forecast36h,
  status,
  error,
  history,
  lastUpdated,
} = storeToRefs(weatherStore)

const { weatherSummary, isLoading: aiLoading, error: aiError } =
  storeToRefs(aiStore)

const baseOptions = ['臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市', '基隆市', '新竹市', '嘉義市']
const locationOptions = computed(() => {
  const combined = [...history.value, ...baseOptions]
  return Array.from(new Set(combined))
})

const isLoading = computed(() => status.value === 'loading')
const showResult = computed(() => status.value === 'success' && currentWeather.value)
const hasForecast = computed(
  () => Array.isArray(forecast36h.value) && forecast36h.value.length > 0
)
const aiDisabled = computed(
  () =>
    !currentWeather.value &&
    (!forecast36h.value || forecast36h.value.length === 0)
)

const handleSearch = (value) => {
  if (typeof aiStore.clearSummaries === 'function') {
    aiStore.clearSummaries()
  }
  weatherStore.fetchWeather(value)
}

const handleSummary = () => {
  if (aiDisabled.value) {
    return
  }
  aiStore.summarizeWeather(
    {
      location: currentLocation.value,
      current: currentWeather.value,
      forecast36h: forecast36h.value,
    },
    { stream: false }
  )
}
</script>

<template>
  <div class="home-view">
    <div class="content-wrapper">
      <!-- Hero Section -->
      <header class="hero-section">
        <h1 class="app-title">
          <span class="text-gradient">AI Weather Companion</span>
        </h1>
        <p class="app-subtitle">您的智慧天氣助手，即時洞察氣象變化</p>
      </header>

      <!-- Search Section -->
      <section class="search-section">
        <div class="search-container">
          <WeatherSearchBar
            v-model="currentLocation"
            :options="locationOptions"
            :loading="isLoading"
            placeholder="請輸入縣市名稱 (如: 臺北市)"
            @search="handleSearch"
          />
          <el-alert
            v-if="error"
            class="search-alert"
            :title="error"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
      </section>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- Main Dashboard -->
      <Transition name="fade-slide">
        <div v-if="showResult" class="dashboard-container">
          <!-- Top Grid: Summary & AI -->
          <div class="dashboard-grid">
            <div class="grid-item main-summary">
              <WeatherSummaryCard
                :location="currentLocation"
                :current-weather="currentWeather"
                :forecast36h="forecast36h"
                :last-updated="lastUpdated"
              />
            </div>
            
            <div class="grid-item ai-panel">
              <div class="ai-actions-bar">
                 <div class="section-label">AI 智慧分析</div>
                 <AISummaryButton
                  :loading="aiLoading"
                  :disabled="aiDisabled"
                  label="生成分析報告"
                  @click="handleSummary"
                />
              </div>
              <AIInsightBox
                class="ai-insight-box"
                :content="weatherSummary"
                :loading="aiLoading"
                :error="aiError"
                empty-message="點擊上方按鈕，讓 AI 為您解讀目前天氣狀況與未來趨勢。"
              />
            </div>
          </div>

          <!-- Bottom Section: Hourly Forecast -->
          <section v-if="hasForecast" class="forecast-section">
             <HourlyForecastList :forecasts="forecast36h" />
          </section>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
  box-sizing: border-box;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.app-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
  color: #2c3e50;
}

.text-gradient {
  background: linear-gradient(90deg, #409eff, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app-subtitle {
  margin-top: 12px;
  font-size: 1.2rem;
  color: #64748b;
}

/* Search Section */
.search-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.search-container {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 10;
}

.search-alert {
  margin-top: 16px;
  border-radius: 8px;
}

/* Loading State */
.loading-state {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Dashboard */
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1.2fr 0.8fr; /* Summary takes a bit more space or balance it */
  }
}

/* AI Panel Styling */
.ai-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section-label {
  font-weight: 600;
  color: #334155;
  font-size: 1.1rem;
}

.ai-insight-box {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

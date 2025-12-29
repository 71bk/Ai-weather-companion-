<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import AIChatPanel from '../components/ai/AIChatPanel.vue'
import WeatherSummaryCard from '../components/weather/WeatherSummaryCard.vue'
import { useWeatherStore } from '../stores/weatherStore'
import { useAiStore } from '../stores/aiStore'

const weatherStore = useWeatherStore()
const aiStore = useAiStore()

const { currentLocation, currentWeather, forecast36h, lastUpdated } =
  storeToRefs(weatherStore)
const { messages, isLoading: aiLoading, error: aiError } = storeToRefs(aiStore)

const showWeather = computed(
  () => !!currentWeather.value || (forecast36h.value && forecast36h.value.length > 0)
)

const handleSend = (question) => {
  aiStore.askQuestion(question, {
    location: currentLocation.value,
    current: currentWeather.value,
    forecast36h: forecast36h.value,
  })
}
</script>

<template>
  <div class="assistant-view">
    <div class="page-container">
      <div class="layout-grid">
        <!-- Sidebar: Weather Context -->
        <aside class="weather-sidebar">
          <div class="sidebar-header">
            <h3>目前天氣參考</h3>
            <p v-if="currentLocation">地點: {{ currentLocation }}</p>
          </div>
          
          <div v-if="showWeather" class="weather-content">
             <WeatherSummaryCard
              :location="currentLocation"
              :current-weather="currentWeather"
              :forecast36h="forecast36h"
              :last-updated="lastUpdated"
              class="compact-card"
            />
          </div>
          <div v-else class="empty-weather">
             <el-empty 
               description="尚未選擇地區" 
               image-size="100"
             >
               <template #default>
                 <p class="empty-hint">請先至首頁查詢天氣，<br>AI 才能提供更精準的建議。</p>
                 <router-link to="/" class="nav-link">前往查詢</router-link>
               </template>
             </el-empty>
          </div>
        </aside>

        <!-- Main: Chat Interface -->
        <main class="chat-main">
          <el-alert
            v-if="aiError"
            :title="aiError"
            type="error"
            show-icon
            class="error-banner"
          />
          <AIChatPanel 
            :messages="messages" 
            :loading="aiLoading" 
            @send="handleSend" 
          />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assistant-view {
  min-height: calc(100vh - 64px); /* Adjust based on header height */
  background: #f8fafc;
  padding: 24px;
}

.page-container {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
}

.layout-grid {
  display: grid;
  grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
  min-height: 600px;
}

/* Sidebar */
.weather-sidebar {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 140px);
}

.sidebar-header {
  margin-bottom: 16px;
}

.sidebar-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1rem;
}

.sidebar-header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.9rem;
}

.compact-card :deep(.el-card__header) {
  padding: 12px 16px;
}

.compact-card :deep(.el-card__body) {
  padding: 16px;
}

.empty-weather {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-hint {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 12px;
}

.nav-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.nav-link:hover {
  text-decoration: underline;
}

/* Main Chat */
.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

.error-banner {
  border-radius: 12px;
}

/* RWD */
@media (max-width: 900px) {
  .layout-grid {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .weather-sidebar {
    position: static;
    height: auto;
    max-height: 320px;
  }

  .assistant-view {
    height: auto;
    min-height: 100vh;
  }
  
  .chat-main {
    height: 600px;
  }
}
</style>

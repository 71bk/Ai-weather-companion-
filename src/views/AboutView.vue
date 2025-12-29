<script setup>
import { 
  Monitor, 
  DataLine, 
  ChatLineRound, 
  Cpu 
} from '@element-plus/icons-vue'

const techStack = [
  { name: 'Vue 3', desc: 'Composition API + Script Setup', tag: 'Framework' },
  { name: 'Vite', desc: '極速開發與建置工具', tag: 'Build Tool' },
  { name: 'Pinia', desc: '直覺的狀態管理 (Store)', tag: 'State Management' },
  { name: 'Element Plus', desc: '現代化 Vue 3 UI 元件庫', tag: 'UI Library' },
  { name: 'ECharts', desc: '強大的資料視覺化圖表', tag: 'Visualization' },
  { name: 'Groq API', desc: '極速 AI 推論引擎', tag: 'AI Integration' },
]

const features = [
  {
    icon: Monitor,
    title: '即時天氣查詢',
    desc: '串接氣象資料，提供全台各縣市目前天氣與未來 36 小時預報。'
  },
  {
    icon: ChatLineRound,
    title: 'AI 智慧助理',
    desc: '內建 AI 對話功能，能根據目前天氣數據，提供穿搭建議與生活指南。'
  },
  {
    icon: DataLine,
    title: '數據視覺化',
    desc: '將複雜的氣象數據轉化為直觀的溫度與降雨趨勢圖表。'
  },
  {
    icon: Cpu,
    title: '自動化分析',
    desc: '一鍵生成天氣摘要與圖表分析報告，省去解讀數據的時間。'
  }
]
</script>

<template>
  <div class="about-view">
    <div class="about-container">
      
      <!-- Hero Section -->
      <section class="hero-section">
        <h1 class="page-title">關於 AI Weather Companion</h1>
        <p class="page-subtitle">探索結合現代前端技術與人工智慧的氣象應用</p>
      </section>

      <!-- Project Intro -->
      <section class="intro-card">
        <div class="intro-content">
          <h3>專案簡介</h3>
          <p>
            本專案旨在展示如何將傳統的 RESTful API 資料與生成式 AI (Generative AI) 進行整合。
            透過 Vue 3 的響應式特性，我們打造了一個流暢的使用者介面，讓使用者不僅能查詢天氣，
            還能獲得 AI 提供的個人化建議，重新定義了天氣查詢的體驗。
          </p>
        </div>
      </section>

      <!-- Features Grid -->
      <section class="features-section">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div v-for="(feat, idx) in features" :key="idx" class="feature-card">
            <div class="feature-icon">
              <el-icon><component :is="feat.icon" /></el-icon>
            </div>
            <h4>{{ feat.title }}</h4>
            <p>{{ feat.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="tech-section">
        <h2 class="section-title">技術堆疊</h2>
        <div class="tech-grid">
          <div v-for="(tech, idx) in techStack" :key="idx" class="tech-item">
            <div class="tech-header">
              <span class="tech-name">{{ tech.name }}</span>
              <el-tag size="small" effect="plain">{{ tech.tag }}</el-tag>
            </div>
            <p class="tech-desc">{{ tech.desc }}</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.about-view {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
  padding: 40px 24px;
}

.about-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* Hero */
.hero-section {
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

/* Intro */
.intro-card {
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  border-left: 5px solid #3b82f6;
}

.intro-content h3 {
  margin: 0 0 16px 0;
  color: #1e293b;
}

.intro-content p {
  line-height: 1.8;
  color: #475569;
  margin: 0;
}

/* Section Common */
.section-title {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 24px 0;
  text-align: center;
  font-weight: 700;
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px auto;
}

.feature-card h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
}

.feature-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
}

/* Tech Stack */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.tech-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tech-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tech-name {
  font-weight: 700;
  color: #334155;
}

.tech-desc {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}
</style>
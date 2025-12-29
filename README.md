# AI Weather Companion 🌤️

> 一個結合現代前端技術與生成式 AI 的智慧天氣助手應用。整合中央氣象署即時資料與 LLM，提供精準氣象預報、AI 趨勢分析與個人化生活建議。

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.3-FFD859)](https://pinia.vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.9-409EFF)](https://element-plus.org/)

## 🎯 專案動機

在資訊爆炸的時代，傳統天氣 App 僅提供數據，使用者仍需自行判讀。本專案嘗試解決這個痛點：

- **問題**：「降雨機率 60%、溫度 18-25°C」—— 這些數字對一般人來說難以轉化為實際行動
- **解法**：透過 AI 將結構化的氣象數據轉換為**自然語言建議**，例如：「今天傍晚可能下雨，建議攜帶雨具，早晚溫差大記得帶外套」

## ✨ 核心功能

| 功能 | 說明 | 技術實現 |
|------|------|---------|
| 🔍 **天氣查詢** | 支援全台縣市搜尋，顯示 36 小時預報 | 中央氣象署 Open API + Axios |
| 🤖 **AI 聊天助理** | 自然語言問答，如「今天適合曬棉被嗎？」 | Groq/OpenAI API + Prompt Engineering |
| 📊 **數據視覺化** | 溫度/降雨機率動態折線圖 | ECharts + Responsive Design |
| ⚡ **一鍵 AI 摘要** | 快速生成天氣趨勢解讀報告 | LLM Context Injection |
| 💾 **查詢歷史** | 自動記錄搜尋紀錄 | Pinia + LocalStorage 持久化 |

## 🛠️ 技術架構

### Tech Stack

```
Frontend Layer        State Layer         API Layer           External Services
┌─────────────┐      ┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Vue 3     │ ──▶  │   Pinia     │ ──▶ │   Axios     │ ──▶ │  中央氣象署 API  │
│  + Router   │      │  weatherStore│     │  weatherApi │     │  Groq/OpenAI    │
│  + ECharts  │      │  aiStore    │     │  aiApi      │     └─────────────────┘
└─────────────┘      └─────────────┘     └─────────────┘
```

### 技術選型理由

| 技術 | 選擇原因 |
|------|---------|
| **Vue 3 Composition API** | 更好的邏輯復用、TypeScript 支援、更清晰的程式碼組織 |
| **Pinia** | 輕量、直覺的 API、完整的 DevTools 支援、比 Vuex 更簡潔 |
| **Vite** | 極速 HMR、原生 ESM 支援、優化的 build 效能 |
| **Element Plus** | 成熟的企業級元件庫、完整的 Vue 3 支援 |
| **ECharts** | 強大的圖表客製化能力、優秀的效能與動畫效果 |

## 📂 專案結構

```
src/
├── api/                    # API 封裝層 - 統一管理外部服務呼叫
│   ├── weatherApi.js       # 天氣 API (中央氣象署)
│   └── aiApi.js            # AI API (Groq/OpenAI)
├── components/
│   ├── layout/             # 佈局元件 (Header, Footer, AppShell)
│   ├── weather/            # 天氣元件 (SearchBar, SummaryCard, ForecastList)
│   ├── charts/             # 圖表元件 (TemperatureChart, RainProbabilityChart)
│   └── ai/                 # AI 元件 (ChatPanel, InsightBox, SummaryButton)
├── stores/                 # Pinia 狀態管理
│   ├── weatherStore.js     # 天氣資料狀態 (location, forecast, history)
│   └── aiStore.js          # AI 對話狀態 (messages, loading, summary)
├── views/                  # 頁面視圖
│   ├── HomeView.vue        # 主頁 - 天氣查詢 + AI 摘要
│   ├── AIAssistantView.vue # AI 聊天助理頁
│   ├── ChartsView.vue      # 圖表分析頁
│   └── AboutView.vue       # 關於頁面
├── router/                 # Vue Router 路由配置
└── App.vue
```

## 🔑 技術亮點

### 1. Prompt Engineering 實踐
將結構化 JSON 天氣數據注入 AI Prompt，實現上下文感知的智慧回答：

```javascript
const prompt = `
你是一個專業的天氣助理。根據以下天氣數據回答用戶問題：
${JSON.stringify(weatherData)}

用戶問題: ${userQuestion}
請用親切的語氣回答，並給出實用的生活建議。
`;
```

### 2. 關注點分離的架構設計
- **API Layer**：統一封裝 HTTP 請求，方便切換 API 來源
- **Store Layer**：集中管理應用狀態，實現資料共享
- **Component Layer**：UI 元件專注於展示邏輯

### 3. 響應式狀態管理
使用 Pinia 搭配 Composition API，實現跨元件的響應式資料流：

```javascript
// 元件中直接使用 store
const weatherStore = useWeatherStore()
const { currentWeather, forecast36h } = storeToRefs(weatherStore)
```

## 🚀 快速開始

### 環境需求
- Node.js v16+
- npm 或 yarn

### 安裝與執行

```bash
# 1. Clone 專案
git clone https://github.com/ianhsu0101/ai-weather-companion.git
cd ai-weather-companion

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 填入您的 API Key

# 4. 啟動開發伺服器
npm run dev
```

### 環境變數設定

```env
# 中央氣象署 API
VITE_WEATHER_API_BASE_URL=https://opendata.cwa.gov.tw/api
VITE_WEATHER_API_KEY=your_cwa_api_key

# AI API (Groq / OpenAI)
VITE_AI_API_BASE_URL=https://api.groq.com/openai/v1
VITE_AI_API_KEY=your_ai_api_key
```

## � 功能預覽

| 天氣查詢主頁 | AI 聊天助理 | 圖表分析 |
|-------------|------------|---------|
| 地區搜尋、即時天氣、36hr 預報 | 自然語言問答、對話歷史 | 溫度/降雨趨勢圖、AI 解讀 |

## 🔮 未來規劃

- [ ] 加入 PWA 支援，實現離線快取
- [ ] 整合推播通知，提醒惡劣天氣
- [ ] 支援多語系 (i18n)
- [ ] 加入單元測試與 E2E 測試

## 📝 開發心得

本專案展示了如何將傳統 RESTful API 與生成式 AI 進行結合。核心挑戰在於：

1. **Prompt 設計**：如何將結構化的 JSON 天氣數據轉換為 AI 可理解的 Context
2. **狀態同步**：確保 AI 助理始終基於最新的天氣資料回答
3. **使用者體驗**：在等待 AI 回應時提供適當的 Loading 反饋

透過這個專案，我深入實踐了 Vue 3 Composition API 的設計模式，以及 AI 應用整合的最佳實踐。

---

<p align="center">
  Made with by <a href="https://github.com/ianhsu0101">Ian Hsu</a>
</p>

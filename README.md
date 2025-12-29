# AI Weather Companion 🌤️

一個結合現代前端技術與人工智慧的智慧天氣助手。不僅提供精準的氣象預報，更能透過 AI 分析天氣趨勢，提供個人化的生活建議。

## ✨ 專案亮點

- **AI 智慧整合**：內建 AI 聊天機器人，能根據即時天氣數據回答您的問題（例如：「今天適合洗衣服嗎？」）。
- **自動化數據分析**：一鍵生成天氣摘要報告與圖表趨勢解讀，省去判讀複雜數據的時間。
- **直觀的資料視覺化**：使用動態圖表 (Charts) 呈現未來 36 小時的溫度與降雨機率變化。
- **現代化 UI/UX**：採用 Glassmorphism (毛玻璃) 設計風格，搭配 RWD 響應式佈局，在各種裝置上都有絕佳體驗。
- **即時搜尋**：支援全台縣市地區搜尋，並自動記錄查詢歷史。

## 🛠️ 技術堆疊 (Tech Stack)

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API + Script Setup)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **UI Library**: [Element Plus](https://element-plus.org/)
- **Visualization**: [ECharts](https://echarts.apache.org/)
- **AI Integration**: Groq API / OpenAI Compatible API
- **HTTP Client**: Axios

## 🚀 快速開始

### 前置需求
- Node.js (建議 v16 以上)
- npm 或 yarn

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd ai-weather-companion
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定環境變數**
   複製 `.env.example` 為 `.env` 並填入您的 API Key：
   ```bash
   cp .env.example .env
   ```
   內容範例：
   ```env
   VITE_WEATHER_API_BASE_URL=https://opendata.cwa.gov.tw/api
   VITE_WEATHER_API_KEY=your_cwa_key
   VITE_AI_API_BASE_URL=https://api.groq.com/openai/v1
   VITE_AI_API_KEY=your_ai_key
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **建置生產版本**
   ```bash
   npm run build
   ```

## 📂 專案結構

```
src/
├── api/            # API 整合 (Weather & AI)
├── components/     # Vue 元件
│   ├── ai/         # AI 相關元件 (Chat, InsightBox)
│   ├── charts/     # 圖表元件 (Temperature, Rain)
│   ├── layout/     # 全域佈局 (Header, Footer)
│   └── weather/    # 天氣顯示元件 (Card, SearchBar)
├── router/         # 路由設定
├── stores/         # Pinia 狀態管理
├── views/          # 主要頁面 (Home, Assistant, Charts, About)
└── App.vue         # 根元件
```

## 📝 開發筆記

本專案展示了如何將傳統 RESTful API (中央氣象署資料) 與生成式 AI 進行結合。透過 Prompt Engineering，我們將結構化的 JSON 天氣數據轉換為自然語言描述，讓使用者獲得更有溫度的天氣資訊。

---
Created with [Ian Hsu](https://github.com/ianhsu0101)
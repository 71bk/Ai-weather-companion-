# AI Weather Companion – Frontend Project Structure

一個使用 **Vue 3 + Vite** 開發的前端專案，整合：
- 台灣天氣 API（例如中央氣象署 36 小時預報）
- AI（例如 OpenAI API）解讀天氣與圖表
- 現代化 UI（Tailwind / Element Plus 擇一或混用）

---

## 🔧 Tech Stack

- **Framework**：Vue 3 + Vite
- **Language**：TypeScript（可改 JS）
- **State Management**：Pinia
- **Routing**：Vue Router
- **UI Library**：Tailwind CSS + Element Plus（可視實作調整）
- **Charts**：ECharts / Recharts（二擇一）
- **HTTP Client**：Axios / Fetch
- **AI API**：OpenAI / 其他代理 API

---

## 📁 Folder Structure

```bash
ai-weather-companion/
├─ public/
│  ├─ favicon.ico
│  └─ icons/              # PWA icon / app icon（非必需）
├─ src/
│  ├─ api/
│  │  ├─ weatherApi.ts    # 與天氣 API 溝通
│  │  └─ aiApi.ts         # 與 AI API 溝通
│  ├─ assets/
│  │  ├─ images/
│  │  │  ├─ logo.svg
│  │  │  └─ weather-*.svg # 天氣 icon
│  │  └─ styles/
│  │     ├─ base.css      # 全域基本樣式（或 Tailwind entry）
│  │     └─ typography.css
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ AppHeader.vue
│  │  │  ├─ AppFooter.vue
│  │  │  └─ AppShell.vue      # 包住整體 layout 的 shell
│  │  ├─ common/
│  │  │  ├─ BaseButton.vue
│  │  │  ├─ BaseCard.vue
│  │  │  ├─ BaseTag.vue
│  │  │  └─ BaseSpinner.vue
│  │  ├─ weather/
│  │  │  ├─ WeatherSearchBar.vue
│  │  │  ├─ WeatherSummaryCard.vue
│  │  │  ├─ WeatherDetailList.vue
│  │  │  ├─ HourlyForecastList.vue
│  │  │  └─ ForecastItemCard.vue
│  │  ├─ charts/
│  │  │  ├─ TemperatureChart.vue
│  │  │  └─ RainProbabilityChart.vue
│  │  └─ ai/
│  │     ├─ AIChatPanel.vue
│  │     ├─ AIInsightBox.vue         # 顯示 AI 對趨勢的解讀
│  │     └─ AISummaryButton.vue      # 一鍵總結 button
│  ├─ router/
│  │  └─ index.ts
│  ├─ stores/
│  │  ├─ weatherStore.ts
│  │  └─ aiStore.ts
│  ├─ views/
│  │  ├─ HomeView.vue                # 主查詢頁
│  │  ├─ AIAssistantView.vue         # AI 對話頁
│  │  ├─ ChartsView.vue              # 圖表 + AI 解讀頁
│  │  └─ AboutView.vue               # 關於本專案
│  ├─ App.vue
│  └─ main.ts
├─ .env.example                       # API key 範例
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md

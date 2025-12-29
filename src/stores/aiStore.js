import { defineStore } from 'pinia'
import { createChatCompletion, streamChatCompletion } from '../api/aiApi'

const DEFAULT_SUMMARY_PROMPT = '請用 2 到 4 句話總結重點。'
const DEFAULT_CHART_PROMPT = '請用 3 個重點解讀圖表趨勢。'

const pickFields = (source, keys) =>
  keys.reduce((result, key) => {
    if (source && source[key] !== undefined && source[key] !== null) {
      result[key] = source[key]
    }
    return result
  }, {})

const simplifyForecast = (forecastList) =>
  forecastList.slice(0, 6).map((item) =>
    pickFields(item, [
      'time',
      'startTime',
      'endTime',
      'temperature',
      'minTemp',
      'maxTemp',
      'rainProbability',
      'description',
      'weather',
    ])
  )

const formatWeatherData = (weatherData) => {
  if (!weatherData) {
    return '無天氣資料'
  }

  if (Array.isArray(weatherData)) {
    return simplifyForecast(weatherData)
  }

  if (typeof weatherData === 'object') {
    const current = weatherData.current || weatherData
    const forecast = weatherData.forecast36h || weatherData.forecast || []

    return {
      current: pickFields(current, [
        'location',
        'city',
        'town',
        'temperature',
        'minTemp',
        'maxTemp',
        'rainProbability',
        'feelsLike',
        'description',
        'weather',
        'time',
      ]),
      forecast36h: Array.isArray(forecast) ? simplifyForecast(forecast) : [],
    }
  }

  return String(weatherData)
}

const buildPrompt = ({ question, weatherData }) => {
  const payload = formatWeatherData(weatherData)
  return [
    `天氣資料：${JSON.stringify(payload)}`,
    question ? `使用者問題：${question}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

const normalizeMessagesForRequest = (messages) =>
  messages.map((message) => ({
    role: message.role,
    content: message.requestContent ?? message.content ?? '',
  }))

export const useAiStore = defineStore('ai', {
  state: () => ({
    messages: [],
    isLoading: false,
    weatherSummary: '',
    chartSummary: '',
    error: '',
  }),
  actions: {
    clearError() {
      this.error = ''
    },
    clearSummaries() {
      this.weatherSummary = ''
      this.chartSummary = ''
    },
    async askQuestion(question, weatherData, { stream = true } = {}) {
      const userMessage = {
        role: 'user',
        content: question,
        requestContent: buildPrompt({ question, weatherData }),
      }

      this.messages.push(userMessage)
      const assistantMessage = { role: 'assistant', content: '' }
      this.messages.push(assistantMessage)

      this.isLoading = true
      this.error = ''

      const messagesForRequest = normalizeMessagesForRequest(
        this.messages.slice(0, -1)
      )

      try {
        if (stream) {
          for await (const chunk of streamChatCompletion({
            messages: messagesForRequest,
          })) {
            assistantMessage.content += chunk
          }
        } else {
          assistantMessage.content = await createChatCompletion({
            messages: messagesForRequest,
          })
        }
      } catch (error) {
        this.error =
          error?.message || 'AI 回覆失敗，請稍後再試'
      } finally {
        this.isLoading = false
      }
    },
    async summarizeWeather(weatherData, { stream = false } = {}) {
      const message = buildPrompt({
        question: DEFAULT_SUMMARY_PROMPT,
        weatherData,
      })

      this.isLoading = true
      this.error = ''

      try {
        if (stream) {
          let summary = ''
          for await (const chunk of streamChatCompletion({
            messages: [{ role: 'user', content: message }],
          })) {
            summary += chunk
          }
          this.weatherSummary = summary
        } else {
          this.weatherSummary = await createChatCompletion({
            messages: [{ role: 'user', content: message }],
          })
        }
      } catch (error) {
        this.error =
          error?.message || 'AI 摘要失敗，請稍後再試'
      } finally {
        this.isLoading = false
      }
    },
    async summarizeCharts(chartData, { stream = false } = {}) {
      const message = [
        `圖表資料：${JSON.stringify(chartData ?? {})}`,
        DEFAULT_CHART_PROMPT,
      ].join('\n')

      this.isLoading = true
      this.error = ''

      try {
        if (stream) {
          let summary = ''
          for await (const chunk of streamChatCompletion({
            messages: [{ role: 'user', content: message }],
          })) {
            summary += chunk
          }
          this.chartSummary = summary
        } else {
          this.chartSummary = await createChatCompletion({
            messages: [{ role: 'user', content: message }],
          })
        }
      } catch (error) {
        this.error =
          error?.message || 'AI 解讀失敗，請稍後再試'
      } finally {
        this.isLoading = false
      }
    },
  },
})

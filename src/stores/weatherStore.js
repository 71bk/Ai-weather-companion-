import { defineStore } from 'pinia'
import { getWeatherByLocation } from '../api/weatherApi'

const MAX_HISTORY = 8
const normalizeLocation = (location) => {
  if (!location || typeof location !== 'string') {
    return location
  }
  const trimmed = location.trim()
  if (trimmed.startsWith('台')) {
    return `臺${trimmed.slice(1)}`
  }
  return trimmed
}

const extractCwaElement = (elements, name) => {
  const target = elements.find((element) => element.elementName === name)
  return Array.isArray(target?.time) ? target.time : []
}

const extractCwaParam = (item) => item?.parameter?.parameterName ?? ''

const mapCwaData = (data) => {
  const location = data?.records?.location?.[0]
  if (!location) {
    return null
  }

  const elements = Array.isArray(location.weatherElement)
    ? location.weatherElement
    : []
  const wx = extractCwaElement(elements, 'Wx')
  const pop = extractCwaElement(elements, 'PoP')
  const minT = extractCwaElement(elements, 'MinT')
  const maxT = extractCwaElement(elements, 'MaxT')
  const ci = extractCwaElement(elements, 'CI')

  const length = Math.max(wx.length, pop.length, minT.length, maxT.length, ci.length)
  const forecast36h = Array.from({ length }, (_, index) => ({
    startTime: wx[index]?.startTime || pop[index]?.startTime || '',
    endTime: wx[index]?.endTime || pop[index]?.endTime || '',
    description: extractCwaParam(wx[index]),
    rainProbability: extractCwaParam(pop[index]),
    minTemp: extractCwaParam(minT[index]),
    maxTemp: extractCwaParam(maxT[index]),
    comfort: extractCwaParam(ci[index]),
  }))

  const first = forecast36h[0] || {}

  return {
    locationName: location.locationName,
    currentWeather: {
      location: location.locationName,
      description: first.description,
      minTemp: first.minTemp,
      maxTemp: first.maxTemp,
      rainProbability: first.rainProbability,
      feelsLike: first.comfort,
      time: first.startTime,
    },
    forecast36h,
  }
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentLocation: '',
    currentWeather: null,
    forecast36h: [],
    history: [],
    status: 'idle',
    error: '',
    lastUpdated: '',
  }),
  actions: {
    setLocation(location) {
      this.currentLocation = location
    },
    clearError() {
      this.error = ''
    },
    async fetchWeather(location) {
      if (!location || typeof location !== 'string') {
        return
      }

      const normalizedLocation = normalizeLocation(location)
      this.status = 'loading'
      this.error = ''

      try {
        const data = await getWeatherByLocation(normalizedLocation)
        const cwaData = mapCwaData(data)

        if (cwaData) {
          this.currentLocation = cwaData.locationName
          this.currentWeather = cwaData.currentWeather
          this.forecast36h = cwaData.forecast36h
        } else {
          this.currentLocation = normalizedLocation
          this.currentWeather = data?.current ?? data ?? null
          this.forecast36h = data?.forecast36h ?? data?.forecast ?? []
        }
        this.lastUpdated = new Date().toISOString()

        const nextHistory = [
          this.currentLocation,
          ...this.history.filter((item) => item !== this.currentLocation),
        ]
        this.history = nextHistory.slice(0, MAX_HISTORY)

        if (!this.currentWeather && (!this.forecast36h || this.forecast36h.length === 0)) {
          this.error = '查無該地區資料，請確認地區名稱（例如：臺北市）。'
          this.status = 'error'
          return
        }

        this.status = 'success'
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          '天氣資料載入失敗，請稍後再試'
        this.error = message
        this.status = 'error'
      }
    },
  },
})

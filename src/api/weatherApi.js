import axios from 'axios'

const baseURL = import.meta.env.VITE_WEATHER_API_BASE_URL
const cwaApiKey = import.meta.env.VITE_CWA_API_KEY

if (!baseURL) {
  console.warn(
    'VITE_WEATHER_API_BASE_URL is not set. Define it in your .env file.'
  )
}
if (!cwaApiKey) {
  console.warn('VITE_CWA_API_KEY is not set. Define it in your .env file.')
}

const client = axios.create({
  baseURL,
})

export async function getWeatherByLocation(location) {
  const response = await client.get('/F-C0032-001', {
    params: {
      Authorization: cwaApiKey,
      locationName: location,
    },
  })
  return response.data
}

const DEFAULT_SYSTEM_PROMPT = '請用繁體中文、簡短、資料不足要直說'

const DEFAULT_PARAMS = {
  model: 'openai/gpt-oss-120b',
  temperature: 0.5,
  max_completion_tokens: 300,
  top_p: 1,
  reasoning_effort: 'low',
  stream: true,
  stop: null,
}

const baseURL =
  import.meta.env.VITE_GROQ_API_BASE_URL || 'https://api.groq.com/openai/v1'
const apiKey = import.meta.env.VITE_GROQ_API_KEY

if (!apiKey) {
  console.warn('VITE_GROQ_API_KEY is not set. Define it in your .env file.')
}

const buildMessages = (messages) => {
  if (!messages || messages.length === 0) {
    return [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }]
  }

  const hasSystem = messages.some((message) => message.role === 'system')
  if (hasSystem) {
    return messages
  }
  return [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }, ...messages]
}

const buildPayload = ({ messages, params = {}, streamOverride }) => ({
  model: params.model ?? DEFAULT_PARAMS.model,
  messages: buildMessages(messages),
  temperature: params.temperature ?? DEFAULT_PARAMS.temperature,
  max_completion_tokens:
    params.max_completion_tokens ?? DEFAULT_PARAMS.max_completion_tokens,
  top_p: params.top_p ?? DEFAULT_PARAMS.top_p,
  reasoning_effort: params.reasoning_effort ?? DEFAULT_PARAMS.reasoning_effort,
  stream: streamOverride ?? params.stream ?? DEFAULT_PARAMS.stream,
  stop: params.stop ?? DEFAULT_PARAMS.stop,
})

const requestChatCompletion = async ({ payload, signal }) => {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Groq API request failed.')
  }

  return response
}

export const createChatCompletion = async ({
  messages,
  params = {},
  signal,
} = {}) => {
  const payload = buildPayload({ messages, params, streamOverride: false })
  const response = await requestChatCompletion({ payload, signal })
  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

export async function* streamChatCompletion({
  messages,
  params = {},
  signal,
} = {}) {
  const payload = buildPayload({ messages, params, streamOverride: true })
  const response = await requestChatCompletion({ payload, signal })

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) {
        continue
      }
      const payloadText = trimmed.replace('data:', '').trim()
      if (payloadText === '[DONE]') {
        return
      }
      try {
        const data = JSON.parse(payloadText)
        const delta = data.choices?.[0]?.delta?.content ?? ''
        if (delta) {
          yield delta
        }
      } catch (error) {
        console.warn('Failed to parse stream payload.', error)
      }
    }
  }
}

export { DEFAULT_PARAMS, DEFAULT_SYSTEM_PROMPT }

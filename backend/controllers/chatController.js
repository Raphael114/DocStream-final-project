import 'dotenv/config'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

function fallbackReply(message) {
  const text = message.toLowerCase().trim()
  if (!text) return "Hi there — tell me a bit about what you want help with and I'll try my best."
  if (/\b(hello|hi|hey)\b/.test(text)) return 'Hello! How can I help with DocStream today?'
  if (text.includes('how') && text.includes('work')) return 'DocStream is a telemedicine platform — you can search doctors, book appointments, and apply for jobs. Which part do you want help with?'
  if (text.includes('book') || text.includes('appointment')) return "To book an appointment, go to the 'Doctors' page, choose a doctor and click 'Book appointment'. I can help find doctors if you tell me the speciality or location."
  if (text.includes('price') || text.includes('fee') || text.includes('cost')) return "Appointment fees vary per doctor. You can view a doctor's fee on their profile when browsing the Doctors page."
  if (text.includes('job') || text.includes('career')) return 'You can see open roles on the Jobs page. Click an entry to view details and apply.'
  if (text.includes('help') || text.includes('support')) return "I'm a lightweight assistant on this demo installation — for detailed answers, configure an LLM API key in the backend (OPENAI_API_KEY)."
  return `Thanks — I received: "${message}". I don't have a full knowledge base available locally, but I can try to help or you can configure an LLM API key in the backend for detailed answers.`
}

export async function handleChat(req, res) {
  try {
    const { message, history = [], model = 'gpt-3.5-turbo' } = req.body || {}
    const currentMessage = typeof message === 'string' ? message.trim() : ''

    if (!currentMessage) {
      return res.status(400).json({ error: 'Message is required' })
    }
    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'History must be an array' })
    }

    const key = process.env.OPENAI_API_KEY
    if (!key) {
      return res.json({ ok: true, provider: 'fallback', reply: fallbackReply(currentMessage) })
    }

    const system = {
      role: 'system',
      content: 'You are DocStream assistant — professional, concise and accurate. If uncertain, ask clarifying questions or say you do not know. Stay safe and avoid making up facts.'
    }
    const conversation = history
      .filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')
      .slice(-20)
      .map(({ role, content }) => ({ role, content }))
    const payload = {
      model: typeof model === 'string' && model.trim() ? model.trim() : 'gpt-3.5-turbo',
      messages: [system, ...conversation, { role: 'user', content: currentMessage }],
      max_tokens: 500,
      temperature: 0.2
    }

    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const details = await response.text()
      console.error('OpenAI chat request failed:', response.status, details)
      return res.status(502).json({ error: 'Chat provider request failed' })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content
    if (typeof reply !== 'string' || !reply.trim()) {
      console.error('OpenAI chat response did not contain a reply')
      return res.status(502).json({ error: 'Chat provider returned an empty reply' })
    }

    return res.json({ ok: true, provider: 'openai', reply: reply.trim(), meta: { model: payload.model } })
  } catch (err) {
    console.error('chat error', err)
    return res.status(500).json({ error: 'Chat service is unavailable' })
  }
}

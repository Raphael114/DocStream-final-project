import 'dotenv/config'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

function fallbackReply(message) {
  // Very lightweight heuristic responder to keep the site functional without an API key.
  const text = message.toLowerCase().trim()
  if (!text) return "Hi there — tell me a bit about what you want help with and I'll try my best."
  if (text.includes('hello') || text.includes('hi')) return "Hello! How can I help with DocStream today?"
  if (text.includes('how') && text.includes('work')) return "DocStream is a telemedicine platform — you can search doctors, book appointments, and apply for jobs. Which part do you want help with?"
  if (text.includes('book') || text.includes('appointment')) return "To book an appointment, go to the 'Doctors' page, choose a doctor and click 'Book appointment'. I can help find doctors if you tell me the speciality or location."
  if (text.includes('price') || text.includes('fee') || text.includes('cost')) return "Appointment fees vary per doctor. You can view a doctor's fee on their profile when browsing the Doctors page."
  if (text.includes('job') || text.includes('career')) return "You can see open roles on the Jobs page. Click an entry to view details and apply."
  if (text.includes('help') || text.includes('support')) return "I'm a lightweight assistant on this demo installation — for deep, knowledgeable answers, configure an LLM API key in the backend (OPENAI_API_KEY)."
  // generic helpful answer
  return `Thanks — I received: "${message}". I don't have a full knowledge base available locally, but I can try to help or you can configure an LLM API key in the backend for detailed answers.`
}

export async function handleChat(req, res) {
  try {
    const { message, history = [], model = 'gpt-3.5-turbo' } = req.body || {}

    if (!message && (!history || history.length === 0)) {
      return res.status(400).json({ error: 'Message or history required' })
    }

    // If no OpenAI key configured, use fallback
    const key = process.env.OPENAI_API_KEY
    if (!key) {
      const reply = fallbackReply(message || (history[history.length-1]?.content || ''))
      return res.json({ ok: true, provider: 'fallback', reply })
    }

    // Prepare messages with a helpful system prompt that encourages correctness and caution
    const system = {
      role: 'system',
      content: `You are DocStream assistant — professional, concise and accurate. If uncertain, ask clarifying questions or say you don't know. Stay safe and avoid making up facts.`
    }

    const messages = [system, ...history.filter(Boolean), { role: 'user', content: message }]

    // Call OpenAI's chat completions
    const payload = {
      model,
      messages,
      max_tokens: 500,
      temperature: 0.2
    }

    const r = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify(payload)
    })

    if (!r.ok) {
      const txt = await r.text()
      return res.status(500).json({ error: 'OpenAI error', details: txt })
    }

    const data = await r.json()
    const reply = data?.choices?.[0]?.message?.content || ''

    return res.json({ ok: true, provider: 'openai', reply, meta: { model } })
  } catch (err) {
    console.error('chat error', err)
    return res.status(500).json({ error: 'Server error', details: err?.message })
  }
}

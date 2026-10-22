import 'dotenv/config'
import doctorModel from '../models/doctorModel.js'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

const referralCategories = [
  {
    speciality: 'Dermatologist',
    terms: ['skin', 'rash', 'acne', 'eczema', 'mole', 'dermatolog']
  },
  {
    speciality: 'Pediatricians',
    terms: ['child', 'children', 'baby', 'infant', 'pediatric', 'paediatric', /\bkids?\b/]
  },
  {
    speciality: 'Gynecologist',
    terms: ['pregnan', 'period', 'menstrual', 'gynecolog', 'women’s health', "women's health", 'reproductive']
  },
  {
    speciality: 'Neurologist',
    terms: ['neurolog', 'seizure', 'migraine', 'numbness', 'nerve']
  },
  {
    speciality: 'Gastroenterologist',
    terms: ['stomach', 'digest', 'heartburn', 'gastroenterolog', 'bowel']
  },
  {
    speciality: 'General physician',
    terms: ['general doctor', 'general physician', 'family doctor', 'checkup', 'check-up', 'general health', 'fever', 'cough', 'common cold', 'flu', 'unwell']
  }
]

const emergencyTerms = [
  'chest pain',
  'difficulty breathing',
  'trouble breathing',
  'shortness of breath',
  'severe bleeding',
  'heavy bleeding',
  'stroke',
  'unconscious',
  'suicidal'
]

function getReferralSpeciality(message) {
  const text = message.toLowerCase()
  return referralCategories.find(category =>
    category.terms.some(term => term instanceof RegExp ? term.test(text) : text.includes(term))
  )?.speciality
}

async function getDoctorReferralReply(message) {
  const text = message.toLowerCase()
  if (emergencyTerms.some(term => text.includes(term))) {
    return 'This may need urgent attention. Please contact your local emergency services or go to the nearest emergency department now rather than waiting for an online appointment.'
  }

  const speciality = getReferralSpeciality(message)
  const asksForDoctor = /\b(doctor|specialist|see|refer|recommend|consult)\b/.test(text)
  if (!speciality && !asksForDoctor) return null
  if (!speciality) {
    return 'I can help find a doctor, but I can’t diagnose symptoms. Which kind of care are you looking for—for example, skin, children’s, women’s health, neurological, digestive, or general care?'
  }

  let doctors
  try {
    doctors = await doctorModel
      .find({ speciality })
      .select('name email speciality address available')
      .sort({ name: 1 })
      .limit(3)
  } catch (error) {
    console.error('Doctor directory lookup failed:', error instanceof Error ? error.message : 'Unknown error')
    return 'I couldn’t reach the doctor directory just now. Please try again shortly or browse the Doctors page.'
  }

  if (!doctors.length) {
    return `I couldn’t find a ${speciality} in the current doctor directory. Please browse the Doctors page or contact the clinic for help.`
  }

  const contacts = doctors.map(doctor => {
    const location = [doctor.address?.line1, doctor.address?.line2].filter(Boolean).join(', ')
    const availability = doctor.available ? 'Available' : 'Currently unavailable'
    const demoContact = doctor.email?.endsWith('@example.com')
      ? ' (demo email; replace with a verified contact)'
      : ''
    return `• ${doctor.name} — ${doctor.speciality}${location ? `, ${location}` : ''}; email: ${doctor.email || 'not listed'}${demoContact}; ${availability}`
  })

  return `Based on the type of care you described, you could contact a ${speciality}. This is a directory match, not a diagnosis. ${contacts.join('\n')}\n\nThese are the contact details listed in the directory; please confirm them before sharing personal or medical information.`
}

function fallbackReply(message) {
  const text = message.toLowerCase().trim()
  if (!text) return "Hi there — tell me a bit about what you want help with and I'll try my best."
  if (/\b(hello|hi|hey)\b/.test(text)) return 'Hello! How can I help with DocStream today?'
  if (text.includes('how') && text.includes('work')) return 'DocStream is a telemedicine platform — you can search doctors, book appointments, and apply for jobs. Which part do you want help with?'
  if (text.includes('book') || text.includes('appointment')) return "To book an appointment, go to the 'Doctors' page, choose a doctor and click 'Book appointment'. I can help find doctors if you tell me the speciality or location."
  if (text.includes('price') || text.includes('fee') || text.includes('cost')) return "Appointment fees vary per doctor. You can view a doctor's fee on their profile when browsing the Doctors page."
  if (text.includes('job') || text.includes('career')) return 'You can see open roles on the Jobs page. Click an entry to view details and apply.'
  if (text.includes('help') || text.includes('support')) return 'I can help you browse doctors, find a specialty, book an appointment, or navigate DocStream. For medical concerns, please consult a qualified healthcare professional.'
  return 'I can help with finding a doctor, booking an appointment, or using DocStream. Tell me what kind of care you are looking for. I can help find a specialty, but I can’t diagnose symptoms.'
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

    const referralReply = await getDoctorReferralReply(currentMessage)
    if (referralReply) {
      return res.json({ ok: true, provider: 'directory', reply: referralReply })
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
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      console.error('OpenAI chat request failed:', response.status)
      return res.json({
        ok: true,
        provider: 'fallback',
        reply: `The full chat service is temporarily unavailable. ${fallbackReply(currentMessage)}`
      })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content
    if (typeof reply !== 'string' || !reply.trim()) {
      console.error('OpenAI chat response did not contain a reply')
      return res.status(502).json({ error: 'Chat provider returned an empty reply' })
    }

    return res.json({ ok: true, provider: 'openai', reply: reply.trim(), meta: { model: payload.model } })
  } catch (err) {
    console.error('chat error', err instanceof Error ? err.message : 'Unknown error')
    const currentMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
    if (currentMessage) {
      return res.json({
        ok: true,
        provider: 'fallback',
        reply: `The full chat service is temporarily unavailable. ${fallbackReply(currentMessage)}`
      })
    }
    return res.status(500).json({ error: 'Chat service is unavailable' })
  }
}

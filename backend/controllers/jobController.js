import jobModel from '../models/jobModel.js'
import applicationModel from '../models/applicationModel.js'
import fs from 'fs'

const liveJobsCacheDuration = 5 * 60 * 1000
let liveJobsCache
let liveJobsFetchedAt = 0

const classifyLiveJob = (job) => {
  const title = job.jobTitle.toLowerCase()
  const industries = job.jobIndustry.join(' ').toLowerCase()

  if (
    /healthcare|medical|pharmaceutical|biotech/.test(industries) ||
    /\b(doctor|nurse|physician|clinical|therapist|pharmacist|medical|healthcare)\b/.test(title)
  ) {
    return 'Medical & Healthcare'
  }

  if (
    /software|engineering|information technology|cybersecurity|data science/.test(industries) ||
    /\b(software|developer|engineer|programmer|data scientist|cybersecurity|devops|it specialist)\b/.test(title)
  ) {
    return 'Technology'
  }

  return 'General'
}

const listLiveJobs = async (req, res) => {
  if (liveJobsCache && Date.now() - liveJobsFetchedAt < liveJobsCacheDuration) {
    return res.json(liveJobsCache)
  }

  try {
    const tags = ['healthcare', 'software', 'customer support', 'marketing']
    const feeds = await Promise.all(tags.map(async (tag) => {
      const query = new URLSearchParams({ count: '50', tag })
      const response = await fetch(`https://jobicy.com/api/jobs?${query}`, {
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`Job feed returned HTTP ${response.status}`)
      }

      const data = await response.json()
      if (!Array.isArray(data.jobs)) {
        throw new Error('Job feed returned an invalid response')
      }
      return data
    }))

    const jobsById = new Map()
    for (const feed of feeds) {
      for (const job of feed.jobs) {
        if (!job.id || typeof job.jobTitle !== 'string' || typeof job.url !== 'string') continue

        let applicationUrl
        try {
          applicationUrl = new URL(job.url)
        } catch {
          continue
        }
        if (applicationUrl.protocol !== 'https:') continue

        const industries = Array.isArray(job.jobIndustry) ? job.jobIndustry : []
        const publishedAt = job.pubDate && !Number.isNaN(Date.parse(job.pubDate))
          ? new Date(job.pubDate).toISOString()
          : null
        const description = typeof job.jobExcerpt === 'string'
          ? job.jobExcerpt.replace(/<[^>]*>/g, '').trim()
          : ''

        jobsById.set(String(job.id), {
          id: String(job.id),
          title: job.jobTitle,
          company: job.companyName || 'Employer not listed',
          category: classifyLiveJob({ ...job, jobIndustry: industries }),
          industries,
          location: job.jobGeo || 'Remote',
          type: Array.isArray(job.jobType) ? job.jobType.join(', ') : '',
          description,
          applicationUrl: applicationUrl.toString(),
          publishedAt,
          salary: job.salaryMin && job.salaryMax
            ? `${job.salaryCurrency || ''} ${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}${job.salaryPeriod ? ` ${job.salaryPeriod}` : ''}`.trim()
            : ''
        })
      }
    }

    const jobs = [...jobsById.values()].sort((first, second) =>
      (Date.parse(second.publishedAt || '') || 0) - (Date.parse(first.publishedAt || '') || 0)
    )
    const result = {
      success: true,
      jobs,
      source: { name: 'Jobicy', url: 'https://jobicy.com' },
      updatedAt: new Date().toISOString()
    }

    liveJobsCache = result
    liveJobsFetchedAt = Date.now()
    return res.json(result)
  } catch (error) {
    console.error('Live job feed request failed:', error instanceof Error ? error.message : error)
    return res.status(503).json({
      success: false,
      message: 'Live job listings are temporarily unavailable. Please try again shortly.'
    })
  }
}

const listJobs = async (req, res) => {
  try {
    const jobs = await jobModel.find({}).sort({ date: -1 })
    res.json({ success: true, jobs })
  } catch (e) {
    console.error(e)
    res.json({ success: false, message: e.message })
  }
}

const getJob = async (req, res) => {
  try {
    const { id } = req.params
    const job = await jobModel.findById(id)
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
    res.json({ success: true, job })
  } catch (e) {
    console.error(e)
    res.json({ success: false, message: e.message })
  }
}

const createJob = async (req, res) => {
  try {
    const { title, team, location, type, description } = req.body
    const job = await jobModel.create({ title, team, location, type, description })
    res.json({ success: true, job })
  } catch (e) {
    console.error(e)
    res.json({ success: false, message: e.message })
  }
}

const applyJob = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, message, resumeUrl } = req.body
    const job = await jobModel.findById(id)
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' })
    const application = await applicationModel.create({ jobId: id, name, email, message, resumeUrl })
    res.json({ success: true, application })
  } catch (e) {
    console.error(e)
    res.json({ success: false, message: e.message })
  }
}

// Accept CSV upload (multipart/form-data) with field 'file' and create jobs from it
const uploadCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
    const text = fs.readFileSync(req.file.path, 'utf8')
    const lines = text.split(/\r?\n/).filter(Boolean)
    if (!lines.length) return res.json({ success: false, message: 'Empty file' })
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    const created = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',')
      if (cols.length < header.length) continue
      const obj = {}
      for (let j = 0; j < header.length; j++) {
        obj[header[j]] = cols[j].trim()
      }
      // expect fields: title,team,location,type,description
      if (!obj.title) continue
      const job = await jobModel.create({
        title: obj.title,
        team: obj.team || '',
        location: obj.location || '',
        type: obj.type || '',
        description: obj.description || ''
      })
      created.push(job)
    }
    // remove uploaded file
    try { fs.unlinkSync(req.file.path) } catch (e) { }
    res.json({ success: true, created })
  } catch (e) {
    console.error(e)
    res.json({ success: false, message: e.message })
  }
}

export { listLiveJobs, listJobs, getJob, createJob, applyJob, uploadCSV }

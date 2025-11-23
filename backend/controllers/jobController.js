import jobModel from '../models/jobModel.js'
import applicationModel from '../models/applicationModel.js'
import fs from 'fs'

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

export { listJobs, getJob, createJob, applyJob, uploadCSV }

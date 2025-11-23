import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  team: { type: String },
  location: { type: String },
  type: { type: String },
  description: { type: String },
  date: { type: Number, default: Date.now }
})

const jobModel = mongoose.models.job || mongoose.model('jobs', jobSchema)
export default jobModel

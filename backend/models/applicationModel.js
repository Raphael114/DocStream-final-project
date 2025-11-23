import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String },
  resumeUrl: { type: String },
  date: { type: Number, default: Date.now }
})

const applicationModel = mongoose.models.application || mongoose.model('applications', applicationSchema)
export default applicationModel

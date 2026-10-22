import express from 'express'
import upload from '../middlewares/multer.js'
import { listLiveJobs, listJobs, getJob, createJob, applyJob, uploadCSV } from '../controllers/jobController.js'

const router = express.Router()

router.get('/list', listJobs)
router.get('/live', listLiveJobs)
router.get('/:id', getJob)
router.post('/', createJob)
router.post('/:id/apply', applyJob)
router.post('/upload-csv', upload.single('file'), uploadCSV)

export default router

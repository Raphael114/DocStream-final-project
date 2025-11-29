import express from 'express'
import { handleChat } from '../controllers/chatController.js'

const router = express.Router()

// POST /api/chat -> { message, history }
router.post('/', handleChat)

export default router

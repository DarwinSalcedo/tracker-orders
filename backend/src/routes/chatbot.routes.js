import express from 'express';
import { getChatbotResponse } from '../services/chatbotService.js';

const router = express.Router();

// Chat endpoint - public (no auth required)
router.post('/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (message.trim().length === 0) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        if (message.length > 500) {
            return res.status(400).json({ error: 'Message too long (max 500 characters)' });
        }

        const response = await getChatbotResponse(message, history);

        res.json({
            response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chatbot route error:', error);
        res.status(500).json({
            error: error.message || 'Error al procesar tu mensaje. Por favor intenta de nuevo.'
        });
    }
});

export default router;

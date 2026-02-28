const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// --- Lab 3: AI Fallback Messages ---
const fallbackMessages = [
  "Take a deep breath. You are doing better than you think.",
  "It's okay to rest. You don't have to solve everything today.",
  "Small steps still move you forward.",
  "You matter. Your effort matters."
];

// --- Routes ---
app.get('/', (req, res) => {
    res.status(200).json({ message: "Wellness API is Live and Healthy!" });
});

// --- Lab 3: AI Mood Support Route ---
app.post('/api/ai-support', async (req, res) => {
    const { mood } = req.body;
    const API_KEY = process.env.GROQ_API_KEY;

    try {
        // Attempt to call Groq AI
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a supportive mental health companion. Give short, calming advice." },
                    { role: "user", content: `I feel: ${mood}` }
                ]
            })
        });

        const result = await response.json();

        if (result.choices && result.choices[0]?.message?.content) {
            return res.json({ message: result.choices[0].message.content, source: "Groq AI" });
        }
        throw new Error("AI response invalid");

    } catch (error) {
        console.warn("AI Error, using fallback:", error.message);
        // Offline Fallback logic
        const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
        res.json({ message: randomFallback, source: "Offline Fallback" });
    }
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server soaring on port ${PORT}`);
});
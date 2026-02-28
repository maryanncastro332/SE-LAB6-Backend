const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// --- Middleware Configuration ---
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// --- Activity 2: Local Fallback Messages ---
const fallbackMessages = [
  "Take a deep breath. You are doing better than you think.",
  "It's okay to rest. You don't have to solve everything today.",
  "Small steps still move you forward.",
  "You matter. Your effort matters.",
  "Pause. Breathe. Continue when you're ready.",
  "Be kind to yourself. You're learning and growing."
];

// --- Status Route ---
app.get('/', (req, res) => {
    res.status(200).json({ message: "Wellness API is Live and Healthy!" });
});

// --- Activity 4 & 6: AI Mood Support with Auto-Fallback ---
app.post('/api/ai-support', async (req, res) => {
    const { mood } = req.body;
    const API_KEY = process.env.GROQ_API_KEY; // Managed via Render Env Vars

    try {
        // Primary Action: Call Groq AI API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", // Required Lab 3 Model
                messages: [
                    { role: "system", content: "You are a supportive mental health companion." },
                    { role: "user", content: `Give a short calming message for someone feeling: ${mood}` }
                ]
            })
        });

        const result = await response.json();

        // Check if AI response is valid
        if (result.choices && result.choices[0]?.message?.content) {
            return res.json({ 
                message: result.choices[0].message.content, 
                source: "Groq AI" 
            });
        }
        throw new Error("Invalid AI response");

    } catch (error) {
        // Activity 2 & 3: Offline Fallback Mode
        console.warn("AI API blocked or failed, using fallback messages.");
        
        const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
        
        res.json({ 
            message: randomFallback, 
            source: "Offline Fallback" 
        });
    }
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server soaring on port ${PORT}`);
});
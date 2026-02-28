const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Added from your new dependency
require('dotenv').config();

const app = express();

// --- Middleware Design ---
app.use(cors());
app.use(bodyParser.json()); // Uses the body-parser you just installed
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get('/', (req, res) => {
    res.status(200).json({ message: "Wellness API is Live and Healthy!" });
});

// Example route for your Mood Tracker
app.post('/api/mood', (req, res) => {
    const { mood, note } = req.body;
    console.log(`Mood Received: ${mood}`);
    res.status(201).json({ success: true, message: "Mood saved to database!" });
});

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server soaring on port ${PORT}`);
});
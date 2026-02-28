const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic route to check if server is working
app.get('/', (req, res) => {
    res.send("Wellness API is Live!");
});

// Port configuration for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
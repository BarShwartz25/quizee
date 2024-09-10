require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Add this line to require the path module

const app = express();
const apiKey = process.env.OPENAI_API_KEY;

app.use(bodyParser.json());
// Serve static files from the "front" directory
app.use(express.static(path.join(__dirname, '../front')));

// Route to summarize text
app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Summarize the following text." },
                    { role: "user", content: text }
                ],
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const summary = response.data.choices[0].message.content;
        res.json({ summary });
    } catch (error) {
        console.error("Error summarizing text:", error);
        res.status(500).json({ error: "Failed to summarize text dkc" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

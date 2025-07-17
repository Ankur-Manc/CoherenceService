const express = require('express');
const cors = require('cors');
const { CohereClient } = require('cohere-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main endpoint to handle prompts
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model = 'command', temperature = 0.7, maxTokens = 300 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await cohere.generate({
      prompt,
      model,
      temperature,
      maxTokens,
    });

    res.json({
      text: response.generations[0].text,
      model: model,
      prompt: prompt
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

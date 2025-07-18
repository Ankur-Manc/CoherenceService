import express from 'express';
import cors from 'cors';
import { generatePrompt } from './promptGenerator.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Deepseek API configuration
const DEEPSEEK_API_KEY = 'sk-371264b5af764190bdbf3c34536a716d';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Helper function to call Deepseek API with structured JSON output
async function callDeepseekAPI(messages, temperature, maxTokens, useStructuredOutput = false) {
  const requestBody = {
    model: 'deepseek-chat',
    messages,
    temperature,
    max_tokens: maxTokens
  };

  // Add structured output for JSON responses
  if (useStructuredOutput) {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to call Deepseek API');
  }

  return response.json();
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Endpoint to generate filtered recommendations
app.post('/api/generate-filtered', async (req, res) => {
  try {
    const {
      filters_applied,
      current_query,
      past_queries,
      model = 'command',
      temperature = 0.7,
      maxTokens = 3000
    } = req.body;

    // Validate required parameters
    if (!current_query) {
      return res.status(400).json({ error: 'current_query is required' });
    }

    // Generate the specialized prompt
    console.log('Generating prompt with:', {
      filters_applied: filters_applied || [],
      current_query,
      past_queries: past_queries || []
    });
    
    const prompt = await generatePrompt(
      filters_applied || [],
      current_query,
      past_queries || []
    );
    
    console.log('Generated prompt:', prompt);

    console.log('Sending to Deepseek API');
    // Send to Deepseek with structured JSON output
    const response = await callDeepseekAPI(
      [{ role: 'user', content: prompt }],
      temperature,
      maxTokens,
      true // Enable structured output for JSON
    );

    res.json({
      text: response.choices[0].message.content,
      model: model,
      prompt: prompt,
      filters_applied: filters_applied,
      current_query: current_query,
      past_queries: past_queries
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to generate filtered response',
      details: error.message
    });
  }
});

// Main endpoint to handle prompts
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model = 'command', temperature = 0.7, maxTokens = 3000 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await callDeepseekAPI(
      [{ role: 'user', content: prompt }],
      temperature,
      maxTokens
    );

    res.json({
      text: response.choices[0].message.content,
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

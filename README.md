# Cohere AI Service

A Node.js backend service that integrates with Cohere AI to generate text responses based on prompts.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The `.env` file should contain:
- `COHERE_API_KEY`: Your Cohere API key
- `PORT`: Port number for the server (default: 3000)

## Running the Service

Start the server:
```bash
npm start
```

## API Endpoints

### Health Check
- GET `/health`
- Returns server status

### Generate Text
- POST `/api/generate`
- Request body:
```json
{
  "prompt": "Your prompt text here",
  "model": "command",         // optional, default: "command"
  "temperature": 0.7,         // optional, default: 0.7
  "maxTokens": 300           // optional, default: 300
}
```
- Response:
```json
{
  "text": "Generated response",
  "model": "command",
  "prompt": "Original prompt"
}
```

## Example Usage

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a short story about a robot",
    "temperature": 0.8
  }'

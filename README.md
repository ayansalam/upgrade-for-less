# Upgrade For Less - Pricing Optimizer

A SaaS pricing optimization tool that helps businesses find the perfect price point for their products and services.

## Features

- Pricing Optimizer: Calculate optimal pricing tiers based on your business goals
- AI Pricing Assistant: Get AI-powered pricing suggestions using Google's Gemini API
- User-friendly interface with modern design

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key to the `.env` file (Get one at https://makersuite.google.com/app/apikey)
4. Start the development server: `npm run dev`

## Environment Variables

This project uses the following environment variables:

- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for AI pricing suggestions

## Development

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing Gemini API via PowerShell

To test the Gemini API directly from PowerShell (instead of curl), use the following example:

```powershell
$apiKey = "YOUR_GEMINI_API_KEY"
$body = '{
  "contents": [{
    "parts": [{"text": "Explain how AI works"}]
  }]
}'
Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey" -Method Post -ContentType "application/json" -Body $body
```

Replace `YOUR_GEMINI_API_KEY` with your actual API key.

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Google Gemini API


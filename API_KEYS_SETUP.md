# Election Assistant - API Keys Setup

## Required Environment Variables

Create a file named `.env.local` in the root of this project and add:

```
GOOGLE_CIVIC_API_KEY=your_google_civic_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### How to get the keys:

**Google Civic Information API Key:**
1. Go to https://console.cloud.google.com/
2. Create or select a project
3. Enable the "Google Civic Information API"
4. Go to "APIs & Services" → "Credentials"
5. Create an API Key and restrict it to "Google Civic Information API"

**Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API Key
3. Copy it and paste it as the value of GEMINI_API_KEY

> ⚠️ NEVER commit .env.local to version control. It is listed in .gitignore.

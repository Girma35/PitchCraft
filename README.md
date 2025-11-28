
<<<<<<< HEAD
# PitchCraft
AI-powered tool that generates personalized outreach emails using company profiles. Scrapes data, stores in Supabase, and crafts professional emails. Built with Node/Express backend and React/Vite frontend, designed for extensibility and future AI integrations.
=======
# LinkedIn Email Generator - Backend API

Backend API for scraping LinkedIn company profiles and generating personalized outreach emails.

## 🚀 Features

- **LinkedIn Scraping**: Uses Apify to scrape company profiles
- **Data Storage**: Stores raw JSON in Supabase (JSONB)
- **Email Generation**: AI-powered personalized emails (optional)
- **RESTful API**: Clean endpoints for profile management

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Apify account

## 🔧 Installation

1. **Clone and install**
```bash
cd "email ai"
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Set up Supabase database**
```sql
-- Run this in Supabase SQL Editor
CREATE TABLE profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  linkedin_url text NOT NULL UNIQUE,
  raw_data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);
```

## 🔑 Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Apify
APIFY_TOKEN=apify_api_...
APIFY_ACTOR_ID=z2Fffb9ooRhoCtS15

# OpenAI (Optional)
OPENAI_API_KEY=sk-...
```

## 🏃 Running

```bash
# Start server
npm start

# Development mode
npm run dev

# Test
npm test
```

Server runs on: **http://localhost:4000**

## 📡 API Endpoints

### POST /generate-email
Scrape LinkedIn profile and generate email

**Request:**
```json
{
  "linkedinUrl": "https://www.linkedin.com/company/apple"
}
```

**Response:**
```json
{
  "profile": { ...raw Apify data... },
  "email": "Subject: ...\n\n...",
  "analysis": {
    "spamScore": 3.5,
    "readabilityScore": 85,
    "trendAnalysis": "Positive trend"
  }
}
```

### GET /profiles
Fetch all profiles (with pagination)

**Query Parameters:**
- `limit` (default: 100)
- `offset` (default: 0)

**Response:**
```json
{
  "profiles": [...],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

### GET /profiles/:identifier
Fetch single profile by UUID or LinkedIn URL

**Examples:**
```bash
GET /profiles/uuid-here
GET /profiles/https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fapple
```

## 🗄️ Database Schema

Super simple - just 4 columns:

```sql
profiles:
- id (uuid)
- linkedin_url (text, unique)
- raw_data (jsonb)  ← All Apify data stored here
- created_at (timestamp)
```

**Why JSONB?**
- No field extraction needed
- Flexible - works with any Apify actor
- Complete - all data preserved
- Queryable with PostgreSQL

## 🧪 Testing

```bash
# Test Apify connection
node server/apify-test.js

# Test complete flow (Apify → Supabase)
node server/full-flow-test.js

# Test fetch endpoints
node server/test-fetch-endpoints.js
```

## 📁 Project Structure

```
email ai/
├── server/
│   ├── index.js              # Main API server
│   ├── apifyClient.js        # Apify helper
│   ├── supabaseClient.js     # Supabase helper
│   ├── apify-test.js         # Test Apify
│   ├── full-flow-test.js     # Test complete flow
│   └── test-fetch-endpoints.js
├── .env                      # Environment variables
├── .env.example             # Template
├── supabase_schema.sql      # Database schema
├── schemareference.txt      # Complete documentation
└── package.json
```

## 📚 Documentation

- **Schema Reference**: `schemareference.txt`
- **Codebase Guide**: `README_CODEBASE.md`
- **SQL Schema**: `supabase_schema.sql`

## 🔄 Workflow

```
1. POST /generate-email with LinkedIn URL
   ↓
2. Apify scrapes company profile → JSON
   ↓
3. Save to Supabase (linkedin_url + raw_data)
   ↓
4. AI generates personalized email
   ↓
5. Return email + analysis
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: Supabase (PostgreSQL)
- **Scraper**: Apify
- **AI**: OpenAI (optional)

## 📝 License

Private

## 🤝 Support

For issues or questions, check the documentation files:
- `README_CODEBASE.md` - Complete codebase guide
- `schemareference.txt` - Database schema details
>>>>>>> 2e811ea (first commit)

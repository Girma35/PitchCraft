# Email AI - Codebase Documentation

## 📋 Project Overview

This is an Email AI application that scrapes LinkedIn company profiles using Apify and generates personalized outreach emails.

### Core Flow
```
User Input (LinkedIn URL)
    ↓
Apify → Scrape Company Profile → JSON
    ↓
Supabase → Store raw_data (JSONB)
    ↓
AI Engine → Generate Email
    ↓
Frontend → Display Email + Analysis
```

---

## 🗂️ Project Structure

```
email ai/
├── client/                    # Frontend components
│   └── EmailCollector.tsx     # Main UI component
├── server/                    # Backend API
│   ├── index.js              # Main API server (Express)
│   ├── apifyClient.js        # Apify helper functions
│   ├── supabaseClient.js     # Supabase helper functions
│   ├── apify-test.js         # Test Apify connection
│   └── full-flow-test.js     # Test complete flow
├── src/                       # Frontend source
├── .env                       # Environment variables (gitignored)
├── .env.example              # Template for environment variables
├── supabase_schema.sql       # Database schema
├── schemareference.txt       # Complete schema documentation
└── package.json              # Dependencies
```

---

## 🔑 Environment Variables

Located in `.env` file:

```env
# Supabase (Database)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Apify (LinkedIn Scraper)
APIFY_TOKEN=apify_api_...
APIFY_ACTOR_ID=z2Fffb9ooRhoCtS15

# AI (Optional - for email generation)
OPENAI_API_KEY=sk-...
```

---

## 💾 Database Schema (Supabase)

### `profiles` Table

Super simple - just 4 columns:

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  linkedin_url text UNIQUE NOT NULL,
  raw_data jsonb,              -- Stores ENTIRE Apify JSON
  created_at timestamp
);
```

**Why this design?**
- ✅ No field extraction needed
- ✅ Flexible - works with any Apify actor
- ✅ Complete - all data preserved
- ✅ Simple - just 2 fields to insert

**Example data:**
```json
{
  "id": "uuid-here",
  "linkedin_url": "https://www.linkedin.com/company/apple",
  "raw_data": {
    "company_name": "Apple",
    "company_id": "162479",
    "industry": "Consumer Electronics",
    "description": "...",
    "website": "http://www.apple.com",
    "followers": 20000000,
    ... (all other fields from Apify)
  },
  "created_at": "2025-11-22T10:51:59Z"
}
```

---

## 🔧 Key Files Explained

### 1. `server/index.js` - Main API Server

**Purpose:** Express server with `/generate-email` endpoint

**Flow:**
```javascript
POST /generate-email
  ↓
1. Get linkedinUrl from request body
  ↓
2. Scrape with Apify → get JSON
  ↓
3. Save to Supabase (just linkedin_url + raw_data)
  ↓
4. Generate email with AI (optional)
  ↓
5. Return { profile, email, analysis }
```

**Key code:**
```javascript
// Scrape with Apify
const run = await apifyClient.actor('z2Fffb9ooRhoCtS15').call({
  company_profile_urls: [linkedinUrl],
  proxy_group: "DATACENTER"
});
const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
const profileData = items[0];

// Save to Supabase (simple!)
await supabase.from('profiles').insert({
  linkedin_url: linkedinUrl,
  raw_data: profileData  // Just save the whole JSON blob
});
```

### 2. `server/supabaseClient.js` - Database Helper

**Purpose:** Initialize Supabase client and helper functions

**Key functions:**
```javascript
// Get Supabase client
export function getSupabaseClient() {
  return supabase;
}

// Insert/update profile (simple!)
export async function upsertProfile(linkedinUrl, rawData) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      linkedin_url: linkedinUrl,
      raw_data: rawData
    })
    .select();
  if (error) throw error;
  return data;
}

// Get all profiles
export async function getProfiles({ limit = 100 } = {}) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(limit);
  if (error) throw error;
  return data;
}
```

### 3. `server/apifyClient.js` - Apify Helper

**Purpose:** Initialize Apify client and helper functions

**Key functions:**
```javascript
// Run an actor
export async function runActor({ actorId, input = {}, options = {} }) {
  const run = await client.actor(actorId).call(input, options);
  return run;
}

// Get dataset items
export async function getDatasetItems({ datasetId, limit = 100 }) {
  const { items } = await client.dataset(datasetId).listItems({ limit });
  return items;
}
```

### 4. `client/EmailCollector.tsx` - Frontend UI

**Purpose:** React component for user input and display

**Features:**
- Input field for LinkedIn URL
- Button to trigger email generation
- Display generated email
- Show analysis scores

---

## 🧪 Testing

### Test Apify Connection
```bash
node server/apify-test.js
```
Tests:
- ✅ Authentication
- ✅ User account info

### Test Complete Flow
```bash
node server/full-flow-test.js
```
Tests:
1. ✅ Scrape LinkedIn with Apify
2. ✅ Save to Supabase
3. ✅ Retrieve from Supabase

### Run Development Server
```bash
# Frontend
npm run dev

# Backend (in separate terminal)
npm run server
```

---

## 🔄 How Data Flows

### 1. User Submits LinkedIn URL
```
Frontend (EmailCollector.tsx)
  ↓
POST /generate-email
  ↓
Backend (server/index.js)
```

### 2. Scrape LinkedIn
```
Apify Actor (z2Fffb9ooRhoCtS15)
  ↓
Returns JSON with 24+ fields:
{
  company_name,
  company_id,
  industry,
  description,
  website,
  followers,
  employees,
  ...
}
```

### 3. Store in Database
```
Supabase profiles table
  ↓
INSERT {
  linkedin_url: "...",
  raw_data: { ...entire JSON... }
}
```

### 4. Generate Email (Optional)
```
OpenAI API
  ↓
Personalized email based on company data
```

### 5. Return to Frontend
```json
{
  "profile": { ...raw_data... },
  "email": "Subject: ...\n\n...",
  "analysis": {
    "spamScore": 3.5,
    "readabilityScore": 85,
    "trendAnalysis": "..."
  }
}
```

---

## 🎯 Key Design Decisions

### Why JSONB for raw_data?
- **Flexible:** Apify can change their schema, we don't care
- **Complete:** No data loss, everything preserved
- **Simple:** No field mapping, just store the blob
- **Queryable:** Can still query inside JSONB with PostgreSQL

### Why Company Profiles (not Personal)?
- Actor ID `z2Fffb9ooRhoCtS15` scrapes company pages
- Input: `company_profile_urls` array
- Example: `linkedin.com/company/apple`

### Why Upsert?
- Prevents duplicates (linkedin_url is UNIQUE)
- Updates existing profiles automatically
- No need to check if exists first

---

## 📚 Common Operations

### Add a New Profile
```javascript
await supabase.from('profiles').insert({
  linkedin_url: 'https://www.linkedin.com/company/google',
  raw_data: apifyJsonResponse
});
```

### Get a Profile
```javascript
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('linkedin_url', 'https://www.linkedin.com/company/apple')
  .single();

// Access data
const companyName = data.raw_data.company_name;
const industry = data.raw_data.industry;
```

### Query Inside JSONB
```javascript
// Find all tech companies
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('raw_data->>industry', 'Technology');
```

### Update a Profile
```javascript
await supabase
  .from('profiles')
  .upsert({
    linkedin_url: url,
    raw_data: newData
  });
```

---

## 🚀 Future Enhancements

### Easy to Add:
1. **More Actors:** Just change `APIFY_ACTOR_ID`
2. **Personal Profiles:** Use different actor, same schema works
3. **Caching:** Check `created_at`, skip if recent
4. **Batch Processing:** Loop through multiple URLs
5. **Email Templates:** Use raw_data fields in templates

### The Schema Supports It All:
Because we store the entire JSON, any new fields from Apify are automatically saved. No schema changes needed!

---

## 🐛 Troubleshooting

### Apify Issues
```bash
# Test connection
node server/apify-test.js

# Check token
echo $APIFY_TOKEN

# Check actor exists
# Visit: https://apify.com/store
```

### Supabase Issues
```bash
# Test connection
node server/full-flow-test.js

# Check credentials in .env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Schema Issues
```sql
-- Run in Supabase SQL Editor
SELECT * FROM profiles LIMIT 5;

-- Check if table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 📖 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **Apify Docs:** https://docs.apify.com
- **Schema Reference:** See `schemareference.txt`
- **Test Files:** `server/apify-test.js`, `server/full-flow-test.js`

---

## ✅ Quick Start Checklist

1. [ ] Copy `.env.example` to `.env`
2. [ ] Add Supabase credentials
3. [ ] Add Apify token
4. [ ] Run schema: `supabase_schema.sql`
5. [ ] Test: `node server/full-flow-test.js`
6. [ ] Start dev: `npm run dev` + `npm run server`

---

**Last Updated:** 2025-11-22  
**Version:** 1.0 - Simplified Schema

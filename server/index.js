import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApifyClient } from 'apify-client';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Load .env from the project root (one level up from server/).
// This works whether the process is started from `server/` or the repo root.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize Clients

const apifyClient = new ApifyClient({
    token: process.env.APIFY_TOKEN,
});

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Support both spellings in .env: MISTRAL_API_KEY or MISTRA_API_KEY
const MISTRAL_KEY = process.env.MISTRAL_API_KEY || process.env.MISTRA_API_KEY || null;




function analyzeEmail(emailBody) {
    // Simple mock analysis
    return {
        spamScore: Math.random() * 10, // 0-10
        readabilityScore: Math.random() * 100, // 0-100
        trendAnalysis: "Positive trend detected in engagement.",
    };
}

app.post('/generate-email', async (req, res) => {
    try {
        const { linkedinUrl } = req.body;

        if (!linkedinUrl) {
            return res.status(400).json({ error: 'LinkedIn URL is required' });
        }

        console.log(`Processing: ${linkedinUrl}`);

        // 1. Try to fetch from Supabase first
        let profileData = {};
        let profileRecord = null;

        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('linkedin_url', linkedinUrl)
            .single();

        if (existingProfile && existingProfile.raw_data) {
            console.log('Using cached profile from Supabase');
            profileRecord = existingProfile;
            profileData = existingProfile.raw_data;
        } else {
            // 2. Fallback to Apify if not found
            console.log('Profile not found in Supabase, fetching from Apify...');
            if (process.env.APIFY_TOKEN) {
                const run = await apifyClient.actor(process.env.APIFY_ACTOR_ID || 'z2Fffb9ooRhoCtS15').call({
                    company_profile_urls: [linkedinUrl],
                    proxy_group: "DATACENTER"
                });
                const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
                profileData = items[0] || {};
            } else {
                console.warn('No APIFY_TOKEN, using mock data');
                profileData = { name: 'Mock Company', industry: 'Technology' };
            }

            // Save to Supabase
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert([
                    {
                        linkedin_url: linkedinUrl,
                        raw_data: profileData
                    }
                ])
                .select()
                .single();

            if (insertError) {
                console.error('Supabase Insert Error:', insertError);
            }
            profileRecord = newProfile;
        }

        // 3. AI Engine -> Generate Personalized Email (Mistral AI)
        const data = profileData;
        const prompt = `
            Write a personalized outreach email to ${data.name || data.company_name || 'the company'}.
            Their industry/headline is: ${data.industry || data.headline || 'Unknown'}.
            About them: ${data.description || data.about || 'N/A'}.
            
            The email should be professional, engaging, and mention their recent work if possible.
        `;

        let emailContent = "";

        if (MISTRAL_KEY) {
            try {
                const client = new OpenAI({
                    apiKey: MISTRAL_KEY,
                    baseURL: "https://api.mistral.ai/v1"
                });

                const chatResponse = await client.chat.completions.create({
                    model: "mistral-small-latest",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                });

                emailContent = chatResponse.choices[0]?.message?.content || "Error: No content generated.";
            } catch (error) {
                console.error('Mistral AI Generation Error:', error);
                emailContent = "Error generating email with Mistral AI.";
            }
        } else {
            console.warn('MISTRAL_API_KEY is missing; falling back to mock email.');
            emailContent = `Subject: Hello ${data.name || data.company_name || 'there'}\n\nThis is a mock email because MISTRAL_API_KEY is missing.\n\nBest,\nSender`;
        }

        // 4. Spam + Readability + Trend Analysis
        const analysis = analyzeEmail(emailContent);

        // 5. Frontend -> Editable Email + Scores
        res.json({
            profile: profileRecord?.raw_data || profileData,
            email: emailContent,
            analysis: analysis
        });

    } catch (error) {
        console.error('Error in /generate-email:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /prepare-prompt - Build AI prompt with sender details
app.post('/prepare-prompt', async (req, res) => {
    try {
        const { linkedinUrl, senderName, senderCompany } = req.body;
        if (!linkedinUrl || !senderName || !senderCompany) {
            return res.status(400).json({ error: 'linkedinUrl, senderName, and senderCompany are required' });
        }

        // 1. Try to fetch from Supabase first
        let profileData = {};
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('raw_data')
            .eq('linkedin_url', linkedinUrl)
            .single();

        if (existingProfile && existingProfile.raw_data) {
            console.log('Using cached profile from Supabase');
            profileData = existingProfile.raw_data;
        } else {
            // 2. Fallback to Apify if not found
            console.log('Profile not found in Supabase, fetching from Apify...');
            if (process.env.APIFY_TOKEN) {
                const run = await apifyClient.actor(process.env.APIFY_ACTOR_ID || 'z2Fffb9ooRhoCtS15').call({
                    company_profile_urls: [linkedinUrl],
                    proxy_group: "DATACENTER"
                });
                const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
                profileData = items[0] || {};
            } else {
                console.warn('No APIFY_TOKEN, using mock data');
                profileData = { name: 'Mock Company', industry: 'Technology' };
            }
        }

const prompt = `
Write a **short and simple outreach email** from ${senderName} at ${senderCompany} to ${profileData.name || profileData.company_name || 'the company'}.

Industry/Headline: ${profileData.industry || profileData.headline || 'Unknown'}  
About them: ${profileData.description || profileData.about || 'N/A'}

Email Structure (follow this exactly):
1. Greeting: "Hi [${profileData.name || profileData.company_name || 'Company Name'}],"
2. Introduction: One sentence introducing ${senderName} and ${senderCompany}.
3. Personal Connection: One sentence about their work, industry, or recent achievement.
4. Value Proposition: One sentence about what you offer or propose.
5. Call-to-Action: One sentence suggesting a simple next step.
6. Closing: "Best regards," followed by ${senderName} and ${senderCompany}.

Tone: Professional, friendly, concise. Avoid long paragraphs.

Output: Return only the complete email text, ready to send.
`;
        res.json({ prompt: prompt.trim() });
    } catch (error) {
        console.error('Error in /prepare-prompt:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/fetch-profile', async (req, res) => {
    try {
        const { linkedinUrl } = req.body;
        if (!linkedinUrl) return res.status(400).json({ error: 'linkedinUrl is required' });

        let profileData = {};

        if (process.env.APIFY_TOKEN) {
            const run = await apifyClient.actor(process.env.APIFY_ACTOR_ID || 'z2Fffb9ooRhoCtS15').call({
                company_profile_urls: [linkedinUrl],
                proxy_group: 'DATACENTER'
            });
            const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
            profileData = items[0] || {};
        } else {
            console.warn('No APIFY_TOKEN, returning mock profile');
            profileData = { company_name: 'Mock Company', company_about_us: 'Mock data', input_url: linkedinUrl };
        }

        res.json(profileData);
    } catch (error) {
        console.error('Error in /fetch-profile:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /profiles - Fetch all profiles from Supabase
app.get('/profiles', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        const { data, error, count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Supabase fetch error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({
            profiles: data,
            total: count,
            limit,
            offset
        });
    } catch (error) {
        console.error('Error in /profiles:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/profiles/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;

        // Check if identifier is a UUID or LinkedIn URL
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        let query = supabase.from('profiles').select('*');

        if (isUUID) {
            query = query.eq('id', identifier);
        } else {
            // Assume it's a LinkedIn URL (decode if needed)
            const linkedinUrl = decodeURIComponent(identifier);
            query = query.eq('linkedin_url', linkedinUrl);
        }

        const { data, error } = await query.single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Profile not found' });
            }
            console.error('Supabase fetch error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        console.error('Error in /profiles/:identifier:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /profiles/:identifier/raw - Fetch ONLY raw_data for a profile
app.get('/profiles/:identifier/raw', async (req, res) => {
    try {
        const { identifier } = req.params;

        // Check if identifier is a UUID or LinkedIn URL
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        let query = supabase.from('profiles').select('raw_data');

        if (isUUID) {
            query = query.eq('id', identifier);
        } else {
            // Assume it's a LinkedIn URL (decode if needed)
            const linkedinUrl = decodeURIComponent(identifier);
            query = query.eq('linkedin_url', linkedinUrl);
        }

        const { data, error } = await query.single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ error: 'Profile not found' });
            }
            console.error('Supabase fetch error:', error);
            return res.status(500).json({ error: error.message });
        }

        // Return just the raw_data object directly
        res.json(data.raw_data);
    } catch (error) {
        console.error('Error in /profiles/:identifier/raw:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

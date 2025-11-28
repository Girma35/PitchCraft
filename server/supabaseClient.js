import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY (or VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Add them to .env or the environment.');
}

if ((process.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_ANON_KEY) && (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY)) {
  console.warn('Using VITE_* Supabase env vars on the server. Ensure these keys are not exposed to client builds in production.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});


export function getSupabaseClient() {
  return supabase;
}

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


export async function getProfiles({ limit = 100 } = {}) {
  const { data, error } = await supabase.from('profiles').select('*').limit(limit);
  if (error) throw error;
  return data;
}

export default supabase;

-- Simple profiles table - just store the raw JSON from Apify
-- No need for 50 fields, just one JSONB blob

DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  linkedin_url text NOT NULL UNIQUE,
  raw_data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Index for faster lookups by LinkedIn URL
CREATE INDEX idx_profiles_linkedin_url ON profiles(linkedin_url);

-- Optional: Index for querying inside the JSONB if needed
CREATE INDEX idx_profiles_raw_data ON profiles USING gin(raw_data);

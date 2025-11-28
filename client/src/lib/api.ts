// Default to the server port (4000) used by the Express backend.
// Can be overridden in client dev by setting `VITE_API_BASE_URL`.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export interface Profile {
  name?: string;
  industry?: string;
  description?: string;
  input_url?: string;
  company_id?: string | number;
  company_logo?: string;
  company_name?: string;
  company_size?: string;
  company_region?: string | null;
  company_slogan?: string;
  company_street?: string;
  company_country?: string | null;
  company_founded?: number;
  company_profile?: string;
  company_website?: string;
  company_about_us?: string;
  company_industry?: string;
  company_locality?: string | null;
  company_cover_image?: string;
  company_postal_code?: string | null;
  company_specialties?: string | null;
  company_address_type?: string | null;
  company_headquarters?: string | null;
  company_organization_type?: string | null;
  company_twitter_description?: string | null;
  company_employees_on_linkedin?: number | null;
  company_followers_on_linkedin?: number | null;
}

export interface Analysis {
  spamScore: number;
  readabilityScore: number;
  trend: string;
}

export interface GenerateEmailResponse {
  profile: Profile;
  email: string;
  analysis: Analysis;
}

export interface ProfileListItem {
  id: string;
  linkedin_url: string;
  name?: string;
  industry?: string;
  created_at?: string;

  // optional LinkedIn/raw fields for list display
  company_name?: string;
  company_logo?: string;
  company_size?: string;
  company_followers_on_linkedin?: number | null;
  company_employees_on_linkedin?: number | null;
}

export interface ProfileDetail extends Profile {
  id: string;
  linkedin_url: string;
  raw_data: unknown;
  created_at: string;
}

export const api = {
  async generateEmail(linkedinUrl: string): Promise<GenerateEmailResponse> {
    const response = await fetch(`${API_BASE_URL}/generate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkedinUrl }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to generate email' }));
      throw new Error(error.message || 'Failed to generate email');
    }

    return response.json();
  },

  async getProfiles(limit = 10, offset = 0): Promise<ProfileListItem[]> {
    const response = await fetch(`${API_BASE_URL}/profiles?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }

    const json = await response.json().catch(() => null);

    // Server returns either an array of profiles or an object { profiles, total, limit, offset }
    if (Array.isArray(json)) {
      return json;
    }

    if (json && Array.isArray((json as any).profiles)) {
      return (json as any).profiles as ProfileListItem[];
    }

    // Fallback empty array to avoid runtime errors in components
    return [];
  },

  async getProfile(identifier: string): Promise<ProfileDetail> {
    const response = await fetch(`${API_BASE_URL}/profiles/${encodeURIComponent(identifier)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  async getRawProfile(identifier: string): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/profiles/${encodeURIComponent(identifier)}/raw`);

    if (!response.ok) {
      throw new Error('Failed to fetch raw profile data');
    }

    return response.json();
  },

  async fetchProfile(linkedinUrl: string): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/fetch-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkedinUrl }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return response.json();
  },
};

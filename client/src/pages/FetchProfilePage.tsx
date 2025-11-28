import { useState, useEffect } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { JsonViewer } from '../components/JsonViewer';
import { ProfileCard } from '../components/ProfileCard';
import { Loader } from '../components/Loader';
import { Toast } from '../components/Toast';
import { useFetchProfile } from '../hooks/useFetchProfile';
import { FileJson } from 'lucide-react';

export function FetchProfilePage() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { data, loading, error, fetchProfile } = useFetchProfile();
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    if (error) setShowToast(true);
  }, [error]);

  const validateLinkedInUrl = (url: string): boolean => {
    if (!url) {
      setUrlError('LinkedIn URL is required');
      return false;
    }

    const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/company\/.+/i;
    if (!linkedInPattern.test(url)) {
      setUrlError('Please enter a valid LinkedIn company URL');
      return false;
    }

    setUrlError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateLinkedInUrl(url)) {
      return;
    }

    await fetchProfile(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileJson className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Fetch Profile Data</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 px-1">
            Scrape LinkedIn company profile data without generating an email
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="LinkedIn Company URL"
              type="text"
              placeholder="https://www.linkedin.com/company/example"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError('');
              }}
              error={urlError}
            />
            <Button type="submit" loading={loading} className="w-full">
              Fetch Profile
            </Button>
          </form>
        </div>

        {loading && <Loader text="Fetching profile data..." />}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-xs sm:text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        
        {data && !loading && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profile</h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Human-friendly view of the scraped LinkedIn profile</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setShowRaw((s) => !s)} className="text-xs">
                  {showRaw ? 'Hide Raw' : 'Show Raw JSON'}
                </Button>
              </div>
            </div>

            {/* Friendly card */}
            <ProfileCard profile={data as any} />

            {/* Raw JSON (toggle) */}
            {showRaw && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Raw JSON response from the API</h3>
                <JsonViewer data={data} />
              </div>
            )}
          </div>
        )}

        {showToast && error && (
          <Toast
            message={error}
            type="error"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { EmailCard } from '../components/EmailCard';
import { AnalysisCard } from '../components/AnalysisCard';
import { ProfileCard } from '../components/ProfileCard';
import { CardSkeleton } from '../components/Loader';
import { Toast } from '../components/Toast';
import { useGenerateEmail } from '../hooks/useGenerateEmail';

export function HomePage() {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { data, loading, error, generateEmail } = useGenerateEmail();

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
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

    await generateEmail(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            AI-Powered Email Generator
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
            Generate personalized outreach emails from LinkedIn company profiles
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
              Generate Email
            </Button>
          </form>
        </div>

        {loading && (
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Show toast when an error appears (useEffect avoids setting state during render) */}
        {/**/}

        {data && !loading && (
          <div className="space-y-6">
            <EmailCard email={data.email} />
            <AnalysisCard analysis={data.analysis} />
            <ProfileCard profile={data.profile} />
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

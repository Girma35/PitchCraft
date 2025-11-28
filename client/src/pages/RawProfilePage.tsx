import { useRawProfile } from '../hooks/useRawProfile';
import { Loader } from '../components/Loader';
import { Button } from '../components/Button';
import { JsonViewer } from '../components/JsonViewer';
import { ArrowLeft } from 'lucide-react';

interface RawProfilePageProps {
  identifier: string;
  onNavigate: (path: string) => void;
}

export function RawProfilePage({ identifier, onNavigate }: RawProfilePageProps) {
  const { data, loading, error } = useRawProfile(identifier);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
          <Loader text="Loading raw data..." />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-red-800 font-medium">{error || 'Raw data not found'}</p>
            <Button onClick={() => onNavigate('/profiles')} className="mt-4">
              Back to Profiles
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate(`/profiles/${identifier}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Back to Profile</span>
          </button>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Raw Profile Data</h1>
          <p className="text-xs sm:text-sm text-gray-600">Complete JSON data from LinkedIn scraping</p>
        </div>

        <JsonViewer data={data} />
      </div>
    </div>
  );
}

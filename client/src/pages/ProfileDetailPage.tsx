import { useProfile } from '../hooks/useProfile';
import { Loader } from '../components/Loader';
import { Button } from '../components/Button';
import { Building2, ExternalLink, Calendar, ArrowLeft } from 'lucide-react';

interface ProfileDetailPageProps {
  identifier: string;
  onNavigate: (path: string) => void;
}

export function ProfileDetailPage({ identifier, onNavigate }: ProfileDetailPageProps) {
  const { data, loading, error } = useProfile(identifier);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return String(dateString);
    }
  };

  const getName = (d: any) => d.name || d.company_name || 'Unknown Company';
  const getIndustry = (d: any) => d.industry || d.company_industry || '';
  const getDescription = (d: any) => d.description || d.company_about_us || d.company_twitter_description || '';
  const getLinkedIn = (d: any) => d.linkedin_url || d.company_profile || d.input_url || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Loader text="Loading profile..." />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">{error || 'Profile not found'}</p>
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
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
        <button
          onClick={() => onNavigate('/profiles')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          <span>Back to Profiles</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{getName(data)}</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">{getIndustry(data)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate(`/profiles/${identifier}/raw`)}
              className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              View Raw Data
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Description</h2>
              <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{getDescription(data)}</p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xs sm:text-sm font-medium text-gray-500 mb-4">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Created</p>
                    <p className="text-sm sm:text-base text-gray-900">{formatDate(data.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">LinkedIn</p>
                    <a
                      href={getLinkedIn(data)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base text-blue-600 hover:underline break-all"
                    >
                      {getLinkedIn(data)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

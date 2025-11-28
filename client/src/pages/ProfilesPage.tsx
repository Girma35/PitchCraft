import { useState } from 'react';
import { useProfiles } from '../hooks/useProfiles';
import { Loader } from '../components/Loader';
import { Button } from '../components/Button';
import { Building2, Calendar, ExternalLink } from 'lucide-react';

interface ProfilesPageProps {
  onNavigate: (path: string) => void;
}

export function ProfilesPage({ onNavigate }: ProfilesPageProps) {
  const [page, setPage] = useState(0);
  const limit = 10;
  const offset = page * limit;

  const { data, loading, error } = useProfiles(limit, offset);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Loader text="Loading profiles..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Company Profiles</h1>
          <p className="text-sm sm:text-base text-gray-600">View all scraped LinkedIn company profiles</p>
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No profiles yet</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Generate your first email to create a company profile
            </p>
            <Button onClick={() => onNavigate('/')}>Go to Home</Button>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:gap-4 mb-6">
              {data.map((profile) => {
                const title = profile.name || profile.company_name || 'Unknown Company';
                const industry = profile.industry || '';
                const logo = (profile as any).company_logo as string | undefined;
                const size = (profile as any).company_size as string | undefined;
                const followers = (profile as any).company_followers_on_linkedin as number | undefined;
                const employees = (profile as any).company_employees_on_linkedin as number | undefined;

                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onNavigate(`/profiles/${profile.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      {logo ? (
                        <img src={logo} alt={title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                      ) : (
                        <div className="p-2 bg-blue-100 rounded-md flex-shrink-0">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{industry}</p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(profile.created_at)}</span>
                          </div>

                          <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">LinkedIn</span>
                          </a>

                          {(size || followers || employees) && (
                            <div className="flex items-center gap-2 text-gray-500">
                              {size && <span className="text-xs sm:text-sm">{size}</span>}
                              {followers !== undefined && followers !== null && (
                                <span className="text-xs sm:text-sm">{followers.toLocaleString()} followers</span>
                              )}
                              {employees !== undefined && employees !== null && (
                                <span className="text-xs sm:text-sm">{employees.toLocaleString()} employees</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`/profiles/${profile.id}/raw`);
                        }}
                        className="text-xs sm:text-sm ml-2"
                      >
                        View Raw
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="text-xs sm:text-sm"
              >
                Previous
              </Button>
              <div className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg">
                <span className="text-xs sm:text-sm text-gray-700 font-medium">Page {page + 1}</span>
              </div>
              <Button
                variant="secondary"
                disabled={data.length < limit}
                onClick={() => setPage(page + 1)}
                className="text-xs sm:text-sm"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { Profile } from '../lib/api';
import { Building2, ExternalLink } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
}

function getName(p: Profile) {
  return p.name || p.company_name || 'Unknown Company';
}

function getIndustry(p: Profile) {
  return p.industry || p.company_industry || 'Unknown';
}

function getDescription(p: Profile) {
  return p.description || p.company_about_us || p.company_twitter_description || '';
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const name = getName(profile);
  const industry = getIndustry(profile);
  const description = getDescription(profile);
  const logo = profile.company_logo;
  const website = profile.company_website || profile.company_profile || profile.input_url;
  const size = profile.company_size;
  const followers = profile.company_followers_on_linkedin;
  const employees = profile.company_employees_on_linkedin;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        {logo ? (
          <img src={logo} alt={`${name} logo`} className="w-12 h-12 rounded-md object-cover" />
        ) : (
          <div className="p-2 bg-blue-100 rounded-md">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{name}</h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{industry}</p>
        </div>

        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
            <ExternalLink className="w-4 h-4 inline-block" />
          </a>
        )}
      </div>

      <div className="space-y-3">
        {profile.company_slogan && (
          <div>
            <p className="text-xs text-gray-500">Slogan</p>
            <p className="text-sm text-gray-900">{profile.company_slogan}</p>
          </div>
        )}

        {description && (
          <div>
            <p className="text-xs text-gray-500">About</p>
            <p className="text-sm text-gray-700 leading-relaxed break-words">{description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {size && (
            <div>
              <p className="text-xs text-gray-500">Company Size</p>
              <p className="text-sm text-gray-900">{size}</p>
            </div>
          )}

          {(followers || employees) && (
            <div>
              <p className="text-xs text-gray-500">LinkedIn</p>
              <p className="text-sm text-gray-900">{followers ? `${followers.toLocaleString()} followers` : ''} {employees ? `· ${employees.toLocaleString()} employees` : ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

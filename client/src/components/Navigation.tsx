import { Mail } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'profiles' | 'profile' | 'raw' | 'fetch';
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'profiles', label: 'Profiles', path: '/profiles' },
    { id: 'fetch', label: 'Fetch', path: '/fetch-profile' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              EmailCollector
            </span>
          </div>

          <div className="flex gap-1 ml-4 flex-shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.path)}
                className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

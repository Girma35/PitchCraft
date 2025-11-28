import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { ProfilesPage } from './pages/ProfilesPage';
import { ProfileDetailPage } from './pages/ProfileDetailPage';
import { RawProfilePage } from './pages/RawProfilePage';
import { FetchProfilePage } from './pages/FetchProfilePage';

type Page = 'home' | 'profiles' | 'profile' | 'raw' | 'fetch';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [profileId, setProfileId] = useState<string>('');

  const navigate = (path: string) => {
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/profiles') {
      setCurrentPage('profiles');
    } else if (path === '/fetch-profile') {
      setCurrentPage('fetch');
    } else if (path.includes('/raw')) {
      const id = path.split('/')[2];
      setProfileId(id);
      setCurrentPage('raw');
    } else if (path.startsWith('/profiles/')) {
      const id = path.split('/')[2];
      setProfileId(id);
      setCurrentPage('profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onNavigate={navigate} />

      {currentPage === 'home' && <HomePage />}
      {currentPage === 'profiles' && <ProfilesPage onNavigate={navigate} />}
      {currentPage === 'profile' && (
        <ProfileDetailPage identifier={profileId} onNavigate={navigate} />
      )}
      {currentPage === 'raw' && (
        <RawProfilePage identifier={profileId} onNavigate={navigate} />
      )}
      {currentPage === 'fetch' && <FetchProfilePage />}
    </div>
  );
}

export default App;

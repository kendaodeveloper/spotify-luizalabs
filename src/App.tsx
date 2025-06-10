import './App.css';

import { useState, useEffect } from 'react';

import { Download } from 'lucide-react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Artists from './pages/Artists';
import ArtistAlbums from './pages/ArtistAlbums';
import Playlists from './pages/Playlists';
import Profile from './pages/Profile';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const App = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      window.location.hostname = '127.0.0.1'; // force not to use localhost
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      setInstallPrompt(e);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handler as EventListener,
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handler as EventListener,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();

    setInstallPrompt(null);
  };

  return (
    <>
      {installPrompt && (
        <button
          className="pwa-install-button"
          onClick={handleInstallClick}
        >
          <Download size={20} className="sidebar-icon" />
          Instalar PWA
        </button>
      )}

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/artists" element={<Artists />} />
              <Route
                path="/artists/:artistId"
                element={<ArtistAlbums />}
              />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;

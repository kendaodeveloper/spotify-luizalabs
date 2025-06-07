import './App.css';

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Artists from './pages/Artists';
import ArtistAlbums from './pages/ArtistAlbums';
import Playlists from './pages/Playlists';
import Profile from './pages/Profile';

function App() {
  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      window.location.hostname = '127.0.0.1'; // force not to use localhost
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:artistId" element={<ArtistAlbums />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
